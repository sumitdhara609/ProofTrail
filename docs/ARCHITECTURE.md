# ProofTrail Architecture

ProofTrail is built as a full-stack trust-record system using Next.js, Supabase, server actions, database-level access control, and a controlled public proof layer.

The architecture is designed around private vault ownership, structured evidence, public proof boundaries, and auditable record lifecycle events.

## High-Level Architecture

ProofTrail has four main layers:

1. Application interface
2. Server action layer
3. Supabase data layer
4. Public proof access layer

Each layer has a clear responsibility.

The application interface handles user flows and presentation.

The server action layer handles mutations, validation, authentication checks, ownership checks, audit logging, revalidation, and redirects.

The Supabase data layer stores users, records, evidence, proof links, and audit events with Row Level Security.

The public proof access layer exposes selected records through active proof identities while keeping private vault data hidden.

## Frontend Layer

The frontend is built with Next.js App Router.

Important route groups include:

* `/`
* `/sign-in`
* `/sign-up`
* `/dashboard`
* `/vault`
* `/vault/new`
* `/vault/[achievementId]`
* `/vault/[achievementId]/edit`
* `/vault/[achievementId]/delete`
* `/proof/[proofId]`

The UI uses a dark premium visual system with consistent language around:

* Vault
* Dossier
* Evidence ledger
* Trust timeline
* Proof identity
* Public proof
* Proof history

Most pages are server-rendered and read authenticated data directly through the Supabase server client.

## Authentication Architecture

ProofTrail uses Supabase Authentication.

Authentication flows include:

* Sign up
* Sign in
* Sign out

Private routes check the authenticated user on the server.

Unauthenticated users are redirected to `/sign-in`.

Protected areas include:

* Dashboard
* Vault archive
* New record creation
* Record dossier
* Record editing
* Record deletion confirmation

Authentication is intentionally handled server-side for private route protection.

## Supabase Client Architecture

ProofTrail uses separate Supabase clients for different environments.

The client-side Supabase client is used where browser-side access is needed.

The server-side Supabase client is used inside server-rendered pages and server actions.

This separation keeps authenticated server logic closer to the data layer and reduces unnecessary client exposure.

## Server Action Architecture

Most mutations are handled through server actions.

Important server actions include:

* Creating achievement records
* Updating achievement records
* Deleting achievement records
* Adding evidence
* Removing evidence
* Generating public proof identities
* Withdrawing public proof access
* Signing in
* Signing up
* Signing out

The common server action pattern is:

1. Create Supabase server client.
2. Read authenticated user.
3. Redirect unauthenticated users.
4. Validate submitted input.
5. Validate record ownership.
6. Perform database mutation.
7. Insert audit event when appropriate.
8. Revalidate affected routes.
9. Redirect to the correct page.

This keeps mutation logic centralized, server-side, and easier to harden.

## Data Layer

The main database tables are:

* `profiles`
* `achievements`
* `evidence_items`
* `public_proof_links`
* `audit_logs`

The data model is centered around authenticated ownership.

Achievement records belong to users.

Evidence items belong to users and achievement records.

Public proof links belong to users and achievement records.

Audit logs belong to users and may reference achievement records.

## Row Level Security

ProofTrail relies on Supabase Row Level Security to protect private vault data.

Private access expectations:

* Users can only read their own records.
* Users can only create records for themselves.
* Users can only update their own records.
* Users can only delete their own records.
* Users can only manage evidence attached to their own records.
* Users can only generate or withdraw proof links for their own records.
* Users can only view their own audit logs.

Public access expectations:

* Public users can only view achievements connected to active proof links.
* Public users can only view achievements with `public` or `unlisted` visibility.
* Public users can only view active proof links.
* Public users can only view evidence items explicitly marked public.
* Withdrawn proof links should not expose active proof cards.

## Public Proof Architecture

Public proof cards are served through:

* `/proof/[proofId]`

A public proof page is only active when:

1. The proof link exists.
2. The proof link is active.
3. The connected achievement exists.
4. The connected achievement visibility is `public` or `unlisted`.

If any condition fails, the page returns a controlled unavailable state.

Unavailable states include:

* Invalid proof identity
* Withdrawn proof identity
* Record unavailable
* Access restricted

This avoids leaking private vault data through public routes.

## Public Evidence Boundary

Public proof cards only show evidence items explicitly marked as public.

This means:

* Private evidence remains hidden.
* Private vault records remain hidden.
* Only selected evidence appears publicly.
* Public proof cards do not expose the full evidence ledger.

This boundary is central to ProofTrail’s privacy model.

## QR Proof Architecture

ProofTrail generates QR-ready public proof URLs.

A proof link stores:

* ProofTrail ID
* Public slug
* QR target URL
* Active state
* Created timestamp
* Revoked timestamp where applicable

QR codes point to active public proof cards.

If public proof access is later withdrawn, the QR target no longer displays the active proof card.

## Proof History Architecture

ProofTrail supports proof history.

A record may have previous proof identities, but only one active proof identity should exist at a time.

Withdrawn proof links remain visible inside the owner’s dossier history.

This supports traceability without keeping old public access open.

## Audit Architecture

Important lifecycle actions create audit logs.

Current audit events include:

* Record created
* Record updated
* Record deleted
* Evidence added
* Evidence removed
* Public proof generated
* Public proof withdrawn

Audit logs support the trust timeline shown inside the record dossier and the recent trust events shown on the dashboard.

## Validation Architecture

ProofTrail includes validation for key mutation flows.

Current validation coverage includes:

* Achievement creation
* Achievement update
* Evidence creation
* Proof code utilities
* Formatting helpers
* Audit label helpers

Validation runs before database mutation where practical.

The goal is to keep malformed input away from the database and produce safer server actions.

## Testing Architecture

The current test setup uses Vitest.

Current tests cover:

* Proof code generation
* Proof formatting helpers
* Audit label helpers
* Achievement validation
* Evidence validation

The current test suite verifies the core utility and validation layer.

Future test expansion should focus on lifecycle and access-control behavior.

## Build Architecture

The application builds through Next.js production build.

The build validates:

* Route compilation
* TypeScript correctness
* Server-rendered routes
* Static route generation
* Production optimization

A passing production build is treated as a required checkpoint before important commits.

## Current Architecture Strengths

ProofTrail currently has:

* Real authentication
* Private authenticated vault
* Supabase-backed data model
* Row Level Security design
* Server-side mutations
* Ownership checks
* Evidence ledger
* Public proof identities
* QR-backed proof access
* Proof withdrawal
* Proof history
* Audit logs
* Polished public proof page
* Validation layer
* Test foundation
* Passing production build

## Future Architecture Priorities

Future improvements should focus on:

* Broader server action tests
* Stronger access-control tests
* More detailed audit metadata display
* Better structured error mapping
* Accessibility review
* Deployment hardening
* Production Supabase policy verification
* Public proof edge-case testing

## Architecture Principle

ProofTrail should stay architecture-first.

Every feature should strengthen at least one of these areas:

* Trust
* Evidence
* Privacy
* Controlled access
* Auditability
* Record lifecycle maturity
* Backend reliability
* Production readiness
