# KryptoHubb V4 — Master Development Project

This is the single source of truth combining the original public website, authentication/database foundation, customer workspace and admin foundation.

## VS Code editing map

- `client/src/features/public` — public marketing website
- `client/src/features/auth` — login/register
- `client/src/features/user` — customer application
- `client/src/features/admin` — admin application
- `client/src/components` — reusable UI components
- `server` — Express API/authentication
- `server/db/schema.sql` — PostgreSQL schema
- `scripts/migrate.ts` — database migration

## Customer modules

Dashboard, Portfolio, Markets, Trade, Wallet, Deposit, Withdraw, Orders, Transaction History, KYC and Settings.

## Admin modules

Dashboard and Users are implemented foundations. Navigation is prepared for KYC, Deposits, Withdrawals, Orders, Trades, Assets, Support, Audit Logs and Settings.

## Current status

Authentication can be tested locally with the in-memory fallback when `DATABASE_URL` is not configured. PostgreSQL can be enabled for persistence. Financial actions remain sandbox/UI-only until the double-entry ledger and sandbox transaction engine are implemented.

## Run

```bash
pnpm install
pnpm dev
```

For PostgreSQL, copy `.env.example` to `.env`, configure `DATABASE_URL`, then run `pnpm db:migrate`.

Do not accept real customer funds from this build.
