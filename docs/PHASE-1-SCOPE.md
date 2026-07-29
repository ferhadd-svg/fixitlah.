# kerjakita — Phase 1 Scope (MVP)

_Last updated: 2026-07-29_

Phase 1 turns the clickable prototype into a **real MVP** that can run the
**Bukit Rimau + Kota Kemuning pilot** with real pros and real customers.
Data persists, pros can list (and pay a listing fee), customers can book, and
there's light admin to vet pros.

> **North star:** customer first. Every trade-off favours the customer's path
> to booking. The pro and admin surfaces stay out of the customer's way.

---

## 1. Goal & definition of done

**Goal:** a working product good enough to onboard ~25 real pros and take real
bookings in the pilot zone.

**Done when:**
- A customer can browse pros near an area, view a real profile, and book — **without creating an account until the moment they book**.
- A real pro can register, get verified by admin, appear in search, and receive + accept booking requests.
- Bookings and reviews persist in a database.
- The listing-fee payment flow exists (waived during the pilot, but wired).
- It's deployed on a real URL and installable as a PWA.

---

## 2. Guiding principles

1. **Customer first** — no login to browse or view profiles. Auth only at booking.
2. **Lean** — managed services over custom infra. Don't build for scale we don't have yet.
3. **Pilot-scoped** — one zone, ~25 pros, hundreds of customers.
4. **Accessible** — big tap targets, plain language, few steps, WhatsApp-based comms (familiar to 23–45 and tech-savvy elderly), installable PWA.

---

## 3. Recommended stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Data + Auth + Storage** | **Supabase** (Postgres, Auth, Storage, Row-Level Security, Edge Functions) | One service replaces DB + auth + file storage + API. Generous free tier. PostGIS available for real distance queries. |
| **Frontend** | **Next.js (React) on Vercel** | Port the existing clean UI into components. Easy auth/session/routing, PWA-ready, good SEO for the marketing/landing side. Free hobby tier. |
| **Payments (listing fee)** | **ToyyibPay or Billplz** (Malaysian) | Native FPX + e-wallet support, low per-transaction fee, simple integration. (Stripe later for cards/international.) |
| **Comms** | **Email (Resend)** for receipts + **WhatsApp handled manually** during pilot | Keep it cheap; automate WhatsApp (Cloud API) in Phase 2. |
| **Analytics** | **PostHog** or **Plausible** | Privacy-friendly product + funnel analytics. |

**Why not a custom Node/Express backend + self-managed DB?** Slower and more ops
for zero benefit at pilot scale. Supabase collapses auth + DB + storage + API and
lets the frontend talk to the DB directly under Row-Level Security.

---

## 4. Architecture (high level)

```
[ Next.js app on Vercel ]  ──►  [ Supabase ]
     - customer web (PWA)          - Postgres (+ PostGIS)
     - pro dashboard               - Auth (OTP / Google)
     - admin (protected)           - Storage (pro & job photos)
     - calls payment gateway       - Row-Level Security
             │
             └──►  [ ToyyibPay / Billplz ]  (listing-fee checkout + webhook)
             └──►  [ Resend ]               (transactional email)
```

Distance/5 km matching runs in Postgres (PostGIS `ST_DWithin`) instead of in the
browser — accurate and scales.

---

## 5. Data model (core tables)

- **profiles** — `id`, `role` (customer|pro|admin), `full_name`, `phone`, `email`, `created_at`
- **areas** — `id`, `name`, `lat`, `lng`, `live` (bool)  _(admin can toggle live zones)_
- **categories** — `id`, `label`, `emoji`
- **pros** — `user_id`, `business_name`, `bio`, `base_lat`, `base_lng`, `base_area_id`, `radius_km`, `years_exp`, `status` (pending|verified|suspended), `plan` (basic|pro), `rating_avg`, `jobs_count`, `verified_at`
- **pro_services** — `pro_id`, `category_id`, `price_from`
- **bookings** — `id`, `customer_id`, `pro_id`, `category_id`, `status` (requested|accepted|scheduled|completed|cancelled), `when_pref`, `note`, `scheduled_at`, `price_agreed`, `created_at`
- **reviews** — `id`, `booking_id`, `customer_id`, `pro_id`, `rating`, `comment`, `created_at`
- **waitlist** — `id`, `email`, `area`, `created_at`
- **pro_subscriptions** — `pro_id`, `plan`, `status`, `gateway_ref`, `period_start`, `period_end`

**Row-Level Security highlights:** pros & their services are publicly readable
only when `status = verified`; a customer can read/write only their own bookings;
a pro can read bookings assigned to them; admin role bypasses for moderation.

---

## 6. Scope by user (in customer-first order)

