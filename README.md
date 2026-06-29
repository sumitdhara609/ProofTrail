# ProofTrail 🛡️

### Personal Achievement Verification Vault

<p align="center">
  <img src="docs/screenshots/02-home-dark.png" alt="ProofTrail dark landing hero" width="100%" />
</p>

<p align="center">
  <strong>A private-first proof identity system for preserving achievements with evidence, context, and controlled public visibility.</strong>
</p>

<p align="center">
  ProofTrail turns certificates, projects, publications, awards, competitions, and meaningful milestones into structured evidence-backed records — then lets users publish selected QR-backed proof pages only when they are ready.
</p>

<p align="center">
  <a href="https://prooftrail-three.vercel.app/"><strong>Live Demo</strong></a>
  ·
  <a href="#-visual-walkthrough"><strong>Visual Walkthrough</strong></a>
  ·
  <a href="#-core-features"><strong>Features</strong></a>
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

## ✦ The Idea

People often display achievements online, but the evidence behind those achievements is usually scattered.

A certificate might be in a folder.
A project link might be in a README.
An award proof might be a screenshot.
A publication record might live on a third-party page.
A meaningful milestone might have no structured proof trail at all.

**ProofTrail** brings those fragments into one private, structured, evidence-backed vault.

It is not a public bragging wall.
It is a **private archive first**.

Every achievement can be stored with:

* what the achievement is,
* who issued or recognized it,
* when it happened,
* why it matters,
* what evidence supports it,
* which evidence is private,
* which evidence is public,
* and whether it deserves a QR-backed public proof identity.

> Preserve privately.
> Review carefully.
> Share selectively.

---

## ✦ Build Timeline ⏳

ProofTrail was built across a focused **3-month development cycle**.

The project involved product planning, backend engineering, authentication, Supabase database design, private evidence storage, public proof routing, QR generation, audit activity, premium interface design, testing, deployment, screenshots, and final documentation.

This timeline reflects a realistic solo-product build: steady development in the early phase, followed by an intensive final stretch focused on polish, stability, and product completion.

---

## ✦ Visual Walkthrough

### 01 — Product First Impression

<p align="center">
  <img src="docs/screenshots/01-landing-hero-light.png" alt="ProofTrail landing hero light mode" width="49%" />
  <img src="docs/screenshots/02-home-dark.png" alt="ProofTrail landing hero dark mode" width="49%" />
</p>

<p align="center">
  <em>A premium private-first vault experience for achievements that deserve proof, context, and dignity.</em>
</p>

---

### 02 — Private by Default

<p align="center">
  <img src="docs/screenshots/03-principles-private-by-default.png" alt="ProofTrail private by default principle" width="100%" />
</p>

<p align="center">
  <em>Evidence does not become public accidentally. Public proof pages show only the evidence a user deliberately approves.</em>
</p>

---

### 03 — Authentication & Vault Entry

<p align="center">
  <img src="docs/screenshots/06-auth-create-vault.png" alt="ProofTrail create vault screen" width="49%" />
  <img src="docs/screenshots/05-auth-sign-in.png" alt="ProofTrail sign in screen" width="49%" />
</p>

<p align="center">
  <em>A polished entry flow for creating a private proof vault or securely returning to an existing archive.</em>
</p>

---

### 04 — Vault Archive

<p align="center">
  <img src="docs/screenshots/07-vault-archive-overview.png" alt="ProofTrail vault archive overview" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/08-vault-record-index.png" alt="ProofTrail vault record index" width="100%" />
</p>

<p align="center">
  <em>The archive organizes records by evidence count, media support, visibility state, and proof identity readiness.</em>
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
  <em>The command center gives users a clear view of vault status, evidence health, proof identity activity, and recent trust events.</em>
</p>

---

### 06 — Create Record Flow

<p align="center">
  <img src="docs/screenshots/12-create-record-intro.png" alt="ProofTrail create record intro" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/13-create-record-flow.png" alt="ProofTrail certificate entry flow" width="49%" />
  <img src="docs/screenshots/14-create-record-guidelines.png" alt="ProofTrail naming and privacy guidance" width="49%" />
</p>

<p align="center">
  <img src="docs/screenshots/15-create-record-form-top.png" alt="ProofTrail create record form top" width="49%" />
  <img src="docs/screenshots/16-create-record-form-bottom.png" alt="ProofTrail create record form bottom" width="49%" />
