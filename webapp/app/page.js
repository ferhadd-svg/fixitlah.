"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  getTopcats, getAreas, getNearbyPros, categoryLabel, allCategories, joinWaitlist,
  createBooking, createProListing, signInWithGoogle, signInWithApple, signInWithEmail, signInAsGuest,
} from "@/lib/db";
import { DEMO_PAYMETHODS } from "@/lib/demoData";

const PAYMETHODS = DEMO_PAYMETHODS; // static list either way — not stored per-project

export default function Home() {
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(null);
  const [areas, setAreas] = useState([]);
  const [area, setArea] = useState(null);
  const [topcats, setTopcats] = useState([]);
  const [topCat, setTopCat] = useState(null);
  const [sub, setSub] = useState(null);
  const [pros, setPros] = useState([]);
  const [prosLoading, setProsLoading] = useState(false);
  const [pro, setPro] = useState(null);
  const [when, setWhen] = useState("As soon as possible");
  const [note, setNote] = useState("");
  const [payMethod, setPayMethod] = useState(PAYMETHODS[0].id);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [returnScreen, setReturnScreen] = useState("home");

  // Pro registration form state.
  const [pfPlan, setPfPlan] = useState("basic");
  const [pfName, setPfName] = useState("");
  const [pfBiz, setPfBiz] = useState("");
  const [pfCats, setPfCats] = useState(new Set());
  const [pfArea, setPfArea] = useState("");
  const [pfRadius, setPfRadius] = useState(5);
  const [pfPhone, setPfPhone] = useState("");
  const [pfEmail, setPfEmail] = useState("");
  const [pfYears, setPfYears] = useState("");
  const [pfPrice, setPfPrice] = useState("");
  const [pfBio, setPfBio] = useState("");
  const [pfAgree, setPfAgree] = useState(false);
  const [pfSubmitting, setPfSubmitting] = useState(false);
  const [pfError, setPfError] = useState("");

  // Initial data load.
  useEffect(() => {
    (async () => {
      const [a, t] = await Promise.all([getAreas(), getTopcats()]);
      setAreas(a);
      setArea(a.find((x) => x.live) || a[0]);
      setPfArea((a.find((x) => x.live) || a[0])?.id || "");
      setTopcats(t);
    })();
  }, []);

  // Splash -> login.
  useEffect(() => {
    if (screen !== "splash") return;
    const timer = setTimeout(() => setScreen("login"), 1400);
    return () => clearTimeout(timer);
  }, [screen]);

  function toast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2600);
  }

  async function handleAuth(via) {
    if (via === "google") await signInWithGoogle();
    else if (via === "apple") await signInWithApple();
    else if (via === "guest") await signInAsGuest();
    setUser({ via });
    setScreen("home");
  }

  function openTopCat(cat) {
    setTopCat(cat);
    setScreen("sub");
  }

  async function openSub(s) {
    setSub(s);
    setScreen("pros");
    setProsLoading(true);
    const list = await getNearbyPros(s.category_id, area, 5);
    setPros(list);
    setProsLoading(false);
  }

  function startBooking(p) {
    setPro(p);
    setWhen("As soon as possible");
    setNote("");
    setScreen("booking");
  }

  async function confirmBooking() {
    const res = await createBooking({
      proId: pro.pro_id || pro.id, categoryId: sub.category_id, whenPref: when, note, paymentMethod: payMethod,
    });
    if (!res.ok && !res.demo) toast("Couldn't save booking — try again.");
    setScreen("done");
  }

  async function submitWaitlist(e) {
    e.preventDefault();
    await joinWaitlist(waitlistEmail, area?.name);
    setWaitlistEmail("");
    toast(`Thanks! We'll email you when kerjakita launches in ${area?.name}.`);
  }

  function openProRegister(from) {
    setReturnScreen(from);
    setScreen("proRegister");
  }

  function toggleCat(id) {
    setPfCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function submitProForm(e) {
    e.preventDefault();
    setPfError("");
    if (pfCats.size === 0) { setPfError("Pick at least one service you offer."); return; }
    if (!user) { await signInAsGuest(); setUser({ via: "guest" }); } // ensure a signed-in uid exists before writing rows
    setPfSubmitting(true);
    const chosenArea = areas.find((a) => a.id === pfArea);
    const res = await createProListing({
      fullName: pfName, businessName: pfBiz, bio: pfBio,
      categoryIds: [...pfCats], baseAreaId: pfArea,
      baseLat: chosenArea?.lat, baseLng: chosenArea?.lng,
      radiusKm: pfRadius, phone: pfPhone, email: pfEmail,
      yearsExp: pfYears ? Number(pfYears) : null,
      priceFrom: pfPrice ? Number(pfPrice) : 0, plan: pfPlan,
    });
    setPfSubmitting(false);
    if (!res.ok && !res.demo) { setPfError("Something went wrong — please try again."); return; }
    setScreen("proSuccess");
  }

  const cat = sub ? categoryLabel(sub.category_id) : null;
  const allCats = allCategories();

  return (
    <>
      {!isSupabaseConfigured && (
        <div className="devbanner">
          Demo mode — no Supabase project connected yet. Data won&apos;t be saved.
        </div>
      )}

      {screen === "splash" && (
        <section className="screen splash" onClick={() => setScreen("login")}>
          <div className="splash__inner">
            <div className="splash__logo">kerjakita</div>
            <div className="splash__tag">trusted pros near you</div>
          </div>
        </section>
      )}

      {screen === "login" && (
        <section className="screen login">
          <div className="login__inner">
            <div className="login__logo">kerjakita</div>
            <p className="login__sub">Sign in to book trusted pros in your area.</p>
            <div className="login__btns">
              <button className="authbtn" onClick={() => handleAuth("google")}>
                <span className="authbtn__ico">G</span> Continue with Google
              </button>
              <button className="authbtn authbtn--dark" onClick={() => handleAuth("apple")}>
                Continue with Apple
              </button>
              <button className="authbtn" onClick={() => handleAuth("guest")}>
                <span className="authbtn__ico">✉️</span> Continue with email
              </button>
            </div>
            <button className="login__guest" onClick={() => handleAuth("guest")}>Continue as guest →</button>
            <p className="login__terms">By continuing you agree to our Terms &amp; Privacy Policy.</p>
            <button className="login__pro" onClick={() => openProRegister("login")}>Are you a pro? List your business</button>
          </div>
        </section>
      )}

      {screen === "home" && area && (
        <section className="screen home">
          <header className="apphdr">
            <button className="brand" onClick={() => setScreen("home")}>kerjakita</button>
            <AreaPicker areas={areas} area={area} onChange={setArea} />
          </header>
          {area.live ? (
            <div className="wrap home__body">
              <h1 className="home__title">What do you need today?</h1>
              <div className="trustline">
                <span>🛡️ Vetted pros</span><span>💳 Payment protected</span><span>✅ 30-day guarantee</span>
              </div>
              <div className="catgrid">
                {topcats.map((c) => (
                  <button key={c.id} className="cat" onClick={() => openTopCat(c)}>
                    <span className="cat__emoji">{c.emoji}</span>
                    <span className="cat__label">{c.label}</span>
                  </button>
                ))}
              </div>
              <button className="home__pro" onClick={() => openProRegister("home")}>Are you a pro? List your business →</button>
            </div>
          ) : (
            <section className="waitlist">
              <div className="waitlist__card">
                <div className="waitlist__emoji">🚧</div>
                <h2 className="waitlist__title">kerjakita isn&apos;t in {area.name} yet</h2>
                <p className="waitlist__sub">We&apos;re starting small — fully live in Bukit Rimau &amp; Kota Kemuning. Want us in your area next? Leave your email.</p>
                <form className="waitlist__form" onSubmit={submitWaitlist}>
                  <input type="email" required placeholder="you@email.com" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)} />
                  <button type="submit" className="btn btn--primary">Notify me</button>
                </form>
                <button type="button" className="btn btn--soft waitlist__try" onClick={() => setArea(areas.find((a) => a.live) || area)}>
                  Try it in Bukit Rimau instead
                </button>
              </div>
            </section>
          )}
        </section>
      )}

      {screen === "sub" && topCat && (
        <section className="screen sub">
          <header className="apphdr apphdr--flow">
            <button className="backbtn" onClick={() => setScreen("home")}>←</button>
            <span className="apphdr__title">{topCat.label}</span>
          </header>
          <div className="wrap sub__body">
            <p className="sub__hint">What kind of {topCat.label.toLowerCase()}?</p>
            <div className="sublist">
              {topCat.subs.map((s, i) => (
                <button key={i} className="subitem" onClick={() => openSub(s)}>
                  <span>{s.label}</span><span className="subitem__go">›</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {screen === "pros" && sub && area && (
        <section className="screen pros">
          <header className="apphdr apphdr--flow">
            <button className="backbtn" onClick={() => setScreen("sub")}>←</button>
            <span className="apphdr__title">{sub.label}</span>
            <span className="locpill locpill--sm">📍 {area.name}</span>
          </header>
          <div className="wrap pros__body">
            {prosLoading ? (
              <p className="results__count">Finding pros near you…</p>
            ) : pros.length === 0 ? (
              <div className="empty">
                <p className="empty__title">
                  {area.live ? `No ${sub.label.toLowerCase()} pros within 5 km` : `Coming soon to ${area.name}`}
                </p>
                <p className="empty__sub">
                  {area.live ? "Try another area." : "We're live in Bukit Rimau & Kota Kemuning."}
                </p>
              </div>
            ) : (
              <>
                <p className="results__count">
                  {pros.length} {sub.label.toLowerCase()} pro{pros.length === 1 ? "" : "s"} within 5 km
                </p>
                <div className="list">
                  {pros.map((p) => {
                    const pid = p.pro_id || p.id;
                    const dist = p.dist_km;
                    const distTxt = dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
                    const name = p.business_name || p.name;
                    return (
                      <div key={pid} className="trow" onClick={() => startBooking(p)}>
                        <div className="tavatar">{initials(name)}</div>
                        <div className="tinfo">
                          <div className="tname">{name}{p.verified && <span className="tick"> ✔</span>}</div>
                          <div className="tsub">
                            {cat.emoji} {cat.label} · {distTxt} · ★ {(p.rating_avg ?? p.rating ?? 0).toFixed(1)}
                          </div>
                        </div>
                        <div className="tmeta">
                          <div className="tprice">from<b>RM{p.price_from}</b></div>
                          <button className="btn btn--primary" onClick={(e) => { e.stopPropagation(); startBooking(p); }}>Book</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {screen === "booking" && pro && (
        <section className="screen booking">
          <header className="apphdr apphdr--flow">
            <button className="backbtn" onClick={() => setScreen("pros")}>←</button>
            <span className="apphdr__title">Book</span>
          </header>
          <div className="wrap flow__body">
            <div className="flowcard">
              <div className="tavatar">{initials(pro.business_name || pro.name)}</div>
              <div><b>{pro.business_name || pro.name}</b><br /><span className="flowcard__sub">{cat.emoji} {sub.label}</span></div>
            </div>
            <div className="flowstep"><span className="flowstep__n">1</span> When do you need it?</div>
            <div className="chiprow">
              {["As soon as possible", "Today, afternoon", "Tomorrow, morning", "This weekend"].map((w) => (
                <button key={w} className={`tchip ${when === w ? "is-on" : ""}`} onClick={() => setWhen(w)}>
                  {w === "As soon as possible" ? "ASAP" : w}
                </button>
              ))}
            </div>
            <div className="flowstep"><span className="flowstep__n">2</span> Tell us the problem</div>
            <textarea className="flowta" rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Bedroom aircon hasn't been cold for 2 weeks" />
            <div className="guarantee">
              <span className="guarantee__ico">🛡️</span>
              <span><b>Protected by the kerjakita Guarantee.</b> Money held until the job&apos;s done &amp; you&apos;re happy, with a 30-day workmanship warranty.</span>
            </div>
          </div>
          <div className="flowbar">
            <div className="flowbar__price">Est. <b>from RM{pro.price_from}</b></div>
            <button className="btn btn--primary" onClick={() => setScreen("pay")}>Continue to payment</button>
          </div>
        </section>
      )}

      {screen === "pay" && pro && (
        <section className="screen pay">
          <header className="apphdr apphdr--flow">
            <button className="backbtn" onClick={() => setScreen("booking")}>←</button>
            <span className="apphdr__title">Payment</span>
          </header>
          <div className="wrap flow__body">
            <div className="ordersum">
              <Row k="Service" v={sub.label} />
              <Row k="Pro" v={pro.business_name || pro.name} />
              <Row k="When" v={when} />
              <Row k="Area" v={area.name} />
              <Row k="Estimated" v={`from RM${pro.price_from}`} strong />
            </div>
            <div className="flowstep"><span className="flowstep__n">3</span> Choose how to pay</div>
            <div className="paylist">
              {PAYMETHODS.map((m) => (
                <button key={m.id} className={`paymethod ${payMethod === m.id ? "is-on" : ""}`} onClick={() => setPayMethod(m.id)}>
                  <span className="paymethod__ico">{m.emoji}</span>
                  <span className="paymethod__txt"><b>{m.label}</b><span>{m.note}</span></span>
                  <span className="paymethod__radio"></span>
                </button>
              ))}
            </div>
            <p className="pay__fine">You&apos;re only charged after the pro accepts. (Demo — no real charge.)</p>
          </div>
          <div className="flowbar">
            <div className="flowbar__price"><b>from RM{pro.price_from}</b></div>
            <button className="btn btn--primary" onClick={confirmBooking}>Confirm booking</button>
          </div>
        </section>
      )}

      {screen === "done" && pro && (
        <section className="screen done">
          <div className="done__inner">
            <div className="done__tick">✓</div>
            <h1>Booking confirmed!</h1>
            <p>{(pro.business_name || pro.name)} will WhatsApp you shortly to confirm {when.toLowerCase()}.</p>
            <div className="flowcard">
              <Row k="Service" v={sub.label} />
              <Row k="Pro" v={pro.business_name || pro.name} />
              <Row k="When" v={when} />
              <Row k="Payment" v={`${PAYMETHODS.find((m) => m.id === payMethod).emoji} ${PAYMETHODS.find((m) => m.id === payMethod).label}`} />
            </div>
            <button className="btn btn--primary btn--block" onClick={() => { setPro(null); setSub(null); setTopCat(null); setScreen("home"); }}>
              Back to home
            </button>
          </div>
        </section>
      )}

      {screen === "proRegister" && (
        <section className="screen prov">
          <div className="wrap">
            <button className="prov__back" onClick={() => setScreen(returnScreen)}>← Back</button>
            <div className="prov__hero">
              <span className="prov__eyebrow">For freelancers &amp; small businesses</span>
              <h1 className="prov__title">Grow your business in your kawasan.</h1>
              <p className="prov__sub">Turn your skill — cleaning, plumbing, car detailing, whatever you&apos;re good at — into steady local jobs on a platform people trust. Get found by neighbours within 5&nbsp;km, not the whole city.</p>
            </div>
            <div className="prov__benefits">
              <div className="benefit"><div className="benefit__ico">📍</div><h3>Get found nearby</h3><p>Customers within 5 km of your base see you first.</p></div>
              <div className="benefit"><div className="benefit__ico">⭐</div><h3>Build a reputation</h3><p>Ratings &amp; reviews that bring repeat work.</p></div>
              <div className="benefit"><div className="benefit__ico">🛡️</div><h3>Get paid safely</h3><p>Payment protection — money&apos;s secured before you start.</p></div>
              <div className="benefit"><div className="benefit__ico">📈</div><h3>A real storefront</h3><p>More than a WhatsApp contact — a proper profile.</p></div>
            </div>
            <div className="steps">
              <div className="step"><b>1</b> Register &amp; pick a plan</div>
              <div className="step"><b>2</b> Get verified (ID + skills)</div>
              <div className="step"><b>3</b> Start getting jobs</div>
            </div>

            <h2 className="prov__h2">Choose a listing plan</h2>
            <div className="pilotnote">🎉 <b>Free for 3 months</b> for the first pilot pros in Bukit Rimau &amp; Kota Kemuning.</div>

            <form className="proform" onSubmit={submitProForm}>
              <div className="plans">
                <label className="plan">
                  <input type="radio" name="plan" checked={pfPlan === "basic"} onChange={() => setPfPlan("basic")} />
                  <div className="plan__body">
                    <div className="plan__name">Basic</div>
                    <div className="plan__price"><b>RM19</b><span>/month</span></div>
                    <ul><li>Listed in your kawasan</li><li>Profile with reviews</li><li>Up to 3 services</li><li>Booking requests</li></ul>
                  </div>
                </label>
                <label className="plan">
                  <input type="radio" name="plan" checked={pfPlan === "pro"} onChange={() => setPfPlan("pro")} />
                  <span className="plan__tag">Most popular</span>
                  <div className="plan__body">
                    <div className="plan__name">Pro</div>
                    <div className="plan__price"><b>RM49</b><span>/month</span></div>
                    <ul><li>Everything in Basic</li><li><b>Featured</b> — top of results</li><li>Unlimited services</li><li>Verified Pro badge</li></ul>
                  </div>
                </label>
              </div>

              <h2 className="prov__h2">Your details</h2>
              <div className="proform__grid">
                <label className="fld">Full name<input required value={pfName} onChange={(e) => setPfName(e.target.value)} placeholder="e.g. Ahmad Faizal" /></label>
                <label className="fld">Business name <span className="opt">(optional)</span><input value={pfBiz} onChange={(e) => setPfBiz(e.target.value)} placeholder="e.g. AF Aircond Services" /></label>
                <label className="fld fld--full">What do you offer? <span className="opt">(pick all that apply)</span>
                  <div className="svcpick">
                    {allCats.map((c) => (
                      <button type="button" key={c.id} className={`svcchip ${pfCats.has(c.id) ? "is-on" : ""}`} onClick={() => toggleCat(c.id)}>
                        {c.emoji} {c.label}
                      </button>
                    ))}
                  </div>
                </label>
                <label className="fld">Base area
                  <select value={pfArea} onChange={(e) => setPfArea(e.target.value)}>
                    {areas.map((a) => <option key={a.id} value={a.id}>{a.name}{a.live ? " (live)" : " (coming soon)"}</option>)}
                  </select>
                </label>
                <label className="fld">Service radius
                  <select value={pfRadius} onChange={(e) => setPfRadius(Number(e.target.value))}>
                    <option value={5}>5 km</option><option value={10}>10 km</option><option value={15}>15 km</option>
                  </select>
                </label>
                <label className="fld">WhatsApp number<input required type="tel" value={pfPhone} onChange={(e) => setPfPhone(e.target.value)} placeholder="e.g. 012-345 6789" /></label>
                <label className="fld">Email<input required type="email" value={pfEmail} onChange={(e) => setPfEmail(e.target.value)} placeholder="you@email.com" /></label>
                <label className="fld">Years of experience<input type="number" min="0" value={pfYears} onChange={(e) => setPfYears(e.target.value)} placeholder="e.g. 8" /></label>
                <label className="fld">Starting price (RM)<input type="number" min="0" value={pfPrice} onChange={(e) => setPfPrice(e.target.value)} placeholder="e.g. 80" /></label>
                <label className="fld fld--full">Short bio<textarea rows={3} value={pfBio} onChange={(e) => setPfBio(e.target.value)} placeholder="Tell customers what you do best." /></label>
              </div>

              <label className="agree">
                <input type="checkbox" required checked={pfAgree} onChange={(e) => setPfAgree(e.target.checked)} />
                I agree to verification (ID &amp; skills) and the kerjakita pro terms.
              </label>
              {pfError && <p className="proform__fine" style={{ color: "#b3261e" }}>{pfError}</p>}
              <button type="submit" className="btn btn--primary btn--block" disabled={pfSubmitting}>
                {pfSubmitting ? "Submitting…" : "Submit application"}
              </button>
              <p className="proform__fine">No charge today — we verify you first.</p>
            </form>
          </div>
        </section>
      )}

      {screen === "proSuccess" && (
        <section className="screen prov">
          <div className="wrap prosuccess">
            <div className="prosuccess__emoji">🎉</div>
            <h2>Application received!</h2>
            <p>Thanks{pfName ? `, ${pfName.split(" ")[0]}` : ""}! We&apos;ll WhatsApp you to verify (ID + skills) and get your {pfPlan === "pro" ? "Pro" : "Basic"} listing live — free for your 3-month pilot period.</p>
            <button className="btn btn--soft" onClick={() => setScreen(returnScreen)}>Back</button>
          </div>
        </section>
      )}

      {toastMsg && <div className="toast is-show">{toastMsg}</div>}
    </>
  );
}

function Row({ k, v, strong }) {
  return (
    <div className={`ordersum__row ${strong ? "ordersum__row--total" : ""}`}>
      <span>{k}</span><b>{v}</b>
    </div>
  );
}

function AreaPicker({ areas, area, onChange }) {
  return (
    <select
      className="locpill"
      value={area?.id || ""}
      onChange={(e) => onChange(areas.find((a) => a.id === e.target.value))}
      aria-label="Choose your area"
    >
      {areas.map((a) => (
        <option key={a.id} value={a.id}>📍 {a.name}{a.live ? "" : " (waitlist)"}</option>
      ))}
    </select>
  );
}

function initials(name) {
  return (name || "?").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
