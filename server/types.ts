export type WorkCategory = "carousels" | "ad-creatives" | "brand-content";

export interface WorkRecord {
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

export interface WorkImageRecord {
  id: string;
  work_id: string;
  image_url: string;
  storage_path: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
}

export interface MessageRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}
