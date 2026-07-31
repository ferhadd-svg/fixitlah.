import { supabase, isSupabaseConfigured } from "./supabaseClient";
import {
  DEMO_TOPCATS, DEMO_CATEGORIES, DEMO_AREAS, DEMO_PROS, haversineKm,
} from "./demoData";

// Every function below tries Supabase first and falls back to the bundled
// demo content when no project is connected yet, so the app is always
// runnable while Phase 1 is being wired up.

export async function getTopcats() {
  if (!isSupabaseConfigured) return DEMO_TOPCATS;
  const { data: topcats, error: e1 } = await supabase
    .from("topcats").select("id, label, emoji, sort").order("sort");
  const { data: subcats, error: e2 } = await supabase
    .from("subcats").select("topcat_id, label, category_id, sort").order("sort");
  if (e1 || e2 || !topcats) return DEMO_TOPCATS;
  return topcats.map((t) => ({
    ...t,
    subs: (subcats || []).filter((s) => s.topcat_id === t.id),
  }));
}

export async function getAreas() {
  if (!isSupabaseConfigured) return DEMO_AREAS;
  const { data, error } = await supabase
    .from("areas").select("id, name, lat, lng, live").order("name");
  return error || !data ? DEMO_AREAS : data;
}

// Pros offering `categoryId`, sorted nearest-first, within `radiusKm` of `area`.
export async function getNearbyPros(categoryId, area, radiusKm = 5) {
  if (!isSupabaseConfigured) {
    return DEMO_PROS
      .filter((p) => p.category_id === categoryId)
      .map((p) => ({ ...p, dist_km: haversineKm(area, p) }))
      .filter((p) => p.dist_km <= radiusKm)
      .sort((a, b) => a.dist_km - b.dist_km);
  }
  const { data, error } = await supabase.rpc("nearby_pros", {
    p_category: categoryId, p_lat: area.lat, p_lng: area.lng, p_radius_km: radiusKm,
  });
  return error || !data ? [] : data;
}

export function categoryLabel(categoryId) {
  return DEMO_CATEGORIES[categoryId] || { label: categoryId, emoji: "🔧" };
}

export function allCategories() {
  return Object.entries(DEMO_CATEGORIES).map(([id, c]) => ({ id, ...c }));
}

export async function joinWaitlist(email, area) {
  if (!isSupabaseConfigured) return { ok: true, demo: true };
  const { error } = await supabase.from("waitlist").insert({ email, area });
  return { ok: !error, error };
}

// Creates a booking for the current session's user (must be signed in,
// including anonymously, before calling this).
export async function createBooking({ proId, categoryId, whenPref, note, paymentMethod }) {
  if (!isSupabaseConfigured) return { ok: true, demo: true };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_signed_in" };
  const { data, error } = await supabase.from("bookings").insert({
    customer_id: user.id, pro_id: proId, category_id: categoryId,
    when_pref: whenPref, note, payment_method: paymentMethod,
  }).select().single();
  return { ok: !error, booking: data, error };
}

// Pro registration: creates the profile (role=pro), a pending pros row,
// and one pro_services row per selected category. Caller must already be
// signed in (see the auth helpers below) — RLS only allows a user to
// insert rows tied to their own auth.uid().
export async function createProListing({
  fullName, businessName, bio, categoryIds, baseAreaId, baseLat, baseLng,
  radiusKm, phone, email, yearsExp, priceFrom, plan,
}) {
  if (!isSupabaseConfigured) return { ok: true, demo: true };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "not_signed_in" };

  const { error: profErr } = await supabase.from("profiles").upsert({
    id: user.id, role: "pro", full_name: fullName, phone, email,
  });
  if (profErr) return { ok: false, error: profErr };

  const { error: proErr } = await supabase.from("pros").upsert({
    user_id: user.id, business_name: businessName || fullName, bio,
    base_area_id: baseAreaId, base_lat: baseLat, base_lng: baseLng,
    radius_km: radiusKm, years_exp: yearsExp, plan, status: "pending",
  });
  if (proErr) return { ok: false, error: proErr };

  const rows = categoryIds.map((categoryId) => ({
    pro_id: user.id, category_id: categoryId, price_from: priceFrom,
  }));
  const { error: svcErr } = await supabase.from("pro_services").upsert(rows, { onConflict: "pro_id,category_id" });
  if (svcErr) return { ok: false, error: svcErr };

  return { ok: true };
}

// ---------- Auth ----------

export async function signInWithGoogle() {
  if (!isSupabaseConfigured) return { ok: false, error: "not_configured" };
  return supabase.auth.signInWithOAuth({ provider: "google" });
}
export async function signInWithApple() {
  if (!isSupabaseConfigured) return { ok: false, error: "not_configured" };
  return supabase.auth.signInWithOAuth({ provider: "apple" });
}
export async function signInWithEmail(email) {
  if (!isSupabaseConfigured) return { ok: false, error: "not_configured" };
  return supabase.auth.signInWithOtp({ email });
}
// "Continue as guest" — anonymous Supabase auth session so a booking
// still has a valid customer_id; upgrade to a real account any time later.
export async function signInAsGuest() {
  if (!isSupabaseConfigured) return { ok: true, demo: true };
  return supabase.auth.signInAnonymously();
}
