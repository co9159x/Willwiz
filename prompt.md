You are building a production-ready SaaS called “My Will” for UK brokers and advisers. Generate a full-stack Next.js 14 App Router project with TypeScript, Prisma, PostgreSQL, NextAuth credentials login, shadcn/ui, Tailwind, and S3-style storage. Scaffold MVP Phase 1 end-to-end so a broker can log in, add a client, create a will draft via wizard, send for approval, complete attestation, store the signed PDF, manage pricing, view policies, and the platform admin can manage brokers and see audits.

NAME
My Will

GOALS
1) Multi-tenant by design. Broker equals tenant. Every record carries tenantId and all queries are scoped.
2) Familiar broker CRM UI. Tables, tabs, wizard. Use shadcn/ui. Glassmorphism across cards, sidebar, modals. All primary buttons same size.
3) Secure and compliant baseline. Argon2id passwords, time-limited file links, audit events for sensitive actions, GDPR pages.
4) Clear expansion path. Feature flags for AI explainer and AI intake. Stubs only in this MVP.

STACK
1) Next.js 14 App Router, TypeScript, ESLint, Prettier
2) Tailwind CSS + shadcn/ui components
3) Prisma ORM + PostgreSQL
4) NextAuth Credentials Provider with email plus password
5) File storage abstraction with S3 compatible buckets. In dev write to /tmp and return fake signed URLs
6) Zod for input validation
7) Playwright for E2E and Vitest for unit tests
8) PDF generation stub using server route with HTML to PDF adapter function. Provide adapter interface and a fake renderer that returns a placeholder PDF buffer for now

GLOBAL UX RULES
1) Use shadcn/ui for UI primitives. Import Button, Card, Tabs, Table, Dialog, Input, Label, Badge, Breadcrumb, Tooltip
2) Create a global .button-base class so all buttons share the same size. Height 40px, min-width 140px, px 16, rounded 12px
3) Create a .card-glass class for frosted panels. Use backdrop-filter blur and a translucent background with subtle border
4) Left sidebar layout with compact top bar and breadcrumb inside page content
5) Tables are responsive with sticky headers and keyboard friendly focus

FILES AND FOLDERS
1) app
   a) layout.tsx with sidebar shell, breadcrumb slot, theme provider
   b) page.tsx dashboard for brokers with KPI cards and recent activity
   c) clients/page.tsx table with search, sort, pagination, New Client dialog
   d) clients/[id]/page.tsx profile with Tabs: Profile, Drafts, Tasks, Notes, Documents
   e) wills/new/page.tsx start wizard by selecting client then stepper
   f) wills/[id]/wizard/page.tsx multistep wizard
   g) storage/page.tsx repository of drafts and signed PDFs with filters
   h) pricing/page.tsx broker pricing editor
   i) policies/privacy/page.tsx and policies/terms/page.tsx and policies/refund/page.tsx static content
   j) admin/page.tsx platform admin dashboard list of brokers and audits
   k) api routes under app/api matching the API section below
2) components
   a) Sidebar, Topbar, Breadcrumbs
   b) KpiCard, DataTable, EmptyState
   c) ClientFormDialog, NoteEditor, UploadButton
   d) WizardStep components: PersonalInfo, Executors, Beneficiaries, Guardianship, Residue, Review
   e) AttestationChecklist
3) lib
   a) auth.ts NextAuth config using Credentials provider and Prisma adapter
   b) db.ts Prisma client
   c) rbac.ts with role checks broker, brokerAdmin, platformAdmin
   d) tenant.ts helpers to read tenantId from session and assert scope
   e) audit.ts function writeAudit(event, entityType, entityId, meta)
   f) storage.ts abstraction putObject, getSignedUrl returning time-limited links
   g) pdf.ts interface PdfRenderer with renderDraft and renderSigned, and a FakePdfRenderer implementation
   h) validate.ts Zod schemas for all inputs
   i) featureFlags.ts simple flag store from env or DB
