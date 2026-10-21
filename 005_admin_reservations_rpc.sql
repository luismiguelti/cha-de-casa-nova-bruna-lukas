-- Expõe reservas somente para usuários autenticados e cadastrados como admin.
create or replace function public.admin_list_gift_reservations()
returns table(id uuid, gift_id uuid, guest_name text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select r.id, r.gift_id, r.guest_name, r.created_at
  from public.gift_reservations r
  where public.is_admin()
  order by r.created_at desc
$$;

revoke all on function public.admin_list_gift_reservations() from public;
grant execute on function public.admin_list_gift_reservations() to authenticated;
