import type { Work, WorkCategory, WorkFilter } from "./types";

export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  carousels: "Carousels",
  "ad-creatives": "Ad Creatives",
  "brand-content": "Brand Content",
};

export function getCategoryLabel(category: WorkCategory): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function validateImageMeta(file: {
  name: string;
  type: string;
  size: number;
}): string | null {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    return `"${file.name}" has an unsupported format. Use JPEG, PNG, WebP, or AVIF.`;
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `"${file.name}" exceeds the 10MB limit.`;
  }
  return null;
}

export function sanitizeStorageFilename(filename: string, uniqueToken?: string): string {
  const ext =
    filename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const base = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const unique =
    uniqueToken ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${unique}-${base || "image"}.${ext}`;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<"name" | "email" | "message", string>>;
  sanitized?: {
    name: string;
    email: string;
    message: string;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactInput(input: {
  name: string;
  email: string;
  message: string;
}): ContactValidationResult {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const errors: Partial<Record<"name" | "email" | "message", string>> = {};

  if (name.length < 2) {
    errors.name = "Please enter at least 2 characters.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  if (!EMAIL_REGEX.test(email) || email.length > 160) {
    errors.email = "Please enter a valid email address.";
  }

  if (message.length < 10) {
    errors.message = "Please tell me a bit more (at least 10 characters).";
  } else if (message.length > 2000) {
    errors.message = "Message must be 2000 characters or fewer.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    sanitized: { name, email, message },
  };
}

export function filterWorksByCategory<T extends Pick<Work, "category">>(
  works: T[],
  filter: WorkFilter
): T[] {
  if (filter === "all") return works;
  return works.filter((item) => item.category === filter);
}

export function sortWorks<T extends Pick<Work, "sort_order" | "created_at">>(
  works: T[]
): T[] {
  return [...works].sort((a, b) => {
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function getAdjacentWorksFromList<T extends Pick<Work, "slug">>(
  works: T[],
  currentSlug: string
): { previous: T | null; next: T | null } {
  if (works.length <= 1) {
    return { previous: null, next: null };
  }

  const index = works.findIndex((work) => work.slug === currentSlug);
  if (index === -1) {
    return { previous: null, next: works[0] ?? null };
  }

  const previous = index > 0 ? works[index - 1] : works[works.length - 1];
  const next = index < works.length - 1 ? works[index + 1] : works[0];

  return {
    previous: previous.slug === currentSlug ? null : previous,
    next: next.slug === currentSlug ? null : next,
  };
}

export function parseToolsList(toolsInput: string): string[] {
  return toolsInput
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function swapWorkOrder<T extends Pick<Work, "id" | "sort_order">>(
  works: T[],
  index: number,
  direction: -1 | 1
): { updated: T[]; pair: [T, T] } | null {
  const targetIndex = index + direction;
  if (index < 0 || targetIndex < 0 || targetIndex >= works.length) {
    return null;
  }

  const copy = works.map((item) => ({ ...item }));
  const current = copy[index];
  const swap = copy[targetIndex];

  const nextOrderCurrent =
    swap.sort_order === current.sort_order ? targetIndex + 1 : swap.sort_order;
  const nextOrderSwap =
    swap.sort_order === current.sort_order ? index + 1 : current.sort_order;

  current.sort_order = nextOrderCurrent;
  swap.sort_order = nextOrderSwap;

  copy[index] = swap;
  copy[targetIndex] = current;

  return { updated: copy, pair: [current, swap] };
}
