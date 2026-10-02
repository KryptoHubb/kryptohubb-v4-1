-- KryptoHubb PostgreSQL foundation
-- This schema is intentionally sandbox/production-architecture ready.
-- Real-money operation still requires regulated integrations, security review,
-- compliance controls, and operational approval.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('USER','ADMIN','SUPER_ADMIN','COMPLIANCE','FINANCE','SUPPORT','VIEW_ONLY');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('PENDING','ACTIVE','SUSPENDED','CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password_hash TEXT,
  role user_role NOT NULL DEFAULT 'USER',
  status account_status NOT NULL DEFAULT 'PENDING',
  email_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_token_hash_idx ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS kyc_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'NOT_STARTED',
  provider_ref TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sensitive KYC data is kept separate from the normal KYC status record.
-- encrypted_payload must contain application-level encrypted data, not raw documents.
CREATE TABLE IF NOT EXISTS kyc_sensitive_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kyc_profile_id UUID UNIQUE NOT NULL REFERENCES kyc_profiles(id) ON DELETE CASCADE,
  encrypted_payload BYTEA NOT NULL,
  payload_version INTEGER NOT NULL DEFAULT 1,
  retention_until TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ,
  deletion_reason TEXT,
  fraud_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (retention_until > created_at)
);
CREATE INDEX IF NOT EXISTS kyc_sensitive_retention_idx ON kyc_sensitive_records(retention_until) WHERE deleted_at IS NULL;

