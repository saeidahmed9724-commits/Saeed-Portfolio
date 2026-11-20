import type { Message, Work, WorkCategory, WorkWithImages } from "./types";
import { getBrowserSupabase, STORAGE_BUCKET } from "./supabaseClient";

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function fetchPublishedWorks(): Promise<Work[]> {
  const res = await fetch("/api/works");
  const data = await parseJson<{ works: Work[] }>(res);
  return data.works;
}

export async function fetchWorkBySlug(slug: string): Promise<{
  work: WorkWithImages;
  adjacent: { previous: Work | null; next: Work | null };
}> {
  const res = await fetch(`/api/works/${encodeURIComponent(slug)}`);
  return parseJson<{
    work: WorkWithImages;
    adjacent: { previous: Work | null; next: Work | null };
  }>(res);
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}): Promise<{ ok: boolean }> {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<{ ok: boolean }>(res);
}

export async function fetchAdminSession(): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  const res = await fetch("/api/admin/session", { credentials: "same-origin" });
  return parseJson<{ authenticated: boolean; email?: string }>(res);
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ authenticated: boolean; email: string }> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ email, password }),
  });
  return parseJson<{ authenticated: boolean; email: string }>(res);
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "same-origin",
  });
}

export async function fetchAdminDashboard(): Promise<{
  email: string;
  works: Work[];
  messages: Message[];
}> {
  const res = await fetch("/api/admin/dashboard", {
    credentials: "same-origin",
  });
  return parseJson<{ email: string; works: Work[]; messages: Message[] }>(res);
}

/**
 * Uploads files straight to Supabase Storage using one-time signed URLs from
 * the server, and returns the stored object paths in the same order.
 */
export async function uploadImages(
  slug: string,
  files: File[]
): Promise<string[]> {
  if (files.length === 0) return [];

  const res = await fetch("/api/admin/upload-urls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      slug,
      files: files.map((f) => ({
        filename: f.name,
        contentType: f.type,
        size: f.size,
      })),
    }),
  });
  const { uploads } = await parseJson<{
    uploads: Array<{ path: string; token: string }>;
  }>(res);

  const storage = getBrowserSupabase().storage.from(STORAGE_BUCKET);
  await Promise.all(
    uploads.map(async (u, i) => {
      const { error } = await storage.uploadToSignedUrl(u.path, u.token, files[i], {
        contentType: files[i].type,
      });
      if (error) throw new Error(`Image upload failed: ${error.message}`);
    })
  );
  return uploads.map((u) => u.path);
}

export async function createAdminWork(payload: {
  title: string;
  slug: string;
  category: WorkCategory;
  description: string;
  client: string;
  year: number | null;
  role: string;
  tools: string[];
  sort_order: number;
  published: boolean;
  coverImage: { path?: string; presetUrl?: string };
  galleryImages: Array<{
    path?: string;
    presetUrl?: string;
    alt?: string;
  }>;
}): Promise<{ work: Work }> {
  const res = await fetch("/api/admin/works", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(payload),
  });
  return parseJson<{ work: Work }>(res);
}

export async function updateAdminWork(
  id: string,
  payload: Partial<Pick<Work, "title" | "category" | "sort_order" | "published">>
): Promise<{ work: Work }> {
  const res = await fetch(`/api/admin/works/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(payload),
  });
  return parseJson<{ work: Work }>(res);
}

export async function reorderAdminWorks(
  updates: Array<{ id: string; sort_order: number }>
): Promise<{ works: Work[] }> {
  const res = await fetch("/api/admin/works/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ updates }),
  });
  return parseJson<{ works: Work[] }>(res);
}

export async function deleteAdminWork(id: string): Promise<void> {
  const res = await fetch(`/api/admin/works/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  await parseJson<{ ok: boolean }>(res);
}

export async function deleteAdminMessage(id: string): Promise<void> {
  const res = await fetch(`/api/admin/messages/${encodeURIComponent(id)}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  await parseJson<{ ok: boolean }>(res);
}
