# requirements.md — My Will (Full SaaS Specification)

## 0. Project Description — My Will SaaS
### 0.1 Overview
My Will is a Software as a Service platform for will creation and management aimed at financial advisers, mortgage brokers, and estate planning professionals in the United Kingdom. The platform lets advisers guide clients through creating legally robust wills, manage attestations in person or via supervised video, and store documents securely, with a clear path to advanced estate planning features.

The rollout happens in two stages.
1. MVP (Phase 1). A lean but complete tool that enables brokers to onboard clients, generate simple wills through a guided wizard, manage attestations, and store documents with audit logs. Built cost‑effectively using Cursor and a lightweight stack to validate demand and win early adopters.
2. Full SaaS (Phase 2). Expansion to trust structures, LPA, CRM integrations, AI assistants and intake in any language, storage partnerships, payments, analytics, and training or lead‑gen partnerships with industry bodies. Requires a larger team and funding.

### 0.2 Why these features matter
1. Broker or adviser centric approach. Will writing is currently unregulated but trending toward regulation. By centering the broker, My Will builds trust and stays regulation ready. Brokers act as compliance anchors and need a simple, familiar interface.
2. Mini‑CRM inside the product. Brokers manage clients, drafts, notes, tasks, and documents in one place. Later, integrations with Salesforce, HubSpot, Intelligent Office, Xplan and similar systems make adoption seamless.
3. Will creation wizard. A step‑by‑step flow reduces errors, standardises clause structure, and supports review and approval before signature. The structure also enables heatmaps to reveal drop‑off points that inform future AI improvements.
4. Attestation in person or via supervised video. UK wills require physical signing. My Will supports real‑world workflows now and can pivot to digital signatures when regulations allow.
5. Secure storage and retrieval. Clients lose paper copies. Brokers can release digital copies for a fee, with encrypted storage that future proofs the platform for digital wills and blockchain timestamping.
6. Compliance and trust. Static legal pages for GDPR, Terms, and Privacy build credibility from day one. Audit logs track capacity and undue influence checks. The future AI assistant is trained on UK sources with controls for accuracy and scope.
7. Revenue model. Brokers set pricing, the platform takes a ten percent commission automatically, and upsell paths include storage fees, Society of Will Writers training commissions, and storage partnerships.
8. Scalability and investor appeal. MVP proves demand quickly. Full SaaS targets a larger market with trusts, LPA, severance of tenancy, CRM integrations, AI, and a stronger compliance posture. Heatmaps and analytics support a data‑driven investor story.

### 0.3 Success definition for MVP signoff
1. A broker completes the journey from login to signed and stored will with audit trail.
2. Tenant isolation prevents any cross‑tenant access in lists or direct id fetches.
3. All primary buttons and actions render at the agreed size across the application.
4. Policies and GDPR notices are visible and accessible.
5. Storage releases log an audit event and expire correctly.
6. Heatmap instrumentation captures wizard step completion in the background for later analytics.

## 1. Project overview
My Will is a UK SaaS for brokers and financial advisers to create, manage, attest and securely store client wills. The system is multi‑tenant so each broker operates in an isolated space with their own clients, documents and pricing.

## 2. goals and non‑goals
1. Deliver a working broker journey: log in, add client, create draft, send for approval, attest and lock, store, manage pricing, view policies.
2. Enforce strict tenant isolation and role‑based access.
3. Keep the UI table‑first and familiar to broker CRMs, using shadcn/ui with a glassmorphism look and same‑size buttons.
4. Keep legal compliance visible without heavyweight integrations.
5. Prepare a clear path to Phase 2 features such as an AI explainer and intake, trusts, LPA and advanced analytics.

Non‑goals for MVP: consumer self‑serve wills, live payments, deep legal integrations, blockchain notarisation, and production analytics dashboards.

## 3. personas
1. Broker. Creates and manages clients, drafts wills, runs attestations, stores documents and sets pricing.
2. Broker admin. Manages staff within a broker firm.
3. Platform admin. Manages broker tenants, monitors audit logs and policies.
4. Client. Reviews drafts and receives final copies in a later portal.

