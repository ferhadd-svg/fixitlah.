/* ============================================================
   kerjakita  —  app logic
   Booking-first. Pick a service, see tukang within 5 km, book.
   ============================================================ */

const PAGE_SIZE = 6;

const state = {
  location: AREAS[0],   // default: Bukit Rimau
  radiusKm: 5,
  category: null,       // null = Semua
  shown: PAGE_SIZE,
};

const $ = sel => document.querySelector(sel);

// ---------- Helpers ----------
function initials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}
function catById(id) { return CATEGORIES.find(c => c.id === id); }

// ---------- Deterministic "past jobs" generator ----------
// Seeded so each pro's history is stable between renders.
function seededRng(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const WHENS = ["3 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago", "2 months ago"];

function proStats(t) {
  const rng = seededRng(t.id + "stats");
  const onTime = Math.min(99, Math.round(90 + (t.rating - 4.5) * 16 + rng() * 3));
  const repeat = Math.round(52 + (t.rating - 4.5) * 30 + rng() * 18);
  return { jobs: t.jobs, onTime, repeat: Math.min(88, repeat), since: t.since };
}

function proJobs(t) {
  const rng = seededRng(t.id + "jobs");
  const cat = catById(t.service);
  const count = 4 + Math.floor(rng() * 2); // 4–5
  const out = [];
  for (let i = 0; i < count; i++) {
    const five = rng() < 0.5 + (t.rating - 4.5) * 0.7; // higher rating → more 5★
    const stars = five ? 5 : 4;
    const pool = five ? REVIEW_POOL.positive : REVIEW_POOL.good;
    const text = pool[Math.floor(rng() * pool.length)];
    const author = REVIEW_POOL.authors[Math.floor(rng() * REVIEW_POOL.authors.length)];
    out.push({ stars, text, author, when: WHENS[i] || "a while ago", job: cat.label });
  }
  return out;
}

let currentProfileId = null;

// Haversine distance in km — the heart of the 5 km matching.
function distanceKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function matchedTukang() {
  const here = state.location;
  return TUKANG
    .map(t => ({ ...t, dist: distanceKm(here, t) }))
    .filter(t => t.dist <= state.radiusKm)
    .filter(t => !state.category || t.service === state.category)
    .sort((a, b) => a.dist - b.dist);
}

// ---------- Service picker ----------
function renderServices() {
  const wrap = $("#services");
  const all = `<button class="svc ${!state.category ? "is-active" : ""}" data-cat="">
      <span class="svc__emoji">🧰</span> All</button>`;
  const rest = CATEGORIES.map(c => `
    <button class="svc ${state.category === c.id ? "is-active" : ""}" data-cat="${c.id}">
      <span class="svc__emoji">${c.emoji}</span> ${c.label}
    </button>`).join("");
  wrap.innerHTML = all + rest;
  wrap.querySelectorAll(".svc").forEach(b => {
    b.addEventListener("click", () => {
      state.category = b.dataset.cat || null;
      state.shown = PAGE_SIZE;
      renderServices();
      renderResults();
    });
  });
}

// ---------- Tukang rows ----------
function tukangRow(t) {
  const cat = catById(t.service);
  const distTxt = t.dist < 1 ? `${Math.round(t.dist * 1000)} m` : `${t.dist.toFixed(1)} km`;
  return `
  <div class="trow" data-id="${t.id}" role="button" tabindex="0">
    <div class="tavatar">${initials(t.name)}</div>
    <div class="tinfo">
      <div class="tname">${t.name}${t.verified ? ' <span class="tick" title="Verified">✔</span>' : ""}</div>
      <div class="tsub">${cat.emoji} ${cat.label} · ${t.area} · ${distTxt} · ★ ${t.rating.toFixed(1)}</div>
    </div>
    <div class="tmeta">
      <div class="tprice">from<b>RM${t.priceFrom}</b></div>
      <button class="btn btn--primary" data-book="${t.id}">Book</button>
    </div>
  </div>`;
}

function renderResults() {
  const list = matchedTukang();
  const listEl = $("#list");
  const empty = $("#empty");
  const showmoreWrap = $("#showmoreWrap");

  $("#locArea").textContent = state.location.name;
  $("#subArea").textContent = state.location.name;

  if (list.length === 0) {
    listEl.innerHTML = "";
    showmoreWrap.hidden = true;
    empty.hidden = false;
    $("#emptyRadius").textContent = `${state.radiusKm} km`;
    $("#emptyExpand").textContent = `Search within ${Math.min(20, state.radiusKm + 5)} km`;
    $("#resultsCount").textContent = "No pros nearby";
    return;
  }

  empty.hidden = true;
  const visible = list.slice(0, state.shown);
  listEl.innerHTML = visible.map(tukangRow).join("");

  // Whole row opens the profile; the Book button books directly.
  listEl.querySelectorAll(".trow").forEach(row => {
    row.addEventListener("click", () => openProfile(row.dataset.id));
    row.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProfile(row.dataset.id); }
    });
  });
  listEl.querySelectorAll("[data-book]").forEach(b =>
    b.addEventListener("click", e => { e.stopPropagation(); openBooking(b.dataset.book); }));

  const remaining = list.length - visible.length;
  showmoreWrap.hidden = remaining <= 0;
  if (remaining > 0) $("#showmoreBtn").textContent = `Show more (${remaining})`;

  const s = list.length === 1 ? "" : "s";
  $("#resultsCount").textContent = `${list.length} pro${s} within ${state.radiusKm} km`;
}

