# KryptoHubb production roadmap

## Implemented in this foundation

- Public landing page preserved.
- User registration/login API and session foundation.
- Customer dashboard route at `/app`.
- Admin dashboard route at `/admin` with role check.
- API health endpoint at `/api/health`.
- PostgreSQL production schema covering users, KYC, assets, wallets, deposits, withdrawals, orders, trades, support and audit logs.
- Environment template.

## Still required before real money

1. Replace in-memory auth/session store with PostgreSQL + secure server-side sessions.
2. Add email verification, password reset and mandatory MFA for admins.
3. Add rate limiting, CSRF strategy, security headers, structured audit logging and secret management.
4. Connect a regulated KYC/AML provider appropriate to the launch jurisdiction.
5. Connect a regulated payment provider and/or crypto custody provider; do not store customer private keys in the web application.
6. Connect market data over server-side APIs/WebSockets.
7. Build the order/risk/ledger system and reconcile every balance-changing event.
8. Add withdrawal review, transaction monitoring and immutable audit trails.
9. Add automated tests, migrations, backups, monitoring and error tracking.
10. Complete legal/regulatory review for the jurisdictions in which KryptoHubb will operate.

The current auth implementation is a development scaffold. It is not suitable for holding real customer funds until the production items above are completed.

## Phase 2 implemented in this foundation

- PostgreSQL connection pool via `DATABASE_URL`
- Persistent users and hashed passwords
- Persistent server-side sessions stored as token hashes
- HttpOnly session cookie for browser authentication
- Admin seed account from environment variables
- Admin user listing endpoint
- Database-backed admin summary counts
- PostgreSQL schema migration script: `npm run db:migrate` / `pnpm db:migrate`

## Before enabling real money

- Add email verification and password-reset flows
- Add MFA/2FA and recovery controls
- Add KYC/AML provider integration and jurisdiction rules
- Add immutable ledger and double-entry accounting
- Add regulated payment/custody/exchange integrations in sandbox first
- Add withdrawal risk controls, limits, approval workflows and audit trails
- Add rate limiting, CSRF protections for cookie-authenticated mutations, security headers and centralized logging
- Add automated tests and production observability
