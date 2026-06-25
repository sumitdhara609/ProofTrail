# ProofTrail Engineering Notes

ProofTrail is being developed as a structured trust-record system focused on authenticated access, evidence-backed records, controlled public proof access, auditability, and production-quality engineering.

This document tracks the internal engineering direction of the project during development.

## Current System Scope

ProofTrail currently supports a private authenticated vault where users can create and manage structured achievement records. Each record can hold context, issuer details, dates, visibility settings, evidence items, audit events, and optional public proof identities.

The system is intentionally designed around controlled record lifecycle management rather than simple CRUD behavior.

## Core Capabilities Implemented

### Authentication

The application uses Supabase Authentication for sign-up, sign-in, and sign-out flows.

Authenticated routes protect private areas such as:

* Dashboard
* Vault archive
* New record creation
* Record dossier pages
* Record edit pages
* Record deletion confirmation pages

Unauthenticated users are redirected to sign-in before accessing private vault features.

### Achievement Records

Users can create structured achievement records with:

* Title
* Category
* Issuer or origin
* Achievement date
* Context
* Impact summary
* Visibility
* Verification status

Records begin as structured private claims and can become stronger through evidence attachment, lifecycle tracking, and optional public proof identity generation.

### Evidence Ledger

Each achievement record can have supporting evidence items attached.

Evidence items currently support:

* Evidence type
* Title
* Description
* Optional source URL
* Public/private evidence visibility

Adding evidence updates the record’s verification status when appropriate.

Evidence items can also be removed through a controlled server action with ownership checks.

### Public Proof Identity

A record can generate a public ProofTrail identity when it is ready for controlled sharing.

The public proof system includes:

* ProofTrail ID
* Public slug
* QR target URL
* QR code generation
* Public proof page
* Active/withdrawn proof state
* Proof history

Public proof access is controlled through active proof links. Withdrawn proof links are preserved in proof history but no longer provide active public access.

### QR-Backed Public Proof

Proof links generate QR-ready public URLs using server-side QR generation.

This gives selected records a shareable proof identity without exposing the private vault.

### Proof Withdrawal

Users can withdraw public proof access without deleting the private achievement record.

This supports a safer lifecycle:

* Keep the private record
* Withdraw public access
* Preserve proof history
* Maintain audit trail

### Proof History

Each achievement dossier displays previous proof identities connected to that record.

The proof history shows:

* ProofTrail ID
* Created timestamp
* Active/withdrawn state
* Revoked timestamp where available

This makes public proof identity controlled and auditable rather than disposable.

### Audit Logs

Important system actions create audit entries.

Current audit actions include:

* Record created
* Evidence added
* Evidence removed
* Record updated
* Public proof generated
* Public proof withdrawn
* Record deleted

Audit logs help establish record lifecycle transparency and make the system closer to a real trust archive.

### Deletion Workflows

ProofTrail avoids casual destructive actions.

Current deletion behavior includes:

* Evidence removal from the dossier
* Full achievement removal through a dedicated confirmation page
* Ownership checks before destructive actions
* Audit event creation before full record deletion
* Clear destructive-action copy on the confirmation page

The full achievement deletion page explains the consequence of removal and gives the user a clear way to keep the record.

## Data Model Overview

The project currently uses these main database tables:

* profiles
* achievements
* evidence_items
* public_proof_links
* audit_logs

The database is designed around authenticated ownership, record-level isolation, and controlled public access.

### Important Relationships

Achievement records belong to users.

Evidence items belong to both users and achievement records.

Public proof links belong to users and achievement records.

Audit logs belong to users and may reference achievement records.

When an achievement is deleted, related evidence and proof links are removed through database behavior, while audit history can remain useful for account-level activity tracking.

## Access Control Expectations

ProofTrail relies on Supabase Row Level Security policies to ensure users only access their own private records.

Expected access behavior:

* Users can only view their own private vault records.
* Users can only edit their own records.
* Users can only add or remove evidence for their own records.
* Users can only generate or withdraw proof links for their own records.
* Public users can only view records with active public proof links and allowed visibility.
* Public users can only view evidence explicitly marked as public.
* Withdrawn proof links should not provide active public proof access.

## Server Action Pattern

Most mutations are handled through server actions.

Server actions generally follow this pattern:

1. Create Supabase server client.
2. Read authenticated user.
3. Redirect unauthenticated users.
4. Validate submitted input where needed.
5. Validate ownership.
6. Perform database mutation.
7. Insert audit event where appropriate.
8. Revalidate affected routes.
9. Redirect to the correct page.

This keeps mutation logic server-side and reduces client-side exposure.

## Validation Layer

ProofTrail includes validation for record and evidence inputs.

Current validation coverage includes:

* Achievement creation input
* Achievement update input
* Evidence creation input
* Proof code formatting tests
* Display-format helper tests
* Audit label helper tests

Validation helps keep server actions safer and keeps malformed data away from the database layer.

## Current UI Philosophy

ProofTrail’s interface is intentionally designed as a premium record system.

Core UI language:

* Vault
* Dossier
* Evidence ledger
* Trust timeline
* Proof identity
* Proof history
* Public proof
* Withdraw public proof
* Remove evidence

The UI avoids casual dashboard language where possible and aims to feel deliberate, calm, archival, and privacy-aware.

## Production Readiness Work Completed

The project now includes:

* Real authentication
* Protected routes
* Supabase-backed data model
* RLS-oriented architecture
* RLS policy hardening
* Server-side mutations
* Public proof pages
* QR code generation
* Audit logging
* Delete confirmation flow
* Public proof withdrawal
* Proof history
* Polished landing page
* Polished dashboard
* Polished vault archive
* Polished record dossier
* Polished public proof page
* Polished auth states
* Polished empty/error states
* Product metadata
* Minimal public README during development
* Unit tests for proof utilities, audit labels, formatting, and validation
* Passing production build

## Remaining Engineering Priorities

### Broader Validation Consistency

Current validation covers the main record and evidence flows. Future improvements can include broader validation consistency across every mutation path and more explicit error mapping.

### Server Action Test Strategy

Server action behavior should be tested where practical.

Important areas include:

* Ownership checks
* Invalid form submissions
* Proof generation edge cases
* Proof withdrawal edge cases
* Delete behavior
* Revalidation and redirect behavior

### Public Proof Access Tests

Public proof pages should continue to be tested carefully for:

* Withdrawn links
* Private visibility
* Missing records
* Deleted records
* Invalid slugs
* Public evidence filtering

### Audit Log Refinement

Audit logs can later be improved with:

* Richer metadata display
* Filtering by action type
* Better record-level timeline grouping
* More detailed before/after change summaries where appropriate

### Accessibility Review

The UI should be reviewed for:

* Keyboard navigation
* Focus states
* Contrast
* Form labels
* Button clarity
* Error message accessibility
* Screen-reader behavior for destructive actions

### Deployment Readiness

Before final public deployment, verify:

* Environment variables
* Supabase production policies
* Public proof routes
* Build output
* Metadata
* Auth redirects
* Database migrations
* Empty states
* Error states
* Public/private evidence behavior
* Proof withdrawal behavior

## Development Principle

ProofTrail should continue to be developed as a serious engineering project, not as a quick showcase.

Each feature should strengthen at least one of these areas:

* Trust
* Evidence
* Privacy
* Auditability
* Controlled access
* Record lifecycle maturity
* Backend reliability
* Production readiness