-- Explicit three-admin access model. This supplements the legacy role enum so
-- older data can continue to exist while permissions become backend-enforced.
CREATE TABLE IF NOT EXISTS admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  admin_tier TEXT NOT NULL CHECK (admin_tier IN ('MASTER','OPERATIONS','SUPPORT')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_profiles_tier_idx ON admin_profiles(admin_tier) WHERE active = true;

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Supported fiat and virtual-asset currencies.
CREATE TABLE IF NOT EXISTS supported_currencies (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  currency_type TEXT NOT NULL CHECK (
    currency_type IN ('FIAT', 'CRYPTO')
  ),
  enabled BOOLEAN NOT NULL DEFAULT true,
  decimal_places INTEGER NOT NULL DEFAULT 2 CHECK (
    decimal_places >= 0 AND decimal_places <= 18
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Initial controlled currency set for KryptoHubb.
INSERT INTO supported_currencies
  (code, name, currency_type, enabled, decimal_places)
VALUES
  ('USD', 'US Dollar', 'FIAT', true, 2),
  ('GHS', 'Ghanaian Cedi', 'FIAT', true, 2),
  ('EUR', 'Euro', 'FIAT', true, 2),
  ('GBP', 'British Pound', 'FIAT', true, 2),
  ('BTC', 'Bitcoin', 'CRYPTO', true, 8),
  ('ETH', 'Ethereum', 'CRYPTO', true, 18),
  ('USDT', 'Tether', 'CRYPTO', true, 6),
  ('USDC', 'USD Coin', 'CRYPTO', true, 6)
ON CONFLICT (code) DO NOTHING;

-- Historical exchange rates received from external providers.
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency TEXT NOT NULL REFERENCES supported_currencies(code),
  quote_currency TEXT NOT NULL REFERENCES supported_currencies(code),
  rate NUMERIC(36,18) NOT NULL CHECK (rate > 0),
  provider TEXT NOT NULL,
  provider_reference TEXT,
  observed_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (
    base_currency,
    quote_currency,
    provider,
    observed_at
  ),
  CHECK (base_currency <> quote_currency)
);

CREATE INDEX IF NOT EXISTS exchange_rates_pair_idx
  ON exchange_rates(base_currency, quote_currency, observed_at DESC);

CREATE INDEX IF NOT EXISTS exchange_rates_provider_idx
  ON exchange_rates(provider, observed_at DESC);

CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES assets(id),
  available NUMERIC(36,18) NOT NULL DEFAULT 0 CHECK (available >= 0),
  locked NUMERIC(36,18) NOT NULL DEFAULT 0 CHECK (locked >= 0),
  UNIQUE(user_id,asset_id)
);

CREATE TABLE IF NOT EXISTS deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  asset_id UUID NOT NULL REFERENCES assets(id),
  amount NUMERIC(36,18) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'PENDING',
  provider_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS deposits_user_idx ON deposits(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  asset_id UUID NOT NULL REFERENCES assets(id),
  amount NUMERIC(36,18) NOT NULL CHECK (amount > 0),
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  approved_by UUID REFERENCES users(id),
  provider_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS withdrawals_user_idx ON withdrawals(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS withdrawals_pending_idx ON withdrawals(status) WHERE status = 'PENDING';

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY','SELL')),
  type TEXT NOT NULL CHECK (type IN ('MARKET','LIMIT')),
  quantity NUMERIC(36,18) NOT NULL CHECK (quantity > 0),
  limit_price NUMERIC(36,18),
  status TEXT NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  price NUMERIC(36,18) NOT NULL CHECK (price >= 0),
  quantity NUMERIC(36,18) NOT NULL CHECK (quantity > 0),
  fee NUMERIC(36,18) NOT NULL DEFAULT 0 CHECK (fee >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Financial transactions provide an idempotent event boundary around ledger entries.
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  idempotency_key TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'POSTED' CHECK (status IN ('PENDING','POSTED','REVERSED','FAILED')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS financial_transactions_reference_idx ON financial_transactions(reference_type, reference_id);

-- Double-entry ledger. Each posted transaction must eventually contain at least
-- one debit and one credit with equal total amounts; application/service logic
-- will enforce the final posting invariant transactionally.
CREATE TABLE IF NOT EXISTS ledger_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ledger_accounts
  DROP CONSTRAINT IF EXISTS ledger_accounts_owner_user_id_asset_id_account_type_key;

CREATE UNIQUE INDEX IF NOT EXISTS ledger_accounts_user_asset_type_key
  ON ledger_accounts(owner_user_id, asset_id, account_type)
  WHERE owner_user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ledger_accounts_system_asset_type_key
  ON ledger_accounts(asset_id, account_type)
  WHERE owner_user_id IS NULL;


CREATE UNIQUE INDEX IF NOT EXISTS ledger_accounts_user_asset_type_key
  ON ledger_accounts(owner_user_id, asset_id, account_type)
  WHERE owner_user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ledger_accounts_system_asset_type_key
  ON ledger_accounts(asset_id, account_type)
  WHERE owner_user_id IS NULL;

CREATE TABLE IF NOT EXISTS ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES financial_transactions(id) ON DELETE RESTRICT,
  account_id UUID NOT NULL REFERENCES ledger_accounts(id) ON DELETE RESTRICT,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('DEBIT','CREDIT')),
  amount NUMERIC(36,18) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ledger_entries_transaction_idx ON ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS ledger_entries_account_idx ON ledger_entries(account_id, created_at DESC);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_target_idx ON audit_logs(target_type, target_id, created_at DESC);

-- Keep the original V4 assets and add a system ledger account for each asset.
INSERT INTO assets (symbol,name)
VALUES ('BTC','Bitcoin'),('ETH','Ethereum'),('USDT','Tether'),('USDC','USD Coin')
ON CONFLICT (symbol) DO NOTHING;

-- Existing SUPER_ADMIN seed users become the first MASTER admin profile.
INSERT INTO admin_profiles (user_id, admin_tier)
SELECT id, 'MASTER' FROM users WHERE role = 'SUPER_ADMIN'
ON CONFLICT (user_id) DO UPDATE SET admin_tier = EXCLUDED.admin_tier;

-- Convenience view for non-sensitive KYC administration. It deliberately excludes
-- encrypted_payload and other sensitive fields.
CREATE OR REPLACE VIEW kyc_admin_summary AS
SELECT
  kp.id,
  kp.user_id,
  kp.status,
  kp.provider_ref,
  kp.reviewed_by,
  kp.reviewed_at,
  ksr.retention_until,
  ksr.deleted_at,
  ksr.fraud_reference
FROM kyc_profiles kp
LEFT JOIN kyc_sensitive_records ksr ON ksr.kyc_profile_id = kp.id;