## 4. scope: phase 1 mvp
### 4.1 authentication and access
1. Email and password login.
2. Password reset flow via email link.
3. Sessions via secure cookies or Firebase sessions.
4. Roles: broker, broker_admin, platform_admin.
5. Multi‑tenant guard on every request.

### 4.2 broker dashboard
1. Welcome banner with broker name.
2. KPI cards: active clients, drafts in progress, attestations pending, revenue this month.
3. Sidebar navigation: Dashboard, Clients, Tasks, Storage, Policies, Pricing.
4. Recent activity stream and quick actions.

### 4.3 clients mini‑crm
1. Clients table with search, sort and filters.
2. Add and edit client details: name, date of birth, address, email, phone.
3. Client profile with tabs: Profile, Drafts, Tasks, Notes, Documents.
4. Notes are timestamped and immutable once saved.
5. Documents tab supports uploads and previews.

### 4.4 will creation wizard
Steps: Personal information, Executors, Beneficiaries, Guardianship when applicable, Residue of estate, Review and preview.
Auto‑save after each step.
Generate a human‑readable draft in English using structured templates.
Send to client for approval status flag.
Version the draft on each significant change.

### 4.5 attestation module
1. Choose mode: in‑person or supervised video call.
2. Checklist: ID verification, witness presence, signature capture.
3. On completion, lock the will and compute a final immutable PDF.
4. Store the signed version in the client’s documents with checksum and timestamps.

### 4.6 storage and document management
1. Central repository of drafts and signed wills.
2. Search by client or document title.
3. Status tags: Draft, Signed, Archived.
4. Release copy action that records an audit event and optional fee placeholder.

### 4.7 broker pricing control
1. Editable pricing table: single will, mirror will, trust will.
2. Revenue model: broker keeps ninety percent, platform retains ten percent.
3. Show net revenue estimate on dashboard KPI.

### 4.8 compliance and policies
1. Static pages: Privacy Policy, Terms and Conditions, Refund Policy.
2. GDPR notice banner and link to data request contact.
3. Downloadable data export placeholder at client level.
4. Placeholder page for AI compliance notes.

### 4.9 admin and platform controls
1. Admin dashboard listing brokers with status and creation dates.
2. Create, suspend and delete broker tenants.
3. Basic audit trail of edits, downloads, logins and document releases.
4. Placeholder widget for future usage heatmap.

## 5. scope: phase 2 expansion
### 5.1 AI assistant and explainer
1. Custom trained on curated UK sources through retrieval augmented generation.
2. Explains the generated will in plain language and any client language.
3. Mandatory disclaimer: “This is a plain‑language summary, not legal advice.”
4. Human‑in‑the‑loop approval before client viewing if enabled.
5. Store prompt, retrieved sources, output, language code and model version for audit.

### 5.2 Advanced analytics and heatmaps
1. Track wizard step completion and time on step.
2. Show drop‑off heatmap to brokers and platform admins.
3. Feed insights into UX changes.

### 5.3 Advanced generators
1. Trust generators including Property Protection Trust and Life Interest Trust.
2. Lasting Power of Attorney generator.
3. Severance of Tenancy generator.
4. Mirror wills with guardianship options.

### 5.4 Digital will storage exploration
1. Private key receipts and notarisation research.
2. Hashing and blockchain timestamping options.

### 5.5 Partnerships and integrations
1. Lead generation and training with Society of Will Writers.
2. Will storage provider partnerships.
3. CRM integrations with HubSpot, Zoho and others.
4. Payments with Stripe or GoCardless and automated commission invoices.

### 5.6 Collaboration and messaging
1. Secure in‑app broker to client messaging.
2. Comment threads on drafts with timestamps.
3. Digital signing integration for when permitted.

### 5.7 Client portal
1. Read‑only access to drafts and signed wills.
2. E‑sign flow when regulations allow.

### 5.8 Payments and billing
1. Broker level pricing dashboard.
2. Commission logic at ninety percent broker and ten percent platform.
3. Automated invoicing to client and commission invoice to broker.