### 6.1 Customer  _(priority 1)_
- Browse verified pros near a chosen area **without an account**.
- Filter by service; 5 km radius match (server-side).
- View pro profile with **real** reviews & stats.
- **Book** → sign in here for the first time (phone OTP) → create booking → pro is notified.
- See booking status; leave a review after completion.

### 6.2 Pro  _(priority 2)_
- Register (the existing form) → creates a **pending** pro profile.
- After admin verification → appears in search.
- Choose a listing plan (Basic/Pro); **free during the pilot** but the checkout is wired.
- Manage services & prices; see booking requests; accept / mark complete.
- See simple earnings/jobs summary.

### 6.3 Admin  _(priority 3 — can start minimal)_
- Review pending pros → verify / reject.
- Toggle which areas are `live`.
- Oversight of bookings; handle disputes manually.
- _Can begin as a couple of protected pages + the Supabase dashboard._

---

## 7. Payments scope

- **In scope:** the **pro listing fee** (Basic RM19 / Pro RM49 per month) via
  ToyyibPay/Billplz, with a webhook to activate the subscription. Waived during
  the pilot (flip a flag to enable).
- **Out of scope (→ Phase 2):** customer job payments, **escrow, and payouts**.
  Holding and releasing money brings KYC/payout/regulatory weight that would
  stall Phase 1. During the pilot, jobs are paid directly (cash/transfer), and
  the "guarantee" is honoured **manually** on the small pilot volume.

---

## 8. Build order (milestones)

| # | Milestone | Delivers |
|---|-----------|----------|
| **M1** | Foundation | Supabase project + schema + RLS; seed categories/areas; Next.js app scaffold with the ported UI; deploy skeleton. |
| **M2** | Customer read path | Pros list + profiles from the DB; 5 km PostGIS search; category filter. **No auth needed** — the browse experience is real first. |
| **M3** | Auth + booking | Phone-OTP login at the booking step; create + track bookings; pro receives the request. |
| **M4** | Pro side | Registration → pending; admin verify; pro dashboard (services, requests, accept/complete); listing-plan checkout (waived in pilot). |
| **M5** | Reviews, comms, polish | Post-job reviews; email/WhatsApp notifications; analytics; PWA manifest + install. **Pilot launch.** |

Customer value lands early (M2–M3) before the pro/admin machinery (M4).

---

## 9. Effort & cost

**Effort:** roughly **6–10 weeks** of focused build (scales with how much time is
put in). M2–M3 are the core; M4 is the largest single chunk.

**Monthly cost during pilot:** effectively **RM0–~RM120**.
- Supabase free tier (Pro ~USD25 only if we outgrow it) · Vercel free · domain ~RM50/yr · payment gateway per-transaction only · email/SMS minimal.

SMS for phone-OTP has a small per-message cost — see decisions below.

---

## 10. Success metrics (Phase 1 / pilot)

- **Supply:** ~25 verified pros across the 5 starter services.
- **Match rate:** % of searches that show ≥3 nearby pros.
- **Demand:** 300–500 customers onboarded, **100+ completed bookings**.
- **Repeat rate** within 60 days (the number that proves the model).
- **Leakage:** % of repeat jobs rebooked in-app.
- Average rating & booking-completion rate.

---

## 11. Decisions

**Locked (from the prototype flow):**
- **Flow:** splash → **login** → home (simple top categories) → sub-service → pros → booking → payment → confirmed. Login-first, with a **"Continue as guest"** fallback so no one bounces at the wall.
- **Login methods:** Google + Apple + email (add phone OTP later if wanted).
- **Categories:** two-level — short top-level groups (Aircon, Plumbing, Car, Construction…) drilling into detailed sub-services (Car → tyres, detailing, audio, battery…).
- **Payment methods (customer-facing):** Apple Pay, Google Pay, Touch 'n Go, DuitNow QR, FPX online banking, card.

**Still to lock:**
1. **Payment gateway** for the pro **listing fee** + (later) job payments: ToyyibPay vs Billplz. _(ToyyibPay simplest to start.)_ The customer payment methods above are surfaced through whichever gateway/aggregator we pick.
2. **Frontend migration:** port to Next.js now (recommended) vs keep the static site + Supabase JS short-term.
3. **Repo/brand:** rename the GitHub repo `fixitlah.` → `kerjakita`? (cosmetic, changes the URL).

---

## 12. Explicitly out of scope (later phases)

- Escrow / job payments / payouts → **Phase 2**
- In-app chat + masked phone numbers → **Phase 2**
- Recurring subscriptions & kerjakita+ membership → **Phase 3**
- Native app (PWA covers Phase 1) → **Phase 3**
- Multi-zone expansion, advanced scheduling/calendar, B2B contracts → **Phase 3–4**
