# ProofTrail Deployment Notes

ProofTrail has reached a stable deployed MVP checkpoint.

This document records the current deployment state, manual QA coverage, and known future priorities before the next major feature phase begins.

## Deployment Status

The application has been deployed and verified live.

Current deployment checkpoint:

- Local tests passing
- Production build passing
- Git working tree clean
- Remote branch synced
- Supabase project verified
- Vercel environment variables configured
- Live product QA completed

## Environment Variables

The Vercel deployment requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These values are configured through Vercel Environment Variables and should not be committed to the repository.

## Supabase Requirements

The deployed application depends on Supabase for:

- Authentication
- Database tables
- Row Level Security policies
- Public proof access rules
- Proof withdrawal behavior
- Audit logging

Required tables:

- `profiles`
- `achievements`
- `evidence_items`
- `public_proof_links`
- `audit_logs`

The `public_proof_links` table must include support for withdrawn proof links through `revoked_at`.

## Auth URL Configuration

Supabase Authentication must include the deployed Vercel URL in the allowed site and redirect configuration.

Required URL coverage:

- Local development URL
- Production Vercel URL
- Production wildcard redirect URL where applicable

## Manual QA Completed

The following live product flows have been tested:

- Home page loading
- Sign-up flow
- Sign-in flow
- Dashboard access
- Record creation
- Record editing
- Evidence attachment
- Public evidence visibility
- Public proof identity generation
- QR-backed proof card access
- Public proof page rendering
- Proof withdrawal
- Withdrawn proof unavailable state
- Evidence deletion
- Record deletion
- Dashboard state review
- Vault state review

## Current Stable Scope

The deployed MVP currently includes:

- Authenticated private vault
- Structured achievement records
- Evidence ledger
- Public/private evidence boundary
- Public ProofTrail IDs
- QR-backed public proof cards
- Proof withdrawal
- Proof history
- Audit timeline
- Dashboard trust events
- RLS-hardened access model
- Validation tests
- Production build stability
- Internal engineering documentation

## Known Future Roadmap

The following improvements are intentionally left for future phases:

- Default light theme
- Dark mode toggle
- Premium button system
- Media upload section for records
- Certificate and moment gallery
- Supabase Storage integration
- File-level public/private access rules
- Stronger accessibility review
- Broader server action tests
- More detailed audit metadata display
- Final public README expansion after completion

## Post-Deployment Principle

ProofTrail should not rush into visual or feature expansion until the current deployed foundation remains stable.

Future features should be added in a way that preserves:

- Trust
- Privacy
- Controlled access
- Auditability
- Evidence boundaries
- Production reliability