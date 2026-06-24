-- ProofTrail Initial Schema
-- Evidence-first achievement verification vault

create extension if not exists "pgcrypto";

-- Public user profile connected to Supabase Auth users.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text unique,
  bio text,
  public_title text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Core achievement record.
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,

  title text not null,
  category text not null,
  issuer text,
  achievement_date date,
  description text,
  impact_summary text,

  visibility text not null default 'private',
  verification_status text not null default 'claimed',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint achievements_visibility_check
    check (visibility in ('private', 'public', 'unlisted')),

  constraint achievements_verification_status_check
    check (
      verification_status in (
        'claimed',
        'evidence_attached',
        'source_linked',
        'reviewed',
        'flagged'
      )
    )
);

-- Evidence items attached to achievements.
create table if not exists public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,

  evidence_type text not null,
  title text not null,
  description text,
  source_url text,
  file_path text,
  file_name text,
  file_mime_type text,

  is_public boolean not null default false,

  created_at timestamptz not null default now(),

  constraint evidence_items_type_check
    check (
      evidence_type in (
        'certificate',
        'document',
        'image',
        'project_link',
        'publication_link',
        'social_post',
        'letter',
        'other'
      )
    )
);

-- Public proof identity for shareable proof cards and QR codes.
create table if not exists public.public_proof_links (
  id uuid primary key default gen_random_uuid(),
  achievement_id uuid not null unique references public.achievements(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,

  proof_code text not null unique,
  public_slug text not null unique,
  qr_target_url text,
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Audit trail for important user actions.
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  achievement_id uuid references public.achievements(id) on delete set null,

  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

-- Helpful indexes.
create index if not exists achievements_user_id_idx
  on public.achievements(user_id);

create index if not exists achievements_visibility_idx
  on public.achievements(visibility);

create index if not exists achievements_verification_status_idx
  on public.achievements(verification_status);

create index if not exists evidence_items_achievement_id_idx
  on public.evidence_items(achievement_id);

create index if not exists evidence_items_user_id_idx
  on public.evidence_items(user_id);

create index if not exists public_proof_links_proof_code_idx
  on public.public_proof_links(proof_code);

create index if not exists audit_logs_user_id_idx
  on public.audit_logs(user_id);

create index if not exists audit_logs_achievement_id_idx
  on public.audit_logs(achievement_id);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs(created_at desc);
  -- Enable Row Level Security.
alter table public.profiles enable row level security;
alter table public.achievements enable row level security;
alter table public.evidence_items enable row level security;
alter table public.public_proof_links enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles
create policy "Users can view public profile data"
on public.profiles
for select
using (true);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Achievements
create policy "Users can view their own achievements"
on public.achievements
for select
using (auth.uid() = user_id);

create policy "Public can view public achievements"
on public.achievements
for select
using (visibility = 'public');

create policy "Users can create their own achievements"
on public.achievements
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own achievements"
on public.achievements
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own achievements"
on public.achievements
for delete
using (auth.uid() = user_id);

-- Evidence Items
create policy "Users can view their own evidence"
on public.evidence_items
for select
using (auth.uid() = user_id);

create policy "Public can view public evidence"
on public.evidence_items
for select
using (is_public = true);

create policy "Users can create their own evidence"
on public.evidence_items
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own evidence"
on public.evidence_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own evidence"
on public.evidence_items
for delete
using (auth.uid() = user_id);

-- Public Proof Links
create policy "Users can view their own proof links"
on public.public_proof_links
for select
using (auth.uid() = user_id);

create policy "Public can view active proof links"
on public.public_proof_links
for select
using (is_active = true);

create policy "Users can create proof links for their own achievements"
on public.public_proof_links
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own proof links"
on public.public_proof_links
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Audit Logs
create policy "Users can view their own audit logs"
on public.audit_logs
for select
using (auth.uid() = user_id);

create policy "Users can create audit logs for themselves"
on public.audit_logs
for insert
with check (auth.uid() = user_id);
-- Automatically create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'ProofTrail user')
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();