### 5.9 Legal and regulatory layer
1. Compliance checklist for capacity and undue influence.
2. Template updates as UK law changes.
3. Regulation‑ready design.

### 5.10 AI Intake Mode (Client‑led data capture in any language)
Purpose. Allow the assistant to collect every field required by the will wizard directly from the client in their chosen language, validate inputs in real time, and emit the same structured payload used by the wizard.

Scope. Conversational intake of personal info, executors, beneficiaries, guardianship, residue, specific gifts, funeral wishes and attestation preference. Live validation, human readable summary and full transcript. Broker review remains mandatory.

Conversation flow. Consent and scope, capacity triage, structured intake by section with confirmations, validation loops, final recap, broker handoff and approval.

Data contract. Intake payload matches wizard schema and adds metadata.
```json
{
  "client": {
    "fullName": "", "dob": "", "email": "", "phone": "",
    "address": { "line1": "", "line2": "", "city": "", "postcode": "", "country": "UK" }
  },
  "maritalStatus": "single|married|civil|divorced|widowed",
  "children": { "hasChildren": false, "dependants": [{"fullName":"", "dob":"", "relationship":"child|step-child|other"}] },
  "executors": [{"fullName":"", "relationship":"", "address":"", "isReserve": false}],
  "guardianship": { "required": false, "guardians": [{"fullName":"", "relationship":"", "address":""}] },
  "specificGifts": [{"beneficiary":"", "itemOrAmount":"", "notes":""}],
  "residue": {
    "distributionType": "equal|percentages|custom",
    "beneficiaries": [{"name":"", "relationship":"", "percentage": 0}]
  },
  "funeralWishes": "noPreference|cremation|burial|other",
  "attestation": { "mode":"inPerson|zoom", "witnessPreferences": "" },
  "specialClauses": "",
  "language": "en|es|yo|fr|...",
  "consents": { "privacy": true, "aiExplanationOk": true, "translationOk": true },
  "meta": { "tenantId":"", "intakeSessionId":"", "intakeVersion": 1, "riskFlags": [], "timestamp":"" }
}
```
Validation rules. UK postcode format and city lookup, residue sums to one hundred, executors and witnesses eighteen plus, guardianship only when dependants exist, duplicate detection, conflict checks.

Multilingual handling. Converse in client language, store language code, normalise answers to English internally if needed, render recap back in client language. Broker sees both original answers and normalised payload.

Compliance and audit. No bespoke legal advice, mandatory disclaimer, transcripts are tenant scoped and encrypted, store prompt, responses, retrieved notes, model version, language, validation outcomes and a transcript hash. Broker approval required before generating a signable draft.

UI requirements. Chat UI with shadcn components and glass panels, progress meter, same size buttons via .button-base, per section recap, save and resume via secure link.

API surface. Create session, turn handler, submit, broker view, broker approve.

## 6. ui and ux requirements
1. Component library is shadcn/ui.
2. Visual style is glassmorphism with frosted translucent panels, subtle blurs, soft shadows and rounded corners.
3. Buttons are the same size across the application. Use one default height and padding for primary, secondary and destructive variants with a fixed min‑width.
4. Layout uses a left sidebar and breadcrumbs.
5. Tables are dense, legible and keyboard accessible with sticky headers and responsive overflow.
6. Empty states provide a single primary action and two sentences of guidance.
7. Inline, accessible form validation.
8. Focus states are visible and consistent.
9. Loading states for tables and wizard steps use skeletons or spinners.

Example sizing tokens.
```css
.button-base { height: 40px; min-width: 140px; padding-left: 16px; padding-right: 16px; border-radius: 12px }
.card-glass { backdrop-filter: blur(10px); background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.3) }
```

## 7. recommended tech stack
1. Next.js with TypeScript.
2. shadcn/ui and Tailwind CSS.
3. Database: PostgreSQL with Prisma or Firebase for managed auth and storage.
4. Storage: S3 compatible buckets or Firebase Storage.
5. Auth: NextAuth with credentials or Firebase Auth.
6. PDF generation: server‑side HTML to PDF renderer.
7. Background jobs: serverless cron or light queue.
8. Tests: Playwright and Vitest.
9. Lint and format: ESLint and Prettier.

