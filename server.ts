import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import type { NextFunction, Request, Response } from "express";

type WorkCategory = "carousels" | "ad-creatives" | "brand-content";

interface WorkRecord {
  id: string;
  slug: string;
  title: string;
  category: WorkCategory;
  description: string | null;
  client: string | null;
  year: number | null;
  role: string | null;
  tools: string[] | null;
  cover_image_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
}

interface WorkImageRecord {
  id: string;
  work_id: string;
  image_url: string;
  storage_path: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
}

interface MessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface StoreData {
  works: WorkRecord[];
  work_images: WorkImageRecord[];
  messages: MessageRecord[];
}

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === "production";
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, "data");
const STORE_PATH = path.join(DATA_DIR, "portfolio-store.json");
const UPLOADS_DIR = path.join(ROOT_DIR, "public", "uploads");

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "saeed@saeedahmed.design";
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "portfolio2026";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  "saeed-portfolio-dev-session-secret-change-me";
const SESSION_COOKIE = "saeed_admin_session";

const HAIRCARE_IMG =
  "/src/assets/images/work_haircare_carousel_1795206549447.jpg";
const SKINCARE_IMG =
  "/src/assets/images/work_skincare_ad_1795206548694.jpg";
const COFFEE_IMG =
  "/src/assets/images/work_coffee_brand_1795206548044.jpg";
