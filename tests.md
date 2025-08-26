# tests.md — My Will

## 1. purpose
Validate that My Will delivers a safe, multi‑tenant broker platform that supports the end‑to‑end will workflow, meets UI and accessibility standards, and is future ready for AI, payments, and advanced documents.

## 2. scope
Covers Phase 1 MVP and Phase 2 SaaS expansion. Includes unit, integration, E2E, security, performance, accessibility, observability, and disaster recovery checks.

## 3. environments
1. Development with seed data and debug logs.  
2. Staging mirroring production settings with realistic data volumes and email sandbox.  
3. Production monitored with alerts and smoke users that are clearly flagged.

## 4. data seeding
1. Create two tenants named Alder Advisors and Birch Planning.  
2. Each tenant has three broker users and one optional broker_admin.  
3. Each tenant has ten clients with mixed statuses and at least five will drafts.  
4. Include one signed and locked will per tenant with real PDFs for checksum tests.  
5. Pricing rows exist per tenant with single, mirror, and trust will values.

## 5. test types and tools
1. Unit tests using Vitest for helpers, schema validation, pricing math, and clause builders.  
2. API and integration tests for auth, row level security, storage signing, PDF generation, and audit logging.  
3. E2E browser tests with Playwright for the complete broker journey.  
4. Contract tests for API payloads using OpenAPI schemas or zod.  
5. Accessibility tests with axe in Playwright and manual keyboard reviews.  
6. Performance checks with Playwright traces or k6 for P95 timing targets.  
7. Security checks including IDOR, session handling, URL signing, and upload scanning.

## 6. test matrix by module

### 6.1 authentication and multi‑tenancy
1. Login accepts valid credentials and sets secure session cookie.  
2. Wrong password is rejected with a generic error.  
3. Password reset email contains a single use token and completes successfully.  
4. Tenant A cannot read Tenant B resources by list or direct id.  
5. Platform admin can list all tenants and users.  
6. Session cookie is httpOnly and secure in staging and production.  
7. Row level policies prevent cross tenant selects and updates.

### 6.2 dashboard kpis
1. Active clients count equals number of clients with status active.  
2. Drafts in progress count equals wills in draft or sent_for_approval.  
3. Attestations pending equals wills in attesting.  
4. Revenue this month equals sum of completed will fees for the tenant minus platform share.

### 6.3 clients mini‑crm
1. Create, read, update, and search clients with pagination and sorting.  
2. Notes save with timestamp and author and are immutable.  
3. Tasks create and complete with correct timestamps.  
4. Documents tab lists uploaded files with kind and checksum when available.  
5. Filters by status and updated date work on server side.

### 6.4 will creation wizard
1. Auto save triggers on step change and idle timeout.  
2. Guardianship step only appears when the client has children.  
3. Preview text includes all supplied fields and ordered clauses.  
4. Version increments when material sections change.  
5. Send for approval sets status and writes an audit event.

### 6.5 attestation module
1. In person and video modes can be selected and persisted.  
2. All checklist items must be ticked before lock is allowed.  
3. Locking generates a final PDF, records checksum, sets lock timestamp, and freezes editing.  
4. Downloading the signed PDF writes an audit entry.  
5. Attempting to edit a locked will is rejected with a clear message.

### 6.6 storage and document management
1. Repository search returns documents for the tenant only.  
2. Status tags filter drafts, signed, and archived correctly.  
3. Release copy generates a time limited link and writes an audit event.  
4. Expired signed URLs cannot be reused.  
5. Checksum validation passes for stored signed documents.

### 6.7 pricing control and revenue
1. Tenant pricing reads and writes correctly.  
2. Defaults apply for ninety percent broker and ten percent platform when fields are missing.  
3. KPI revenue reflects pricing updates on subsequent completions.

### 6.8 policies and compliance
1. Privacy, Terms, and Refund pages load and meet accessibility basics.  
2. GDPR notice displays once per user until dismissed and persists across sessions.  
3. Client data export endpoint returns client, wills, notes, tasks, and documents metadata.  
4. Delete request workflow creates a ticket record with status and timestamps.

### 6.9 admin and platform controls
1. Platform admin creates a broker tenant and initial user successfully.  
2. Suspend blocks broker logins and API actions.  
3. Delete revokes access while audit logs remain preserved.  
4. Audit list is filterable by user, event, and date range.

### 6.10 api contracts
1. All endpoints enforce authentication and tenant scoping.  
2. Pagination uses page and pageSize with stable ordering.  
3. Error responses follow code, message, and details structure.  
4. Input validation rejects malformed payloads with helpful messages.

### 6.11 pdf and content generation
1. Previews render with a visible Draft watermark.  
2. Final PDFs include header, footer, page numbers, and document id.  
3. Clause numbering and nesting match the template rules.  
4. Font embedding produces readable outputs on common PDF viewers.

### 6.12 observability
1. Successful requests include trace ids in logs.  
2. Error logs capture route, tenantId, anonymised ids, and stack trace.  
3. Metrics exist for request count, error rate, and latency.

## 7. phase 2 saas expansion tests

