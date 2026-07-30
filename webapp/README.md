# kerjakita — web app (Phase 1)

The real, persistent version of kerjakita — Next.js + Supabase. This replaces
the static prototype at the repo root once it's fully wired up; for now both
live side by side.

**Runs in demo mode out of the box** (no Supabase project needed) — falls
back to bundled sample data so you can develop the UI immediately. Connect a
real Supabase project (see below) to make bookings, pro signups, and the
waitlist actually persist.

## Quick start

```bash
cd webapp
npm install
npm run dev
```

Open http://localhost:3000 — you'll see a yellow "Demo mode" banner until a
Supabase project is connected.

## Connect a real Supabase project

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the two migrations in order:
   - `../supabase/migrations/0001_init.sql` (schema, PostGIS matching function, RLS)
   - `../supabase/migrations/0002_seed.sql` (categories, areas, taxonomy)
3. In **Authentication → Providers**, enable:
   - **Google** (needs a Google Cloud OAuth client ID/secret)
   - **Apple** (needs an Apple Developer Services ID — skip for now if you
     don't have one yet; the button will just no-op)
   - **Email** (magic link — on by default)
   - **Anonymous sign-ins** (Authentication → Settings) — powers "Continue as guest"
4. Copy `.env.example` to `.env.local` and fill in your project's URL + anon
   key from **Project Settings → API**.
5. Restart `npm run dev` — the demo banner disappears once it can reach Supabase.

## What's real vs. still a stand-in

| Working now | Still to build (later milestones) |
|---|---|
| Real Postgres schema + Row Level Security | Payments actually charging (gateway integration) |
| Real 5 km matching (PostGIS `nearby_pros`) | Escrow / holding & releasing money |
| Real auth (Google / Apple / email / guest) | In-app chat, masked phone numbers |
| Bookings persist to the database | Pro registration UI (still the static site's form) |
| Waitlist emails persist | Admin pro-verification screen |

## Notes

- No real pros are seeded (`0002_seed.sql`'s pro rows are commented out) —
  Supabase requires a real `auth.users` row per pro (foreign key), so sample
  pros can't be inserted until real accounts exist. Fastest way to test the
  browse path with real data: sign up as a pro through Supabase Auth (or add
  a user manually in the dashboard), then insert matching `pros` /
  `pro_services` rows using that user's UUID.
- Until then, demo mode's bundled pros (`lib/demoData.js`) let you develop
  and test the full customer flow immediately.
