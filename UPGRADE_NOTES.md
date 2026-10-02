# KryptoHubb V4 upgrade notes

## What was inspected

The mastered project already contained a public landing page, registration and login flows, a customer workspace with dashboard, markets, trade, wallet, deposit, withdrawal, orders, history, KYC, and settings routes, plus role-protected admin dashboard and user routes. The server includes an Express API, a PostgreSQL connection layer, an in-memory development fallback, session cookies, a PostgreSQL schema, and an admin summary/users foundation.

## What was upgraded

- Added `client/src/components/ThemeToggle.tsx` as a reusable accessible switch.
- Enabled persistent light/dark mode from `ThemeContext` using `localStorage`, `data-theme`, `color-scheme`, and the existing `.dark` class.
- Added light theme tokens and compatibility overrides in `client/src/index.css` so the existing dark-first Tailwind surfaces remain readable in light mode.
- Added the theme control to the public navigation, authentication screens, customer workspace, and admin dashboard.
- Kept the current authentication, admin APIs, database schema, and sandbox module boundaries intact.
- Refreshed `pnpm-lock.yaml` after removing the stale Vite JSX-location plugin reference from the mastered dependency graph.
- Added `@types/pg`, set the shared TypeScript target to ES2022, and corrected the PostgreSQL query generic so the inherited server foundation passes type checking.

## Verification

- `pnpm check` passes.
- `pnpm build` passes.
- The V4 development preview starts on port 3001 and serves the application.

## Important boundary

Financial actions are still sandbox/UI-only. The project must not accept real customer funds until the production roadmap items are completed: regulated KYC/AML and custody integrations, a double-entry ledger, risk controls, withdrawal review, MFA, rate limiting, immutable audit logging, observability, and legal/regulatory review.