const SUMMER_IMG =
  "/src/assets/images/work_summer_capsule_1795206548883.jpg";

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function createSeedStore(): StoreData {
  return {
    works: [
      {
        id: "work-1",
        slug: "brazilian-haircare-launch-carousel",
        title: "Brazilian Haircare Launch Carousel",
        category: "carousels",
        description:
          "An 8-slide educational Instagram carousel introducing Alma Botânica's sulfate-free Brazilian keratin line, engineered to lift saves and ingredient trust.",
        client: "Alma Botânica Haircare",
        year: 2026,
        role: "Social Media Designer",
        tools: ["Photoshop", "Figma", "Illustrator"],
        cover_image_url: HAIRCARE_IMG,
        sort_order: 1,
        published: true,
        created_at: "2026-01-15T10:00:00Z",
      },
      {
        id: "work-5",
        slug: "artisan-coffee-brand-feed-overhaul",
        title: "Artisan Coffee Brand Feed Overhaul",
        category: "brand-content",
        description:
          "A cohesive Instagram grid system combining warm editorial layouts, single-origin roast spotlights, and reusable template modules.",
        client: "Stone & Stem Roasters",
        year: 2025,
        role: "Social Brand Designer",
        tools: ["Figma", "Illustrator", "Photoshop"],
        cover_image_url: COFFEE_IMG,
        sort_order: 2,
        published: true,
        created_at: "2025-11-18T10:00:00Z",
      },
      {
        id: "work-3",
        slug: "q4-conversion-meta-ad-pack",
        title: "Q4 Conversion Meta Ad Pack",
        category: "ad-creatives",
        description:
          "High-contrast static ad creatives engineered for cold traffic acquisition, featuring rapid value hooks, social proof modules, and A/B test variants.",
        client: "Verve Skin Co.",
        year: 2026,
        role: "Performance Ad Designer",
        tools: ["Photoshop", "Figma", "After Effects"],
        cover_image_url: SKINCARE_IMG,
        sort_order: 3,
        published: true,
        created_at: "2026-02-01T10:00:00Z",
      },
      {
        id: "work-6",
        slug: "summer-capsule-social-identity",
        title: "Summer Capsule Social Identity",
        category: "brand-content",
        description:
          "Campaign launch toolkit covering Instagram feed posts, countdown stories, and highlight covers aligned with Mediterranean resortwear art direction.",
        client: "Soli Studio",
        year: 2025,
        role: "Visual Designer",
        tools: ["Figma", "Photoshop"],
        cover_image_url: SUMMER_IMG,
        sort_order: 4,
        published: true,
        created_at: "2025-10-05T10:00:00Z",
      },
      {
        id: "work-4",
        slug: "dtc-haircare-retargeting-ads",
        title: "DTC Haircare Retargeting Ads",
        category: "ad-creatives",
        description:
          "Multi-ratio paid social creatives (1:1, 4:5, and 9:16) showcasing customer reviews and bundle savings for bottom-of-funnel conversions.",
        client: "Alma Botânica Haircare",
        year: 2026,
        role: "Social Media Designer",
        tools: ["Photoshop", "Illustrator"],
        cover_image_url: HAIRCARE_IMG,
        sort_order: 5,
        published: true,
        created_at: "2026-01-22T10:00:00Z",
      },
      {
        id: "work-2",
        slug: "hydration-ritual-carousel-series",
        title: "Hydration Ritual Storytelling Series",
        category: "carousels",
        description:
          "Editorial multi-slide carousel system built around crisp typography, subtle product framing, and seamless swipe continuity for DTC skincare.",
        client: "Aqua Vitalis Labs",
        year: 2025,
        role: "Lead Social Designer",
        tools: ["Figma", "Photoshop"],
        cover_image_url: SKINCARE_IMG,
        sort_order: 6,
        published: true,
        created_at: "2025-12-10T10:00:00Z",
      },
    ],
    work_images: [
      {
        id: "img-1-1",
        work_id: "work-1",
        image_url: HAIRCARE_IMG,
        storage_path: "",
        alt: "Slide 01 — Hook cover frame for Brazilian keratin haircare launch",
        sort_order: 1,
        created_at: "2026-01-15T10:00:00Z",
      },
      {
        id: "img-1-2",
        work_id: "work-1",
        image_url: SUMMER_IMG,
        storage_path: "",
        alt: "Slide 02 — Botanical texture and sunlit ingredient story",
        sort_order: 2,
        created_at: "2026-01-15T10:01:00Z",
      },
      {
        id: "img-1-3",
        work_id: "work-1",
        image_url: COFFEE_IMG,
        storage_path: "",
        alt: "Slide 03 — Editorial brand rhythm and typography system",
        sort_order: 3,
        created_at: "2026-01-15T10:02:00Z",
      },
      {
        id: "img-2-1",
        work_id: "work-2",
        image_url: SKINCARE_IMG,
        storage_path: "",
        alt: "Hydration ritual cover slide with macro droplet detail",
        sort_order: 1,
        created_at: "2025-12-10T10:00:00Z",
      },
      {
        id: "img-2-2",
        work_id: "work-2",
        image_url: HAIRCARE_IMG,
        storage_path: "",
        alt: "Active botanical pairing breakdown slide",
        sort_order: 2,
        created_at: "2025-12-10T10:01:00Z",
      },
      {
        id: "img-3-1",
        work_id: "work-3",
        image_url: SKINCARE_IMG,
        storage_path: "",
        alt: "Meta Ad Variant A — High-contrast hero hydration hook",
        sort_order: 1,
        created_at: "2026-02-01T10:00:00Z",
      },
      {
        id: "img-3-2",
        work_id: "work-3",
        image_url: SUMMER_IMG,
        storage_path: "",
        alt: "Meta Ad Variant B — Lifestyle editorial comparison",
        sort_order: 2,
        created_at: "2026-02-01T10:01:00Z",
      },
      {
        id: "img-4-1",
        work_id: "work-4",
        image_url: HAIRCARE_IMG,
        storage_path: "",
        alt: "Retargeting ad featuring keratin oil and repair cream bundle",
        sort_order: 1,
        created_at: "2026-01-22T10:00:00Z",
      },
      {
        id: "img-4-2",
        work_id: "work-4",
        image_url: COFFEE_IMG,
        storage_path: "",
        alt: "Warm editorial social proof card frame",
        sort_order: 2,
        created_at: "2026-01-22T10:01:00Z",
      },
      {
        id: "img-5-1",
        work_id: "work-5",
        image_url: COFFEE_IMG,
        storage_path: "",
        alt: "Stone & Stem Ethiopia Guji roast origin editorial frame",
        sort_order: 1,
        created_at: "2025-11-18T10:00:00Z",
      },
      {
        id: "img-5-2",
        work_id: "work-5",
        image_url: SUMMER_IMG,
        storage_path: "",
        alt: "Morning ritual lifestyle photography extension",
        sort_order: 2,
        created_at: "2025-11-18T10:01:00Z",
      },
      {
        id: "img-6-1",
        work_id: "work-6",
        image_url: SUMMER_IMG,
        storage_path: "",
        alt: "Summer capsule launch hero post in Mediterranean sunlight",
        sort_order: 1,
        created_at: "2025-10-05T10:00:00Z",
      },
      {
        id: "img-6-2",
        work_id: "work-6",
        image_url: HAIRCARE_IMG,
        storage_path: "",
        alt: "Capsule texture and warm tone grid anchor",
        sort_order: 2,
        created_at: "2025-10-05T10:01:00Z",
      },
    ],
    messages: [
      {
        id: "msg-seed-1",
        name: "Camila Ferreira",
        email: "camila@almabotanica.com.br",
        message:
          "Hi Saeed! Loved the launch carousel performance. Could we book a monthly retainer for 12 carousels and 6 Meta ad statics starting next month?",
        created_at: "2026-02-12T14:30:00Z",
      },
    ],
  };
}

