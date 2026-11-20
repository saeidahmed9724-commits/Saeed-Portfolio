# Deploying to Vercel + Supabase

## 1) Supabase
1. Create a project at supabase.com.
2. SQL Editor -> New query -> paste `supabase/schema.sql` -> Run.
   This creates the tables, the public `portfolio` storage bucket, and your starter works.
3. Project Settings -> API: copy the Project URL, the anon/publishable key,
   and the secret/service_role key.

## 2) Push to GitHub
Commit the project (`.env*` files are git-ignored) and push.

## 3) Vercel
1. Add New Project -> import the repo (framework: Vite, detected automatically).
2. Environment Variables (all of them from `.env.example`):
   - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET
   - VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_BUCKET
   - ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
3. Deploy. Then open /admin and log in.

`VITE_*` variables are baked in at build time: if you change them, redeploy.

## Local development
    cp .env.example .env     # fill it in
    npm install
    npm run dev              # http://localhost:3000
