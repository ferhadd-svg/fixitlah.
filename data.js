/* ============================================================
   kerjakita  —  seed data
   Mock data for the clickable prototype. Coordinates are real-ish
   points around the Klang / Shah Alam area so the 5 km matching
   feels believable.
   ============================================================ */

// Service categories.
const CATEGORIES = [
  { id: "aircond",   emoji: "❄️", label: "Aircon Service",    tagline: "Clean, gas top-up, not cold" },
  { id: "plumbing",  emoji: "🔧", label: "Plumbing",          tagline: "Leaks, blocked sinks" },
  { id: "electrical",emoji: "⚡", label: "Electrician",       tagline: "Wiring, sockets, lights" },
  { id: "carmech",   emoji: "🚗", label: "Car Mechanic",      tagline: "Service, brakes, car aircon" },
  { id: "motor",     emoji: "🏍️", label: "Motorbike Repair",  tagline: "Service, flat tyres" },
  { id: "cleaning",  emoji: "🧽", label: "House Cleaning",    tagline: "Regular & deep clean" },
  { id: "grasscut",  emoji: "🌿", label: "Lawn & Garden",     tagline: "Mowing, trimming" },
  { id: "pest",      emoji: "🐜", label: "Pest Control",      tagline: "Termites, rats, roaches" },
  { id: "reno",      emoji: "🧱", label: "Renovation",        tagline: "Reno, plaster, tiling" },
  { id: "painting",  emoji: "🎨", label: "Painting",          tagline: "Interior & exterior" },
  { id: "appliance", emoji: "🧊", label: "Appliance Repair",  tagline: "Fridge, washing machine" },
  { id: "locksmith", emoji: "🔑", label: "Locksmith",         tagline: "Locked out? We come to you" },
  { id: "cctv",      emoji: "📹", label: "CCTV & Antenna",    tagline: "Install & tuning" },
  { id: "furniture", emoji: "🪑", label: "Furniture Assembly",tagline: "IKEA, wardrobe, beds" },
];

// Two-level category tree: short top-level groups -> detailed sub-services.
// Each sub maps to an underlying pro service pool (the 14 CATEGORIES ids).
const TAXONOMY = [
  { id: "cooling",    emoji: "❄️", label: "Aircon", subs: [
    { label: "Aircon service", service: "aircond" },
    { label: "Aircon repair", service: "aircond" },
    { label: "Install / relocate", service: "aircond" },
    { label: "Chemical wash", service: "aircond" },
  ]},
  { id: "plumbing",   emoji: "🔧", label: "Plumbing", subs: [
    { label: "Leaks & pipes", service: "plumbing" },
    { label: "Water heater", service: "plumbing" },
    { label: "Toilet & sink", service: "plumbing" },
    { label: "Blocked drains", service: "plumbing" },
  ]},
  { id: "electrical", emoji: "⚡", label: "Electrical", subs: [
    { label: "Wiring & sockets", service: "electrical" },
    { label: "Lights & fans", service: "electrical" },
    { label: "Water heater install", service: "electrical" },
    { label: "DB / breaker box", service: "electrical" },
  ]},
  { id: "cleaning",   emoji: "🧽", label: "Cleaning", subs: [
    { label: "Home cleaning", service: "cleaning" },
    { label: "Deep clean", service: "cleaning" },
    { label: "Sofa & mattress", service: "cleaning" },
    { label: "Post-reno clean", service: "cleaning" },
  ]},
  { id: "car",        emoji: "🚗", label: "Car", subs: [
    { label: "Car service", service: "carmech" },
    { label: "Tyres", service: "carmech" },
    { label: "Car detailing", service: "carmech" },
    { label: "Car audio / player", service: "carmech" },
    { label: "Battery", service: "carmech" },
    { label: "Car aircon", service: "carmech" },
  ]},
  { id: "reno",       emoji: "🏗️", label: "Construction", subs: [
    { label: "Tiling", service: "reno" },
    { label: "Plaster & ceiling", service: "reno" },
    { label: "Painting", service: "painting" },
    { label: "Waterproofing", service: "reno" },
    { label: "Minor repairs", service: "reno" },
  ]},
  { id: "outdoor",    emoji: "🌿", label: "Outdoor", subs: [
    { label: "Lawn & garden", service: "grasscut" },
    { label: "Pest control", service: "pest" },
  ]},
  { id: "homeset",    emoji: "🪑", label: "Home setup", subs: [
    { label: "Furniture assembly", service: "furniture" },
    { label: "CCTV & antenna", service: "cctv" },
    { label: "Locksmith", service: "locksmith" },
    { label: "Appliance repair", service: "appliance" },
  ]},
  { id: "motor",      emoji: "🏍️", label: "Motorbike", subs: [
    { label: "Service", service: "motor" },
    { label: "Tyres", service: "motor" },
    { label: "Battery", service: "motor" },
  ]},
];

