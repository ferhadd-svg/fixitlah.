-- kerjakita — seed data (categories, areas, taxonomy, sample verified pros)
-- Mirrors webapp/../data.js so the pilot has real content from day one.
-- Sample pros are seeded as already-verified so the Home -> Pros path
-- works immediately; swap for real pro signups once the pilot launches.

insert into areas (id, name, lat, lng, live) values
  ('bukit-rimau',   'Bukit Rimau',           3.0247, 101.5327, true),
  ('kota-kemuning', 'Kota Kemuning',         3.0208, 101.5378, true),
  ('shah-alam',     'Shah Alam (Seksyen 13)',3.0700, 101.5180, false),
  ('klang',         'Klang Bandar',          3.0449, 101.4455, false),
  ('bukit-tinggi',  'Bukit Tinggi, Klang',   3.0330, 101.4630, false),
  ('usj',           'USJ, Subang Jaya',      3.0438, 101.5860, false),
  ('puchong',       'Puchong',               3.0027, 101.6167, false),
  ('setia-alam',    'Setia Alam',            3.1050, 101.4600, false);

insert into categories (id, label, emoji) values
  ('aircond',    'Aircon Service',     '❄️'),
  ('plumbing',   'Plumbing',           '🔧'),
  ('electrical', 'Electrician',        '⚡'),
  ('carmech',    'Car Mechanic',       '🚗'),
  ('motor',      'Motorbike Repair',   '🏍️'),
  ('cleaning',   'House Cleaning',     '🧽'),
  ('grasscut',   'Lawn & Garden',      '🌿'),
  ('pest',       'Pest Control',       '🐜'),
  ('reno',       'Renovation',        '🧱'),
  ('painting',   'Painting',           '🎨'),
  ('appliance',  'Appliance Repair',   '🧊'),
  ('locksmith',  'Locksmith',          '🔑'),
  ('cctv',       'CCTV & Antenna',     '📹'),
  ('furniture',  'Furniture Assembly', '🪑');

insert into topcats (id, label, emoji, sort) values
  ('cooling',    'Aircon',       '❄️', 1),
  ('plumbing',   'Plumbing',     '🔧', 2),
  ('electrical', 'Electrical',   '⚡', 3),
  ('cleaning',   'Cleaning',     '🧽', 4),
  ('car',        'Car',          '🚗', 5),
  ('reno',       'Construction', '🏗️', 6),
  ('outdoor',    'Outdoor',      '🌿', 7),
  ('homeset',    'Home setup',   '🪑', 8),
  ('motor',      'Motorbike',    '🏍️', 9);

insert into subcats (topcat_id, label, category_id, sort) values
  ('cooling', 'Aircon service',      'aircond', 1),
  ('cooling', 'Aircon repair',       'aircond', 2),
  ('cooling', 'Install / relocate',  'aircond', 3),
  ('cooling', 'Chemical wash',       'aircond', 4),
  ('plumbing', 'Leaks & pipes',      'plumbing', 1),
  ('plumbing', 'Water heater',       'plumbing', 2),
  ('plumbing', 'Toilet & sink',      'plumbing', 3),
  ('plumbing', 'Blocked drains',     'plumbing', 4),
  ('electrical', 'Wiring & sockets', 'electrical', 1),
  ('electrical', 'Lights & fans',    'electrical', 2),
  ('electrical', 'Water heater install', 'electrical', 3),
  ('electrical', 'DB / breaker box', 'electrical', 4),
  ('cleaning', 'Home cleaning',      'cleaning', 1),
  ('cleaning', 'Deep clean',         'cleaning', 2),
  ('cleaning', 'Sofa & mattress',    'cleaning', 3),
  ('cleaning', 'Post-reno clean',    'cleaning', 4),
  ('car', 'Car service',             'carmech', 1),
  ('car', 'Tyres',                   'carmech', 2),
  ('car', 'Car detailing',           'carmech', 3),
  ('car', 'Car audio / player',      'carmech', 4),
  ('car', 'Battery',                 'carmech', 5),
  ('car', 'Car aircon',              'carmech', 6),
  ('reno', 'Tiling',                 'reno', 1),
  ('reno', 'Plaster & ceiling',      'reno', 2),
  ('reno', 'Painting',               'painting', 3),
  ('reno', 'Waterproofing',          'reno', 4),
  ('reno', 'Minor repairs',          'reno', 5),
  ('outdoor', 'Lawn & garden',       'grasscut', 1),
  ('outdoor', 'Pest control',        'pest', 2),
  ('homeset', 'Furniture assembly',  'furniture', 1),
  ('homeset', 'CCTV & antenna',      'cctv', 2),
  ('homeset', 'Locksmith',           'locksmith', 3),
  ('homeset', 'Appliance repair',    'appliance', 4),
  ('motor', 'Service',               'motor', 1),
  ('motor', 'Tyres',                 'motor', 2),
  ('motor', 'Battery',               'motor', 3);

-- Sample pros. In production these come from real signups (pros.status
-- starts 'pending' until admin verifies) — these are pre-verified demo
-- rows so the pilot has content to show before real pros are onboarded.
-- NOTE: pros.user_id must reference a real auth.users row, so this seed
-- can only run *after* you create these accounts (e.g. via Supabase
-- dashboard "Add user" with a throwaway password) and substitute their
-- UUIDs below. Left as a template — do not run as-is against auth.users.
--
-- insert into profiles (id, role, full_name, phone, email) values
--   ('00000000-0000-0000-0000-000000000001', 'pro', 'Ahmad Faizal', '012-3456789', 'ahmad@example.com');
-- insert into pros (user_id, business_name, bio, base_area_id, base_lat, base_lng, radius_km,
--   years_exp, plan, status, rating_avg, jobs_count, verified_at) values
--   ('00000000-0000-0000-0000-000000000001', 'AF Aircond Services',
--    'Aircon specialist, 12 years. Cleaning, R32 gas top-up, and reviving units that won''t cool.',
--    'kota-kemuning', 3.0215, 101.5360, 5, 12, 'pro', 'verified', 4.9, 640, now());
-- insert into pro_services (pro_id, category_id, price_from) values
--   ('00000000-0000-0000-0000-000000000001', 'aircond', 80);
