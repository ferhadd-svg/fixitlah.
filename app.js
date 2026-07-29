/* ============================================================
   kerjakita  —  app logic (screen-based customer flow)
   splash -> login -> home -> subcategory -> pros -> booking
   -> payment -> confirmed.  Front-end prototype, mock data.
   ============================================================ */

const PAGE_SIZE = 6;

const state = {
  location: AREAS[0],   // Bukit Rimau
  radiusKm: 5,
  shown: PAGE_SIZE,
  user: null,           // set on login (or guest)
  topCat: null,
  sub: null,
  pro: null,
  when: "As soon as possible",
  pay: PAYMETHODS[0].id,
  returnScreen: "scrHome",
};

const $ = sel => document.querySelector(sel);
const initials = name => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
const catById = id => CATEGORIES.find(c => c.id === id);

// ---------- Distance / matching ----------
function distanceKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function prosFor(service) {
  return TUKANG
    .map(t => ({ ...t, dist: distanceKm(state.location, t) }))
    .filter(t => t.dist <= state.radiusKm && t.service === service)
    .sort((a, b) => a.dist - b.dist);
}

// ---------- Seeded past-jobs generator (for profiles) ----------
function seededRng(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
const WHENS = ["3 days ago", "1 week ago", "2 weeks ago", "3 weeks ago", "1 month ago", "2 months ago"];
function proStats(t) {
  const rng = seededRng(t.id + "s");
  return { jobs: t.jobs, onTime: Math.min(99, Math.round(90 + (t.rating - 4.5) * 16 + rng() * 3)),
    repeat: Math.min(88, Math.round(52 + (t.rating - 4.5) * 30 + rng() * 18)), since: t.since };
}
function proJobs(t) {
  const rng = seededRng(t.id + "j");
  const cat = catById(t.service);
  const n = 4 + Math.floor(rng() * 2), out = [];
  for (let i = 0; i < n; i++) {
    const five = rng() < 0.5 + (t.rating - 4.5) * 0.7;
    const pool = five ? REVIEW_POOL.positive : REVIEW_POOL.good;
    out.push({ stars: five ? 5 : 4, text: pool[Math.floor(rng() * pool.length)],
      author: REVIEW_POOL.authors[Math.floor(rng() * REVIEW_POOL.authors.length)], when: WHENS[i] || "a while ago", job: cat.label });
  }
  return out;
}

// ---------- Screen router ----------
const SCREENS = ["scrSplash", "scrLogin", "scrHome", "scrSub", "scrPros", "scrBooking", "scrPay", "scrDone", "proView"];
function showScreen(id) {
  SCREENS.forEach(s => { const el = document.getElementById(s); if (el) el.hidden = s !== id; });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

// ---------- Home ----------
function renderCatGrid() {
  $("#catGrid").innerHTML = TAXONOMY.map(c =>
    `<button class="cat" data-cat="${c.id}"><span class="cat__emoji">${c.emoji}</span><span class="cat__label">${c.label}</span></button>`
  ).join("");
  $("#catGrid").querySelectorAll(".cat").forEach(b =>
    b.addEventListener("click", () => openTopCat(TAXONOMY.find(c => c.id === b.dataset.cat))));
}
function goHome() { showScreen("scrHome"); updateAreaLabels(); }

// ---------- Subcategory ----------
function openTopCat(cat) {
  state.topCat = cat;
  $("#subTitle").textContent = cat.label;
  $("#subHintCat").textContent = cat.label.toLowerCase();
  $("#subList").innerHTML = cat.subs.map((s, i) =>
    `<button class="subitem" data-i="${i}"><span>${s.label}</span><span class="subitem__go">›</span></button>`
  ).join("");
  $("#subList").querySelectorAll(".subitem").forEach(b =>
    b.addEventListener("click", () => openSub(cat.subs[+b.dataset.i])));
  showScreen("scrSub");
}

// ---------- Pros list ----------
function openSub(sub) {
  state.sub = sub;
  state.shown = PAGE_SIZE;
  $("#prosTitle").textContent = sub.label;
  renderPros();
  showScreen("scrPros");
}
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
function renderPros() {
  const listEl = $("#list"), empty = $("#prosEmpty"), showmoreWrap = $("#showmoreWrap");
  updateAreaLabels();

  if (!state.location.live) {
    listEl.innerHTML = ""; showmoreWrap.hidden = true; empty.hidden = false;
    $("#prosCount").textContent = "";
    $("#prosEmptyTitle").textContent = `Coming soon to ${state.location.name}`;
    $("#prosEmptySub").textContent = "We're live in Bukit Rimau & Kota Kemuning. Try there to see it in action.";
    return;
  }
  const list = prosFor(state.sub.service);
  if (list.length === 0) {
    listEl.innerHTML = ""; showmoreWrap.hidden = true; empty.hidden = false;
    $("#prosCount").textContent = "";
    $("#prosEmptyTitle").textContent = `No ${state.sub.label.toLowerCase()} pros within ${state.radiusKm} km`;
    $("#prosEmptySub").textContent = "Try a nearby area.";
    return;
  }
  empty.hidden = true;
  const visible = list.slice(0, state.shown);
  listEl.innerHTML = visible.map(tukangRow).join("");
  listEl.querySelectorAll(".trow").forEach(row => {
    row.addEventListener("click", () => openProfile(row.dataset.id));
    row.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProfile(row.dataset.id); } });
  });
  listEl.querySelectorAll("[data-book]").forEach(b =>
    b.addEventListener("click", e => { e.stopPropagation(); startBooking(b.dataset.book); }));

  const remaining = list.length - visible.length;
  showmoreWrap.hidden = remaining <= 0;
  if (remaining > 0) $("#showmoreBtn").textContent = `Show more (${remaining})`;
  $("#prosCount").textContent = `${list.length} ${state.sub.label.toLowerCase()} pro${list.length === 1 ? "" : "s"} within ${state.radiusKm} km`;
}

