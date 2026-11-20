import type { SiteConfig } from "../lib/types";

export const GENERATED_ASSETS = {
  haircare: "/src/assets/images/work_haircare_carousel_1795206549447.jpg",
  skincare: "/src/assets/images/work_skincare_ad_1795206548694.jpg",
  coffee: "/src/assets/images/work_coffee_brand_1795206548044.jpg",
  summer: "/src/assets/images/work_summer_capsule_1795206548883.jpg",
  portrait: "/src/assets/images/portrait_saeed_1795206548690.jpg",
} as const;

export const siteConfig: SiteConfig = {
  name: "Saeed Ahmed",
  brandMark: "Saeed.",
  role: "Social Media Designer",
  location: "Alexandria, Egypt",
  email: "saeedahmed2006y@gmail.com",
  whatsappNumber: "201225854231",
  whatsappPrefill:
    "Hi Saeed! I saw your portfolio and would love to discuss a social media design project.",

  socials: [
    {
      label: "Instagram",
      href: "https://instagram.com/saeed.designs",
      handle: "@saeed.designs",
    },
    {
      label: "Behance",
      href: "https://behance.net/saeedahmed",
      handle: "behance.net/saeed",
    },
  ],

  navLinks: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    availabilityText: "Available for projects · Alexandria, Egypt",
    subline:
      "Social media designer crafting high-converting Instagram carousels, paid ad creatives, and brand-aligned visuals for international DTC brands.",
    primaryCta: "View my work",
    secondaryCta: "Let's talk",
    floatingCards: [
      {
        id: "hero-card-1",
        title: "Brazilian Haircare Launch",
        tag: "Carousel · 8 Slides",
        image: GENERATED_ASSETS.haircare,
        slug: "brazilian-haircare-launch-carousel",
      },
      {
        id: "hero-card-2",
        title: "Q4 Paid Meta Creative",
        tag: "Ad Creative · 4:5",
        image: GENERATED_ASSETS.skincare,
        slug: "q4-conversion-meta-ad-pack",
      },
      {
        id: "hero-card-3",
        title: "Artisan Coffee Feed",
        tag: "Brand Content · IG",
        image: GENERATED_ASSETS.coffee,
        slug: "artisan-coffee-brand-feed-overhaul",
      },
    ],
  },

  marqueeItems: [
    "Instagram Carousels",
    "Ad Creatives",
    "Brand Content",
    "Motion",
    "Storytelling",
  ],

  about: {
    eyebrow: "About Me",
    heading: "Design built for the thumb-scroll era.",
    portraitImage: GENERATED_ASSETS.portrait,
    portraitAlt:
      "Portrait of Saeed Ahmed, Social Media Designer in Alexandria, Egypt",
    bio: [
      "I'm Saeed Ahmed, a social media designer based in Alexandria, Egypt with 1+ years of hands-on experience building visual systems that turn passive scrollers into engaged buyers.",
      "I've partnered with ambitious international brands—including a fast-growing Brazilian haircare brand—to craft cohesive Instagram carousels, performance ad creatives, and campaign storytelling tailored for modern feeds.",
    ],
    stats: [
      {
        label: "Years Experience",
        value: 1,
        suffix: "+",
        context: "Dedicated social craft",
      },
      {
        label: "International Brands",
        value: 8,
        suffix: "+",
        context: "Brazil, Europe & MENA",
      },
      {
        label: "Social Designs",
        value: 100,
        suffix: "+",
        context: "Shipped carousels & ads",
      },
    ],
    skills: [
      { name: "Instagram Carousels", level: 96 },
      { name: "Ad Creatives", level: 92 },
      { name: "Brand Identity on Social", level: 90 },
      { name: "Layout & Typography", level: 94 },
      { name: "Motion Basics", level: 82 },
    ],
  },

  services: {
    eyebrow: "Services",
    heading: "Focused deliverables that move metrics.",
    subline:
      "Every visual is structured around visual hierarchy, mobile legibility, and clear conversion hooks.",
    items: [
      {
        id: "carousels",
        number: "01",
        title: "Instagram Carousel Design",
        description:
          "Narrative-driven multi-slide carousels engineered to boost saves, shares, and dwell time.",
        icon: "layers",
        bullets: [
          "Scroll-stopping cover hook frame",
          "Seamless cross-slide visual flow",
          "Exported print-sharp at 1080×1350",
        ],
      },
      {
        id: "ads",
        number: "02",
        title: "Ad Creatives",
        description:
          "Performance-first statics built for Meta, TikTok, and Instagram campaigns that fight creative fatigue.",
        icon: "sparkles",
        bullets: [
          "Hook variations for A/B testing",
          "Clear value-prop & CTA hierarchy",
          "Multi-ratio exports (1:1, 4:5, 9:16)",
        ],
      },
      {
        id: "brand-content",
        number: "03",
        title: "Brand-Aligned Social Content",
        description:
          "Consistent daily feed graphics and campaign visuals that elevate brand perception across markets.",
        icon: "palette",
        bullets: [
          "Typography & color fidelity",
          "Product-focused retouching & compositing",
          "Cohesive feed grid rhythm",
        ],
      },
      {
        id: "systems",
        number: "04",
        title: "Content Systems & Templates",
        description:
          "Scalable Figma & Photoshop template libraries so your marketing team can ship fast without losing craft.",
        icon: "layout",
        bullets: [
          "Reusable modular slide components",
          "Organized Figma / PSD source files",
          "Mini social visual style guide",
        ],
      },
    ],
  },

  testimonials: {
    eyebrow: "Client Words",
    heading: "Trusted by growing brands.",
    items: [
      {
        id: "test-1",
        name: "Camila Ferreira",
        role: "Brand Lead",
        company: "Alma Botânica Haircare",
        quote:
          "Saeed elevated our entire Instagram presence. Our educational carousels doubled their save rate within six weeks while staying faithful to our packaging.",
        initials: "CF",
      },
      {
        id: "test-2",
        name: "Omar Mansour",
        role: "Performance Marketer",
        company: "Verve Skin Co.",
        quote:
          "His static ad creatives immediately stood out in our Meta account. Clean typography, sharp hooks, and fast turnaround on A/B testing variants.",
        initials: "OM",
      },
      {
        id: "test-3",
        name: "Elena Rostova",
        role: "Creative Strategist",
        company: "Stone & Stem Roasters",
        quote:
          "Working with Saeed feels effortless. He understands both editorial craft and why a post needs to earn attention in the first half-second.",
        initials: "ER",
      },
    ],
  },

  footer: {
    headline: "Let's create something people stop scrolling for.",
    copyrightName: "Saeed Ahmed",
  },
};