</p>

<p align="center">
  <em>Records begin with structured metadata, context, and impact — before any evidence is attached or made public.</em>
</p>

---

### 07 — Record Dossier

<p align="center">
  <img src="docs/screenshots/17-record-dossier-proof-identity.png" alt="ProofTrail record dossier with active proof identity" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/18-record-details.png" alt="ProofTrail record details" width="100%" />
</p>

<p align="center">
  <em>Each achievement becomes a complete dossier with context, evidence metrics, record details, QR access, and public proof controls.</em>
</p>

---

### 08 — Evidence Intake

<p align="center">
  <img src="docs/screenshots/19-evidence-intake-overview.png" alt="ProofTrail evidence intake overview" width="49%" />
  <img src="docs/screenshots/20-evidence-intake-upload-note.png" alt="ProofTrail evidence upload note" width="49%" />
</p>

<p align="center">
  <img src="docs/screenshots/21-evidence-intake-safety-workflow.png" alt="ProofTrail evidence safety workflow" width="100%" />
</p>

<p align="center">
  <em>Evidence can include certificate files, PDFs, images, source links, notes, and supporting references — all private until reviewed.</em>
</p>

---

### 09 — Evidence Ledger

<p align="center">
  <img src="docs/screenshots/22-evidence-ledger-overview.png" alt="ProofTrail evidence ledger overview" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/23-evidence-ledger-author-photo.png" alt="ProofTrail evidence ledger author photo" width="49%" />
  <img src="docs/screenshots/24-evidence-ledger-certificate.png" alt="ProofTrail evidence ledger certificate frame" width="49%" />
</p>

<p align="center">
  <em>The evidence ledger presents supporting files inside a structured, reviewable frame with clear public/private visibility labels.</em>
</p>

---

### 10 — Public Proof Page

<p align="center">
  <img src="docs/screenshots/25-public-proof-overview.png" alt="ProofTrail public proof overview" width="100%" />
</p>

<p align="center">
  <img src="docs/screenshots/26-public-proof-evidence-photo.png" alt="ProofTrail public proof photo evidence" width="49%" />
  <img src="docs/screenshots/27-public-proof-evidence-certificate.png" alt="ProofTrail public proof certificate evidence" width="49%" />
</p>

<p align="center">
  <em>Public proof pages expose only selected public evidence, visible context, QR-backed access, and a transparent verification note.</em>
</p>

---

### 11 — Proof History

<p align="center">
  <img src="docs/screenshots/29-proof-history.png" alt="ProofTrail proof history" width="100%" />
</p>

<p align="center">
  <em>Proof history records public proof identities and helps users understand the lifecycle of controlled public access.</em>
</p>

---

### 12 — Brand Identity

<p align="center">
  <img src="docs/screenshots/30-footer-brand-identity.png" alt="ProofTrail footer brand identity" width="100%" />
</p>

<p align="center">
  <em>ProofTrail is shaped as a premium proof identity system built around evidence, context, and controlled visibility.</em>
</p>

---

## ✦ Core Features 🚀

### 🗂️ Private Achievement Vault

Create structured records for:

* certificates,
* awards,
* projects,
* publications,
* competitions,
* leadership roles,
* academic milestones,
* creative achievements,
* and personal proof-worthy accomplishments.

Each record can include a title, category, issuer, achievement date, visibility state, public context, impact summary, evidence count, media count, and proof identity status.

---

### 📎 Evidence Management

Attach supporting proof through:

* certificate images,
* PDF documents,
* screenshots,
* source URLs,
* publication pages,
* project links,
* notes,
* and contextual references.

Evidence remains private unless it is intentionally selected for public display.

---

### 🔐 Private-first Visibility

ProofTrail is designed to prevent accidental exposure.

By default:

* records remain private,
* evidence remains private,
* uploaded files stay protected,
* private metadata is not exposed,
* and public proof pages only display selected evidence.

Public proof is an excerpt — not the whole vault.

---

### 🪪 Public Proof Identity

When a record is ready, ProofTrail can generate a public proof identity with:

* ProofTrail ID,
* public slug,
* QR-backed access,
* selected evidence,
* visible record context,
* public impact summary,
* and a verification note.

Public proof can be withdrawn without deleting the original private record.

