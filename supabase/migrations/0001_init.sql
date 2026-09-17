-- Nexsus Gaming — core schema (Mobile Legends: Bang Bang only)
-- Run in the Supabase SQL editor, or `supabase db push`.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  ml_id         text,
  ml_zone       text,
  ign           text,
  display_name  text,
  discord       text,
  country       text,
  role          text not null default 'player'
                check (role in ('player', 'caster', 'moderator', 'admin')),
  banned        boolean not null default false,
  ban_reason    text,
  created_at    timestamptz not null default now(),
  unique (ml_id, ml_zone)
);

-- ------------------------------------------------------------------ squads
create table if not exists public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  tag         text not null,
  logo_url    text,
  bio         text,
  recruiting  boolean not null default false,
  looking_for text,
  leader_id   uuid not null references public.profiles (id) on delete cascade,
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'rejected', 'banned')),
  review_note text,
  invite_code text not null unique default encode(gen_random_bytes(4), 'hex'),
  created_at  timestamptz not null default now()
);

create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  team_id    uuid not null references public.teams (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role       text not null default 'player'
             check (role in ('leader', 'player', 'sub', 'coach')),
  joined_at  timestamptz not null default now(),
  unique (team_id, profile_id)
);

-- ------------------------------------------------------------- tournaments
create table if not exists public.tournaments (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  summary         text,
  rules           text,
  banner_url      text,
  format          text not null default 'single_elim'
                  check (format in ('single_elim', 'double_elim', 'group_stage', 'swiss')),
  mode            text not null default '5v5',
  region          text,
  prize_pool      text,
  entry_fee       text,
  max_teams       integer not null default 16,
  discord_channel text,
  reg_opens_at    timestamptz,
  reg_closes_at   timestamptz,
  starts_at       timestamptz,
  status          text not null default 'draft'
                  check (status in ('draft', 'registration_open', 'registration_closed',
                                    'ongoing', 'completed', 'cancelled')),
  created_by      uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now()
);

create table if not exists public.registrations (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  team_id       uuid not null references public.teams (id) on delete cascade,
  status        text not null default 'pending'
                check (status in ('pending', 'accepted', 'rejected', 'banned', 'withdrawn')),
  seed          integer,
  notes         text,
  created_at    timestamptz not null default now(),
  unique (tournament_id, team_id)
);

-- Bracket fixtures for a tournament. Scores are per-series only; nothing here
-- aggregates into a site-wide ladder.
create table if not exists public.matches (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  bracket       text not null default 'main' check (bracket in ('main', 'lower', 'final')),
  round         integer not null,
  position      integer not null,
  best_of       integer not null default 3,
  team_a_id     uuid references public.teams (id) on delete set null,
  team_b_id     uuid references public.teams (id) on delete set null,
  score_a       integer not null default 0,
  score_b       integer not null default 0,
  winner_id     uuid references public.teams (id) on delete set null,
  scheduled_at  timestamptz,
  stream_url    text,
  notes         text,
  status        text not null default 'scheduled'
                check (status in ('scheduled', 'live', 'completed', 'walkover')),
  unique (tournament_id, bracket, round, position)
);

-- ----------------------------------------------------- staff applications
create table if not exists public.staff_applications (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  position    text not null check (position in ('admin', 'moderator', 'caster')),
  discord     text not null,
  timezone    text,
  experience  text not null,
  hours       text,
  status      text not null default 'pending'
              check (status in ('pending', 'reviewing', 'accepted', 'rejected')),
  review_note text,
  created_at  timestamptz not null default now()
);

create index if not exists teams_status_idx on public.teams (status);
create index if not exists teams_recruiting_idx on public.teams (recruiting);
create index if not exists team_members_team_idx on public.team_members (team_id);
create index if not exists tournaments_status_idx on public.tournaments (status);
create index if not exists registrations_tournament_idx on public.registrations (tournament_id);
create index if not exists matches_tournament_idx on public.matches (tournament_id, bracket, round, position);
create index if not exists staff_apps_status_idx on public.staff_applications (status);

-- --------------------------------------------------------------- functions
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'moderator', 'caster')
  );
$$;

create or replace function public.is_team_leader(target uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.teams where id = target and leader_id = auth.uid());
$$;

