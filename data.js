/* ============================================================
   fixitlah.  —  seed data
   Everything here is mock data for the clickable prototype.
   Coordinates are real-ish points around the Klang / Shah Alam
   area so the 5 km radius matching feels believable.
   ============================================================ */

// Service categories — Manglish labels, the way people actually say it.
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

// Preset "kawasan" (neighbourhoods) the customer can pick from,
// plus the option to use real GPS.
const AREAS = [
  { id: "bukit-rimau",   name: "Bukit Rimau",          lat: 3.0247, lng: 101.5327 },
  { id: "kota-kemuning", name: "Kota Kemuning",        lat: 3.0208, lng: 101.5378 },
  { id: "shah-alam",     name: "Shah Alam (Seksyen 13)",lat: 3.0700, lng: 101.5180 },
  { id: "klang",         name: "Klang Bandar",         lat: 3.0449, lng: 101.4455 },
  { id: "bukit-tinggi",  name: "Bukit Tinggi, Klang",  lat: 3.0330, lng: 101.4630 },
  { id: "usj",           name: "USJ, Subang Jaya",     lat: 3.0438, lng: 101.5860 },
  { id: "puchong",       name: "Puchong",              lat: 3.0027, lng: 101.6167 },
  { id: "setia-alam",    name: "Setia Alam",           lat: 3.1050, lng: 101.4600 },
];

