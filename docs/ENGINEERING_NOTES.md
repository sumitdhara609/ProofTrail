# ProofTrail Engineering Notes

ProofTrail is being developed as a structured trust-record system with a focus on authenticated access, evidence-backed records, public proof control, auditability, and production-quality engineering.

This document tracks the internal engineering direction of the project during development.

## Current System Scope

ProofTrail currently supports a private authenticated vault where users can create and manage structured achievement records. Each record can hold context, issuer details, dates, visibility settings, evidence items, audit events, and optional public proof identities.

The system is intentionally designed around controlled record lifecycle management rather than simple CRUD behavior.

## Core Capabilities Implemented

### Authentication

The application uses Supabase authentication for user sign-up, sign-in, and sign-out flows.

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

Records begin as private structured claims and can later become stronger through evidence and proof identity generation.

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

A record can generate a public ProofTrail identity when ready.

The public proof system includes:

* ProofTrail ID
* Public slug
* QR target URL
* QR code generation
* Public proof page
* Active/deactivated proof state

Public proof access is controlled through active proof links. Deactivated proof links are preserved in proof history but no longer provide active public access.

### QR-Backed Public Proof

Proof links generate QR-ready public URLs using server-side QR generation.

This gives each eligible record a shareable proof identity without exposing the private vault.

### Proof Withdrawal

Users can withdraw public proof access without deleting the private achievement record.

This supports a safer lifecycle:

* Keep private record
* Withdraw public access
* Preserve proof history
* Maintain audit trail

### Proof History

Each achievement dossier displays previous proof identities connected to that record.

The proof history shows:

* ProofTrail ID
* Created timestamp
* Active/deactivated state
* Revoked timestamp where available

This makes public proof identity feel controlled and auditable rather than disposable.

### Audit Logs

Important system actions create audit entries.

Current audit actions include:

* Evidence added
* Evidence removed
* Achievement updated
* Proof link generated
* Proof link deactivated
* Achievement deleted

Audit logs help establish record lifecycle transparency and make the system feel closer to a real trust archive.

### Deletion Workflows

ProofTrail avoids casual destructive actions.

Current deletion behavior includes:

* Evidence removal from dossier
* Full achievement removal through a dedicated confirmation page
* Ownership checks before destructive actions
* Audit event creation before full record deletion

The full achievement deletion page explains the consequence of removal and gives the user a clear way to keep the record.

## Data Model Overview

The project currently uses these main database tables:

* profiles
* achievements
* evidence_items
* public_proof_links
* audit_logs

The database is designed around authenticated ownership and record-level isolation.

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
* Users can only add/remove evidence for their own records.
* Users can only generate or withdraw proof links for their own records.
* Public users can only view records with active public proof links and allowed visibility.
* Deactivated proof links should not provide active public proof access.

## Server Action Pattern

Most mutations are handled through server actions.

Server actions generally follow this pattern:

1. Create Supabase server client.
2. Read authenticated user.
3. Redirect unauthenticated users.
4. Validate ownership.
5. Validate submitted input where needed.
6. Perform database mutation.
7. Insert audit event where appropriate.
8. Revalidate affected routes.
9. Redirect to the correct page.

This keeps mutation logic server-side and reduces client-side exposure.

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

The UI avoids casual dashboard language where possible and aims to feel deliberate, calm, and archival.

## Production Readiness Work Completed

The project now includes:

* Real authentication
* Protected routes
* Supabase-backed data model
* RLS-oriented architecture
* Server-side mutations
* Public proof pages
* QR code generation
* Audit logging
* Delete confirmation flow
* Public proof deactivation
* Proof history
* Polished dashboard
* Polished vault archive
* Product metadata
* Minimal public README during development

## Remaining Engineering Priorities

### Stronger Validation

Current validation exists for record and evidence creation. Future improvements should include broader validation consistency across all mutation flows.

### Better Error Handling

Some pages now display cleaner error banners. More routes should eventually use structured error states instead of raw query strings or generic redirects.

### Public Proof Hardening

Public proof pages should be tested carefully for:

* Deactivated links
* Private visibility
* Missing records
* Deleted records
* Invalid slugs
* Public evidence filtering

### Audit Log Refinement

Audit logs can later be improved with richer event labels, cleaner metadata display, and filtering by action type.

### Test Coverage

Future test coverage should include:

* Validation schemas
* Proof code generation
* QR generation safeguards
* Server action behavior where practical
* Public proof access rules
* Record lifecycle edge cases

### Accessibility Review

The UI should be reviewed for:

* Keyboard navigation
* Focus states
* Contrast
* Form labels
* Button clarity
* Error message accessibility

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