-- new auth user -> profile row (metadata is filled by the signup form)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, ml_id, ml_zone, ign, display_name, discord, country)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'ml_id', ''),
    nullif(new.raw_user_meta_data ->> 'ml_zone', ''),
    nullif(new.raw_user_meta_data ->> 'ign', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data ->> 'discord', ''),
    nullif(new.raw_user_meta_data ->> 'country', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- the leader is always a roster member
create or replace function public.add_leader_to_roster()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.team_members (team_id, profile_id, role)
  values (new.id, new.leader_id, 'leader')
  on conflict (team_id, profile_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_team_created on public.teams;
create trigger on_team_created
  after insert on public.teams
  for each row execute function public.add_leader_to_roster();

-- players cannot promote themselves or lift their own ban
create or replace function public.guard_profile_privileges()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.banned := old.banned;
    new.ban_reason := old.ban_reason;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_update on public.profiles;
create trigger on_profile_update
  before update on public.profiles
  for each row execute function public.guard_profile_privileges();

-- only an admin moves a squad out of its current review state
create or replace function public.guard_team_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.status := old.status;
  end if;
  return new;
end;
$$;

drop trigger if exists on_team_update on public.teams;
create trigger on_team_update
  before update on public.teams
  for each row execute function public.guard_team_status();

-- ------------------------------------------------------------------- RLS
alter table public.profiles           enable row level security;
alter table public.teams              enable row level security;
alter table public.team_members       enable row level security;
alter table public.tournaments        enable row level security;
alter table public.registrations      enable row level security;
alter table public.matches            enable row level security;
alter table public.staff_applications enable row level security;

-- profiles
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select using (true);

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_delete_admin on public.profiles;
create policy profiles_delete_admin on public.profiles
  for delete to authenticated using (public.is_admin());

-- teams
drop policy if exists teams_read on public.teams;
create policy teams_read on public.teams for select using (true);

drop policy if exists teams_insert_leader on public.teams;
create policy teams_insert_leader on public.teams
  for insert to authenticated with check (leader_id = auth.uid());

drop policy if exists teams_update on public.teams;
create policy teams_update on public.teams for update to authenticated
  using ((leader_id = auth.uid() and status <> 'banned') or public.is_admin());

drop policy if exists teams_delete on public.teams;
create policy teams_delete on public.teams for delete to authenticated
  using (leader_id = auth.uid() or public.is_admin());

-- team_members
drop policy if exists members_read on public.team_members;
create policy members_read on public.team_members for select using (true);

drop policy if exists members_insert on public.team_members;
create policy members_insert on public.team_members for insert to authenticated
  with check (profile_id = auth.uid() or public.is_team_leader(team_id) or public.is_admin());

drop policy if exists members_update on public.team_members;
create policy members_update on public.team_members for update to authenticated
  using (public.is_team_leader(team_id) or public.is_admin());

drop policy if exists members_delete on public.team_members;
create policy members_delete on public.team_members for delete to authenticated
  using (profile_id = auth.uid() or public.is_team_leader(team_id) or public.is_admin());

-- tournaments
drop policy if exists tournaments_read on public.tournaments;
create policy tournaments_read on public.tournaments
  for select using (status <> 'draft' or public.is_staff());

drop policy if exists tournaments_write on public.tournaments;
create policy tournaments_write on public.tournaments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- registrations
drop policy if exists registrations_read on public.registrations;
create policy registrations_read on public.registrations for select using (true);

drop policy if exists registrations_insert on public.registrations;
create policy registrations_insert on public.registrations for insert to authenticated
  with check (public.is_team_leader(team_id) or public.is_admin());

drop policy if exists registrations_update on public.registrations;
create policy registrations_update on public.registrations
  for update to authenticated using (public.is_admin());

drop policy if exists registrations_delete on public.registrations;
create policy registrations_delete on public.registrations for delete to authenticated
  using (public.is_team_leader(team_id) or public.is_admin());

-- matches
drop policy if exists matches_read on public.matches;
create policy matches_read on public.matches for select using (true);

drop policy if exists matches_write on public.matches;
create policy matches_write on public.matches for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- staff applications: an applicant sees only their own, staff see all
drop policy if exists staff_apps_read on public.staff_applications;
create policy staff_apps_read on public.staff_applications for select to authenticated
  using (profile_id = auth.uid() or public.is_staff());

drop policy if exists staff_apps_insert on public.staff_applications;
create policy staff_apps_insert on public.staff_applications for insert to authenticated
  with check (profile_id = auth.uid());

drop policy if exists staff_apps_update on public.staff_applications;
create policy staff_apps_update on public.staff_applications
  for update to authenticated using (public.is_admin());

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

drop policy if exists logos_read on storage.objects;
create policy logos_read on storage.objects for select using (bucket_id = 'logos');

drop policy if exists logos_upload on storage.objects;
create policy logos_upload on storage.objects
  for insert to authenticated with check (bucket_id = 'logos');

drop policy if exists logos_update on storage.objects;
create policy logos_update on storage.objects
  for update to authenticated using (bucket_id = 'logos');