// ---------- Profile modal ----------
let currentProfileId = null;
function openProfile(id) {
  const t = TUKANG.find(x => x.id === id); const cat = catById(t.service);
  const s = proStats(t), jobs = proJobs(t); currentProfileId = id;
  const jobsHtml = jobs.map(j => `
    <div class="job">
      <div class="job__top"><span class="job__stars">${"★".repeat(j.stars)}${"☆".repeat(5 - j.stars)}</span><span class="job__when">${j.when}</span></div>
      <p class="job__text">“${j.text}”</p><div class="job__meta"><b>${j.author}</b> · ${j.job}</div>
    </div>`).join("");
  $("#profileBody").innerHTML = `
    <div class="profile__head">
      <div class="profile__top">
        <div class="profile__avatar">${initials(t.name)}</div>
        <div><div class="profile__name">${t.name}${t.verified ? ' <span class="tick">✔</span>' : ""}</div>
        <div class="profile__svc">${cat.emoji} ${cat.label} · ${t.area}</div></div>
      </div>
      <div class="profile__rate">
        <span><span class="profile__star">★</span> <b>${t.rating.toFixed(1)}</b> (${t.reviews})</span>
        <span><b>${t.jobs}</b> jobs</span><span>Responds <b>${t.respondsIn}</b></span><span>From <b>RM${t.priceFrom}</b></span>
      </div>
    </div>
    <div class="trustrow">
      <span class="trustbadge">🛡️ Payment protected</span><span class="trustbadge">✅ 30-day guarantee</span>
      ${t.verified ? '<span class="trustbadge">🪪 ID verified</span>' : ""}<span class="trustbadge">📅 Since ${s.since}</span>
    </div>
    <div class="profile__section"><h4>About</h4><p class="profile__about">${t.blurb}</p></div>
    <div class="stats">
      <div class="stat"><b>${s.jobs}</b><span>Jobs done</span></div><div class="stat"><b>${s.onTime}%</b><span>On time</span></div>
      <div class="stat"><b>${t.rating.toFixed(1)}</b><span>Rating</span></div><div class="stat"><b>${s.repeat}%</b><span>Repeat</span></div>
    </div>
    <div class="profile__section"><h4>Recent jobs & reviews</h4></div><div class="jobs">${jobsHtml}</div>`;
  $("#profileBook").textContent = `Book ${t.name.split(" ")[0]} · from RM${t.priceFrom}`;
  openModal("#profileModal");
}

// ---------- Booking ----------
function startBooking(proId) {
  closeModal("#profileModal");
  state.pro = TUKANG.find(x => x.id === proId);
  state.when = "As soon as possible";
  const cat = catById(state.pro.service);
  $("#bookWho").innerHTML = `
    <div class="tavatar">${initials(state.pro.name)}</div>
    <div><b>${state.pro.name}</b><br/><span class="flowcard__sub">${cat.emoji} ${state.sub ? state.sub.label : cat.label} · ${state.pro.area}</span></div>`;
  $("#bookEst").textContent = `from RM${state.pro.priceFrom}`;
  $("#bookNote").value = "";
  $("#whenRow").querySelectorAll(".tchip").forEach((c, i) => c.classList.toggle("is-on", i === 0));
  showScreen("scrBooking");
}