## 8. data model
All entities carry tenant_id for isolation and created_at, updated_at timestamps.

### 8.1 tables

Clients
field    type    notes
id    uuid    primary key
tenant_id    uuid    broker tenant id
first_name    text
last_name    text
dob    date
email    text    unique per tenant
phone    text
address_line_1    text
address_line_2    text
city    text
postcode    text
country    text    default UK
status    text    active, archived
last_updated_by    uuid    user id

Wills
field    type    notes
id    uuid    primary key
tenant_id    uuid
client_id    uuid    references clients
version    integer    starts at 1
status    text    draft, sent_for_approval, attesting, signed, archived
json_payload    jsonb    structured form data
draft_markdown    text    generated output
signed_pdf_url    text    final document url
checksum_sha256    text    for signed pdf
lock_at    timestamp    set when signed

Tasks
field    type    notes
id    uuid
tenant_id    uuid
client_id    uuid
title    text
completed    boolean
completed_at    timestamp
created_by    uuid    user id

Notes
field    type    notes
id    uuid
tenant_id    uuid
client_id    uuid
body    text    immutable after save
author_id    uuid

Documents
field    type    notes
id    uuid
tenant_id    uuid
client_id    uuid
will_id    uuid    nullable
title    text
kind    text    draft, signed, upload
url    text    storage location
checksum_sha256    text

Pricing
field    type    notes
tenant_id    uuid    primary key
single_will_price    integer    pence
mirror_will_price    integer    pence
trust_will_price    integer    pence
revenue_split_broker    integer    default 90
revenue_split_platform    integer    default 10

Users
field    type    notes
id    uuid
tenant_id    uuid    nullable for platform_admin
email    text    unique
hashed_password    text
role    text    broker, broker_admin, platform_admin
last_login_at    timestamp

Audit_logs
field    type    notes
id    uuid
tenant_id    uuid
user_id    uuid
event    text    LOGIN, CREATE_CLIENT, UPDATE_WILL, DOWNLOAD_DOC, RELEASE_COPY
entity_type    text    client, will, document
entity_id    uuid
meta    jsonb
occurred_at    timestamp

### 8.2 indexes
1. Index tenant_id on all tenant‑scoped tables.
2. Unique composite constraints for unique(email, tenant_id) on clients.
3. Hash index on checksum for integrity checks.

### 8.3 row‑level security
1. Enable RLS and restrict by jwt tenant claim equals tenant_id.
2. Platform admin policy allows unrestricted select.

## 9. api surface
Authenticated routes always apply tenant scoping.

1. POST /api/auth/login
2. POST /api/auth/reset
3. GET /api/dashboard/kpis
4. GET /api/clients
5. POST /api/clients
6. GET /api/clients/:id
7. PATCH /api/clients/:id
8. GET and POST /api/clients/:id/notes
9. GET and POST /api/clients/:id/documents
10. POST /api/wills
11. PATCH /api/wills/:id
12. POST /api/wills/:id/preview
13. POST /api/wills/:id/send_for_approval
14. POST /api/wills/:id/attestation/complete
15. GET /api/storage
16. GET and PATCH /api/pricing
17. GET /api/policies
18. Admin: GET and POST /api/admin/brokers, GET /api/admin/audit

Conventions. JSON only, camelCase payloads, page and pageSize pagination, sortBy and sortDir, error shape code and message and details, session cookie or bearer token required.

## 10. security and compliance
1. Tenant isolation in code and with row‑level policies where supported.
2. All storage URLs are private and time‑limited.
3. Passwords stored with Argon2id.
4. Audit trail for sensitive actions including document releases and attestation lock.
5. GDPR support with client export and delete request workflow.
6. Signed PDFs carry a SHA‑256 checksum in database.
7. HTTP security headers and CSP.
8. Session cookies httpOnly, secure and sameSite.
9. Backups daily with restore tests and clear RPO and RTO targets.
10. DPIA checklist stored and reviewed before Phase 2 AI launch.

