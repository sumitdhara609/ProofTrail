-- ProofTrail Phase 18
-- Media evidence metadata hardening

alter table public.evidence_items
add column if not exists file_size_bytes bigint;

alter table public.evidence_items
add column if not exists storage_bucket text;

alter table public.evidence_items
add constraint evidence_items_file_size_check
check (
  file_size_bytes is null
  or (
    file_size_bytes > 0
    and file_size_bytes <= 5242880
  )
);

create index if not exists evidence_items_file_path_idx
on public.evidence_items(file_path);

create index if not exists evidence_items_storage_bucket_idx
on public.evidence_items(storage_bucket);