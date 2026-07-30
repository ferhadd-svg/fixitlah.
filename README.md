# kerjakita

**Trusted pros near you, within 5 km.**

A Malaysian on-demand services marketplace — aircon, plumbing, electrical,
car services, construction, and more — that only matches customers with pros
**within a small radius of their kawasan** (default **5 km**). Small radius =
faster response, support local, and less cut-throat competition for the pro.

Piloting in **Bukit Rimau & Kota Kemuning**.

This repo currently holds two things side by side:

| | What it is | Status |
|---|---|---|
| **Root files** (`index.html`, `app.js`, …) | The original clickable front-end prototype — splash → login → categories → booking → payment, all on mock data | Demo only, nothing persists |
| **`webapp/`** | The real Phase 1 build — Next.js + Supabase | Runs standalone; connect a Supabase project to make it persist (see `webapp/README.md`) |

> Note: the folder / git repo is still named `fixitlah` (the original name);
> the product is now branded **kerjakita**.

---

## Run the prototype (root files)

No build step, no install:

```bash
open index.html            # macOS
xdg-open index.html        # Linux
# or just double-click index.html
```

## Run the real webapp

```bash
cd webapp
npm install
npm run dev
```

Works out of the box in **demo mode** (bundled sample data). See
`webapp/README.md` to connect a real Supabase project so bookings, pro
signups, and the waitlist actually persist.

---

## The customer flow (both versions)

Splash → **Login** (Google / Apple / email / continue as guest) → **Home**
(short top-level categories: Aircon, Plumbing, Car, Construction, …) → tap a
category → **detailed sub-services** (e.g. Car → tyres, detailing, audio,
battery) → **nearby pros** within 5 km, real distance matching → **Book**
(when + describe the problem) → **Payment** (Apple Pay, Google Pay, Touch 'n
Go, DuitNow QR, FPX, card) → confirmed.

Customer-first throughout: browsing never requires an account; the pro
registration ("List your business") and pilot-zone waitlist stay visually
secondary to the customer's path to booking.

---

## Project structure

```
index.html, styles.css, data.js, app.js   the static prototype (root)
fonts/                                    self-hosted Plus Jakarta Sans
docs/PHASE-1-SCOPE.md                     Phase 1 scope: stack, milestones, decisions
supabase/migrations/                      real Postgres schema + seed data (PostGIS matching, RLS)
webapp/                                   Next.js app — the real Phase 1 build
  app/page.js                               the whole customer flow (client component)
  lib/db.js                                 data access — Supabase first, demo-data fallback
  lib/demoData.js                           bundled sample content for demo mode
```

---

## Roadmap

**Phase 1 (in progress)** — real backend + auth + persistence. See
`docs/PHASE-1-SCOPE.md` for the full milestone breakdown (M1–M5).

**Phase 2** — real escrow/payments, in-app chat + masked contact, reviews from
real completed jobs, notifications, scheduling.

**Phase 3** — recurring subscriptions, kerjakita+ membership, referrals, pro
dashboard, installable PWA.

**Phase 4** — new verticals, B2B, expansion beyond the pilot zone.

---

*Prototype/demo content — sample pros, prices and reviews unless connected to a real Supabase project. Made in Malaysia 🇲🇾*