// ---------- Payment ----------
function renderPayment() {
  const cat = catById(state.pro.service);
  $("#orderSum").innerHTML = `
    <div class="ordersum__row"><span>Service</span><b>${state.sub ? state.sub.label : cat.label}</b></div>
    <div class="ordersum__row"><span>Pro</span><b>${state.pro.name}</b></div>
    <div class="ordersum__row"><span>When</span><b>${state.when}</b></div>
    <div class="ordersum__row"><span>Area</span><b>${state.location.name}</b></div>
    <div class="ordersum__row ordersum__row--total"><span>Estimated</span><b>from RM${state.pro.priceFrom}</b></div>`;
  $("#payList").innerHTML = PAYMETHODS.map(m => `
    <button class="paymethod ${m.id === state.pay ? "is-on" : ""}" data-pay="${m.id}">
      <span class="paymethod__ico">${m.emoji}</span>
      <span class="paymethod__txt"><b>${m.label}</b><span>${m.note}</span></span>
      <span class="paymethod__radio"></span>
    </button>`).join("");
  $("#payList").querySelectorAll(".paymethod").forEach(b =>
    b.addEventListener("click", () => {
      state.pay = b.dataset.pay;
      $("#payList").querySelectorAll(".paymethod").forEach(x => x.classList.toggle("is-on", x === b));
    }));
  $("#payTotal").textContent = `from RM${state.pro.priceFrom}`;
}

// ---------- Done ----------
function renderDone() {
  const method = PAYMETHODS.find(m => m.id === state.pay);
  const cat = catById(state.pro.service);
  $("#doneMsg").textContent = `${state.pro.name} will WhatsApp you shortly to confirm ${state.when.toLowerCase()}.`;
  $("#doneSummary").innerHTML = `
    <div class="ordersum__row"><span>Service</span><b>${state.sub ? state.sub.label : cat.label}</b></div>
    <div class="ordersum__row"><span>Pro</span><b>${state.pro.name}</b></div>
    <div class="ordersum__row"><span>When</span><b>${state.when}</b></div>
    <div class="ordersum__row"><span>Payment</span><b>${method.emoji} ${method.label}</b></div>`;
}

// ---------- Location modal ----------
function updateAreaLabels() {
  $("#locArea").textContent = state.location.name;
  $("#locArea2").textContent = state.location.name;
}
function renderAreaList() {
  const wrap = $("#areaList");
  const item = a => `<button class="arealist__item ${a.id === state.location.id ? "is-active" : ""} ${a.live ? "" : "is-soon"}" data-area="${a.id}">
    <span>${a.name}</span>${a.live ? '<span class="tag-live">Live</span>' : '<span class="tag-soon">Soon</span>'}</button>`;
  wrap.innerHTML = `<div class="arealist__sep">Live now</div>` + AREAS.filter(a => a.live).map(item).join("") +
    `<div class="arealist__sep">Coming soon</div>` + AREAS.filter(a => !a.live).map(item).join("");
  wrap.querySelectorAll(".arealist__item").forEach(el =>
    el.addEventListener("click", () => {
      state.location = AREAS.find(a => a.id === el.dataset.area);
      state.shown = PAGE_SIZE;
      closeModal("#locModal");
      updateAreaLabels();
      if (!$("#scrPros").hidden) renderPros();
      toast(`📍 Area: ${state.location.name}`);
    }));
}

// ---------- For pros view ----------
function buildProForm() {
  $("#pfServices").innerHTML = CATEGORIES.map(c =>
    `<button type="button" class="svcchip" data-svc="${c.id}">${c.emoji} ${c.label}</button>`).join("");
  $("#pfServices").querySelectorAll(".svcchip").forEach(chip =>
    chip.addEventListener("click", () => chip.classList.toggle("is-on")));
  const opt = a => `<option value="${a.id}">${a.name}${a.live ? " (live)" : " (coming soon)"}</option>`;
  $("#pfArea").innerHTML = AREAS.filter(a => a.live).map(opt).join("") + AREAS.filter(a => !a.live).map(opt).join("");
}
function openProView(returnScreen) {
  state.returnScreen = returnScreen;
  $("#proFormWrap").hidden = false; $("#proSuccess").hidden = true;
  showScreen("proView");
}

