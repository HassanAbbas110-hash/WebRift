create table if not exists quotes (
  id text primary key,
  token text not null default substr(replace(gen_random_uuid()::text,'-',''),1,10),
  seq serial,
  created_at timestamptz not null default now(),
  valid_until date not null,
  input jsonb not null,
  totals jsonb not null,
  client_name text,
  client_phone text,
  shop_name text,
  marketer text,
  negotiated boolean not null default false,
  status text not null default 'new'
);
-- Tables created before share tokens existed: add the column (existing rows each get their own token).
alter table quotes add column if not exists token text not null default substr(replace(gen_random_uuid()::text,'-',''),1,10);
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('chat','health-check','quote')),
  name text,
  phone text,
  shop text,
  summary text,
  intent int,
  transcript jsonb,
  consent boolean not null,
  status text not null default 'new'
);
create table if not exists settings (
  key text primary key,
  value jsonb
);
