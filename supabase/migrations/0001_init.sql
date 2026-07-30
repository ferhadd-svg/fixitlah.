-- kerjakita — Phase 1 schema (M1: Foundation)
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.

create extension if not exists postgis;
create extension if not exists pgcrypto;

-- ---------- Reference data ----------

create table areas (
  id text primary key,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  geog geography(point, 4326) generated always as
    (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored,
  live boolean not null default false
);

create table categories (
  id text primary key,
  label text not null,
  emoji text not null
);

-- Two-level taxonomy shown on the customer Home screen.
create table topcats (
  id text primary key,
  label text not null,
  emoji text not null,
  sort int not null default 0
);

create table subcats (
  id uuid primary key default gen_random_uuid(),
  topcat_id text not null references topcats(id) on delete cascade,
  label text not null,
  category_id text not null references categories(id),
  sort int not null default 0
);

-- ---------- People ----------

-- One row per authenticated user (customer, pro, or admin).
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'pro', 'admin')),
  full_name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table pros (
  user_id uuid primary key references profiles(id) on delete cascade,
  business_name text,
  bio text,
  base_area_id text references areas(id),
  base_lat double precision,
  base_lng double precision,
  base_geog geography(point, 4326) generated always as
    (st_setsrid(st_makepoint(base_lng, base_lat), 4326)::geography) stored,
  radius_km numeric not null default 5,
  years_exp int,
  plan text not null default 'basic' check (plan in ('basic', 'pro')),
  status text not null default 'pending' check (status in ('pending', 'verified', 'suspended')),
  rating_avg numeric not null default 0,
  jobs_count int not null default 0,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table pro_services (
  id uuid primary key default gen_random_uuid(),
  pro_id uuid not null references pros(user_id) on delete cascade,
  category_id text not null references categories(id),
  price_from numeric not null,
  unique (pro_id, category_id)
);

-- ---------- Transactions ----------

create table bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id),
  pro_id uuid not null references pros(user_id),
  category_id text not null references categories(id),
  status text not null default 'requested'
    check (status in ('requested', 'accepted', 'scheduled', 'completed', 'cancelled')),
  when_pref text,
  note text,
  scheduled_at timestamptz,
  price_agreed numeric,
  payment_method text,
  created_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) unique,
  customer_id uuid not null references profiles(id),
  pro_id uuid not null references pros(user_id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  area text,
  created_at timestamptz not null default now()
);

create table pro_subscriptions (
  id uuid primary key default gen_random_uuid(),
  pro_id uuid not null references pros(user_id),
  plan text not null check (plan in ('basic', 'pro')),
  status text not null default 'trialing'
    check (status in ('trialing', 'active', 'past_due', 'cancelled')),
  gateway_ref text,
  period_start timestamptz not null default now(),
  period_end timestamptz
);

-- ---------- Matching function ----------
-- Pros offering `p_category` within `p_radius_km` of (p_lat, p_lng), nearest first.
create or replace function nearby_pros(
  p_category text,
  p_lat double precision,
  p_lng double precision,
  p_radius_km numeric default 5
)
returns table (
  pro_id uuid,
  business_name text,
  price_from numeric,
  rating_avg numeric,
  jobs_count int,
  dist_km numeric
)
language sql stable as $$
  select
    p.user_id,
    p.business_name,
    ps.price_from,
    p.rating_avg,
    p.jobs_count,
    round((st_distance(p.base_geog, st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography) / 1000)::numeric, 2)
  from pros p
  join pro_services ps on ps.pro_id = p.user_id
  where p.status = 'verified'
    and ps.category_id = p_category
    and st_dwithin(p.base_geog, st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography, p_radius_km * 1000)
  order by 6 asc;
$$;

-- ---------- Row Level Security ----------

alter table areas enable row level security;
alter table categories enable row level security;
alter table topcats enable row level security;
alter table subcats enable row level security;
alter table profiles enable row level security;
alter table pros enable row level security;
alter table pro_services enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table waitlist enable row level security;
alter table pro_subscriptions enable row level security;

-- Reference data & verified pro listings: publicly readable (no login needed to browse).
create policy "public read areas" on areas for select using (true);
create policy "public read categories" on categories for select using (true);
create policy "public read topcats" on topcats for select using (true);
create policy "public read subcats" on subcats for select using (true);
create policy "public read verified pros" on pros for select using (status = 'verified');
create policy "public read services of verified pros" on pro_services for select using (
  exists (select 1 from pros where pros.user_id = pro_services.pro_id and pros.status = 'verified')
);
create policy "public read reviews" on reviews for select using (true);

-- Anyone can join the waitlist; nobody can read others' entries back.
create policy "anyone can join waitlist" on waitlist for insert with check (true);

-- Profiles: a user manages only their own row.
create policy "read own profile" on profiles for select using (auth.uid() = id);
create policy "update own profile" on profiles for update using (auth.uid() = id);
create policy "insert own profile" on profiles for insert with check (auth.uid() = id);

-- Pros: the pro manages their own listing; pending listings are visible only to the owner.
create policy "pro reads own listing" on pros for select using (auth.uid() = user_id);
create policy "pro updates own listing" on pros for update using (auth.uid() = user_id);
create policy "pro creates own listing" on pros for insert with check (auth.uid() = user_id);
create policy "pro manages own services" on pro_services for all using (
  exists (select 1 from pros where pros.user_id = pro_services.pro_id and pros.user_id = auth.uid())
);

-- Bookings: visible to the customer who made it and the pro assigned to it.
create policy "customer reads own bookings" on bookings for select using (auth.uid() = customer_id);
create policy "pro reads assigned bookings" on bookings for select using (auth.uid() = pro_id);
create policy "customer creates booking" on bookings for insert with check (auth.uid() = customer_id);
create policy "pro updates assigned booking" on bookings for update using (auth.uid() = pro_id);

-- Reviews: the customer who completed the booking can leave one.
create policy "customer creates review" on reviews for insert with check (auth.uid() = customer_id);

-- Admin role bypasses RLS via the service key (used only in trusted server contexts), not covered here.
