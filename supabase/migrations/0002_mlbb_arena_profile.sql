-- Arena-verified MLBB account data (avatar, level, in-game rank) plus the
-- stored session token, so a player's profile can be refreshed silently on
-- login instead of asking for a new in-game code every time.
--
-- Note: rank_level / history_rank_level are the player's own MLBB account
-- values shown on their profile. Nexsus does not compute a site-wide ladder.

alter table public.profiles
  add column if not exists avatar_url         text,
  add column if not exists level              integer,
  add column if not exists rank_level         integer,
  add column if not exists history_rank_level integer,
  add column if not exists mlbb_verified      boolean not null default false,
  add column if not exists mlbb_token         text,
  add column if not exists mlbb_synced_at     timestamptz;

-- The Arena JWT is a credential: it must never be readable by other players.
drop policy if exists profiles_read on public.profiles;

create or replace view public.public_profiles as
  select id, ml_id, ml_zone, ign, display_name, discord, country, role, banned,
         avatar_url, level, rank_level, history_rank_level, mlbb_verified, created_at
  from public.profiles;

grant select on public.public_profiles to anon, authenticated;

create policy profiles_read_self on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
