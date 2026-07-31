-- Nova Dijital Davetiye - Misafir fotoğrafları kurulumu
-- Supabase Dashboard > SQL Editor içinde bir kez çalıştırın.

create extension if not exists pgcrypto;

create table if not exists public.guest_photos (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (char_length(trim(guest_name)) between 2 and 70),
  note text check (note is null or char_length(note) <= 180),
  storage_path text not null unique check (char_length(storage_path) <= 240),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists guest_photos_status_created_at_idx
  on public.guest_photos (status, created_at desc);

alter table public.guest_photos enable row level security;

drop policy if exists "Ziyaretciler onay bekleyen fotograf ekleyebilir" on public.guest_photos;
create policy "Ziyaretciler onay bekleyen fotograf ekleyebilir"
  on public.guest_photos
  for insert
  to anon
  with check (status = 'pending');

drop policy if exists "Ziyaretciler onaylanan fotograflari gorebilir" on public.guest_photos;
create policy "Ziyaretciler onaylanan fotograflari gorebilir"
  on public.guest_photos
  for select
  to anon
  using (status = 'approved');

drop policy if exists "Yoneticiler tum fotograflari gorebilir" on public.guest_photos;
create policy "Yoneticiler tum fotograflari gorebilir"
  on public.guest_photos
  for select
  to authenticated
  using (((select auth.uid()) = '30071b48-f363-42c2-a7fe-591c63f3c87b'::uuid));

drop policy if exists "Yoneticiler fotograf durumunu degistirebilir" on public.guest_photos;
create policy "Yoneticiler fotograf durumunu degistirebilir"
  on public.guest_photos
  for update
  to authenticated
  using (((select auth.uid()) = '30071b48-f363-42c2-a7fe-591c63f3c87b'::uuid))
  with check (((select auth.uid()) = '30071b48-f363-42c2-a7fe-591c63f3c87b'::uuid) and status in ('pending', 'approved', 'rejected'));

drop policy if exists "Yoneticiler fotograf kaydini silebilir" on public.guest_photos;
create policy "Yoneticiler fotograf kaydini silebilir"
  on public.guest_photos
  for delete
  to authenticated
  using (((select auth.uid()) = '30071b48-f363-42c2-a7fe-591c63f3c87b'::uuid));

grant select, insert on public.guest_photos to anon;
grant select, update, delete on public.guest_photos to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guest-photos',
  'guest-photos',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Ziyaretciler misafir fotografi yukleyebilir" on storage.objects;
create policy "Ziyaretciler misafir fotografi yukleyebilir"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'guest-photos'
    and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  );

drop policy if exists "Yoneticiler misafir fotograflarini yonetebilir" on storage.objects;
create policy "Yoneticiler misafir fotograflarini yonetebilir"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'guest-photos' and ((select auth.uid()) = '30071b48-f363-42c2-a7fe-591c63f3c87b'::uuid))
  with check (bucket_id = 'guest-photos' and ((select auth.uid()) = '30071b48-f363-42c2-a7fe-591c63f3c87b'::uuid));