// Payment methods (Malaysia-first). Prototype only — no real charge.
const PAYMETHODS = [
  { id: "applepay",  emoji: "🍎", label: "Apple Pay",           note: "One tap" },
  { id: "googlepay", emoji: "🟢", label: "Google Pay",          note: "One tap" },
  { id: "tng",       emoji: "🔵", label: "Touch 'n Go eWallet", note: "Malaysia's #1 e-wallet" },
  { id: "duitnow",   emoji: "🟥", label: "DuitNow QR",          note: "Scan to pay" },
  { id: "fpx",       emoji: "🏦", label: "Online banking (FPX)",note: "Maybank, CIMB & more" },
  { id: "card",      emoji: "💳", label: "Credit / debit card", note: "Visa, Mastercard" },
];

// Preset neighbourhoods the customer can pick from, plus GPS.
// `live: true` = inside the pilot zone. Everything else is "coming soon"
// and routes visitors to the waitlist.
const AREAS = [
  { id: "bukit-rimau",   name: "Bukit Rimau",          lat: 3.0247, lng: 101.5327, live: true },
  { id: "kota-kemuning", name: "Kota Kemuning",        lat: 3.0208, lng: 101.5378, live: true },
  { id: "shah-alam",     name: "Shah Alam (Seksyen 13)",lat: 3.0700, lng: 101.5180 },
  { id: "klang",         name: "Klang Bandar",         lat: 3.0449, lng: 101.4455 },
  { id: "bukit-tinggi",  name: "Bukit Tinggi, Klang",  lat: 3.0330, lng: 101.4630 },
  { id: "usj",           name: "USJ, Subang Jaya",     lat: 3.0438, lng: 101.5860 },
  { id: "puchong",       name: "Puchong",              lat: 3.0027, lng: 101.6167 },
  { id: "setia-alam",    name: "Setia Alam",           lat: 3.1050, lng: 101.4600 },
];

