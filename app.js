/* ============================================================
   fixitlah.  —  app logic
   Vanilla JS, no framework. State + render + the 5 km matching.
   ============================================================ */

// ---------- State ----------
const state = {
  location: AREAS[0],        // default: Bukit Rimau
  radiusKm: 5,
  category: null,            // null = all
  query: "",
};

// Consistent avatar colours from a name.
const AVATAR_COLORS = ["#12a594", "#ff8a3d", "#0b6b62", "#f2701f", "#2d8f7a", "#e0651a", "#1e7d84"];
function colorFor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}
function catById(id) { return CATEGORIES.find(c => c.id === id); }

// ---------- The core: Haversine distance (km) ----------
function distanceKm(a, b) {
  const R = 6371; // earth radius km
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const la1 = a.lat * Math.PI / 180;
  const la2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ---------- Matching: who is within the radius ----------
function matchedTukang() {
  const here = state.location;
  return TUKANG
    .map(t => ({ ...t, dist: distanceKm(here, t) }))
    .filter(t => t.dist <= state.radiusKm)
    .filter(t => !state.category || t.service === state.category)
    .filter(t => {
      if (!state.query) return true;
      const q = state.query.toLowerCase();
      const cat = catById(t.service);
      return (
        t.name.toLowerCase().includes(q) ||
        t.blurb.toLowerCase().includes(q) ||
        (cat && (cat.label.toLowerCase().includes(q) || cat.tagline.toLowerCase().includes(q))) ||
        t.service.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => a.dist - b.dist);
}

// Count of everything reachable (ignores category/search) — for the hero stat.
function reachableCount() {
  return TUKANG.filter(t => distanceKm(state.location, t) <= state.radiusKm).length;
}

// ---------- Renderers ----------
const $ = sel => document.querySelector(sel);

function renderCats() {
  const scroll = $("#catScroll");
  const all = `<button class="chip ${!state.category ? "is-active" : ""}" data-cat="">
      <span class="chip__emoji">🧰</span> Semua</button>`;
  const chips = CATEGORIES.map(c => `
    <button class="chip ${state.category === c.id ? "is-active" : ""}" data-cat="${c.id}">
      <span class="chip__emoji">${c.emoji}</span> ${c.label}
    </button>`).join("");
  scroll.innerHTML = all + chips;
  scroll.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.cat || null;
      renderCats();
      renderResults();
    });
  });
}

function tukangCard(t) {
  const cat = catById(t.service);
  const distTxt = t.dist < 1 ? `${Math.round(t.dist * 1000)} m` : `${t.dist.toFixed(1)} km`;
  return `
  <article class="card">
    <div class="card__top">
      <div class="card__avatar" style="background:${colorFor(t.name)}">${initials(t.name)}</div>
      <div class="card__id">
        <div class="card__name">${t.name} ${t.verified ? '<span class="badge badge--verified">✔ Verified</span>' : ""}</div>
        <div class="card__svc">${cat.emoji} ${cat.label} • ${t.area}</div>
      </div>
      <div class="card__dist">${distTxt}<small>dari you</small></div>
    </div>
    <p class="card__blurb">${t.blurb}</p>
    <div class="card__meta">
      <span class="card__rating">★ ${t.rating.toFixed(1)} <span>(${t.reviews})</span></span>
      <span>• ${t.jobs} job siap</span>
      <span class="card__price">• dari <b>RM${t.priceFrom}</b></span>
      <span>• ${t.respondsIn}</span>
    </div>
    <div class="card__actions">
      <button class="btn btn--ghost" data-book="${t.id}">Book</button>
      <button class="btn btn--primary" data-wa="${t.id}">WhatsApp</button>
    </div>
  </article>`;
}

function renderResults() {
  const list = matchedTukang();
  const grid = $("#grid");
  const empty = $("#empty");

  // Title reflects the active filter.
  const cat = state.category ? catById(state.category) : null;
  $("#resultsTitle").textContent = cat
    ? `${cat.label} dekat you`
    : "Tukang dekat you";

  if (list.length === 0) {
    grid.innerHTML = "";
    grid.hidden = true;
    empty.hidden = false;
    $("#emptyRadius").textContent = `${state.radiusKm} km`;
  } else {
    grid.hidden = false;
    empty.hidden = true;
    grid.innerHTML = list.map(tukangCard).join("");
    grid.querySelectorAll("[data-book]").forEach(b =>
      b.addEventListener("click", () => openBooking(b.dataset.book)));
    grid.querySelectorAll("[data-wa]").forEach(b =>
      b.addEventListener("click", () => {
        const t = TUKANG.find(x => x.id === b.dataset.wa);
        toast(`📲 Opening WhatsApp with ${t.name}… (demo)`);
      }));
  }

  // Sync the various counters / labels.
  $("#radiusVal").textContent = `${state.radiusKm} km`;
  $("#statRadius").textContent = state.radiusKm;
  $("#heroRadius").textContent = `${state.radiusKm} km`;
  $("#statTukang").textContent = reachableCount();
  $("#locArea").textContent = state.location.name;
}

