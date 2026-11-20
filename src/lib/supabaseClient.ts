import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Browser Supabase client. Only the public URL + publishable/anon key are used
 * here, and only to upload files with one-time signed tokens issued by the
 * server -- it can't read your tables (RLS blocks it).
 */
export function getBrowserSupabase(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) {
    throw new Error(
      "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY (needed for image uploads)."
    );
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export const STORAGE_BUCKET =
  (import.meta.env.VITE_SUPABASE_BUCKET as string | undefined) || "portfolio";
