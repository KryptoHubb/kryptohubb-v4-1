# KryptoHubb live foundation setup

## 1. Install dependencies

Use Node 20+ and pnpm (the repository is configured for pnpm).

```bash
pnpm install
```

The project now requires the `pg` PostgreSQL package. If your lockfile has not been refreshed yet, run:

```bash
pnpm add pg
```

## 2. Configure PostgreSQL

Copy `.env.example` to `.env` and set `DATABASE_URL`, `AUTH_PEPPER`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

Then run:

```bash
pnpm db:migrate
```

The migration creates users, sessions, KYC, wallets, deposits, withdrawals, orders, trades, support tickets and audit logs, and seeds BTC/ETH/USDT/USDC as enabled assets.

## 3. Run

```bash
pnpm dev
```

Production:

```bash
pnpm build
pnpm start
```

## Admin

The first super-admin is seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Change the password before any production deployment. Admin routes are API-protected by role, and browser sessions use an HttpOnly cookie.

## Important

This is still a sandbox financial foundation. Do not accept real customer funds or enable real withdrawals/trading until KYC/AML, jurisdictional compliance, double-entry accounting, custody/payment/exchange integrations, MFA, rate limiting, monitoring, security review and operational controls are implemented and tested.
