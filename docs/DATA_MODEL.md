# ProofTrail Data Model

ProofTrail is designed around structured achievement records, supporting evidence, controlled public proof access, and audit-aware lifecycle tracking.

The data model is intentionally built around ownership, privacy boundaries, and record-level trust signals rather than simple public profiles.

## Core Entities

### profiles

A profile belongs to one authenticated user.

It stores user-facing identity fields such as:

* Full name
* Username
* Title
* Bio
* Avatar URL

Profiles are connected to Supabase authenticated users and are created automatically when a user signs up.

### achievements

An achievement is the core record inside a user's private vault.

It stores:

* User ownership
* Title
* Category
* Issuer or origin
* Achievement date
* Description / context
* Impact summary
* Visibility
* Verification status
* Created timestamp
* Updated timestamp

An achievement starts as a structured claim. It becomes stronger when the owner attaches evidence, links sources, and manages its proof lifecycle carefully.

Supported visibility states:

* `private`
* `unlisted`
* `public`

Supported verification status values:

* `claimed`
* `evidence_attached`
* `source_linked`
* `reviewed`
* `flagged`

ProofTrail should not imply that every achievement is independently verified. Status labels describe the record’s evidence state and lifecycle, not guaranteed external certification.

### evidence_items

Evidence items are supporting proof objects attached to achievement records.

They may represent:

* Source links
* Project links
* Certificates
* Publications
* Screenshots
* Letters
* Notes
* Other supporting references

Evidence items store:

* User ownership
* Achievement reference
* Evidence type
* Title
* Description
* Optional source URL
* Public/private evidence visibility
* Created timestamp

Evidence visibility is important.

A record can be public or unlisted, but individual evidence items still need to be marked public before they appear on a public proof card.

This allows the owner to share a proof identity without exposing every private evidence item.

### public_proof_links

A public proof link gives an achievement a shareable ProofTrail identity.

It powers:

* ProofTrail ID
* Public slug
* QR target URL
* Public proof page
* Active proof access
* Proof withdrawal
* Proof history

Public proof links store:

* User ownership
* Achievement reference
* Proof code
* Public slug
* QR target URL
* Active state
* Created timestamp
* Revoked timestamp

A record may have proof history, but only one active proof link should exist for a record at a time.

Withdrawn proof links remain stored for history, but they should not provide active public proof access.

### audit_logs

Audit logs record important lifecycle actions.

Audit entries may reference:

* User
* Achievement record
* Entity type
* Entity ID
* Action name
* Metadata
* Created timestamp

Current audit actions include:

* `achievement.created`
* `achievement.updated`
* `achievement.deleted`
* `evidence.added`
* `evidence.deleted`
* `proof_link.generated`
* `proof_link.deactivated`

Audit logs make the system feel closer to a real trust archive because important record changes are traceable over time.

## Important Relationships

### User to profile

Each authenticated user has one profile.

### User to achievements

Each achievement belongs to one user.

A user can have many achievement records.

### Achievement to evidence items

Each evidence item belongs to one achievement record.

An achievement can have many evidence items.

When an achievement is deleted, its related evidence items are removed through database behavior.

### Achievement to public proof links

Each public proof link belongs to one achievement record.

An achievement can have proof history, but only one active proof identity should exist at a time.

When an achievement is deleted, its related public proof links are removed through database behavior.

### User to audit logs

Audit logs belong to users and may reference achievement records.

Audit logs are used to preserve lifecycle activity around important actions.

## Public Proof Access Model

Public proof access is intentionally narrow.

A public proof card should only be visible when:

1. A public proof link exists.
2. The proof link is active.
3. The connected achievement exists.
4. The connected achievement visibility is `public` or `unlisted`.

If any of these conditions fail, the public proof page should show a controlled unavailable state instead of leaking private data.

## Public Evidence Filtering

Public proof cards should only show evidence items where:

* The evidence item belongs to the connected achievement.
* The evidence item is explicitly marked public.
* The achievement has an active public proof link.
* The achievement visibility allows public or unlisted access.

Private evidence must remain hidden from public proof pages.

This separation allows a user to maintain a private vault while selectively exposing only the evidence that is safe to share.

## Proof Withdrawal Model

Proof withdrawal does not delete the private achievement record.

When public proof access is withdrawn:

* The proof link becomes inactive.
* The revoked timestamp is recorded.
* The public proof page no longer displays the active proof.
* The proof identity remains visible inside the owner’s proof history.
* The private record remains available inside the vault.

This gives users control over public access without forcing them to delete private records.

## Row Level Security Expectations

ProofTrail relies on Supabase Row Level Security to protect private data.

Expected private access behavior:

* Users can only view their own private records.
* Users can only create records for themselves.
* Users can only update their own records.
* Users can only delete their own records.
* Users can only manage evidence for their own records.
* Users can only generate or withdraw proof links for their own records.
* Users can only view their own private audit logs.

Expected public access behavior:

* Public users can only view achievements with active proof links and allowed visibility.
* Public users can only view active proof links that point to public or unlisted records.
* Public users can only view evidence items explicitly marked public.
* Withdrawn proof links must not expose active public proof cards.

## Lifecycle Summary

A typical ProofTrail record lifecycle:

1. User creates an achievement record.
2. Record begins as a structured claim.
3. User adds supporting evidence.
4. Record status improves based on evidence state.
5. User optionally generates a public proof identity.
6. Public proof card exposes selected record details and public evidence only.
7. User may later withdraw public proof access.
8. Proof history and audit logs preserve lifecycle activity.

## Trust Principle

ProofTrail does not treat every claim as automatically verified.

The system should clearly communicate the difference between:

* A claimed record
* A record with attached evidence
* A record with source-linked evidence
* A record exposed through a public proof identity

The public proof page does not independently certify an achievement. It presents the structured record and public evidence so viewers can review the context and sources transparently.