## 11. pdf and content generation
1. Draft content from templates with deterministic sections.
2. Final PDF generated server‑side with header, footer, pagination and document id.
3. Previews watermarked as Draft.
4. Clause library with tokens for executors, guardianship and residue.
5. Numbering style with nested numerals and letters.

## 12. non‑functional requirements
1. Accessibility with keyboard navigation, focus states, labels and ARIA.
2. Performance targets: dashboard and tables under two seconds P95, preview under three seconds P95, final PDF under five seconds P95.
3. Availability single region acceptable for MVP with daily backups.
4. Observability with structured logs, tracing and metrics.
5. Environments: development, staging, production.
6. Feature flags for Phase 2 features for dark‑launch.

## 13. roles and permissions
Broker. Read and write within tenant for clients, wills, notes, tasks, documents, pricing.
Broker admin. Broker privileges plus tenant user management.
Platform admin. Manage tenants, cross‑tenant audits, suspend accounts.
Client. Read their documents and explanations in a future portal.

## 14. document lifecycle and retention
Draft created then updated then sent for approval then attesting then signed and locked then archived. Locking creates a final PDF and freezes edits. Drafts retained for twelve months. Signed wills retained indefinitely unless archived by broker.

## 15. attestation procedures
In‑person. Two witnesses not beneficiaries, ID verified, signatures captured.  
Zoom. Record meeting identifier and timestamps, witness details confirmed, broker confirmation tick boxes.  
Post‑attestation. Store signed PDF, metadata and checksums, lock record, write audit events.

## 16. video integration
1. Zoom or Twilio token creation on request.
2. Store meeting id, start and end timestamps, participants’ names.
3. No video recordings stored in MVP, metadata only.

## 17. storage and checksum
1. Per‑tenant folder structure in storage.
2. Compute SHA‑256 checksum on upload and finalisation.
3. Validate checksum on download if requested.
4. Signed URLs expire within fifteen minutes by default.

## 18. observability and logging
1. Log format includes iso8601 timestamp, level, tenantId, userId, route, latency, status, traceId.
2. Error reports include route, tenantId and anonymised identifiers.
3. Metrics for request count, error rate and p50 p95 p99 latency.
4. Alerts when error rate or latency exceeds thresholds.

## 19. feature flags and configuration
1. Flags: aiAssistant, aiIntakeMode, payments, messaging, digitalSigning, heatmaps.
2. Environment variables for database, storage, email, secrets.
3. Admin console toggles features per tenant for beta trials.

## 20. internationalisation
1. UI message catalog with default English and language switcher ready.
2. Date, currency and number formats localised.
3. AI explanations and intake store language codes with outputs.

## 21. rate limiting and quotas
1. API rate limits per tenant and per user.
2. Download link creation limits per document per day.
3. AI assistant call limits per client per day.

## 22. privacy notices and disclaimers
1. Plain privacy summary on sign up and first login.
2. AI disclaimer on every explanation: “This is a plain‑language summary, not legal advice.”
3. Cookie notice for session and analytics.

## 23. deployment and environments
1. Infrastructure as code for repeatable environments.
2. Rolling deployments.
3. Database migrations in CI before deploy.
4. Staging mirrors production.

## 24. backup and disaster recovery
1. Automated daily backups and monthly restore verification.
2. Recovery time objective eight hours and recovery point objective twenty‑four hours.
3. Quarterly tabletop DR exercise.

## 25. roadmap and milestones
Milestone 1. MVP auth, clients, wizard, attestation, storage, pricing, policies, admin basics.  
Milestone 2. PDF hardening, audit enrichment, RLS policies, KPI tuning, UAT.  
Milestone 3. Phase 2 flags, AI explainer and intake beta, analytics heatmap, payments pilot.  
Milestone 4. Collaboration, digital signing, LPA and trust generators.

## 26. acceptance criteria summary
1. A broker completes the end‑to‑end journey from login to storing a signed will.
2. Tenant isolation verified by tests and manual checks.
3. All buttons render at the same size across pages.
4. Audit entries appear for key actions such as update will, preview, lock and release copy.
5. Policies pages are reachable and readable.
6. Pricing changes reflect in revenue KPI.
