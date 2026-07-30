// Fallback demo content — used only when Supabase isn't configured yet
// (no NEXT_PUBLIC_SUPABASE_URL / ANON_KEY set), so `npm run dev` shows a
// working app before a real project exists. Mirrors supabase/migrations.

export const DEMO_TOPCATS = [
  { id: "cooling", emoji: "❄️", label: "Aircon", subs: [
    { label: "Aircon service", category_id: "aircond" },
    { label: "Aircon repair", category_id: "aircond" },
    { label: "Install / relocate", category_id: "aircond" },
    { label: "Chemical wash", category_id: "aircond" },
  ]},
  { id: "plumbing", emoji: "🔧", label: "Plumbing", subs: [
    { label: "Leaks & pipes", category_id: "plumbing" },
    { label: "Water heater", category_id: "plumbing" },
    { label: "Toilet & sink", category_id: "plumbing" },
    { label: "Blocked drains", category_id: "plumbing" },
  ]},
  { id: "electrical", emoji: "⚡", label: "Electrical", subs: [
    { label: "Wiring & sockets", category_id: "electrical" },
    { label: "Lights & fans", category_id: "electrical" },
    { label: "Water heater install", category_id: "electrical" },
    { label: "DB / breaker box", category_id: "electrical" },
  ]},
  { id: "cleaning", emoji: "🧽", label: "Cleaning", subs: [
    { label: "Home cleaning", category_id: "cleaning" },
    { label: "Deep clean", category_id: "cleaning" },
    { label: "Sofa & mattress", category_id: "cleaning" },
    { label: "Post-reno clean", category_id: "cleaning" },
  ]},
  { id: "car", emoji: "🚗", label: "Car", subs: [
    { label: "Car service", category_id: "carmech" },
    { label: "Tyres", category_id: "carmech" },
    { label: "Car detailing", category_id: "carmech" },
    { label: "Car audio / player", category_id: "carmech" },
    { label: "Battery", category_id: "carmech" },
    { label: "Car aircon", category_id: "carmech" },
  ]},
  { id: "reno", emoji: "🏗️", label: "Construction", subs: [
    { label: "Tiling", category_id: "reno" },
    { label: "Plaster & ceiling", category_id: "reno" },
    { label: "Painting", category_id: "painting" },
    { label: "Waterproofing", category_id: "reno" },
    { label: "Minor repairs", category_id: "reno" },
  ]},
  { id: "outdoor", emoji: "🌿", label: "Outdoor", subs: [
    { label: "Lawn & garden", category_id: "grasscut" },
    { label: "Pest control", category_id: "pest" },
  ]},
  { id: "homeset", emoji: "🪑", label: "Home setup", subs: [
    { label: "Furniture assembly", category_id: "furniture" },
    { label: "CCTV & antenna", category_id: "cctv" },
    { label: "Locksmith", category_id: "locksmith" },
    { label: "Appliance repair", category_id: "appliance" },
  ]},
  { id: "motor", emoji: "🏍️", label: "Motorbike", subs: [
    { label: "Service", category_id: "motor" },
    { label: "Tyres", category_id: "motor" },
    { label: "Battery", category_id: "motor" },
  ]},
];

export const DEMO_CATEGORIES = {
  aircond: { label: "Aircon Service", emoji: "❄️" },
  plumbing: { label: "Plumbing", emoji: "🔧" },
  electrical: { label: "Electrician", emoji: "⚡" },
  carmech: { label: "Car Mechanic", emoji: "🚗" },
  motor: { label: "Motorbike Repair", emoji: "🏍️" },
  cleaning: { label: "House Cleaning", emoji: "🧽" },
  grasscut: { label: "Lawn & Garden", emoji: "🌿" },
  pest: { label: "Pest Control", emoji: "🐜" },
  reno: { label: "Renovation", emoji: "🧱" },
  painting: { label: "Painting", emoji: "🎨" },
  appliance: { label: "Appliance Repair", emoji: "🧊" },
  locksmith: { label: "Locksmith", emoji: "🔑" },
  cctv: { label: "CCTV & Antenna", emoji: "📹" },
  furniture: { label: "Furniture Assembly", emoji: "🪑" },
};

export const DEMO_AREAS = [
  { id: "bukit-rimau", name: "Bukit Rimau", lat: 3.0247, lng: 101.5327, live: true },
  { id: "kota-kemuning", name: "Kota Kemuning", lat: 3.0208, lng: 101.5378, live: true },
  { id: "shah-alam", name: "Shah Alam (Seksyen 13)", lat: 3.0700, lng: 101.5180, live: false },
  { id: "klang", name: "Klang Bandar", lat: 3.0449, lng: 101.4455, live: false },
  { id: "usj", name: "USJ, Subang Jaya", lat: 3.0438, lng: 101.5860, live: false },
  { id: "puchong", name: "Puchong", lat: 3.0027, lng: 101.6167, live: false },
  { id: "setia-alam", name: "Setia Alam", lat: 3.1050, lng: 101.4600, live: false },
];

export const DEMO_PROS = [
  { id: "t1", name: "Ahmad Faizal", category_id: "aircond", area: "Kota Kemuning", lat: 3.0215, lng: 101.5360, rating: 4.9, jobs: 640, price_from: 80, verified: true },
  { id: "t2", name: "Muthu Kumar", category_id: "plumbing", area: "Bukit Rimau", lat: 3.0261, lng: 101.5310, rating: 4.8, jobs: 402, price_from: 60, verified: true },
  { id: "t3", name: "Tan Ah Meng", category_id: "electrical", area: "Bukit Rimau", lat: 3.0233, lng: 101.5349, rating: 4.9, jobs: 710, price_from: 70, verified: true },
  { id: "t4", name: "Faizal Rahman", category_id: "carmech", area: "Kota Kemuning", lat: 3.0190, lng: 101.5402, rating: 4.7, jobs: 240, price_from: 90, verified: true },
  { id: "t5", name: "Siti Aminah", category_id: "cleaning", area: "Bukit Rimau", lat: 3.0250, lng: 101.5290, rating: 5.0, jobs: 900, price_from: 120, verified: true },
  { id: "t9", name: "Ganesh Rao", category_id: "reno", area: "Kemuning Utama", lat: 3.0180, lng: 101.5540, rating: 4.9, jobs: 130, price_from: 150, verified: true },
  { id: "t13", name: "Bala Subramaniam", category_id: "furniture", area: "Bukit Rimau", lat: 3.0245, lng: 101.5305, rating: 4.9, jobs: 380, price_from: 45, verified: true },
  { id: "t14", name: "Azman Yusof", category_id: "motor", area: "Telok Gadong", lat: 3.0250, lng: 101.4990, rating: 4.7, jobs: 210, price_from: 40, verified: false },
];

export const DEMO_PAYMETHODS = [
  { id: "applepay", emoji: "🍎", label: "Apple Pay", note: "One tap" },
  { id: "googlepay", emoji: "🟢", label: "Google Pay", note: "One tap" },
  { id: "tng", emoji: "🔵", label: "Touch 'n Go eWallet", note: "Malaysia's #1 e-wallet" },
  { id: "duitnow", emoji: "🟥", label: "DuitNow QR", note: "Scan to pay" },
  { id: "fpx", emoji: "🏦", label: "Online banking (FPX)", note: "Maybank, CIMB & more" },
  { id: "card", emoji: "💳", label: "Credit / debit card", note: "Visa, Mastercard" },
];

export function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