4) prisma
   a) schema.prisma with models from the Data Model section
   b) seed.ts creates two tenants, users, pricing, clients, one signed will with checksum
5) tests
   a) e2e happy-path.spec.ts Playwright scenario
   b) api unit tests with Vitest for validation and scoping
6) styles
   a) globals.css add .button-base and .card-glass plus Tailwind base
7) middleware.ts protect routes, inject tenant scope from session

PRISMA DATA MODEL
model Tenant {
  id           String  @id @default(uuid())
  name         String
  createdAt    DateTime @default(now())
  users        User[]
  clients      Client[]
  wills        Will[]
  documents    Document[]
  pricing      Pricing?
  audits       AuditLog[]
}
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  hashedPassword String
  role         Role
  tenantId     String?
  tenant       Tenant?  @relation(fields: [tenantId], references: [id])
  lastLoginAt  DateTime?
  createdAt    DateTime @default(now())
}
enum Role { broker broker_admin platform_admin }
model Client {
  id           String   @id @default(uuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id])
  firstName    String
  lastName     String
  dob          DateTime?
  email        String?
  phone        String?
  addressLine1 String?
  addressLine2 String?
  city         String?
  postcode     String?
  country      String   @default("UK")
  status       String   @default("active")
  lastUpdatedBy String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  wills        Will[]
  notes        Note[]
  documents    Document[]
  tasks        Task[]
  @@index([tenantId])
  @@unique([tenantId, email])
}
model Will {
  id           String   @id @default(uuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id])
  clientId     String
  client       Client   @relation(fields: [clientId], references: [id])
  version      Int      @default(1)
  status       String   @default("draft")
  jsonPayload  Json
  draftMarkdown String?
  signedPdfUrl String?
  checksumSha256 String?
  lockAt       DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  @@index([tenantId, clientId])
}
model Document {
  id           String   @id @default(uuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id])
  clientId     String
  client       Client   @relation(fields: [clientId], references: [id])
  willId       String?
  title        String
  kind         String   // draft signed upload
  url          String
  checksumSha256 String?
  createdAt    DateTime @default(now())
  @@index([tenantId, clientId])
}
model Pricing {
  tenantId     String   @id
  tenant       Tenant   @relation(fields: [tenantId], references: [id])
  singleWillPrice Int   @default(20000)   // pence
  mirrorWillPrice Int   @default(35000)
  trustWillPrice  Int   @default(75000)
  revenueSplitBroker Int @default(90)
  revenueSplitPlatform Int @default(10)
}
model Task {
  id           String   @id @default(uuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id])
  clientId     String
  client       Client   @relation(fields: [clientId], references: [id])
  title        String
  completed    Boolean  @default(false)
  completedAt  DateTime?
  createdBy    String?
  createdAt    DateTime @default(now())
}
model Note {
  id           String   @id @default(uuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id])
  clientId     String
  client       Client   @relation(fields: [clientId], references: [id])
  body         String
  authorId     String
  createdAt    DateTime @default(now())
}
model AuditLog {
  id           String   @id @default(uuid())
  tenantId     String
  tenant       Tenant   @relation(fields: [tenantId], references: [id])
  userId       String?
  event        String
  entityType   String
  entityId     String?
  meta         Json?
  occurredAt   DateTime @default(now())
  @@index([tenantId, occurredAt])
}

AUTH AND TENANT SCOPING
1) Credentials login with email and password hashed by Argon2id. On success return a JWT session that includes user id, role, and tenantId
2) middleware.ts protects app routes, redirects unauthenticated users to /login, and attaches session to request
3) All API handlers must read tenantId from session and filter queries by tenantId. Admin routes require platform_admin

