-- ProofTrail Phase 18
-- Private storage bucket for media evidence

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'proof-evidence',
  'proof-evidence',
  false,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ];

-- Remove older versions of these policies if this migration is re-run manually.
drop policy if exists "Users can upload their own proof evidence files"
on storage.objects;

drop policy if exists "Users can view their own proof evidence files"
on storage.objects;

drop policy if exists "Users can update their own proof evidence files"
on storage.objects;

drop policy if exists "Users can delete their own proof evidence files"
on storage.objects;

-- File path convention:
-- proof-evidence/{user_id}/{achievement_id}/{filename}
--
-- The first folder must match auth.uid().
-- This prevents one user from reading, writing, or deleting another user's files.

create policy "Users can upload their own proof evidence files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'proof-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view their own proof evidence files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'proof-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own proof evidence files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'proof-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'proof-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own proof evidence files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'proof-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);