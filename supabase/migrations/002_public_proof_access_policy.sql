-- Allow public access to public/unlisted achievements only when an active proof link exists.

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