function ensureDirectories() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function loadStore(): StoreData {
  ensureDirectories();
  if (!fs.existsSync(STORE_PATH)) {
    const seed = createSeedStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    if (!Array.isArray(parsed.works) || !Array.isArray(parsed.work_images)) {
      throw new Error("Invalid store shape");
    }
    return parsed;
  } catch {
    const seed = createSeedStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

function saveStore(store: StoreData) {
  ensureDirectories();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function slugifyServer(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function sortWorksList(works: WorkRecord[]): WorkRecord[] {
  return [...works].sort((a, b) => {
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function signSession(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, iat: Date.now() }),
    "utf8"
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

function verifySession(token: string | undefined): { email: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { email?: string };
    return parsed.email ? { email: parsed.email } : null;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const eqIndex = part.indexOf("=");
    if (eqIndex === -1) continue;
    const key = part.slice(0, eqIndex).trim();
    const val = part.slice(eqIndex + 1).trim();
    result[key] = decodeURIComponent(val);
  }
  return result;
}

function getSessionFromRequest(req: Request): { email: string } | null {
  const cookies = parseCookies(req.headers.cookie);
  return verifySession(cookies[SESSION_COOKIE]);
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = getSessionFromRequest(req);
  if (!session) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }
  next();
}

function saveDataUrlImage(
  dataUrl: string,
  filename: string,
  slug: string
): { imageUrl: string; storagePath: string } {
  const match = /^data:(image\/(?:jpeg|png|webp|avif));base64,([A-Za-z0-9+/=]+)$/.exec(
    dataUrl
  );
  if (!match) {
    throw new Error("Invalid image payload. Use JPEG, PNG, WebP, or AVIF.");
  }
  const mime = match[1];
  const ext = ALLOWED_MIME[mime];
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("Uploaded image exceeds the 10MB limit.");
  }

  const safeSlug = slugifyServer(slug) || "project";
  const baseName = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 32);
  const unique = `${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;
  const finalName = `${safeSlug}-${unique}-${baseName || "frame"}.${ext}`;
  const fullPath = path.join(UPLOADS_DIR, finalName);

  ensureDirectories();
  fs.writeFileSync(fullPath, buffer);

  return {
    imageUrl: `/uploads/${finalName}`,
    storagePath: finalName,
  };
}

function isValidCategory(value: unknown): value is WorkCategory {
  return (
    value === "carousels" ||
    value === "ad-creatives" ||
    value === "brand-content"
  );
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "35mb" }));

  ensureDirectories();
  loadStore();

  // Serve uploaded user files
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Public: list published works
  app.get("/api/works", (_req, res) => {
    const store = loadStore();
    const published = sortWorksList(store.works.filter((w) => w.published));
    res.json({ works: published });
  });

  // Public: get single published work + images + adjacent links
  app.get("/api/works/:slug", (req, res) => {
    const store = loadStore();
    const published = sortWorksList(store.works.filter((w) => w.published));
    const work = published.find((w) => w.slug === req.params.slug);
    if (!work) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    const images = store.work_images
      .filter((img) => img.work_id === work.id)
      .sort((a, b) => a.sort_order - b.sort_order);

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
      work: { ...work, work_images: images },
      adjacent: {
        previous: previous && previous.slug !== work.slug ? previous : null,
        next: next && next.slug !== work.slug ? next : null,
      },
    });
  });

  // Public: submit contact inquiry
  app.post("/api/messages", (req, res) => {
    const body = req.body as {
      name?: unknown;
      email?: unknown;
      message?: unknown;
      honeypot?: unknown;
    };

    if (typeof body.honeypot === "string" && body.honeypot.trim().length > 0) {
      res.status(201).json({ ok: true });
      return;
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

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

    const store = loadStore();
    const record: MessageRecord = {
      id: `msg-${crypto.randomUUID()}`,
      name,
      email,
      message,
      created_at: new Date().toISOString(),
    };
    store.messages.unshift(record);
    saveStore(store);

    res.status(201).json({ ok: true, message: record });
  });

  // Admin auth: check session
  app.get("/api/admin/session", (req, res) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      res.json({ authenticated: false });
      return;
    }
    res.json({ authenticated: true, email: session.email });
  });

  // Admin auth: login
  app.post("/api/admin/login", (req, res) => {
    const body = req.body as { email?: unknown; password?: unknown };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (
      email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = signSession(ADMIN_EMAIL);
    res.setHeader(
      "Set-Cookie",
      `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
    );
    res.json({ authenticated: true, email: ADMIN_EMAIL });
  });

  // Admin auth: logout
  app.post("/api/admin/logout", (_req, res) => {
    res.setHeader(
      "Set-Cookie",
      `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
    );
    res.json({ ok: true });
  });

  // Admin: dashboard data
  app.get("/api/admin/dashboard", requireAdmin, (req, res) => {
    const session = getSessionFromRequest(req);
    const store = loadStore();
    res.json({
      email: session?.email ?? ADMIN_EMAIL,
      works: sortWorksList(store.works),
      messages: [...store.messages].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    });
  });

  // Admin: create work with uploaded cover + gallery frames
  app.post("/api/admin/works", requireAdmin, (req, res) => {
    try {
      const body = req.body as {
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
        coverImage?: { dataUrl?: string; filename?: string; presetUrl?: string };
        galleryImages?: Array<{
          dataUrl?: string;
          filename?: string;
          presetUrl?: string;
          alt?: string;
        }>;
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

      const store = loadStore();
      if (store.works.some((w) => w.slug === slug)) {
        res
          .status(409)
          .json({ error: `A project with slug "${slug}" already exists.` });
        return;
      }

      let coverUrl = "";
      let coverStoragePath = "";

      if (body.coverImage?.dataUrl) {
        const saved = saveDataUrlImage(
          body.coverImage.dataUrl,
          body.coverImage.filename || "cover.png",
          slug
        );
        coverUrl = saved.imageUrl;
        coverStoragePath = saved.storagePath;
      } else if (body.coverImage?.presetUrl) {
        coverUrl = body.coverImage.presetUrl;
      } else {
        res.status(400).json({ error: "Please select a cover image." });
        return;
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
        tools: Array.isArray(body.tools) && body.tools.length > 0 ? body.tools : null,
        cover_image_url: coverUrl,
        sort_order:
          typeof body.sort_order === "number" && Number.isFinite(body.sort_order)
            ? body.sort_order
            : store.works.length + 1,
        published: body.published !== false,
        created_at: now,
      };

      const newImages: WorkImageRecord[] = [];
      const gallery = Array.isArray(body.galleryImages)
        ? body.galleryImages
        : [];

      if (gallery.length === 0) {
        newImages.push({
          id: `img-${crypto.randomUUID()}`,
          work_id: workId,
          image_url: coverUrl,
          storage_path: coverStoragePath,
          alt: title,
          sort_order: 1,
          created_at: now,
        });
      } else {
        gallery.forEach((item, index) => {
          let imageUrl = "";
          let storagePath = "";
          if (item.dataUrl) {
            const saved = saveDataUrlImage(
              item.dataUrl,
              item.filename || `frame-${index + 1}.png`,
              slug
            );
            imageUrl = saved.imageUrl;
            storagePath = saved.storagePath;
          } else if (item.presetUrl) {
            imageUrl = item.presetUrl;
          }
          if (imageUrl) {
            newImages.push({
              id: `img-${crypto.randomUUID()}`,
              work_id: workId,
              image_url: imageUrl,
              storage_path: storagePath,
              alt: item.alt?.trim() || `${title} frame ${index + 1}`,
              sort_order: index + 1,
              created_at: now,
            });
          }
        });
      }

      store.works.push(newWork);
      store.work_images.push(...newImages);
      saveStore(store);

      res.status(201).json({ work: newWork, work_images: newImages });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      res.status(400).json({ error: msg });
    }
  });

  // Admin: update work inline
  app.patch("/api/admin/works/:id", requireAdmin, (req, res) => {
    const store = loadStore();
    const target = store.works.find((w) => w.id === req.params.id);
    if (!target) {
      res.status(404).json({ error: "Work not found." });
      return;
    }

    const body = req.body as Partial<WorkRecord>;
    if (typeof body.title === "string" && body.title.trim()) {
      target.title = body.title.trim();
    }
    if (isValidCategory(body.category)) {
      target.category = body.category;
    }
    if (typeof body.sort_order === "number" && Number.isFinite(body.sort_order)) {
      target.sort_order = body.sort_order;
    }
    if (typeof body.published === "boolean") {
      target.published = body.published;
    }

    saveStore(store);
    res.json({ work: target });
  });

  // Admin: reorder two works
  app.post("/api/admin/works/reorder", requireAdmin, (req, res) => {
    const body = req.body as {
      updates?: Array<{ id: string; sort_order: number }>;
    };
    if (!Array.isArray(body.updates) || body.updates.length === 0) {
      res.status(400).json({ error: "Missing updates array." });
      return;
    }

    const store = loadStore();
    for (const item of body.updates) {
      const match = store.works.find((w) => w.id === item.id);
      if (match && Number.isFinite(item.sort_order)) {
        match.sort_order = item.sort_order;
      }
    }
    saveStore(store);
    res.json({ works: sortWorksList(store.works) });
  });

  // Admin: delete work + uploaded files
  app.delete("/api/admin/works/:id", requireAdmin, (req, res) => {
    const store = loadStore();
    const idx = store.works.findIndex((w) => w.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: "Work not found." });
      return;
    }

    const [removed] = store.works.splice(idx, 1);
    const removedImages = store.work_images.filter(
      (img) => img.work_id === removed.id
    );
    store.work_images = store.work_images.filter(
      (img) => img.work_id !== removed.id
    );

    const filesToDelete = new Set<string>();
    for (const img of removedImages) {
      if (img.storage_path) filesToDelete.add(img.storage_path);
    }
    if (removed.cover_image_url?.startsWith("/uploads/")) {
      filesToDelete.add(path.basename(removed.cover_image_url));
    }
    for (const file of filesToDelete) {
      const fullPath = path.join(UPLOADS_DIR, path.basename(file));
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch {
          // Ignore file unlink errors
        }
      }
    }

    saveStore(store);
    res.json({ ok: true });
  });

  // Admin: delete contact message
  app.delete("/api/admin/messages/:id", requireAdmin, (req, res) => {
    const store = loadStore();
    const idx = store.messages.findIndex((m) => m.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: "Message not found." });
      return;
    }
    store.messages.splice(idx, 1);
    saveStore(store);
    res.json({ ok: true });
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(ROOT_DIR, "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Saeed Ahmed Portfolio server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
