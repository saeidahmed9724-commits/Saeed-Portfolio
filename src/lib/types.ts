export type WorkCategory = "carousels" | "ad-creatives" | "brand-content";

export type WorkFilter = "all" | WorkCategory;

export interface Work {
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

export interface WorkImage {
  id: string;
  work_id: string;
  image_url: string;
  storage_path: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
}

export interface WorkWithImages extends Work {
  work_images: WorkImage[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface SiteConfig {
  name: string;
  brandMark: string;
  role: string;
  location: string;
  email: string;
  whatsappNumber: string;
  whatsappPrefill: string;
  socials: {
    label: string;
    href: string;
    handle: string;
  }[];
  navLinks: {
    label: string;
    href: string;
  }[];
  hero: {
    availabilityText: string;
    subline: string;
    primaryCta: string;
    secondaryCta: string;
    floatingCards: {
      id: string;
      title: string;
      tag: string;
      image: string;
      slug: string;
    }[];
  };
  marqueeItems: string[];
  about: {
    eyebrow: string;
    heading: string;
    portraitImage: string;
    portraitAlt: string;
    bio: string[];
    stats: {
      label: string;
      value: number;
      suffix: string;
      context: string;
    }[];
    skills: {
      name: string;
      level: number;
    }[];
  };
  services: {
    eyebrow: string;
    heading: string;
    subline: string;
    items: {
      id: string;
      number: string;
      title: string;
      description: string;
      icon: "layers" | "sparkles" | "palette" | "layout";
      bullets: string[];
    }[];
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    items: {
      id: string;
      name: string;
      role: string;
      company: string;
      quote: string;
      initials: string;
    }[];
  };
  footer: {
    headline: string;
    copyrightName: string;
  };
}