API ROUTES WITH ZOD VALIDATION
1) POST /api/auth/login   credentials login returns session
2) POST /api/auth/reset   start password reset write token to DB and log console in dev
3) GET /api/dashboard/kpis   return counts for active clients, drafts, attesting, revenue this month
4) GET /api/clients   query params search sort page pageSize returns paginated list
5) POST /api/clients   create client validate fields with zod
6) GET /api/clients/[id]   fetch profile
7) PATCH /api/clients/[id]   update details
8) GET and POST /api/clients/[id]/notes   list and create timestamped notes
9) GET and POST /api/clients/[id]/documents   list and start upload return signed URL
10) POST /api/wills   create draft for a client with initial payload
11) PATCH /api/wills/[id]   autosave wizard step update jsonPayload and bump version on material changes
12) POST /api/wills/[id]/preview   render draftMarkdown and return a previewPdfUrl using FakePdfRenderer
13) POST /api/wills/[id]/send_for_approval   set status sent_for_approval write audit
14) POST /api/wills/[id]/attestation/complete   set status signed generate final PDF set checksum and lockAt write audit
15) GET /api/storage   list documents by kind and client filter
16) GET and PATCH /api/pricing   read and update tenant pricing
17) Admin GET and POST /api/admin/brokers   list and create tenants and first user
18) Admin GET /api/admin/audit   list audit events filter by date and event

UI PAGES
1) Dashboard shows four KPI cards and a Recent Activity list
2) Clients page shows DataTable Name Status Last Updated Actions with search and new client dialog
3) Client profile tabs
   Profile shows editable fields
   Drafts shows list of wills with statuses and buttons Open Wizard Preview Send For Approval
   Tasks shows checkbox list
   Notes shows a form that stamps createdAt and author
   Documents lists uploads with kind Draft Signed Upload and a Release Copy action
4) Wizard page is a simple stepper with autosave and a Review step with Generate Preview button
5) Storage page shows all documents with filters Draft Signed Archived and a search by client name
6) Pricing page shows editable fields for single mirror trust and info text Broker keeps ninety percent Platform retains ten percent
7) Policies pages are static and load from mdx or simple JSX
8) Admin page lists tenants with create suspend delete, plus a simple table of recent AuditLog rows

SHADCN AND STYLES
1) Install shadcn and generate Button Card Tabs Table Dialog Input Label Badge Breadcrumb Tooltip
2) globals.css
   .button-base { height: 40px; min-width: 140px; padding-left: 16px; padding-right: 16px; border-radius: 12px }
   .card-glass { backdrop-filter: blur(10px); background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.3) }
   Apply .button-base to every primary action button across pages
3) Use neutral palette and ensure text remains readable on glass cards

SEED SCRIPT
1) Two tenants Alder Advisors and Birch Planning
2) One platform_admin user
3) One broker per tenant with argon2 hashed passwords test1234
4) Pricing per tenant and a few sample clients, one signed will with checksum, and a couple of notes and tasks

TESTS
1) Playwright happy path
   login as broker
   create client
   start wizard fill minimal fields
   generate preview
   send for approval
   complete attestation
   see signed document in storage
2) Vitest unit tests
   zod validators for client and will updates
   revenue calculation helper returns broker ninety percent platform ten percent
3) Simple API scoping test that proves a user cannot read another tenant’s client

ENVIRONMENT
Create .env with
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
STORAGE_BUCKET or LOCAL temp path
Use Prisma migrate dev to create schema. Use seed.ts to populate data. Provide npm scripts dev test seed.

NON FUNCTIONAL
1) Add basic rate limiting middleware for API routes using memory store stub
2) Log audit events for LOGIN CREATE_CLIENT UPDATE_WILL DOWNLOAD_DOC RELEASE_COPY and ATTEST_LOCKED
3) Return consistent API error shape with code message details

DELIVERABLE
A running Next.js app that meets the MVP acceptances and passes the happy path Playwright test. Feature flags exist for future aiAssistant and aiIntake without implementing them yet. The UI follows shadcn with glass cards and all primary buttons using .button-base sizing.
