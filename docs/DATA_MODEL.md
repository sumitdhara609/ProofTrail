# ProofTrail Data Model

ProofTrail is designed around evidence-backed achievement records.

## Core Entities

### profiles

A profile belongs to one authenticated user. It stores public-facing identity fields such as full name, username, title, bio, and avatar URL.

### achievements

An achievement is the core record inside a user's vault. It stores the achievement title, category, issuer, date, description, impact summary, visibility, and verification status.

### evidence_items

Evidence items are proof objects attached to achievements. They may be external links, uploaded files, screenshots, certificates, publications, project links, letters, or other supporting records.

### public_proof_links

A public proof link gives an achievement a shareable identity. This powers public proof cards and QR-backed sharing.

### audit_logs

Audit logs record important actions such as achievement creation, evidence updates, visibility changes, proof link generation, and verification status changes.

## Trust Principle

ProofTrail does not treat every claim as automatically verified.

A record may move through different levels:

- claimed
- evidence_attached
- source_linked
- reviewed
- flagged

The platform should clearly communicate the status of a record without exaggerating verification.