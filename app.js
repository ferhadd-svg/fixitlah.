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
      <span class="svc__emoji">🧰</span> Semua</button>`;
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
  <div class="trow">
    <div class="tavatar">${initials(t.name)}</div>
    <div class="tinfo">
      <div class="tname">${t.name}${t.verified ? ' <span class="tick" title="Verified">✔</span>' : ""}</div>
      <div class="tsub">${cat.emoji} ${cat.label} · ${t.area} · ${distTxt} · ★ ${t.rating.toFixed(1)}</div>
    </div>
    <div class="tmeta">
      <div class="tprice">dari<b>RM${t.priceFrom}</b></div>
      <button class="btn btn--primary" data-book="${t.id}">Book</button>
    </div>
  </div>`;
}

function renderResults() {
  const list = matchedTukang();
  const listEl = $("#list");
  const empty = $("#empty");
  const showmoreWrap = $("#showmoreWrap");
  const cat = state.category ? catById(state.category) : null;

  $("#locArea").textContent = state.location.name;
  $("#subArea").textContent = state.location.name;

  if (list.length === 0) {
    listEl.innerHTML = "";
    showmoreWrap.hidden = true;
    empty.hidden = false;
    $("#emptyRadius").textContent = `${state.radiusKm} km`;
    $("#emptyExpand").textContent = `Cari dalam ${Math.min(20, state.radiusKm + 5)} km`;
    $("#resultsCount").textContent = "Tiada tukang berdekatan";
    return;
  }

  empty.hidden = true;
  const visible = list.slice(0, state.shown);
  listEl.innerHTML = visible.map(tukangRow).join("");
  listEl.querySelectorAll("[data-book]").forEach(b =>
    b.addEventListener("click", () => openBooking(b.dataset.book)));

  const remaining = list.length - visible.length;
  showmoreWrap.hidden = remaining <= 0;
  if (remaining > 0) $("#showmoreBtn").textContent = `Tunjuk lagi (${remaining})`;

  const noun = cat ? cat.label : "tukang";
  $("#resultsCount").textContent = `${list.length} ${noun} dalam ${state.radiusKm} km`;
}

// ---------- Location modal ----------
function renderAreaList() {
  const wrap = $("#areaList");
  wrap.innerHTML = AREAS.map(a => {
    const active = a.id === state.location.id;
    const d = distanceKm(state.location, a);
    return `<button class="arealist__item ${active ? "is-active" : ""}" data-area="${a.id}">
      <span>${a.name}</span>
      ${active ? "<small>📍 sekarang</small>" : `<small>${d.toFixed(1)} km</small>`}
    </button>`;
  }).join("");
  wrap.querySelectorAll(".arealist__item").forEach(item => {
    item.addEventListener("click", () => {
      state.location = AREAS.find(a => a.id === item.dataset.area);
      state.shown = PAGE_SIZE;
      closeModal("#locModal");
      renderResults();
      toast(`📍 Kawasan: ${state.location.name}`);
    });
  });
}

// ---------- Booking modal ----------
function openBooking(tukangId) {
  const t = TUKANG.find(x => x.id === tukangId);
  const cat = catById(t.service);
  $("#bookWho").innerHTML = `
    <div class="tavatar">${initials(t.name)}</div>
    <div><b>${t.name}</b><br/><span>${cat.emoji} ${cat.label} · dari RM${t.priceFrom}</span></div>`;
  $("#bookForm").dataset.tukang = tukangId;
  openModal("#bookModal");
}

// ---------- Modal / toast helpers ----------
function openModal(sel) { $(sel).hidden = false; document.body.style.overflow = "hidden"; }
function closeModal(sel) { $(sel).hidden = true; document.body.style.overflow = ""; }

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
    if (!navigator.geolocation) { toast("GPS tak support kat browser ni 😅"); return; }
    $("#gpsBtn").textContent = "🛰️ Mencari lokasi…";
    navigator.geolocation.getCurrentPosition(
      pos => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const nearest = AREAS.map(a => ({ a, d: distanceKm(me, a) })).sort((x, y) => x.d - y.d)[0];
        state.location = nearest.a;
        state.shown = PAGE_SIZE;
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

  $("#showmoreBtn").addEventListener("click", () => { state.shown += PAGE_SIZE; renderResults(); });

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
    toast(`✅ Request dihantar ke ${t.name}! Dia akan WhatsApp you sekejap lagi.`);
  });

  document.querySelectorAll("[data-close]").forEach(el =>
    el.addEventListener("click", () => { closeModal("#locModal"); closeModal("#bookModal"); }));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal("#locModal"); closeModal("#bookModal"); }
  });
}

document.addEventListener("DOMContentLoaded", init);
