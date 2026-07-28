# fixitlah.

**Cari tukang dekat kawasan you. Senang je.**

A Malaysian on-demand services marketplace — from aircond servicing and paip
bocor to mekanik kereta — that only matches customers with tukang (handymen /
tradespeople) **within a small radius of their kawasan** (default **5 km**).
Small radius = faster response, support local, and less cut-throat competition
for the tukang.

This repo currently holds a **clickable front-end prototype** (no backend yet).
Everything runs in the browser on mock data so you can see and feel the concept.

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

- **📍 Kawasan-based matching** — pick your area (Bukit Rimau, Kota Kemuning,
  Klang, Shah Alam, …) or tap **Guna GPS saya**. The app snaps you to the
  nearest known area.
- **🎯 Real 5 km radius filter** — distances are computed with the Haversine
  formula. Drag the **radius slider** and watch tukang appear/disappear. Only
  tukang inside your radius are shown, sorted nearest-first.
- **🧰 14 service categories** — aircond, paip, wireman, mekanik, motor,
  cleaning, potong rumput, pest control, reno, cat, appliance repair, tukang
  kunci, CCTV, pasang perabot. Filter by category + free-text search.
- **🛠️ Tukang cards** — rating, jobs done, "from RM__", response time, verified
  badge, and distance from you.
- **📩 Booking flow (mock)** — pick a time, describe the problem, send request.
- **🤝 "Jadi tukang" section** — the freelancer side of the story: register once,
  get jobs only within 5 km of your base.

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
