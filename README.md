Wave App - Auth & Supabase

Setup

- Backend
  - Requires env vars: `SUPABASE_URL`, `SUPABASE_KEY` (service role or anon works for auth validation).
  - Start: from `backend/` run `npm i && npm run dev`.

- Frontend
  - Requires build env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
  - Local dev: create `frontend/.env` with the two variables above.
  - Start: from `frontend/` run `npm i && npm run dev`.

Features Added

- Frontend signup/login/logout via Supabase Auth.
- Auth context with session handling and UI in `Index` header.
- Backend JWT validation middleware and protected `/api/me` route.

Kubernetes/Helm

- Set `supabase.url` and `supabase.key` in Helm values or use `supabase.existingSecret`.
- Frontend build must have `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set at build time.