// ---------- Modal / toast helpers ----------
function openModal(sel) { $(sel).hidden = false; document.body.style.overflow = "hidden"; }
function closeModal(sel) { $(sel).hidden = true; document.body.style.overflow = ""; }
let toastTimer;
function toast(msg) {
  const el = $("#toast"); el.textContent = msg; el.hidden = false;
  requestAnimationFrame(() => el.classList.add("is-show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove("is-show"); setTimeout(() => (el.hidden = true), 300); }, 2600);
}

// ---------- Init ----------
function init() {
  renderCatGrid();
  buildProForm();
  renderAreaList();

  // Splash -> login
  showScreen("scrSplash");
  const splashGo = () => { if (!$("#scrSplash").hidden) showScreen("scrLogin"); };
  setTimeout(splashGo, 1500);
  $("#scrSplash").addEventListener("click", splashGo);

  // Login
  document.querySelectorAll("[data-auth]").forEach(b =>
    b.addEventListener("click", () => { state.user = { via: b.dataset.auth }; goHome(); }));
  $("#guestBtn").addEventListener("click", () => { state.user = { via: "guest" }; goHome(); });

  // Nav / back
  $("#brandBtn").addEventListener("click", goHome);
  document.querySelectorAll("[data-back]").forEach(b =>
    b.addEventListener("click", () => showScreen("scr" + b.dataset.back.charAt(0).toUpperCase() + b.dataset.back.slice(1))));

  // Location
  $("#locBtn").addEventListener("click", () => { renderAreaList(); openModal("#locModal"); });
  $("#locBtn2").addEventListener("click", () => { renderAreaList(); openModal("#locModal"); });
  $("#gpsBtn").addEventListener("click", () => {
    if (!navigator.geolocation) { toast("GPS isn't supported here 😅"); return; }
    $("#gpsBtn").textContent = "🛰️ Finding your location…";
    navigator.geolocation.getCurrentPosition(
      pos => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        state.location = AREAS.map(a => ({ a, d: distanceKm(me, a) })).sort((x, y) => x.d - y.d)[0].a;
        state.shown = PAGE_SIZE;
        $("#gpsBtn").innerHTML = "<span>🛰️</span> Use my GPS location";
        closeModal("#locModal"); updateAreaLabels();
        if (!$("#scrPros").hidden) renderPros();
        toast(`📍 Nearest area: ${state.location.name}`);
      },
      () => { $("#gpsBtn").innerHTML = "<span>🛰️</span> Use my GPS location"; toast("Couldn't access GPS — pick your area 🙏"); }
    );
  });

  // Pros screen
  $("#showmoreBtn").addEventListener("click", () => { state.shown += PAGE_SIZE; renderPros(); });
  $("#prosEmptyBtn").addEventListener("click", () => {
    state.location = AREAS.find(a => a.id === "bukit-rimau"); state.shown = PAGE_SIZE; renderPros();
  });
  $("#profileBook").addEventListener("click", () => { if (currentProfileId) startBooking(currentProfileId); });

  // Booking screen
  $("#whenRow").querySelectorAll(".tchip").forEach(c =>
    c.addEventListener("click", () => {
      $("#whenRow").querySelectorAll(".tchip").forEach(x => x.classList.remove("is-on"));
      c.classList.add("is-on"); state.when = c.dataset.when;
    }));
  $("#toPayBtn").addEventListener("click", () => { renderPayment(); showScreen("scrPay"); });

  // Payment screen
  $("#payBtn").addEventListener("click", () => { renderDone(); showScreen("scrDone"); });

  // Done
  $("#doneHome").addEventListener("click", () => { state.topCat = state.sub = state.pro = null; goHome(); });

  // For pros
  $("#proOpenLogin").addEventListener("click", () => openProView("scrLogin"));
  $("#proOpenHome").addEventListener("click", () => openProView("scrHome"));
  $("#proBack").addEventListener("click", () => showScreen(state.returnScreen));
  $("#proDone").addEventListener("click", () => showScreen(state.returnScreen));
  $("#proForm").addEventListener("submit", e => {
    e.preventDefault();
    const chosen = [...document.querySelectorAll("#pfServices .svcchip.is-on")];
    if (chosen.length === 0) { toast("Pick at least one service you offer 🙏"); return; }
    const name = $("#pfName").value.split(" ")[0] || "there";
    const plan = document.querySelector('input[name="plan"]:checked').value;
    $("#proSuccessMsg").textContent = `Thanks ${name}! We'll WhatsApp you to verify (ID + skills) and get your ${plan} listing live — free for your 3-month pilot period.`;
    $("#proFormWrap").hidden = true; $("#proSuccess").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Close modals
  document.querySelectorAll("[data-close]").forEach(el =>
    el.addEventListener("click", () => { closeModal("#locModal"); closeModal("#profileModal"); }));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal("#locModal"); closeModal("#profileModal"); }
  });
}
document.addEventListener("DOMContentLoaded", init);