### 7.1 ai assistant
1. Given a draft will, assistant returns a plain language explanation in English with a mandatory disclaimer at the top.  
2. Given a target language such as Spanish or Yoruba, assistant returns a translation while preserving the disclaimer and structure.  
3. Logs store language code, model version, prompt hash, and correlation id.  
4. Rate limits apply per tenant and per client.  
5. Optional human in the loop approval flow hides the explanation until approved.

### 7.2 ai intake mode
1. Client completes the intake in their language and the system produces a valid Will JSON that the wizard can open with all steps prefilled.  
2. Residue validation enforces one hundred percent total with clear corrections.  
3. Broker review shows bilingual view and allows edits before approval.  
4. Audit contains transcript hash, model version, language code, and validation results.  
5. All recap screens include the disclaimer text.

### 7.3 advanced generators
1. Mirror wills include guardianship options and produce correct clauses.  
2. Property Protection Trust and Life Interest Trust generators output expected sections.  
3. LPA generator creates the correct set of fields for download.  
4. Severance of Tenancy generates the correct notice template.

### 7.4 collaboration and messaging
1. Broker and client exchange messages on a draft and messages are encrypted at rest.  
2. Client comments appear in the broker Drafts tab with timestamps.  
3. Permissions prevent clients from viewing other clients threads.

### 7.5 digital signing
1. Digital signing session can be initiated and completed.  
2. Signed file is stored, checksum recorded, and audit trail updated.  
3. Failed signing attempts surface a useful, non technical error.

### 7.6 payments and billing
1. Stripe test card payment succeeds and updates invoice status.  
2. GoCardless direct debit mandate completes in sandbox.  
3. Commission invoice for the platform is generated at ten percent and delivered to the broker.  
4. Refund creates a credit note and updates revenue metrics.

### 7.7 analytics and heatmaps
1. Heatmap shows the wizard step with the highest drop off.  
2. Broker performance report matches underlying event data.  
3. CSV export mirrors the client list columns and order.

### 7.8 crm integrations
1. HubSpot or Zoho sync pushes new clients and updates status changes.  
2. Failures are retried with exponential backoff and logged.

### 7.9 secure storage redundancy
1. Reading a signed will succeeds from a secondary replica during a simulated outage.  
2. Certified digital copy issuance watermarks the PDF and writes audit entries.

### 7.10 legal and regulatory layer
1. Compliance checklist appears in the wizard and must be completed before attestation.  
2. Template updates propagate to newly created drafts while existing locked wills remain unchanged.

### 7.11 white label readiness
1. Tenant theme setting applies logo, colours, and email branding without affecting other tenants.

### 7.12 rate limits and quotas
1. API rate limits per tenant and per user return a friendly error when exceeded.  
2. Download link creation is limited per document per day and logged.

## 8. security suite
1. Authentication requires session or bearer token on every protected route.  
2. Direct object reference attempts across tenants fail with forbidden.  
3. Storage keys are time limited, single resource, single method.  
4. Uploads are scanned and non PDF executables are rejected.  
5. Passwords use Argon2id and meet minimum complexity rules.  
6. JWTs or sessions carry a tenant claim and short expiry.  
7. CSRF is mitigated on form posts or avoided with JSON APIs.  
8. Content Security Policy forbids inline scripts except hashed bundles.  
9. Clickjacking is prevented with frame options and CSP.  
10. Audit log integrity check confirms no edits to historical entries.

## 9. performance and reliability
1. Dashboard loads under two seconds at P95 with fifty clients and twenty wills.  
2. Preview generation returns under three seconds at P95.  
3. Final PDF generation returns under five seconds at P95.  
4. Repository search returns under two seconds at P95.  
5. Cold start for serverless routes remains under one second P50 in staging.  
6. Concurrency test with two hundred virtual users keeps error rate under two percent.

## 10. accessibility and ui consistency
1. All primary, secondary, and destructive buttons share the same height and minimum width.  
2. Keyboard focus order follows visual order on dashboard, clients, and wizard steps.  
3. Contrast meets WCAG AA for text and controls.  
4. Tables expose header associations to screen readers.  
5. Reduced motion preference removes non essential animations.  
6. Glass panels keep text readable with adequate blur and overlay.

## 11. backup and disaster recovery
1. A restore from last night backup completes to a staging environment and passes smoke tests.  
2. Recovery point objective within twenty four hours and recovery time objective within eight hours.  
3. Backups are encrypted and access is restricted.

## 12. coverage and quality gates
1. Unit test line coverage at seventy percent minimum and critical files at eighty percent.  
2. E2E happy path runs green before each deployment.  
3. No critical severity issues open in the security report.

## 13. ci pipeline
1. Lint, type check, and unit tests on every pull request.  
2. API and integration tests on merge to main.  
3. E2E tests against staging before production deploy.  
4. Reports published to the pipeline summary with artifacts for failed traces.

## 14. definition of done
1. Acceptance criteria in requirements are met in staging.  
2. Automated tests are green and coverage thresholds met.  
3. Accessibility checks complete for dashboard, clients, wizard, and storage.  
4. Security checks show no critical findings.  
5. Product review confirms same size buttons and glass styling are consistent.