---

### 📱 QR-backed Proof Cards

Each active public proof page includes QR-backed access, making ProofTrail useful for:

* portfolio proof,
* certificate cards,
* printed proof sheets,
* public achievement records,
* project showcases,
* and shareable credibility pages.

---

### 🧾 Audit & Trust Activity

ProofTrail tracks important vault events such as:

* record creation,
* evidence attachment,
* evidence updates,
* public proof generation,
* proof withdrawal,
* and record deletion.

This gives the product a traceable internal trust layer.

---

### 🌓 Light & Dark Mode

ProofTrail includes polished light and dark experiences with persistent theme handling.

The interface is designed to feel premium, calm, and serious in both modes.

---

## ✦ Product System 🧠

ProofTrail is built around four core concepts:

| Concept                | Purpose                                                                      |
| ---------------------- | ---------------------------------------------------------------------------- |
| **Achievement Record** | Stores the claim, issuer, date, category, context, and impact                |
| **Evidence Item**      | Stores files, links, notes, certificates, screenshots, and source references |
| **Proof Identity**     | Creates QR-backed public access for selected records                         |
| **Audit Activity**     | Tracks important events across the record and evidence lifecycle             |

---

## ✦ Privacy Model 🔒

ProofTrail follows a strict private-first model.

Public proof pages show:

* selected public evidence,
* approved public context,
* proof identity,
* QR access,
* and a verification note.

Public proof pages do **not** show:

* private evidence,
* hidden vault records,
* unapproved files,
* raw storage paths,
* private file names,
* MIME types,
* or file sizes.

This protects the private vault while still allowing meaningful public proof.

---

## ✦ Verification Disclaimer ⚠️

ProofTrail does not independently certify achievements.

It provides a structured way to present a record and its supporting evidence so viewers can review the context, sources, and public proof material transparently.

ProofTrail is an evidence organization and proof presentation system — not a third-party certification authority.

---

## ✦ Technical Architecture 🏗️

ProofTrail is a full-stack product with authenticated private routes, public proof pages, storage-backed evidence handling, and structured database modeling.

### Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* Responsive interface design
* Server components
* Client components where needed
* Reusable card, button, frame, and layout components
* Premium light/dark visual system

### Backend

* Supabase Auth
* Supabase PostgreSQL
* Supabase Storage
* Server actions
* Protected vault routes
* Public proof routes
* Signed media preview URLs
* Audit activity persistence

### Product Infrastructure

* QR code generation
* Public proof slug routing
* Private evidence bucket
* Public evidence selection
* Proof identity generation
* Public proof withdrawal
* Vercel deployment

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

The project includes a test and production build workflow:

```bash
npm run test
npm run build
```

The final polished version was checked across:

* local testing,
* production build,
* live deployment,
* authenticated dashboard routes,
* private vault routes,
* evidence upload flows,
* public proof pages,
* QR proof access,
* light/dark mode,
* and manual UI review.

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

Add your environment variables:

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

Public pages should rely on selected public evidence and controlled preview access instead of exposing raw vault storage.

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
* tests,
* deployment,
* and visual documentation.

---

## ✦ Roadmap 🛣️

Potential future improvements:

* advanced evidence verification states,
* proof bundles,
* downloadable proof sheets,
* public proof analytics,
* PDF export for proof cards,
* organization profiles,
* richer audit filters,
* custom proof page themes,
* collaborator access,
* and multi-record public collections.

---

## ✦ Author 👤

<p align="center">
  <strong>Designed, built, and shaped by Sumit Dhara</strong>
</p>

<p align="center">
  ProofTrail reflects a private-first approach to credibility: evidence, context, and controlled public proof identity.
</p>

<p align="center">
  <a href="https://github.com/sumitdhara609">GitHub</a>
  ·
  <a href="https://www.linkedin.com/in/sumit-dhara609/">LinkedIn</a>
</p>

---

<p align="center">
  <strong>ProofTrail</strong><br />
  Evidence · Context · Controlled Proof
</p>

---

## 📜 License
 This project is open-source under the  **MIT License.**

#### © 2026 Sumit Dhara. All rights reserved.

---

## ⭐ Support 
- ProofTrail took 3 months of persistence to launch publicly.
- If you appreciate builders who keep improving until ideas become real products, consider giving this repository a **star.**
