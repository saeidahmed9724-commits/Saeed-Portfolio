import crypto from "node:crypto";
import express from "express";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import {
  adminEmail,
  clearedSessionCookie,
  credentialsValid,
  getSession,
  requireAdmin,
  requireConfigured,
  sessionCookie,
  signSession,
} from "./auth.js";
import {
  BUCKET,
  getSupabase,
  publicUrlFor,
  storagePathFromUrl,
} from "./supabase.js";
import type {
  MessageRecord,
  WorkCategory,
  WorkImageRecord,
  WorkRecord,
} from "./types.js";

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 30;
const UPLOAD_PATH_RE = /^uploads\/[a-z0-9][a-z0-9._-]{0,200}$/;

function slugifyServer(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidCategory(value: unknown): value is WorkCategory {
  return (
    value === "carousels" ||
    value === "ad-creatives" ||
    value === "brand-content"
  );
}

/** Express 4 doesn't catch rejected promises, so wrap async handlers. */
const wrap =
  (fn: (req: Request, res: Response) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    fn(req, res).catch(next);
  };

function sortWorks<T extends WorkRecord>(works: T[]): T[] {
  return [...works].sort((a, b) =>
    a.sort_order !== b.sort_order
      ? a.sort_order - b.sort_order
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

async function fetchWorks(onlyPublished: boolean): Promise<WorkRecord[]> {
  let query = getSupabase().from("works").select("*");
  if (onlyPublished) query = query.eq("published", true);
  const { data, error } = await query;
  if (error) throw error;
  return sortWorks((data ?? []) as WorkRecord[]);
}

/** Resolve an uploaded-file path (validated) or a bundled preset to a URL. */
function resolveImage(item: { path?: string; presetUrl?: string } | undefined): {
  imageUrl: string;
  storagePath: string;
} | null {
  if (!item) return null;
  if (item.path) {
    if (!UPLOAD_PATH_RE.test(item.path)) {
      throw new Error("Invalid image path.");
    }
    return { imageUrl: publicUrlFor(item.path), storagePath: item.path };
  }
  if (item.presetUrl) {
    if (!item.presetUrl.startsWith("/src/assets/")) {
      throw new Error("Invalid preset image.");
    }
    return { imageUrl: item.presetUrl, storagePath: "" };
  }
  return null;
}

export function createApp() {
  const app = express();
  // Request bodies are small JSON now: images go straight to Supabase Storage.
  app.use(express.json({ limit: "1mb" }));

  // ---------- Public ----------

  app.get(
    "/api/works",
    wrap(async (_req, res) => {
      res.json({ works: await fetchWorks(true) });
    })
  );

  app.get(
    "/api/works/:slug",
    wrap(async (req, res) => {
      const published = await fetchWorks(true);
      const work = published.find((w) => w.slug === req.params.slug);
      if (!work) {
        res.status(404).json({ error: "Project not found." });
        return;
      }

      const { data, error } = await getSupabase()
        .from("work_images")
        .select("*")
        .eq("work_id", work.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;

      const index = published.findIndex((w) => w.slug === work.slug);
      const previous =
        published.length > 1
          ? published[index > 0 ? index - 1 : published.length - 1]
          : null;
      const next =
        published.length > 1
          ? published[index < published.length - 1 ? index + 1 : 0]
          : null;

      res.json({
        work: { ...work, work_images: (data ?? []) as WorkImageRecord[] },
        adjacent: {
          previous: previous && previous.slug !== work.slug ? previous : null,
          next: next && next.slug !== work.slug ? next : null,
        },
      });
    })
  );

  app.post(
    "/api/messages",
    wrap(async (req, res) => {
      const body = (req.body ?? {}) as Record<string, unknown>;

      if (typeof body.honeypot === "string" && body.honeypot.trim().length > 0) {
        res.status(201).json({ ok: true });
        return;
      }

      const name = typeof body.name === "string" ? body.name.trim() : "";
      const email = typeof body.email === "string" ? body.email.trim() : "";
      const message =
        typeof body.message === "string" ? body.message.trim() : "";

      if (name.length < 2 || name.length > 100) {
        res.status(400).json({ error: "Please enter a valid name." });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 160) {
        res.status(400).json({ error: "Please enter a valid email address." });
        return;
      }
      if (message.length < 10 || message.length > 2000) {
        res
          .status(400)
          .json({ error: "Message must be between 10 and 2000 characters." });
        return;
      }

      const record: MessageRecord = {
        id: `msg-${crypto.randomUUID()}`,
        name,
        email,
        message,
        created_at: new Date().toISOString(),
      };
      const { error } = await getSupabase().from("messages").insert(record);
      if (error) throw error;

      // Don't echo the stored record back to anonymous visitors.
      res.status(201).json({ ok: true });
    })
  );

  // ---------- Admin auth ----------

  app.get("/api/admin/session", requireConfigured, (req, res) => {
    const session = getSession(req);
    res.json(
      session
        ? { authenticated: true, email: session.email }
        : { authenticated: false }
    );
  });

  app.post("/api/admin/login", requireConfigured, (req, res) => {
    const body = (req.body ?? {}) as { email?: unknown; password?: unknown };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!credentialsValid(email, password)) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }
    res.setHeader("Set-Cookie", sessionCookie(signSession(adminEmail())));
    res.json({ authenticated: true, email: adminEmail() });
  });

  app.post("/api/admin/logout", (_req, res) => {
    res.setHeader("Set-Cookie", clearedSessionCookie());
    res.json({ ok: true });
  });

  // Everything below here needs a valid admin session.
  app.use("/api/admin", requireConfigured, (req, res, next) => {
    if (
      req.path === "/session" ||
      req.path === "/login" ||
      req.path === "/logout"
    ) {
      next();
      return;
    }
    requireAdmin(req, res, next);
  });

  // ---------- Admin ----------

  app.get(
    "/api/admin/dashboard",
    wrap(async (req, res) => {
      const [works, messages] = await Promise.all([
        fetchWorks(false),
        getSupabase()
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);
      if (messages.error) throw messages.error;
      res.json({
        email: getSession(req)?.email ?? adminEmail(),
        works,
        messages: (messages.data ?? []) as MessageRecord[],
      });
    })
  );

  // Step 1 of an upload: hand the browser one-time signed URLs so it can send
  // files straight to Supabase Storage (bypasses the serverless body limit).
  app.post(
    "/api/admin/upload-urls",
    wrap(async (req, res) => {
      const body = (req.body ?? {}) as {
        slug?: string;
        files?: Array<{ filename?: string; contentType?: string; size?: number }>;
      };
      const files = Array.isArray(body.files) ? body.files : [];
      if (files.length === 0 || files.length > MAX_FILES_PER_REQUEST) {
        res
          .status(400)
          .json({ error: `Send between 1 and ${MAX_FILES_PER_REQUEST} files.` });
        return;
      }

      const safeSlug = slugifyServer(body.slug || "") || "project";
      const uploads: Array<{ path: string; token: string }> = [];

      for (const file of files) {
        const ext = ALLOWED_MIME[file.contentType ?? ""];
        if (!ext) {
          res
            .status(400)
            .json({ error: "Use JPEG, PNG, WebP, or AVIF images." });
          return;
        }
        if (typeof file.size !== "number" || file.size > MAX_UPLOAD_BYTES) {
          res.status(400).json({ error: "Each image must be 10MB or less." });
          return;
        }
        const baseName = (file.filename || "frame")
          .replace(/\.[^/.]+$/, "")
          .toLowerCase()
          .replace(/[^a-z0-9-_]/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 32);
        const unique = `${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
        const path = `uploads/${safeSlug}-${unique}-${baseName || "frame"}.${ext}`;

        const { data, error } = await getSupabase()
          .storage.from(BUCKET)
          .createSignedUploadUrl(path);
        if (error || !data) throw error ?? new Error("Could not sign upload.");
        uploads.push({ path: data.path, token: data.token });
      }

      res.json({ uploads });
    })
  );

  // Step 2: create the work, referencing already-uploaded files by path.
  app.post(
    "/api/admin/works",
    wrap(async (req, res) => {
      const body = (req.body ?? {}) as {
        title?: string;
        slug?: string;
        category?: WorkCategory;
        description?: string;
        client?: string;
        year?: number | null;
        role?: string;
        tools?: string[];
        sort_order?: number;
        published?: boolean;
        coverImage?: { path?: string; presetUrl?: string };
        galleryImages?: Array<{ path?: string; presetUrl?: string; alt?: string }>;
      };

      const title = (body.title || "").trim();
      const slug = slugifyServer(body.slug || title);
      if (!title || !slug) {
        res.status(400).json({ error: "Title and valid slug are required." });
        return;
      }
      if (!isValidCategory(body.category)) {
        res.status(400).json({ error: "Invalid category." });
        return;
      }

      let cover: ReturnType<typeof resolveImage>;
      const gallery: Array<{ img: NonNullable<ReturnType<typeof resolveImage>>; alt?: string }> = [];
      try {
        cover = resolveImage(body.coverImage);
        if (!cover) {
          res.status(400).json({ error: "Please select a cover image." });
          return;
        }
        for (const item of Array.isArray(body.galleryImages)
          ? body.galleryImages
          : []) {
          const img = resolveImage(item);
          if (img) gallery.push({ img, alt: item.alt });
        }
      } catch (err) {
        res.status(400).json({
          error: err instanceof Error ? err.message : "Invalid image.",
        });
        return;
      }

      const sb = getSupabase();

      const existing = await sb
        .from("works")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (existing.error) throw existing.error;
      if (existing.data) {
        res
          .status(409)
          .json({ error: `A project with slug "${slug}" already exists.` });
        return;
      }

      let sortOrder: number;
      if (typeof body.sort_order === "number" && Number.isFinite(body.sort_order)) {
        sortOrder = body.sort_order;
      } else {
        const count = await sb
          .from("works")
          .select("id", { count: "exact", head: true });
        sortOrder = (count.count ?? 0) + 1;
      }

      const now = new Date().toISOString();
      const workId = `work-${crypto.randomUUID()}`;
      const newWork: WorkRecord = {
        id: workId,
        slug,
        title,
        category: body.category,
        description: body.description?.trim() || null,
        client: body.client?.trim() || null,
        year:
          typeof body.year === "number" && Number.isFinite(body.year)
            ? body.year
            : null,
        role: body.role?.trim() || null,
        tools:
          Array.isArray(body.tools) && body.tools.length > 0 ? body.tools : null,
        cover_image_url: cover.imageUrl,
        sort_order: sortOrder,
        published: body.published !== false,
        created_at: now,
      };

      const frames =
        gallery.length === 0
          ? [{ img: cover, alt: title }]
          : gallery;
      const newImages: WorkImageRecord[] = frames.map((f, index) => ({
        id: `img-${crypto.randomUUID()}`,
        work_id: workId,
        image_url: f.img.imageUrl,
        storage_path: f.img.storagePath,
        alt: f.alt?.trim() || `${title} frame ${index + 1}`,
        sort_order: index + 1,
        created_at: now,
      }));

      const insertedWork = await sb.from("works").insert(newWork);
      if (insertedWork.error) {
        if (insertedWork.error.code === "23505") {
          res
            .status(409)
            .json({ error: `A project with slug "${slug}" already exists.` });
          return;
        }
        throw insertedWork.error;
      }
      const insertedImages = await sb.from("work_images").insert(newImages);
      if (insertedImages.error) {
        await sb.from("works").delete().eq("id", workId); // roll back
        throw insertedImages.error;
      }

      res.status(201).json({ work: newWork, work_images: newImages });
    })
  );

  app.patch(
    "/api/admin/works/:id",
    wrap(async (req, res) => {
      const body = (req.body ?? {}) as Partial<WorkRecord>;
      const patch: Partial<WorkRecord> = {};
      if (typeof body.title === "string" && body.title.trim()) {
        patch.title = body.title.trim();
      }
      if (isValidCategory(body.category)) patch.category = body.category;
      if (typeof body.sort_order === "number" && Number.isFinite(body.sort_order)) {
        patch.sort_order = body.sort_order;
      }
      if (typeof body.published === "boolean") patch.published = body.published;

      const q = getSupabase().from("works");
      const { data, error } =
        Object.keys(patch).length > 0
          ? await q.update(patch).eq("id", req.params.id).select().maybeSingle()
          : await q.select().eq("id", req.params.id).maybeSingle();
      if (error) throw error;
      if (!data) {
        res.status(404).json({ error: "Work not found." });
        return;
      }
      res.json({ work: data as WorkRecord });
    })
  );

  app.post(
    "/api/admin/works/reorder",
    wrap(async (req, res) => {
      const body = (req.body ?? {}) as {
        updates?: Array<{ id: string; sort_order: number }>;
      };
      if (!Array.isArray(body.updates) || body.updates.length === 0) {
        res.status(400).json({ error: "Missing updates array." });
        return;
      }
      const sb = getSupabase();
      const results = await Promise.all(
        body.updates
          .filter((u) => typeof u.id === "string" && Number.isFinite(u.sort_order))
          .map((u) =>
            sb.from("works").update({ sort_order: u.sort_order }).eq("id", u.id)
          )
      );
      for (const r of results) if (r.error) throw r.error;
      res.json({ works: await fetchWorks(false) });
    })
  );

  app.delete(
    "/api/admin/works/:id",
    wrap(async (req, res) => {
      const sb = getSupabase();
      const { data: work, error } = await sb
        .from("works")
        .select("*")
        .eq("id", req.params.id)
        .maybeSingle();
      if (error) throw error;
      if (!work) {
        res.status(404).json({ error: "Work not found." });
        return;
      }

      const imgs = await sb
        .from("work_images")
        .select("storage_path")
        .eq("work_id", work.id);
      if (imgs.error) throw imgs.error;

      const paths = new Set<string>();
      for (const i of imgs.data ?? []) {
        if (i.storage_path) paths.add(i.storage_path);
      }
      const coverPath = storagePathFromUrl(work.cover_image_url);
      if (coverPath) paths.add(coverPath);

      // work_images rows are removed by ON DELETE CASCADE.
      const del = await sb.from("works").delete().eq("id", work.id);
      if (del.error) throw del.error;

      if (paths.size > 0) {
        // Best effort: a leftover file is harmless, a failed delete shouldn't 500.
        await sb.storage.from(BUCKET).remove([...paths]).catch(() => undefined);
      }
      res.json({ ok: true });
    })
  );

  app.delete(
    "/api/admin/messages/:id",
    wrap(async (req, res) => {
      const { error } = await getSupabase()
        .from("messages")
        .delete()
        .eq("id", req.params.id);
      if (error) throw error;
      res.json({ ok: true });
    })
  );

  // ---------- Errors ----------

  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Not found." });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("API error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  });

  return app;
}
