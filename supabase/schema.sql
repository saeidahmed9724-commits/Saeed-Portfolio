-- Saeed Portfolio: Supabase schema
-- Run this whole file once in: Supabase Dashboard -> SQL Editor -> New query.

create table if not exists public.works (
  id text primary key,
  slug text not null unique,
  title text not null,
  category text not null check (category in ('carousels','ad-creatives','brand-content')),
  description text,
  client text,
  year integer,
  role text,
  tools text[],
  cover_image_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.work_images (
  id text primary key,
  work_id text not null references public.works(id) on delete cascade,
  image_url text not null,
  storage_path text not null default '',
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists work_images_work_id_idx on public.work_images(work_id);

create table if not exists public.messages (
  id text primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- All reads/writes go through the server using the secret key, which bypasses RLS.
-- Enabling RLS with no policies means the public (anon) key can NOT read the
-- tables directly -- in particular the contact messages stay private.
alter table public.works enable row level security;
alter table public.work_images enable row level security;
alter table public.messages enable row level security;

-- Public storage bucket for uploaded work images (10MB, images only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 10485760,
        array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Starter content (same works that were in data/portfolio-store.json).

insert into public.works (id,slug,title,category,description,client,year,role,tools,cover_image_url,sort_order,published,created_at) values
  ('work-1','brazilian-haircare-launch-carousel','Brazilian Haircare Launch Carousel','carousels','An 8-slide educational Instagram carousel introducing Alma Botânica''s sulfate-free Brazilian keratin line, engineered to lift saves and ingredient trust.','Alma Botânica Haircare',2026,'Social Media Designer',array['Photoshop','Figma','Illustrator']::text[],'/src/assets/images/work_haircare_carousel_1795206549447.jpg',1,true,'2026-01-15T10:00:00Z'),
  ('work-5','artisan-coffee-brand-feed-overhaul','Artisan Coffee Brand Feed Overhaul','brand-content','A cohesive Instagram grid system combining warm editorial layouts, single-origin roast spotlights, and reusable template modules.','Stone & Stem Roasters',2025,'Social Brand Designer',array['Figma','Illustrator','Photoshop']::text[],'/src/assets/images/work_coffee_brand_1795206548044.jpg',2,true,'2025-11-18T10:00:00Z'),
  ('work-3','q4-conversion-meta-ad-pack','Q4 Conversion Meta Ad Pack','ad-creatives','High-contrast static ad creatives engineered for cold traffic acquisition, featuring rapid value hooks, social proof modules, and A/B test variants.','Verve Skin Co.',2026,'Performance Ad Designer',array['Photoshop','Figma','After Effects']::text[],'/src/assets/images/work_skincare_ad_1795206548694.jpg',3,true,'2026-02-01T10:00:00Z'),
  ('work-6','summer-capsule-social-identity','Summer Capsule Social Identity','brand-content','Campaign launch toolkit covering Instagram feed posts, countdown stories, and highlight covers aligned with Mediterranean resortwear art direction.','Soli Studio',2025,'Visual Designer',array['Figma','Photoshop']::text[],'/src/assets/images/work_summer_capsule_1795206548883.jpg',4,true,'2025-10-05T10:00:00Z'),
  ('work-4','dtc-haircare-retargeting-ads','DTC Haircare Retargeting Ads','ad-creatives','Multi-ratio paid social creatives (1:1, 4:5, and 9:16) showcasing customer reviews and bundle savings for bottom-of-funnel conversions.','Alma Botânica Haircare',2026,'Social Media Designer',array['Photoshop','Illustrator']::text[],'/src/assets/images/work_haircare_carousel_1795206549447.jpg',5,true,'2026-01-22T10:00:00Z'),
  ('work-2','hydration-ritual-carousel-series','Hydration Ritual Storytelling Series','carousels','Editorial multi-slide carousel system built around crisp typography, subtle product framing, and seamless swipe continuity for DTC skincare.','Aqua Vitalis Labs',2025,'Lead Social Designer',array['Figma','Photoshop']::text[],'/src/assets/images/work_skincare_ad_1795206548694.jpg',6,true,'2025-12-10T10:00:00Z')
on conflict (id) do nothing;

insert into public.work_images (id,work_id,image_url,storage_path,alt,sort_order,created_at) values
  ('img-1-1','work-1','/src/assets/images/work_haircare_carousel_1795206549447.jpg','','Slide 01 — Hook cover frame for Brazilian keratin haircare launch',1,'2026-01-15T10:00:00Z'),
  ('img-1-2','work-1','/src/assets/images/work_summer_capsule_1795206548883.jpg','','Slide 02 — Botanical texture and sunlit ingredient story',2,'2026-01-15T10:01:00Z'),
  ('img-1-3','work-1','/src/assets/images/work_coffee_brand_1795206548044.jpg','','Slide 03 — Editorial brand rhythm and typography system',3,'2026-01-15T10:02:00Z'),
  ('img-2-1','work-2','/src/assets/images/work_skincare_ad_1795206548694.jpg','','Hydration ritual cover slide with macro droplet detail',1,'2025-12-10T10:00:00Z'),
  ('img-2-2','work-2','/src/assets/images/work_haircare_carousel_1795206549447.jpg','','Active botanical pairing breakdown slide',2,'2025-12-10T10:01:00Z'),
  ('img-3-1','work-3','/src/assets/images/work_skincare_ad_1795206548694.jpg','','Meta Ad Variant A — High-contrast hero hydration hook',1,'2026-02-01T10:00:00Z'),
  ('img-3-2','work-3','/src/assets/images/work_summer_capsule_1795206548883.jpg','','Meta Ad Variant B — Lifestyle editorial comparison',2,'2026-02-01T10:01:00Z'),
  ('img-4-1','work-4','/src/assets/images/work_haircare_carousel_1795206549447.jpg','','Retargeting ad featuring keratin oil and repair cream bundle',1,'2026-01-22T10:00:00Z'),
  ('img-4-2','work-4','/src/assets/images/work_coffee_brand_1795206548044.jpg','','Warm editorial social proof card frame',2,'2026-01-22T10:01:00Z'),
  ('img-5-1','work-5','/src/assets/images/work_coffee_brand_1795206548044.jpg','','Stone & Stem Ethiopia Guji roast origin editorial frame',1,'2025-11-18T10:00:00Z'),
  ('img-5-2','work-5','/src/assets/images/work_summer_capsule_1795206548883.jpg','','Morning ritual lifestyle photography extension',2,'2025-11-18T10:01:00Z'),
  ('img-6-1','work-6','/src/assets/images/work_summer_capsule_1795206548883.jpg','','Summer capsule launch hero post in Mediterranean sunlight',1,'2025-10-05T10:00:00Z'),
  ('img-6-2','work-6','/src/assets/images/work_haircare_carousel_1795206549447.jpg','','Capsule texture and warm tone grid anchor',2,'2025-10-05T10:01:00Z')
on conflict (id) do nothing;
