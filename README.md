# kerjakita

**Tukang berdekatan, dalam 5 km.**

A Malaysian on-demand services marketplace — from aircond servicing and paip
bocor to mekanik kereta — that only matches customers with tukang (handymen /
tradespeople) **within a small radius of their kawasan** (default **5 km**).
Small radius = faster response, support local, and less cut-throat competition
for the tukang.

The landing page **is** the booking page: pick a service, see the tukang within
5 km of your area, tap **Book**. No marketing detour. The look is deliberately
clean and bright (Wise-inspired): forest green + lime, lots of whitespace.

This repo currently holds a **clickable front-end prototype** (no backend yet).
Everything runs in the browser on mock data so you can see and feel the concept.

> Note: the folder / git repo is still named `fixitlah` (the original name);
> the product is now branded **kerjakita**.

---

## Run it

No build step, no install. Just open the file:

```bash
# from the repo folder
open index.html            # macOS
xdg-open index.html        # Linux
# or just double-click index.html
```

Or serve it locally (nicer for GPS testing, which needs a secure/localhost origin):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## What works in the prototype

- **🛎️ Booking-first landing** — the first screen is the booking flow: choose a
  service, the matching tukang appear immediately below.
- **📍 Kawasan-based matching** — pick your area (Bukit Rimau, Kota Kemuning,
  Klang, Shah Alam, …) or tap **Guna GPS saya**. The app snaps you to the
  nearest known area.
- **🎯 Real 5 km radius filter** — distances are computed with the Haversine
  formula. Only tukang inside 5 km are shown, sorted nearest-first. If none are
  in range, one tap widens the search.
- **🧰 14 service categories** — aircond, paip, wireman, mekanik, motor,
  cleaning, potong rumput, pest control, reno, cat, appliance repair, tukang
  kunci, CCTV, pasang perabot.
- **📩 Booking flow (mock)** — pick a time, describe the problem, send request.

Everything is styled mobile-first, so it looks right on a phone.

---

## Project structure

| File | What it does |
|------|--------------|
| `index.html` | Page structure & sections |
| `styles.css` | All styling (tropical + warm Malaysian palette) |
| `data.js`    | Mock seed data: service categories, areas, tukang (with lat/lng) |
| `app.js`     | State, Haversine distance, radius matching, rendering, modals |

The matching logic lives in `app.js` → `distanceKm()` and `matchedTukang()`.

---

## Roadmap (from prototype → real product)

**Next up**
- [ ] Real backend + database (customers, tukang, bookings that persist)
- [ ] Auth: separate customer & tukang signup / login
- [ ] Tukang onboarding: set base location + service radius, upload SSM / IC
      for verification
- [ ] Live geocoding (address → lat/lng) instead of preset areas
- [ ] Actual WhatsApp / in-app messaging between customer and tukang

**Later**
- [ ] In-app payment + escrow (release after job done), FPX / e-wallet (GrabPay,
      TnG, Boost)
- [ ] Ratings & reviews written by real customers
- [ ] Push notifications for new nearby jobs (tukang side)
- [ ] Admin dashboard + dispute handling
- [ ] PWA / wrap into an installable mobile app

---

*Prototype demo — all tukang, prices and reviews are sample data. Made in Malaysia 🇲🇾*
