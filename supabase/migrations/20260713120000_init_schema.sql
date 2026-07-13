-- ============================================================================
-- Insecure Mail — initial schema
-- Tables: subscribers, newsletters  +  Row Level Security
-- This migration mirrors supabase.md and is written to be idempotent, so it is
-- safe even if you already ran that SQL by hand in the dashboard.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- subscribers  (tier 'recon' = free, 'root' = paid)
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id                 uuid primary key default gen_random_uuid(),
  email              text unique not null,
  tier               text not null default 'recon'
                       check (tier in ('recon', 'root')),
  status             text not null default 'pending'
                       check (status in ('pending', 'active', 'unsubscribed')),
  source             text,                              -- e.g. 'landing'
  unsubscribe_token  uuid not null default gen_random_uuid(),
  -- payment bookkeeping (written by the payment webhook via service_role):
  provider           text,                              -- 'sellix' | 'helio' | ...
  provider_ref       text,                              -- external order/sub id
  root_expires_at    timestamptz,                       -- when paid access lapses
  created_at         timestamptz not null default now(),
  confirmed_at       timestamptz
);

create index if not exists subscribers_tier_status_idx
  on public.subscribers (tier, status);

-- ---------------------------------------------------------------------------
-- newsletters  (the archive)
-- ---------------------------------------------------------------------------
create table if not exists public.newsletters (
  id             uuid primary key default gen_random_uuid(),
  edition        text not null,       -- 'Sun · Threat Radar' | 'Thu · The Brief' ...
  slug           text unique,
  title          text not null,
  summary        text,
  body_html      text,
  body_markdown  text,
  send_tier      text not null default 'root'
                   check (send_tier in ('recon', 'root')),  -- who got it by email
  status         text not null default 'draft'
                   check (status in ('draft', 'sent')),
  sent_at        timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists newsletters_status_sent_idx
  on public.newsletters (status, sent_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.subscribers enable row level security;
alter table public.newsletters enable row level security;

-- Table-level privileges (RLS still gates the rows). service_role bypasses RLS.
grant insert            on table public.subscribers to anon;
grant select, insert    on table public.subscribers to authenticated;
grant select            on table public.newsletters to authenticated;
grant all               on table public.subscribers to service_role;
grant all               on table public.newsletters to service_role;

-- ---- subscribers policies -------------------------------------------------

-- Anyone may sign up, but ONLY as a pending recon subscriber. This is what
-- stops a visitor from self-granting 'root' or 'active'.
drop policy if exists "public can self-subscribe as recon" on public.subscribers;
create policy "public can self-subscribe as recon"
  on public.subscribers for insert
  to anon, authenticated
  with check ( tier = 'recon' and status = 'pending' );

-- A logged-in user may read only their own row (the app uses this to learn
-- whether they are an active root member).
drop policy if exists "users read their own subscriber row" on public.subscribers;
create policy "users read their own subscriber row"
  on public.subscribers for select
  to authenticated
  using ( email = auth.email() );

-- No UPDATE/DELETE policies on purpose: confirmations, upgrades to 'root', and
-- unsubscribes are done by n8n / webhooks using service_role (bypasses RLS).

-- ---- newsletters policies -------------------------------------------------

-- Only active root members can read sent issues (the paid archive). Enforced
-- in the database, not just in the frontend router.
drop policy if exists "root members read the archive" on public.newsletters;
create policy "root members read the archive"
  on public.newsletters for select
  to authenticated
  using (
    status = 'sent'
    and exists (
      select 1 from public.subscribers s
      where s.email = auth.email()
        and s.tier = 'root'
        and s.status = 'active'
        and (s.root_expires_at is null or s.root_expires_at > now())
    )
  );
