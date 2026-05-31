# Supabase/Auth Architecture Proposal

This is an architecture proposal only. It does not implement Supabase, authentication, backend persistence, database migrations, lender integrations, or user-data sync.

## Why Supabase Later

Supabase can become useful when the CreditCrest ecosystem needs authenticated user profiles, cross-device continuity, consent records, audit trails, and controlled backend persistence.

For the current prototype, local-only storage is appropriate because the app is educational, synthetic, and privacy-minimal. Supabase should be introduced only when the product has a clear reason to sync user data or support account-based experiences.

## Auth Goals

Future authentication should:

- Let users save educational profiles across devices
- Keep Financial Snapshot and simulation history under user control
- Support explicit consent before syncing local data
- Avoid collecting sensitive identifiers by default
- Provide a foundation for audit logging and compliance review
- Keep CreditCrest AI and CrestLend aligned under one account model

## Recommended Auth Methods

Initial recommended methods:

- Email/password
- Magic link or OTP

Optional later methods:

- OAuth providers such as Google or Apple, after privacy and mobile-store disclosure review

Avoid adding authentication until cloud sync, consent, and data deletion behavior are designed together.

## User Profile Model

A future user profile should contain minimal metadata:

- User id from Supabase Auth
- Display name or nickname
- Product preferences
- Primary learning goal
- Created timestamp
- Updated timestamp
- Consent state

The profile should not contain sensitive identifiers. Any richer financial profile should live in purpose-specific tables with clear consent and retention rules.

## Local Snapshot To Cloud Profile Migration

Financial Snapshot currently lives in browser localStorage. A future migration should be explicit:

1. User creates an account.
2. App detects an existing local Financial Snapshot.
3. App explains what fields would be copied.
4. User gives explicit consent to sync.
5. App writes the snapshot to the authenticated user's cloud profile.
6. App records a consent event and audit event.
7. User can delete the cloud profile data later.

No silent upload should occur.

## RLS-First Database Model

Supabase tables should be designed with Row Level Security from day one.

Default rule:

- Users can read and write only their own rows.
- Service role access is limited to trusted server-side operations.
- No client should receive elevated credentials.
- Public read access should be disabled unless a table is intentionally public and contains no user data.

## Sensitive Data Boundaries

Do not store these initially:

- SSNs
- Bank credentials
- Credit bureau credentials
- Identity documents
- Raw lender underwriting decisions
- Account numbers
- Full dates of birth
- Real credit bureau reports
- Real bank transaction feeds
- Real income verification documents

If future integrations require any sensitive data, they need legal, security, privacy, and compliance review before implementation.

## Suggested Future Tables

### `profiles`

Stores minimal account metadata linked to Supabase Auth users.

Suggested fields:

- `id`
- `user_id`
- `display_name`
- `primary_goal`
- `created_at`
- `updated_at`

### `financial_snapshots`

Stores user-consented educational profile estimates.

Suggested fields:

- `id`
- `user_id`
- `monthly_income_estimate`
- `monthly_debt_obligations`
- `credit_card_balance`
- `credit_card_limit`
- `recent_inquiries`
- `missed_payment_history`
- `oldest_account_age_months`
- `primary_goal`
- `created_at`
- `updated_at`

### `lending_preferences`

Stores sandbox lending journey preferences.

Suggested fields:

- `id`
- `user_id`
- `loan_purpose`
- `preferred_term_range`
- `risk_comfort`
- `education_focus`
- `created_at`
- `updated_at`

### `simulation_history`

Stores optional saved simulations for continuity.

Suggested fields:

- `id`
- `user_id`
- `product_area`
- `scenario_type`
- `input_summary`
- `result_summary`
- `created_at`

Do not store sensitive raw application data.

### `consent_events`

Records user consent decisions.

Suggested fields:

- `id`
- `user_id`
- `event_type`
- `consent_version`
- `summary`
- `created_at`

### `audit_events`

Records security-relevant account and data events.

Suggested fields:

- `id`
- `user_id`
- `event_type`
- `actor_type`
- `metadata`
- `created_at`

## Security Principles

- Row Level Security on every user-data table
- Least privilege for clients, services, and administrative operations
- Server-side secrets only
- No lender integrations without compliance review
- Explicit consent logs before syncing or sharing user data
- No sensitive data in URLs, analytics, client logs, or error traces
- Separate sandbox/test environments from production
- Document retention, deletion, and export behavior before launch

## Integration Phases

### Phase 0: Local-Only Prototype

Current state. CreditCrest AI uses synthetic demo data and browser localStorage. No auth, backend persistence, lender integrations, or user-data sync.

### Phase 1: Auth + Cloud Profile Sync

Add Supabase Auth and user-controlled profile sync. Keep data minimal. Require explicit consent before migrating local snapshots to the cloud.

### Phase 2: Consent + Audit Logging

Add consent event logging, audit event logging, privacy-version tracking, and user-facing data deletion controls.

### Phase 3: Partner/Lender Sandbox API

Introduce sandbox-only partner or lender API simulations. Keep all offers clearly marked as synthetic or sandbox. Do not submit real applications.

### Phase 4: Production Lender Integrations After Legal Review

Only after legal, compliance, privacy, and security review, consider production lender integrations. This phase requires real disclosures, vendor review, data-sharing controls, licensing analysis, monitoring, and incident response planning.

## Open Questions

- Is the ecosystem primarily B2C or B2B2C?
- What licensing or partner model would apply before real lending workflows?
- What data retention and deletion windows are appropriate?
- How must the privacy policy and disclaimer change for authenticated profiles?
- What Google Play and Apple App Store declarations are required for CrestLend?
- What consumer finance compliance review is required before any production lender integration?
- Should CreditCrest AI and CrestLend share one account system or remain loosely connected?
- What data export controls should exist for users?

## Non-Goals For This Pass

- No Supabase packages
- No auth flows
- No backend persistence
- No environment variables
- No database migrations
- No real lending integrations
- No user-data sync