// The tukang. Clustered mostly around Bukit Rimau / Kota Kemuning so a
// 5 km search returns a healthy list, with a few farther out to prove
// the radius filter is doing real work.
const TUKANG = [
  {
    id: "t1", name: "Ahmad Faizal", service: "aircond", area: "Kota Kemuning",
    lat: 3.0215, lng: 101.5360, rating: 4.9, reviews: 213, jobs: 640,
    priceFrom: 80, verified: true, respondsIn: "± 15 min",
    blurb: "Aircond specialist 12 tahun. Cuci, top-up gas R32, service unit tak sejuk. Same-day boleh.",
  },
  {
    id: "t2", name: "Muthu Kumar", service: "plumbing", area: "Bukit Rimau",
    lat: 3.0261, lng: 101.5310, rating: 4.8, reviews: 156, jobs: 402,
    priceFrom: 60, verified: true, respondsIn: "± 20 min",
    blurb: "Paip bocor, sinki tersumbat, water heater. Kerja bersih, no hidden charge.",
  },
  {
    id: "t3", name: "Tan Ah Meng", service: "electrical", area: "Bukit Rimau",
    lat: 3.0233, lng: 101.5349, rating: 4.9, reviews: 288, jobs: 710,
    priceFrom: 70, verified: true, respondsIn: "± 10 min",
    blurb: "Licensed wireman. Wiring rumah, tambah plug point, baiki DB box, lampu & kipas.",
  },
  {
    id: "t4", name: "Faizal Rahman", service: "carmech", area: "Kota Kemuning",
    lat: 3.0190, lng: 101.5402, rating: 4.7, reviews: 98, jobs: 240,
    priceFrom: 90, verified: true, respondsIn: "± 30 min",
    blurb: "Mobile mechanic. Servis minyak hitam, brake pad, bateri, aircond kereta. Datang rumah.",
  },
  {
    id: "t5", name: "Siti Aminah", service: "cleaning", area: "Bukit Rimau",
    lat: 3.0250, lng: 101.5290, rating: 5.0, reviews: 341, jobs: 900,
    priceFrom: 120, verified: true, respondsIn: "± 1 jam",
    blurb: "Cleaning rumah & spring clean. Team perempuan, teliti sampai skirting. Booking awal ya.",
  },
  {
    id: "t6", name: "Raju Pillai", service: "grasscut", area: "Alam Impian",
    lat: 3.0400, lng: 101.5400, rating: 4.6, reviews: 74, jobs: 188,
    priceFrom: 50, verified: false, respondsIn: "± 45 min",
    blurb: "Potong rumput, trim pagar hidup, buang sampah taman. Rumah teres RM50 flat.",
  },
  {
    id: "t7", name: "Lim Chee Keong", service: "aircond", area: "Bukit Rimau",
    lat: 3.0272, lng: 101.5333, rating: 4.7, reviews: 129, jobs: 350,
    priceFrom: 75, verified: true, respondsIn: "± 25 min",
    blurb: "Chemical wash, repair PCB, relocate aircond. Ada warranty 30 hari untuk repair.",
  },
  {
    id: "t8", name: "Nurul Huda", service: "pest", area: "Kota Kemuning",
    lat: 3.0201, lng: 101.5351, rating: 4.8, reviews: 112, jobs: 265,
    priceFrom: 100, verified: true, respondsIn: "± 40 min",
    blurb: "Kawalan anai-anai, lipas, tikus & denggi fogging. Guna bahan lulus KKM, selamat anak-anak.",
  },
  {
    id: "t9", name: "Ganesh Rao", service: "reno", area: "Kemuning Utama",
    lat: 3.0180, lng: 101.5540, rating: 4.9, reviews: 87, jobs: 130,
    priceFrom: 150, verified: true, respondsIn: "± 2 jam",
    blurb: "Tukang rumah — tiling, plaster ceiling, cat, waterproofing bumbung. Free site visit.",
  },
  {
    id: "t10", name: "Zulkifli Osman", service: "locksmith", area: "Kota Kemuning",
    lat: 3.0230, lng: 101.5320, rating: 4.7, reviews: 203, jobs: 540,
    priceFrom: 65, verified: true, respondsIn: "± 20 min",
    blurb: "Terkunci luar rumah/kereta? 24 jam. Tukar mangga, digital lock, duplicate kunci.",
  },
  {
    id: "t11", name: "Wong Kok Wai", service: "appliance", area: "Seksyen 32, Shah Alam",
    lat: 3.0530, lng: 101.5310, rating: 4.6, reviews: 66, jobs: 175,
    priceFrom: 70, verified: false, respondsIn: "± 1 jam",
    blurb: "Baiki peti ais tak sejuk, mesin basuh bocor, oven & microwave. Check RM40 sahaja.",
  },
  {
    id: "t12", name: "Hafiz Idris", service: "painting", area: "Kota Kemuning",
    lat: 3.0212, lng: 101.5388, rating: 4.8, reviews: 91, jobs: 160,
    priceFrom: 130, verified: true, respondsIn: "± 2 jam",
    blurb: "Cat dalam & luar, cat waterproof, touch-up sebelum pindah. Kemas, cover semua furniture.",
  },
  {
    id: "t13", name: "Bala Subramaniam", service: "furniture", area: "Bukit Rimau",
    lat: 3.0245, lng: 101.5305, rating: 4.9, reviews: 148, jobs: 380,
    priceFrom: 45, verified: true, respondsIn: "± 30 min",
    blurb: "Pasang perabot IKEA, wardrobe, katil, meja study. Bawa tools sendiri, cepat & rapi.",
  },
  {
    id: "t14", name: "Azman Yusof", service: "motor", area: "Telok Gadong",
    lat: 3.0250, lng: 101.4990, rating: 4.7, reviews: 82, jobs: 210,
    priceFrom: 40, verified: false, respondsIn: "± 35 min",
    blurb: "Servis motor, tukar tayar, brake, bateri. Tayar pancit tepi jalan pun boleh call.",
  },
  {
    id: "t15", name: "Chong Wei Ling", service: "cctv", area: "Alam Impian",
    lat: 3.0420, lng: 101.5460, rating: 4.8, reviews: 59, jobs: 120,
    priceFrom: 110, verified: true, respondsIn: "± 1 jam",
    blurb: "Pasang CCTV 4-channel, setup phone view, tuning Astro/antenna. Cabling kemas.",
  },
  {
    id: "t16", name: "Ravi Chandran", service: "electrical", area: "Kemuning Utama",
    lat: 3.0100, lng: 101.5470, rating: 4.6, reviews: 71, jobs: 195,
    priceFrom: 65, verified: false, respondsIn: "± 30 min",
    blurb: "Lampu tak nyala, plug hangus, pasang kipas siling & water heater. Harga student pun boleh.",
  },
  {
    id: "t17", name: "Norwati Ismail", service: "cleaning", area: "Kota Kemuning",
    lat: 3.0206, lng: 101.5366, rating: 4.9, reviews: 197, jobs: 470,
    priceFrom: 110, verified: true, respondsIn: "± 1 jam",
    blurb: "Deep cleaning dapur berminyak, tandas, cuci sofa & tilam. Booking weekend cepat penuh.",
  },
  // ---- Farther out (Klang / Bukit Tinggi) — mostly OUTSIDE 5 km from Bukit Rimau ----
  {
    id: "t18", name: "Saiful Bahri", service: "plumbing", area: "Klang Bandar",
    lat: 3.0455, lng: 101.4460, rating: 4.7, reviews: 88, jobs: 230,
    priceFrom: 55, verified: true, respondsIn: "± 30 min",
    blurb: "Paip, water heater, toilet bowl. Cover area Klang & Bukit Tinggi.",
  },
  {
    id: "t19", name: "Lee Chong Hui", service: "carmech", area: "Bukit Tinggi, Klang",
    lat: 3.0335, lng: 101.4625, rating: 4.8, reviews: 140, jobs: 310,
    priceFrom: 85, verified: true, respondsIn: "± 40 min",
    blurb: "Workshop Bukit Tinggi. Servis major, timing belt, aircond kereta. Boleh mobile sekitar Klang.",
  },
  {
    id: "t20", name: "Kamarul Zaman", service: "aircond", area: "Klang Bandar",
    lat: 3.0440, lng: 101.4470, rating: 4.6, reviews: 62, jobs: 150,
    priceFrom: 70, verified: false, respondsIn: "± 45 min",
    blurb: "Servis & repair aircond area Klang. Cuci normal RM70, chemical RM130.",
  },
  // ---- Setia Alam / Shah Alam / USJ / Puchong — even farther ----
  {
    id: "t21", name: "Vimala Devi", service: "cleaning", area: "Setia Alam",
    lat: 3.1055, lng: 101.4610, rating: 4.9, reviews: 176, jobs: 420,
    priceFrom: 115, verified: true, respondsIn: "± 1 jam",
    blurb: "Cleaning & spring clean area Setia Alam / Setia Eco. Team 3 orang.",
  },
  {
    id: "t22", name: "Firdaus Anuar", service: "electrical", area: "Shah Alam (Seksyen 13)",
    lat: 3.0705, lng: 101.5175, rating: 4.7, reviews: 103, jobs: 260,
    priceFrom: 70, verified: true, respondsIn: "± 25 min",
    blurb: "Wireman berlesen area Shah Alam. Wiring kilang & rumah, upgrade DB.",
  },
  {
    id: "t23", name: "Tan Boon Seng", service: "reno", area: "USJ, Subang Jaya",
    lat: 3.0442, lng: 101.5855, rating: 4.8, reviews: 64, jobs: 90,
    priceFrom: 160, verified: true, respondsIn: "± 2 jam",
    blurb: "Renovation dapur & tandas area USJ/Subang. Design + build.",
  },
  {
    id: "t24", name: "Arun Kumar", service: "grasscut", area: "Puchong",
    lat: 3.0031, lng: 101.6160, rating: 4.5, reviews: 48, jobs: 130,
    priceFrom: 55, verified: false, respondsIn: "± 45 min",
    blurb: "Potong rumput & landscaping area Puchong. Kontrak bulanan pun ada.",
  },
];