// ---------- Location modal ----------
function renderAreaList() {
  const wrap = $("#areaList");
  wrap.innerHTML = AREAS.map(a => {
    const d = distanceKm(state.location, a);
    const active = a.id === state.location.id;
    return `<button class="arealist__item ${active ? "is-active" : ""}" data-area="${a.id}">
      <span>${a.name}</span>
      ${active ? "<small>📍 sekarang</small>" : `<small>${d < 0.1 ? "" : d.toFixed(1) + " km"}</small>`}
    </button>`;
  }).join("");
  wrap.querySelectorAll(".arealist__item").forEach(item => {
    item.addEventListener("click", () => {
      state.location = AREAS.find(a => a.id === item.dataset.area);
      closeModal("#locModal");
      renderResults();
      toast(`📍 Kawasan tukar ke ${state.location.name}`);
    });
  });
}

// ---------- Booking modal ----------
function openBooking(tukangId) {
  const t = TUKANG.find(x => x.id === tukangId);
  const cat = catById(t.service);
  $("#bookWho").innerHTML = `
    <div class="card__avatar" style="background:${colorFor(t.name)}">${initials(t.name)}</div>
    <div>
      <b>${t.name}</b><br/>
      <span class="join__meta">${cat.emoji} ${cat.label} • dari RM${t.priceFrom}</span>
    </div>`;
  $("#bookForm").dataset.tukang = tukangId;
  openModal("#bookModal");
}

// ---------- Modal helpers ----------
function openModal(sel) { $(sel).hidden = false; document.body.style.overflow = "hidden"; }
function closeModal(sel) { $(sel).hidden = true; document.body.style.overflow = ""; }

// ---------- Toast ----------
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

// ---------- Wire up events ----------
function init() {
  renderCats();
  renderResults();

  // Location pill -> open modal
  $("#locBtn").addEventListener("click", () => { renderAreaList(); openModal("#locModal"); });

  // GPS button -> find nearest preset area to the real position
  $("#gpsBtn").addEventListener("click", () => {
    if (!navigator.geolocation) { toast("GPS tak support kat browser ni 😅"); return; }
    $("#gpsBtn").textContent = "🛰️ Mencari lokasi…";
    navigator.geolocation.getCurrentPosition(
      pos => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const nearest = AREAS
          .map(a => ({ a, d: distanceKm(me, a) }))
          .sort((x, y) => x.d - y.d)[0];
        state.location = nearest.a;
        $("#gpsBtn").innerHTML = "<span>🛰️</span> Guna lokasi GPS saya";
        closeModal("#locModal");
        renderResults();
        toast(`📍 Kawasan terdekat: ${nearest.a.name}`);
      },
      () => {
        $("#gpsBtn").innerHTML = "<span>🛰️</span> Guna lokasi GPS saya";
        toast("Tak dapat akses GPS. Pilih kawasan manual ya 🙏");
      }
    );
  });

  // Radius slider
  const radius = $("#radius");
  radius.addEventListener("input", () => {
    state.radiusKm = Number(radius.value);
    renderResults();
  });

  // Search
  const search = $("#searchInput");
  const clear = $("#searchClear");
  search.addEventListener("input", () => {
    state.query = search.value.trim();
    clear.hidden = !state.query;
    renderResults();
  });
  clear.addEventListener("click", () => {
    search.value = ""; state.query = ""; clear.hidden = true; search.focus(); renderResults();
  });

  // Empty-state expand
  $("#emptyExpand").addEventListener("click", () => {
    state.radiusKm = Math.min(20, Math.max(10, state.radiusKm + 5));
    radius.value = state.radiusKm;
    renderResults();
  });

  // Booking submit
  $("#bookForm").addEventListener("submit", e => {
    e.preventDefault();
    const t = TUKANG.find(x => x.id === e.target.dataset.tukang);
    closeModal("#bookModal");
    e.target.reset();
    toast(`✅ Request dihantar ke ${t.name}! Dia akan WhatsApp you sekejap lagi.`);
  });

  // "Jadi tukang" buttons
  $("#joinBtn").addEventListener("click", () => toast("🚧 Pendaftaran tukang coming soon lah!"));

  // Close modals via backdrop / X / Esc
  document.querySelectorAll("[data-close]").forEach(el =>
    el.addEventListener("click", () => { closeModal("#locModal"); closeModal("#bookModal"); }));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal("#locModal"); closeModal("#bookModal"); }
  });
}

document.addEventListener("DOMContentLoaded", init);
