-- Rode no Supabase: SQL Editor > New query > cole tudo > Run
create extension if not exists pgcrypto;

create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table public.guest_confirmations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 5 and 120),
  created_at timestamptz not null default now());
create unique index guest_confirmations_name_uq on public.guest_confirmations (lower(full_name));
create table public.gifts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  description text,
  category text not null,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now());
create index gifts_category_idx on public.gifts (category);
create table public.gift_reservations (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null unique references public.gifts(id) on delete cascade,  -- UNIQUE = 1 reserva por presente
  guest_name text not null check (char_length(guest_name) between 5 and 120),
  created_at timestamptz not null default now());

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

alter table public.admins enable row level security;
alter table public.guest_confirmations enable row level security;
alter table public.gifts enable row level security;
alter table public.gift_reservations enable row level security;

-- Somente admin acessa diretamente as tabelas (público usa as funções abaixo)
create policy admins_self on public.admins for select to authenticated using (user_id = auth.uid());
create policy gc_admin on public.guest_confirmations for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy gifts_admin on public.gifts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy res_admin on public.gift_reservations for all to authenticated using (public.is_admin()) with check (public.is_admin());
revoke all on public.admins, public.guest_confirmations, public.gifts, public.gift_reservations from anon;

-- Confirmação de presença (público)
create or replace function public.confirm_presence(p_name text) returns text
language plpgsql security definer set search_path = public as $$
declare n text := btrim(regexp_replace(coalesce(p_name,''), '\s+', ' ', 'g'));
begin
  if char_length(n) < 5 or char_length(n) > 120 or n !~ '^\S+( \S+)+$' then return 'invalid'; end if;
  insert into guest_confirmations(full_name) values (n) on conflict do nothing;
  return 'ok';
end $$;

-- Lista pública de presentes (sem expor quem reservou)
create or replace function public.list_gifts()
returns table(id uuid, name text, description text, category text, image_url text, reserved boolean)
language sql stable security definer set search_path = public as $$
  select g.id, g.name, g.description, g.category, g.image_url,
         exists(select 1 from gift_reservations r where r.gift_id = g.id)
  from gifts g where g.is_active order by g.category, g.name $$;

-- Reserva atômica (a restrição UNIQUE decide quem ganha)
create or replace function public.reserve_gift(p_gift_id uuid, p_name text) returns text
language plpgsql security definer set search_path = public as $$
declare n text := btrim(regexp_replace(coalesce(p_name,''), '\s+', ' ', 'g'));
begin
  if char_length(n) < 5 or char_length(n) > 120 or n !~ '^\S+( \S+)+$' then return 'invalid'; end if;
  if not exists (select 1 from gifts where id = p_gift_id and is_active) then return 'invalid'; end if;
  insert into gift_reservations(gift_id, guest_name) values (p_gift_id, n);
  return 'ok';
exception when unique_violation then return 'already_reserved';
end $$;

revoke all on function public.confirm_presence(text), public.list_gifts(), public.reserve_gift(uuid,text) from public;
grant execute on function public.confirm_presence(text), public.list_gifts(), public.reserve_gift(uuid,text), public.is_admin() to anon, authenticated;