// The pros. Clustered mostly around Bukit Rimau / Kota Kemuning so a
// 5 km search returns a healthy list, with a few farther out.
const TUKANG = [
  {
    id: "t1", name: "Ahmad Faizal", service: "aircond", area: "Kota Kemuning",
    lat: 3.0215, lng: 101.5360, rating: 4.9, reviews: 213, jobs: 640,
    priceFrom: 80, verified: true, respondsIn: "~15 min", since: 2016,
    blurb: "Aircon specialist, 12 years. Cleaning, R32 gas top-up, and reviving units that won't cool. Same-day available.",
  },
  {
    id: "t2", name: "Muthu Kumar", service: "plumbing", area: "Bukit Rimau",
    lat: 3.0261, lng: 101.5310, rating: 4.8, reviews: 156, jobs: 402,
    priceFrom: 60, verified: true, respondsIn: "~20 min", since: 2018,
    blurb: "Leaks, blocked sinks, water heaters. Clean work, no hidden charges.",
  },
  {
    id: "t3", name: "Tan Ah Meng", service: "electrical", area: "Bukit Rimau",
    lat: 3.0233, lng: 101.5349, rating: 4.9, reviews: 288, jobs: 710,
    priceFrom: 70, verified: true, respondsIn: "~10 min", since: 2015,
    blurb: "Licensed wireman. House wiring, extra power points, DB box repairs, lights & fans.",
  },
  {
    id: "t4", name: "Faizal Rahman", service: "carmech", area: "Kota Kemuning",
    lat: 3.0190, lng: 101.5402, rating: 4.7, reviews: 98, jobs: 240,
    priceFrom: 90, verified: true, respondsIn: "~30 min", since: 2019,
    blurb: "Mobile mechanic. Oil service, brake pads, battery, car aircon — I come to your home.",
  },
  {
    id: "t5", name: "Siti Aminah", service: "cleaning", area: "Bukit Rimau",
    lat: 3.0250, lng: 101.5290, rating: 5.0, reviews: 341, jobs: 900,
    priceFrom: 120, verified: true, respondsIn: "~1 hr", since: 2017,
    blurb: "Home cleaning & deep clean. All-female team, thorough down to the skirting. Please book ahead.",
  },
  {
    id: "t6", name: "Raju Pillai", service: "grasscut", area: "Alam Impian",
    lat: 3.0400, lng: 101.5400, rating: 4.6, reviews: 74, jobs: 188,
    priceFrom: 50, verified: false, respondsIn: "~45 min", since: 2020,
    blurb: "Lawn mowing, hedge trimming, garden waste removal. Terrace house RM50 flat.",
  },
  {
    id: "t7", name: "Lim Chee Keong", service: "aircond", area: "Bukit Rimau",
    lat: 3.0272, lng: 101.5333, rating: 4.7, reviews: 129, jobs: 350,
    priceFrom: 75, verified: true, respondsIn: "~25 min", since: 2018,
    blurb: "Chemical wash, PCB repair, aircon relocation. 30-day warranty on repairs.",
  },
  {
    id: "t8", name: "Nurul Huda", service: "pest", area: "Kota Kemuning",
    lat: 3.0201, lng: 101.5351, rating: 4.8, reviews: 112, jobs: 265,
    priceFrom: 100, verified: true, respondsIn: "~40 min", since: 2019,
    blurb: "Termite, cockroach & rat control, plus dengue fogging. KKM-approved products, safe for kids.",
  },
  {
    id: "t9", name: "Ganesh Rao", service: "reno", area: "Kemuning Utama",
    lat: 3.0180, lng: 101.5540, rating: 4.9, reviews: 87, jobs: 130,
    priceFrom: 150, verified: true, respondsIn: "~2 hr", since: 2017,
    blurb: "Home renovation — tiling, plaster ceilings, painting, roof waterproofing. Free site visit.",
  },
  {
    id: "t10", name: "Zulkifli Osman", service: "locksmith", area: "Kota Kemuning",
    lat: 3.0230, lng: 101.5320, rating: 4.7, reviews: 203, jobs: 540,
    priceFrom: 65, verified: true, respondsIn: "~20 min", since: 2016,
    blurb: "Locked out of your house or car? 24 hours. Padlock changes, digital locks, key duplication.",
  },
  {
    id: "t11", name: "Wong Kok Wai", service: "appliance", area: "Seksyen 32, Shah Alam",
    lat: 3.0530, lng: 101.5310, rating: 4.6, reviews: 66, jobs: 175,
    priceFrom: 70, verified: false, respondsIn: "~1 hr", since: 2020,
    blurb: "Fridge not cooling, washing machine leaks, ovens & microwaves. Diagnosis just RM40.",
  },
  {
    id: "t12", name: "Hafiz Idris", service: "painting", area: "Kota Kemuning",
    lat: 3.0212, lng: 101.5388, rating: 4.8, reviews: 91, jobs: 160,
    priceFrom: 130, verified: true, respondsIn: "~2 hr", since: 2018,
    blurb: "Interior & exterior painting, waterproof coating, pre-move touch-ups. Tidy — all furniture covered.",
  },
  {
    id: "t13", name: "Bala Subramaniam", service: "furniture", area: "Bukit Rimau",
    lat: 3.0245, lng: 101.5305, rating: 4.9, reviews: 148, jobs: 380,
    priceFrom: 45, verified: true, respondsIn: "~30 min", since: 2018,
    blurb: "IKEA furniture, wardrobes, beds, study desks. I bring my own tools — fast & neat.",
  },
  {
    id: "t14", name: "Azman Yusof", service: "motor", area: "Telok Gadong",
    lat: 3.0250, lng: 101.4990, rating: 4.7, reviews: 82, jobs: 210,
    priceFrom: 40, verified: false, respondsIn: "~35 min", since: 2019,
    blurb: "Motorbike service, tyre changes, brakes, battery. Roadside flat-tyre call-outs too.",
  },
  {
    id: "t15", name: "Chong Wei Ling", service: "cctv", area: "Alam Impian",
    lat: 3.0420, lng: 101.5460, rating: 4.8, reviews: 59, jobs: 120,
    priceFrom: 110, verified: true, respondsIn: "~1 hr", since: 2020,
    blurb: "4-channel CCTV install, phone-view setup, Astro/antenna tuning. Neat cabling.",
  },
  {
    id: "t16", name: "Ravi Chandran", service: "electrical", area: "Kemuning Utama",
    lat: 3.0100, lng: 101.5470, rating: 4.6, reviews: 71, jobs: 195,
    priceFrom: 65, verified: false, respondsIn: "~30 min", since: 2020,
    blurb: "Lights not working, burnt sockets, ceiling fans & water heaters. Student-friendly rates.",
  },
  {
    id: "t17", name: "Norwati Ismail", service: "cleaning", area: "Kota Kemuning",
    lat: 3.0206, lng: 101.5366, rating: 4.9, reviews: 197, jobs: 470,
    priceFrom: 110, verified: true, respondsIn: "~1 hr", since: 2017,
    blurb: "Deep-clean greasy kitchens, toilets, sofa & mattress cleaning. Weekend slots fill fast.",
  },
  // ---- Farther out (Klang / Bukit Tinggi) — mostly OUTSIDE 5 km from Bukit Rimau ----
  {
    id: "t18", name: "Saiful Bahri", service: "plumbing", area: "Klang Bandar",
    lat: 3.0455, lng: 101.4460, rating: 4.7, reviews: 88, jobs: 230,
    priceFrom: 55, verified: true, respondsIn: "~30 min", since: 2018,
    blurb: "Pipes, water heaters, toilet bowls. Covers Klang & Bukit Tinggi.",
  },
  {
    id: "t19", name: "Lee Chong Hui", service: "carmech", area: "Bukit Tinggi, Klang",
    lat: 3.0335, lng: 101.4625, rating: 4.8, reviews: 140, jobs: 310,
    priceFrom: 85, verified: true, respondsIn: "~40 min", since: 2016,
    blurb: "Bukit Tinggi workshop. Major service, timing belt, car aircon. Mobile around Klang.",
  },
  {
    id: "t20", name: "Kamarul Zaman", service: "aircond", area: "Klang Bandar",
    lat: 3.0440, lng: 101.4470, rating: 4.6, reviews: 62, jobs: 150,
    priceFrom: 70, verified: false, respondsIn: "~45 min", since: 2021,
    blurb: "Aircon service & repair around Klang. Normal wash RM70, chemical RM130.",
  },
  // ---- Setia Alam / Shah Alam / USJ / Puchong — even farther ----
  {
    id: "t21", name: "Vimala Devi", service: "cleaning", area: "Setia Alam",
    lat: 3.1055, lng: 101.4610, rating: 4.9, reviews: 176, jobs: 420,
    priceFrom: 115, verified: true, respondsIn: "~1 hr", since: 2017,
    blurb: "Cleaning & deep clean around Setia Alam / Setia Eco. Team of 3.",
  },
  {
    id: "t22", name: "Firdaus Anuar", service: "electrical", area: "Shah Alam (Seksyen 13)",
    lat: 3.0705, lng: 101.5175, rating: 4.7, reviews: 103, jobs: 260,
    priceFrom: 70, verified: true, respondsIn: "~25 min", since: 2018,
    blurb: "Licensed wireman around Shah Alam. Factory & home wiring, DB upgrades.",
  },
  {
    id: "t23", name: "Tan Boon Seng", service: "reno", area: "USJ, Subang Jaya",
    lat: 3.0442, lng: 101.5855, rating: 4.8, reviews: 64, jobs: 90,
    priceFrom: 160, verified: true, respondsIn: "~2 hr", since: 2019,
    blurb: "Kitchen & bathroom renovation around USJ / Subang. Design + build.",
  },
  {
    id: "t24", name: "Arun Kumar", service: "grasscut", area: "Puchong",
    lat: 3.0031, lng: 101.6160, rating: 4.5, reviews: 48, jobs: 130,
    priceFrom: 55, verified: false, respondsIn: "~45 min", since: 2021,
    blurb: "Lawn mowing & landscaping around Puchong. Monthly contracts available.",
  },
];

// Pools used to synthesise believable past jobs / reviews on the profile.
const REVIEW_POOL = {
  authors: [
    "Aisyah R.", "Kevin T.", "Priya M.", "Farid H.", "Mei Ling", "Daniel W.",
    "Nadia S.", "Ganesan", "Sarah L.", "Amir Z.", "Yee Wen", "Hafizah",
    "Ravi K.", "Joanne C.", "Syafiq", "Lina T.", "Suresh", "Wan Aziz",
  ],
  positive: [
    "On time, tidy, and explained everything clearly. Will book again.",
    "Fixed the problem fast and the price was exactly as quoted. No surprises.",
    "Very professional and friendly. Cleaned up after the job too.",
    "Responded quickly and came the same day. Highly recommend.",
    "Honest and didn't upsell me things I didn't need. Trustworthy.",
    "Great work, and followed up the next day to check it was still fine.",
    "Neat job, fair price, easy to deal with. My go-to from now on.",
  ],
  good: [
    "Good job overall. Ran a little late but messaged me to let me know.",
    "Solid work and reasonable price. Would use again.",
    "Did the job well. Would've liked a bit more explanation, but happy.",
  ],
};