// ---------- Location modal ----------
function renderAreaList() {
  const wrap = $("#areaList");
  wrap.innerHTML = AREAS.map(a => {
    const active = a.id === state.location.id;
    const d = distanceKm(state.location, a);
    return `<button class="arealist__item ${active ? "is-active" : ""}" data-area="${a.id}">
      <span>${a.name}</span>
      ${active ? "<small>📍 current</small>" : `<small>${d.toFixed(1)} km</small>`}
    </button>`;
  }).join("");
  wrap.querySelectorAll(".arealist__item").forEach(item => {
    item.addEventListener("click", () => {
      state.location = AREAS.find(a => a.id === item.dataset.area);
      state.shown = PAGE_SIZE;
      closeModal("#locModal");
      renderResults();
      toast(`📍 Area: ${state.location.name}`);
    });
  });
}

// ---------- Profile modal ----------
function openProfile(tukangId) {
  const t = TUKANG.find(x => x.id === tukangId);
  const cat = catById(t.service);
  const s = proStats(t);
  const jobs = proJobs(t);
  currentProfileId = tukangId;

  const jobsHtml = jobs.map(j => `
    <div class="job">
      <div class="job__top">
        <span class="job__stars">${"★".repeat(j.stars)}${"☆".repeat(5 - j.stars)}</span>
        <span class="job__when">${j.when}</span>
      </div>
      <p class="job__text">“${j.text}”</p>
      <div class="job__meta"><b>${j.author}</b> · ${j.job}</div>
    </div>`).join("");

  $("#profileBody").innerHTML = `
    <div class="profile__head">
      <div class="profile__top">
        <div class="profile__avatar">${initials(t.name)}</div>
        <div>
          <div class="profile__name">${t.name}${t.verified ? ' <span class="tick" title="Verified">✔</span>' : ""}</div>
          <div class="profile__svc">${cat.emoji} ${cat.label} · ${t.area}</div>
        </div>
      </div>
      <div class="profile__rate">
        <span><span class="profile__star">★</span> <b>${t.rating.toFixed(1)}</b> (${t.reviews} reviews)</span>
        <span><b>${t.jobs}</b> jobs done</span>
        <span>Responds <b>${t.respondsIn}</b></span>
        <span>From <b>RM${t.priceFrom}</b></span>
      </div>
    </div>

    <div class="trustrow">
      <span class="trustbadge">🛡️ Payment protected</span>
      <span class="trustbadge">✅ 30-day guarantee</span>
      ${t.verified ? '<span class="trustbadge">🪪 ID verified</span>' : ""}
      <span class="trustbadge">📅 Member since ${s.since}</span>
    </div>

    <div class="profile__section">
      <h4>About</h4>
      <p class="profile__about">${t.blurb}</p>
    </div>

    <div class="stats">
      <div class="stat"><b>${s.jobs}</b><span>Jobs done</span></div>
      <div class="stat"><b>${s.onTime}%</b><span>On time</span></div>
      <div class="stat"><b>${t.rating.toFixed(1)}</b><span>Rating</span></div>
      <div class="stat"><b>${s.repeat}%</b><span>Repeat clients</span></div>
    </div>

    <div class="profile__section"><h4>Recent jobs & reviews</h4></div>
    <div class="jobs">${jobsHtml}</div>`;

  $("#profileBook").textContent = `Book ${t.name.split(" ")[0]} · from RM${t.priceFrom}`;
  openModal("#profileModal");
}

