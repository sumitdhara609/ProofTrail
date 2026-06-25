-- ProofTrail RLS + proof lifecycle hardening
-- Keeps private vault data private while allowing controlled public proof cards.

-- Add revoked_at for withdrawn proof links.
alter table public.public_proof_links
add column if not exists revoked_at timestamptz;

-- Allow proof history by removing the original one-proof-link-ever constraint.
alter table public.public_proof_links
drop constraint if exists public_proof_links_achievement_id_key;

-- Allow only one active proof link per achievement at a time.
create unique index if not exists public_proof_links_one_active_per_achievement_idx
on public.public_proof_links (achievement_id)
where is_active = true;

-- Useful lookup indexes.
create index if not exists public_proof_links_public_slug_idx
on public.public_proof_links(public_slug);

create index if not exists public_proof_links_active_slug_idx
on public.public_proof_links(public_slug, is_active);

create index if not exists evidence_items_public_lookup_idx
on public.evidence_items(achievement_id, is_public);

-- Remove overly broad public policies from the initial MVP schema.
drop policy if exists "Public can view public achievements"
on public.achievements;

drop policy if exists "Public can view public evidence"
on public.evidence_items;

drop policy if exists "Public can view active proof links"
on public.public_proof_links;

-- Public can view only records that are intentionally exposed through
-- an active ProofTrail proof identity.
create policy "Public can view achievements with active proof links"
on public.achievements
for select
using (
  visibility in ('public', 'unlisted')
  and exists (
    select 1
    from public.public_proof_links
    where public_proof_links.achievement_id = achievements.id
      and public_proof_links.is_active = true
  )
);

-- Public can view only evidence that is explicitly marked public AND belongs
-- to a record with an active public proof identity.
create policy "Public can view evidence for active proof cards"
on public.evidence_items
for select
using (
  is_public = true
  and exists (
    select 1
    from public.achievements
    join public.public_proof_links
      on public.public_proof_links.achievement_id = public.achievements.id
    where public.achievements.id = evidence_items.achievement_id
      and public.achievements.visibility in ('public', 'unlisted')
      and public.public_proof_links.is_active = true
  )
);

-- Public can read active proof link rows only when the connected achievement
-- is intentionally public/unlisted.
create policy "Public can view active proof links for public proof cards"
on public.public_proof_links
for select
using (
  is_active = true
  and exists (
    select 1
    from public.achievements
    where achievements.id = public_proof_links.achievement_id
      and achievements.visibility in ('public', 'unlisted')
  )
);