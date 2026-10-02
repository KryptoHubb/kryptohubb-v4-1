# KryptoHubb — Higher Architecture Plan

This document maps the V4 foundation to the upgraded KryptoHubb concept. It is intentionally separated into implementation phases so working code is preserved and each stage can be tested before the next stage.

## Current V4 foundation

- React + TypeScript + Vite frontend
- Express API
- PostgreSQL schema and migration foundation
- Registration/login/session foundation
- Customer workspace shell
- Admin dashboard and user listing
- Assets, wallets, deposits, withdrawals, orders, trades, KYC, support and audit-log schema foundations
- Sandbox-only financial actions

## Completed in this upgrade batch

1. Public conversion buttons no longer pretend to create accounts locally.
   - Start trading / Create account routes to registration.
   - Login routes to login.
   - Market actions scroll to the market section.
2. Customer workspace now checks `/api/me` before rendering.
   - Unauthenticated users are sent to `/login`.
   - Session identity is displayed in the workspace shell.
   - Sign out now revokes the server session before returning to login.
3. Admin dashboard now checks the authenticated session before rendering.
   - Only `ADMIN` and `SUPER_ADMIN` roles enter the current admin area.
   - Non-admin users are redirected to the customer app.
   - Admin identity and role are visible in the admin shell.
4. Added a shared client session helper at `client/src/lib/auth.ts`.

## Next implementation sequence

### Phase A — Authentication hardening

- Validate registration and password policy consistently.
- Add email verification.
- Add password reset and recovery.
- Add MFA/2FA for administrators.
- Add rate limiting and security headers.
- Add CSRF protection for cookie-authenticated mutations.
- Remove the development fallback secret/pepper from production paths.

### Phase B — Admin/RBAC architecture

Target administrative access model:

- Master Admin: full system access, including sensitive KYC data during the permitted retention period.
- Admin 2: operations access without sensitive KYC data.
- Admin 3: support/monitoring access without sensitive KYC data.

Permissions must be enforced server-side. The frontend must never be the security boundary.

Add a permission matrix and middleware so access is based on explicit capabilities rather than scattered role checks.

### Phase C — KYC architecture

Development flow:

Registration → personal information → KYC submission → verification → KYC status/reference → retention timer → secure deletion of sensitive data when permitted.

For development, use test data only. Real identity verification should use an appropriate regulated KYC/AML provider when KryptoHubb moves toward real financial activity.

The database should retain appropriate non-sensitive verification references, status, timestamps and security/audit records after sensitive data is deleted. Retention must remain configurable and comply with the applicable jurisdictional requirements.

### Phase D — Wallet and ledger foundation

- Asset balances
- Available vs locked balances
- Deposits
- Withdrawals
- Internal transfers where appropriate
- Transaction history
- Immutable transaction/event records
- Double-entry ledger before any real-money launch

Do not treat a mutable wallet balance alone as the source of truth for a real financial system.

### Phase E — Trading engine

Sandbox first:

Market data → order validation → order record → simulated execution → trade record → ledger/balance update → history.

Later, if legally and operationally appropriate:

Market provider/exchange integration → risk checks → execution → reconciliation.

### Phase F — Operations and risk

- Withdrawal review and approval workflow
- Transaction monitoring
- Account limits
- Fraud/security alerts
- Support tickets
- Audit logging
- Sensitive-data access logging
- Admin action history

### Phase G — Production readiness

Before real customer funds:

- Regulated KYC/AML process
- Custody/payment/exchange integrations
- Double-entry ledger
- MFA
- Rate limiting
- Security headers
- CSRF strategy
- Immutable audit trail
- Automated tests
- Database backups
- Monitoring and error tracking
- Legal/regulatory review for launch jurisdictions

## Non-negotiable boundary

KryptoHubb remains sandbox-only during development. No real customer funds, private keys, or production identity documents should be introduced into the development environment.

## Database upgrade implemented in the current batch

The PostgreSQL schema has now been expanded to support the higher architecture:

- Separate sensitive KYC storage with encrypted payload, retention deadline, deletion marker, and fraud reference.
- Explicit `admin_profiles` tiers: MASTER, OPERATIONS, SUPPORT.
- Financial transaction boundary with idempotency keys.
- Double-entry ledger tables: `ledger_accounts` and `ledger_entries`.
- Wallet/deposit/withdrawal/order/trade constraints and indexes.
- Audit-log indexes for actor and target investigations.
- A non-sensitive `kyc_admin_summary` view that deliberately excludes the encrypted payload.
- Existing V4 roles and tables remain for backward compatibility while the backend permission model is upgraded.

Important: the database schema is an architecture foundation. The application still needs transactional ledger-posting services, backend permission middleware, KYC retention cleanup jobs, and tests before any real-money use.
