# ProofTrail 🛡️

### Personal Achievement Verification Vault

<p align="center">
  <img src="docs/screenshots/02-home-dark.png" alt="ProofTrail dark mode hero preview" width="100%" />
</p>

<p align="center">
  <strong>A private-first proof identity system for preserving achievements with evidence, context, and controlled public visibility.</strong>
</p>

<p align="center">
  ProofTrail transforms certificates, awards, publications, projects, competitions, and meaningful milestones into structured evidence-backed records — then allows users to publish selected QR-backed proof pages only when the record is ready.
</p>

<p align="center">
  <a href="https://prooftrail-three.vercel.app/"><strong>Live Demo</strong></a>
  ·
  <a href="#-visual-product-walkthrough"><strong>Visual Walkthrough</strong></a>
  ·
  <a href="#-product-philosophy"><strong>Philosophy</strong></a>
  ·
  <a href="#-technical-architecture"><strong>Architecture</strong></a>
  ·
  <a href="#-local-development"><strong>Local Development</strong></a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Auth%20%7C%20Database%20%7C%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel" />
</p>

---

## ✦ Table of Contents

* [Product Vision](#-product-vision)
* [Product Philosophy](#-product-philosophy)
* [Build Timeline](#-build-timeline-)
* [Visual Product Walkthrough](#-visual-product-walkthrough)
* [Core Features](#-core-features-)
* [Product System](#-product-system-)
* [User Flow](#-user-flow)
* [Privacy Model](#-privacy-model-)
* [Technical Architecture](#-technical-architecture-)
* [Engineering Highlights](#-engineering-highlights-)
* [File Structure](#-file-structure-)
* [Tech Stack](#-tech-stack-)
* [Quality & Testing](#-quality--testing-)
* [Local Development](#-local-development-)
* [Roadmap](#-roadmap-)
* [License](#-license-)
* [Author](#-author)

---

## ✦ Product Vision

Most achievements are easy to claim but difficult to preserve properly.

A certificate may sit in a downloads folder.
A project may live inside a repository.
A publication record may be scattered across a third-party page.
A competition result may exist only as a screenshot.
A meaningful milestone may have no organized proof trail at all.

**ProofTrail** solves this by turning achievements into structured, evidence-backed records.

It is not a public bragging wall.
It is not only a certificate gallery.
It is not a simple file uploader.

It is a **private achievement verification vault** designed around one serious principle:

> Preserve the full record privately.
> Review the evidence carefully.
> Share only what deserves to become public proof.

ProofTrail gives achievements a place where they can be stored with context, supported with evidence, protected by default, and shared with dignity when ready.

---

## ✦ Product Philosophy

### Preserve privately.

Every achievement begins inside the vault. Records, files, notes, source links, and supporting evidence stay private by default.

### Review carefully.

The user can inspect the record, evidence, media preview, source notes, public labels, proof identity state, and audit history before allowing anything to become public.

### Share selectively.

Public proof pages are controlled excerpts. They show only selected public evidence, approved context, QR-backed proof identity, and a verification note.

**Public proof is not the whole vault.**
It is a deliberate, reviewable, public-facing proof card.

---

## ✦ Build Timeline ⏳

ProofTrail was built over a realistic **3-month development cycle**.

This was not a weekend prototype. It involved product thinking, backend design, privacy modeling, authenticated workflows, storage handling, public proof routing, QR-backed identity generation, UI polish, testing, deployment, and final documentation.

| Phase   | Focus                                                                                        | Outcome                              |
| ------- | -------------------------------------------------------------------------------------------- | ------------------------------------ |
| Month 1 | Product concept, vault model, authentication, Supabase schema, early record system           | Core private vault foundation        |
| Month 2 | Evidence model, protected routes, public proof logic, QR identity, storage handling          | Functional proof and evidence system |
| Month 3 | UI refinement, dashboard polish, privacy hardening, testing, deployment, screenshots, README | Polished public-ready product        |

The final version includes:

* authenticated user access,
* private achievement records,
* evidence uploads,
* Supabase-backed storage,
* public/private visibility control,
* QR-backed proof identities,
* public proof pages,
* audit activity,
* polished light/dark UI,
* testing,
* deployment,
* and full visual documentation.

---

## ✦ Why ProofTrail Matters

ProofTrail explores a real-world problem: **credibility without chaos**.

People increasingly need ways to show proof of achievements, but most platforms focus only on display. ProofTrail focuses on the layer before display — the private, structured, evidence-backed archive that makes public proof meaningful.

It is useful for:

* students preserving certificates and awards,
* developers documenting projects and achievements,
* authors storing publication milestones,
* creators organizing media-backed proof,
* photographers preserving exhibition records,
* competition participants archiving results,
* and anyone who wants proof with context instead of scattered files.

ProofTrail is built for people who want their work to be represented carefully — not casually.

---

## ✦ Product Snapshot

| Area           | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| Product Type   | Full-stack private achievement verification vault                           |
| Core Idea      | Evidence-backed achievement records with controlled public proof            |
| Access Model   | Authenticated private vault + public proof pages                            |
| Evidence Model | Files, links, notes, certificates, screenshots, PDFs, and source references |
| Public Sharing | QR-backed proof identity with selected public evidence                      |
| Privacy Rule   | Private by default; public only by deliberate selection                     |
| Build Timeline | 3-month focused product cycle                                               |
| Deployment     | Vercel                                                                      |
| Backend        | Supabase Auth, Database, and Storage                                        |

---

## ✦ Visual Product Walkthrough

### 01 — Product First Impression

<p align="center">
  <img src="docs/screenshots/01-landing-hero-light.png" alt="ProofTrail landing page light mode" width="49%" />
  <img src="docs/screenshots/02-home-dark.png" alt="ProofTrail landing page dark mode" width="49%" />
</p>

<p align="center">
  <em>A calm, premium, private-first entry point for achievements that deserve evidence, context, and dignity.</em>
</p>

---

### 02 — Private by Default

<p align="center">
  <img src="docs/screenshots/03-principles-private-by-default.png" alt="ProofTrail private by default principle section" width="100%" />
</p>

<p align="center">
  <em>ProofTrail makes the product rule clear: evidence does not become public accidentally.</em>
</p>

---

### 03 — Authentication & Vault Entry

<p align="center">
  <img src="docs/screenshots/06-auth-create-vault.png" alt="ProofTrail create vault screen" width="49%" />
  <img src="docs/screenshots/05-auth-sign-in.png" alt="ProofTrail sign in screen" width="49%" />
</p>

<p align="center">
  <em>Users can create a private proof vault or securely return to an existing archive through a polished authentication experience.</em>
</p>

---

### 04 — Private Vault Archive

<p align="center">
  <img src="docs/screenshots/07-vault-archive-overview.png" alt="ProofTrail vault archive overview" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/08-vault-record-index.png" alt="ProofTrail record index inside vault archive" width="100%" />
</p>

<p align="center">
  <em>The vault archive organizes achievements by evidence count, media support, visibility state, and public proof readiness.</em>
</p>

---

### 05 — Dashboard Command Center

<p align="center">
  <img src="docs/screenshots/09-dashboard-overview.png" alt="ProofTrail dashboard overview" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/10-dashboard-review-guidance.png" alt="ProofTrail dashboard review guidance" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/11-dashboard-activity-recent-records.png" alt="ProofTrail dashboard activity and recent records" width="100%" />
</p>

<p align="center">
  <em>The dashboard acts as a command center for vault health, evidence status, proof identity activity, and trust events.</em>
</p>

---

### 06 — Create Record Flow

<p align="center">
  <img src="docs/screenshots/12-create-record-intro.png" alt="ProofTrail create record introduction" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/13-create-record-flow.png" alt="ProofTrail certificate entry flow" width="49%" />
  <img src="docs/screenshots/14-create-record-guidelines.png" alt="ProofTrail record naming and privacy guidance" width="49%" />
</p>

<p align="center">
  <img src="docs/screenshots/15-create-record-form-top.png" alt="ProofTrail create record form top" width="49%" />
  <img src="docs/screenshots/16-create-record-form-bottom.png" alt="ProofTrail create record form bottom" width="49%" />
</p>

<p align="center">
  <em>Record creation begins with structured metadata, context, issuer, date, visibility, and impact — before public proof is even considered.</em>
</p>

---

### 07 — Record Dossier

<p align="center">
  <img src="docs/screenshots/17-record-dossier-proof-identity.png" alt="ProofTrail record dossier with active proof identity" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/18-record-details.png" alt="ProofTrail record details section" width="100%" />
</p>

<p align="center">
  <em>Each achievement becomes a dossier containing the record story, evidence metrics, QR-backed proof identity, and controlled public access state.</em>
</p>

---

### 08 — Evidence Intake

<p align="center">
  <img src="docs/screenshots/19-evidence-intake-overview.png" alt="ProofTrail evidence intake overview" width="49%" />
  <img src="docs/screenshots/20-evidence-intake-upload-note.png" alt="ProofTrail evidence upload form and note" width="49%" />
</p>

<p align="center">
  <img src="docs/screenshots/21-evidence-intake-safety-workflow.png" alt="ProofTrail evidence visibility safety workflow" width="100%" />
</p>

<p align="center">
  <em>Evidence intake supports certificates, PDFs, images, source URLs, notes, and supporting references while keeping files private by default.</em>
</p>

---

### 09 — Evidence Ledger

<p align="center">
  <img src="docs/screenshots/22-evidence-ledger-overview.png" alt="ProofTrail evidence ledger overview" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/23-evidence-ledger-author-photo.png" alt="ProofTrail image evidence in ledger" width="49%" />
  <img src="docs/screenshots/24-evidence-ledger-certificate.png" alt="ProofTrail certificate evidence in ledger" width="49%" />
</p>

<p align="center">
  <em>The evidence ledger presents attached proof inside a structured review frame with clear public/private visibility labels.</em>
</p>

---

### 10 — Public Proof Page

<p align="center">
  <img src="docs/screenshots/25-public-proof-overview.png" alt="ProofTrail public proof page overview" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/26-public-proof-evidence-photo.png" alt="ProofTrail public proof photo evidence" width="49%" />
  <img src="docs/screenshots/27-public-proof-evidence-certificate.png" alt="ProofTrail public proof certificate evidence" width="49%" />
</p>

<p align="center">
  <em>Public proof pages expose only the selected evidence, public context, QR-backed proof identity, and verification note.</em>
</p>

---

### 11 — Proof History

<p align="center">
  <img src="docs/screenshots/29-proof-history.png" alt="ProofTrail proof history" width="100%" />
</p>

<p align="center">
  <em>Proof history helps track public proof identity creation and active controlled-access states.</em>
</p>

---

### 12 — Brand Identity

<p align="center">
  <img src="docs/screenshots/30-footer-brand-identity.png" alt="ProofTrail brand identity footer" width="100%" />
</p>

<p align="center">
  <em>ProofTrail is shaped as a premium proof identity system built around evidence, context, and controlled public visibility.</em>
</p>

---

## ✦ Core Features 🚀

### 🗂️ Private Achievement Vault

Create structured records for:

* certificates,
* awards,
* publications,
* projects,
* competitions,
* academic milestones,
* leadership roles,
* creative achievements,
* and personal proof-worthy accomplishments.

Each record can include:

* title,
* category,
* issuer or origin,
* achievement date,
* visibility state,
* context,
* impact summary,
* evidence count,
* media count,
* public evidence count,
* and proof identity status.

---

### 📎 Evidence Management

Attach supporting evidence through:

* certificate images,
* PDF documents,
* screenshots,
* source URLs,
* publication pages,
* project references,
* award links,
* notes,
* and contextual proof descriptions.

Evidence can remain private or be selected for public proof pages.

---

### 🔐 Private-first Visibility

ProofTrail is designed to prevent accidental exposure.

By default:

* records remain private,
* uploaded files remain private,
* evidence items are not public automatically,
* file metadata is hidden from public proof pages,
* and only approved public evidence is shown.

Public proof is a selected excerpt, not the entire vault.

---

### 🪪 Public Proof Identity

For records ready to share, ProofTrail can generate a public proof identity with:

* ProofTrail ID,
* public slug,
* QR-backed access,
* public record context,
* selected evidence,
* visible impact summary,
* and verification note.

A user can withdraw public access without deleting the original private record.

---

### 📱 QR-backed Proof Pages

Each active public proof page includes QR-backed access.

This makes ProofTrail suitable for:

* portfolio proof,
* certificate cards,
* printed proof sheets,
* public achievement pages,
* project showcases,
* creator proof pages,
* and shareable credibility records.

---

### 🧾 Audit Activity

ProofTrail records important trust events, including:

* record creation,
* evidence attachment,
* evidence updates,
* public proof generation,
* public proof withdrawal,
* and record deletion.

This gives the vault a traceable internal activity layer.

---

### 🌓 Light & Dark Experience

ProofTrail includes a polished light/dark interface system with persistent theme handling.

The UI is designed to feel:

* calm,
* premium,
* minimal,
* serious,
* readable,
* and product-focused.

---

## ✦ Product System 🧠

ProofTrail is built around four core product entities:

| Product Entity         | Role                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| **Achievement Record** | The main private record containing the achievement claim, issuer, date, context, and impact     |
| **Evidence Item**      | Supporting proof such as files, links, notes, certificates, images, PDFs, and source references |
| **Public Proof Link**  | A controlled public identity that exposes selected proof through a public slug and QR code      |
| **Audit Event**        | A trust timeline event showing important record, evidence, and proof activity                   |

---

## ✦ User Flow

```txt
Create account
    ↓
Enter private vault
    ↓
Create achievement record
    ↓
Attach evidence privately
    ↓
Review context, files, and visibility
    ↓
Generate public proof identity
    ↓
Share selected QR-backed public proof page
```

---

## ✦ Privacy Model 🔒

ProofTrail follows a strict private-first model.

Public proof pages can show:

* selected public evidence,
* approved public context,
* public impact summary,
* proof identity,
* QR access,
* source links,
* and a verification note.

Public proof pages do **not** show:

* private evidence,
* hidden vault records,
* unapproved files,
* raw storage paths,
* private file names,
* MIME types,
* file sizes,
* or full private vault metadata.

This protects the private archive while still allowing meaningful public proof.

---

## ✦ Verification Disclaimer ⚠️

ProofTrail does not independently certify achievements.

It provides a structured way to present a record and its supporting evidence so viewers can review the context, sources, and public proof material transparently.

ProofTrail is an evidence organization and proof presentation system — not a third-party certifying authority.

---

## ✦ Technical Architecture 🏗️

ProofTrail is a full-stack web application with authenticated private routes, public proof pages, private evidence storage, server-side data access, and structured public visibility rules.

### Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* Responsive interface design
* Server components
* Client components where interactivity is needed
* Reusable layout, card, button, form, frame, and theme components
* Premium light/dark visual system

### Backend

* Supabase Auth
* Supabase PostgreSQL
* Supabase Storage
* Server actions
* Protected vault routes
* Public proof routes
* Private evidence storage
* Signed media preview URLs
* Audit activity persistence

### Product Infrastructure

* QR code generation
* Public proof slug routing
* Private evidence bucket
* Evidence visibility controls
* Proof identity generation
* Public proof withdrawal
* Vercel deployment

---

## ✦ Engineering Highlights ⚙️

* Authenticated private vault experience
* Supabase-backed user record ownership
* Public/private evidence visibility separation
* QR-backed public proof identity system
* Protected evidence upload flow
* Public proof route that exposes only selected data
* Audit activity for important trust events
* Premium responsive UI with light/dark mode
* Full screenshot-driven documentation
* Production deployment on Vercel
* Tested build workflow

---

## ✦ File Structure 📁

```txt
prooftrail/
├── app/
│   ├── auth/
│   │   └── actions.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── proof/
│   │   └── [proofId]/
│   │       └── page.tsx
│   ├── sign-in/
│   │   └── page.tsx
│   ├── sign-up/
│   │   └── page.tsx
│   ├── vault/
│   │   ├── [achievementId]/
│   │   │   ├── edit/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── certificates/
│   │   └── CertificateFrame.tsx
│   ├── theme/
│   │   └── ThemeToggle.tsx
│   └── vault/
│       └── AddEvidenceForm.tsx
│
├── docs/
│   └── screenshots/
│       ├── 01-landing-hero-light.png
│       ├── 02-home-dark.png
│       ├── 03-principles-private-by-default.png
│       ├── 05-auth-sign-in.png
│       ├── 06-auth-create-vault.png
│       ├── 07-vault-archive-overview.png
│       ├── 08-vault-record-index.png
│       ├── 09-dashboard-overview.png
│       ├── 10-dashboard-review-guidance.png
│       ├── 11-dashboard-activity-recent-records.png
│       ├── 12-create-record-intro.png
│       ├── 13-create-record-flow.png
│       ├── 14-create-record-guidelines.png
│       ├── 15-create-record-form-top.png
│       ├── 16-create-record-form-bottom.png
│       ├── 17-record-dossier-proof-identity.png
│       ├── 18-record-details.png
│       ├── 19-evidence-intake-overview.png
│       ├── 20-evidence-intake-upload-note.png
│       ├── 21-evidence-intake-safety-workflow.png
│       ├── 22-evidence-ledger-overview.png
│       ├── 23-evidence-ledger-author-photo.png
│       ├── 24-evidence-ledger-certificate.png
│       ├── 25-public-proof-overview.png
│       ├── 26-public-proof-evidence-photo.png
│       ├── 27-public-proof-evidence-certificate.png
│       ├── 29-proof-history.png
│       └── 30-footer-brand-identity.png
│
├── lib/
│   └── supabase/
│
├── public/
│
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
└── eslint.config.mjs
```

---

## ✦ Tech Stack 🧰

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Framework      | Next.js                     |
| Language       | TypeScript                  |
| Styling        | Tailwind CSS                |
| Authentication | Supabase Auth               |
| Database       | Supabase PostgreSQL         |
| Storage        | Supabase Storage            |
| Deployment     | Vercel                      |
| Testing        | Vitest / project test suite |
| QR             | QR code generation utility  |

---

## ✦ Quality & Testing 🧪

The product was tested through the standard project workflow:

```bash
npm run test
npm run build
```

The final polished version was checked across:

* local development,
* production build,
* authenticated dashboard routes,
* private vault routes,
* record creation flow,
* evidence upload flow,
* public proof page rendering,
* QR-backed public proof access,
* light/dark mode,
* screenshot documentation,
* and live deployment.

---

## ✦ Local Development 🛠️

Clone the repository:

```bash
git clone https://github.com/sumitdhara609/ProofTrail.git
cd ProofTrail
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env.local
```

Add the required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

Run the development server:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

Create a production build:

```bash
npm run build
```

---

## ✦ Suggested Supabase Setup 🧱

ProofTrail expects Supabase configuration for:

* user authentication,
* achievement records,
* evidence items,
* public proof links,
* audit events,
* private evidence storage,
* and policies that prevent accidental public file exposure.

A private storage bucket is recommended for evidence files.

Public proof pages should rely on selected public evidence and controlled preview access instead of exposing raw vault storage.

---

## ✦ Current Status 📌

ProofTrail is a functional full-stack product prototype with:

* authenticated vault access,
* private achievement archive,
* dashboard command center,
* record dossier pages,
* evidence upload flow,
* public/private evidence controls,
* QR-backed public proof pages,
* proof identity generation,
* public proof withdrawal,
* audit activity,
* light/dark mode,
* production deployment,
* tests,
* and full visual documentation.

---

## ✦ Roadmap 🛣️

Potential future improvements:

* advanced evidence verification states,
* public proof analytics,
* downloadable proof sheets,
* multi-record proof bundles,
* PDF export for proof cards,
* organization profiles,
* institution-issued verification,
* richer audit filters,
* custom public proof themes,
* collaborator access,
* and public collections.

---

## ✦ License 📜

This project is open-source under the **MIT License**.

© 2026 Sumit Dhara.

---

## ✦ Author

<p align="center">
  <strong>Designed, built, and shaped by Sumit Dhara</strong>
</p>

<p align="center">
  ProofTrail reflects a private-first approach to credibility — built around evidence, context, and controlled public proof identity.
</p>

<p align="center">
  <a href="https://github.com/sumitdhara609"><strong>GitHub</strong></a>
  ·
  <a href="https://www.linkedin.com/in/sumit-dhara609/"><strong>LinkedIn</strong></a>
</p>

---

## ✦ Support ⭐

ProofTrail took **3 months of persistent product work** to reach this polished public version.

If this project feels useful, thoughtful, or inspiring, consider giving the repository a **star**.

<p align="center">
  <strong>ProofTrail</strong><br />
  Evidence · Context · Controlled Proof
</p>
```