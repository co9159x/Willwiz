# scenario.md — Context Walkthrough

## actors
Sarah is a broker at Alder Advisors.  
John Davies is Sarah client.  
Priya is the platform admin.

## day 1 onboarding and first draft
1. Priya creates a new tenant named Alder Advisors and the first broker user Sarah.  
2. Sarah logs in and sees a clean dashboard with zero counts for clients, drafts, attestations and revenue.  
3. Sarah adds John Davies with email, phone, date of birth and address.  
4. On John profile, Sarah opens the Will Wizard, completes personal information, executors, beneficiaries, and adds guardianship for the children.  
5. Auto save fires as she moves between steps and a draft preview renders with a visible Draft watermark.  
6. Sarah sends the draft for approval and an audit event is written.

## day 2 approval and attestation
1. John reviews the draft and confirms he is ready to sign.  
2. Sarah chooses a Zoom attestation and schedules it.  
3. During the call Sarah completes the checklist for ID verification, witness presence and signatures.  
4. She locks the will. The system generates a final PDF, stores it, records the checksum, and prevents further editing.  
5. The signed will appears in storage with status Signed and the dashboard updates Attestations complete.

## day 14 release a copy and pricing change
1. John asks for another copy. Sarah clicks Release copy. The app creates a short lived download link and writes an audit record.  
2. Sarah updates Single Will price to two hundred pounds.  
3. The dashboard shows revenue this month with broker share ninety percent and platform share ten percent.

## month 3 cross tenant isolation
1. A user at Birch Planning pastes a URL for John document by mistake. The request is denied by row level security and an alert is logged.  
2. Priya reviews audit logs, confirms isolation is working, and closes the case.

## year 1 SaaS features arrive
1. Sarah enables the AI assistant and AI Intake Mode for her tenant.  
2. John requests an explanation in Spanish. The assistant returns a plain language summary with the disclaimer at the top and logs the language code and model version.  
3. John completes the intake conversation in Spanish. The system validates residue at one hundred percent, flags no risks, and produces a structured Will JSON that pre fills the wizard.  
4. Sarah reviews the bilingual intake view, makes a small edit to executors, approves the intake, and generates a fresh draft.  
5. Sarah opens Analytics and sees that most drop off occurs at the executors step. She adds a tip in the UI next to executors and watches the rate improve the next week.  
6. Sarah invoices John through Stripe. Payment succeeds and the platform automatically issues a ten percent commission invoice to Sarah.  
7. A client requests digital signing on a new will. The signing ceremony completes, the PDF is returned, checksum recorded, and the file is locked with audit entries.

## resilience drill
1. A simulated storage outage routes reads to a secondary replica and signed wills remain accessible.  
2. A backup restore to staging succeeds and passes smoke tests within the target recovery time.

## takeaway
This scenario validates the happy path, cross tenant isolation, auditability, pricing logic, AI explanations and intake in any language, payments, digital signing, analytics insights, and operational resilience. It proves understanding of both the MVP and the full SaaS roadmap.