// ---------- Booking modal ----------
function openBooking(tukangId) {
  const t = TUKANG.find(x => x.id === tukangId);
  const cat = catById(t.service);
  $("#bookWho").innerHTML = `
    <div class="tavatar">${initials(t.name)}</div>
    <div><b>${t.name}</b><br/><span>${cat.emoji} ${cat.label} · from RM${t.priceFrom}</span></div>`;
  $("#bookForm").dataset.tukang = tukangId;
  openModal("#bookModal");
}

// ---------- Modal / toast helpers ----------
function openModal(sel) { $(sel).hidden = false; document.body.style.overflow = "hidden"; }
function closeModal(sel) { $(sel).hidden = true; document.body.style.overflow = ""; }
function closeAllModals() {
  ["#locModal", "#bookModal", "#profileModal"].forEach(closeModal);
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add("is-show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("is-show");
    setTimeout(() => (el.hidden = true), 300);
  }, 2600);
}

// ---------- Init ----------
function init() {
  renderServices();
  renderResults();

  $("#locBtn").addEventListener("click", () => { renderAreaList(); openModal("#locModal"); });

  $("#gpsBtn").addEventListener("click", () => {
    if (!navigator.geolocation) { toast("GPS isn't supported in this browser 😅"); return; }
    $("#gpsBtn").textContent = "🛰️ Finding your location…";
    navigator.geolocation.getCurrentPosition(
      pos => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const nearest = AREAS.map(a => ({ a, d: distanceKm(me, a) })).sort((x, y) => x.d - y.d)[0];
        state.location = nearest.a;
        state.shown = PAGE_SIZE;
        $("#gpsBtn").innerHTML = "<span>🛰️</span> Use my GPS location";
        closeModal("#locModal");
        renderResults();
        toast(`📍 Nearest area: ${nearest.a.name}`);
      },
      () => {
        $("#gpsBtn").innerHTML = "<span>🛰️</span> Use my GPS location";
        toast("Couldn't access GPS. Please pick your area manually 🙏");
      }
    );
  });

  $("#showmoreBtn").addEventListener("click", () => { state.shown += PAGE_SIZE; renderResults(); });

  // Book from the profile → close profile, open booking for the same pro.
  $("#profileBook").addEventListener("click", () => {
    closeModal("#profileModal");
    if (currentProfileId) openBooking(currentProfileId);
  });

  $("#emptyExpand").addEventListener("click", () => {
    state.radiusKm = Math.min(20, state.radiusKm + 5);
    state.shown = PAGE_SIZE;
    renderResults();
  });

  $("#bookForm").addEventListener("submit", e => {
    e.preventDefault();
    const t = TUKANG.find(x => x.id === e.target.dataset.tukang);
    closeModal("#bookModal");
    e.target.reset();
    toast(`✅ Request sent to ${t.name}! They'll WhatsApp you shortly.`);
  });

  document.querySelectorAll("[data-close]").forEach(el =>
    el.addEventListener("click", () => { closeAllModals(); }));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAllModals();
  });
}

document.addEventListener("DOMContentLoaded", init);
