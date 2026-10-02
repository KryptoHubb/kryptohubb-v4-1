import { dbQuery } from "../db.js";

export type SupportedCurrency = {
  code: string;
  name: string;
  currencyType: "FIAT" | "CRYPTO";
  enabled: boolean;
  decimalPlaces: number;
};

export type ExchangeRate = {
  id: string;
  baseCurrency: string;
  quoteCurrency: string;
  rate: string;
  provider: string;
  providerReference: string | null;
  observedAt: Date;
  expiresAt: Date | null;
};

export type SaveExchangeRateInput = {
  baseCurrency: string;
  quoteCurrency: string;
  rate: string;
  provider: string;
  providerReference?: string | null;
  observedAt: Date;
  expiresAt?: Date | null;
};

function normalizeCurrency(code: string): string {
  return code.trim().toUpperCase();
}

function validateRate(rate: string): void {
  if (!/^\d+(?:\.\d{1,18})?$/.test(rate)) {
    throw new Error(
      "Exchange rate must be a positive decimal with at most 18 decimal places."
    );
  }

  if (/^0+(?:\.0{1,18})?$/.test(rate)) {
    throw new Error("Exchange rate must be greater than zero.");
  }
}

async function assertSupportedCurrency(code: string): Promise<void> {
  const result = await dbQuery<{ enabled: boolean }>(
    `
      SELECT enabled
      FROM supported_currencies
      WHERE code = $1
      LIMIT 1
    `,
    [code]
  );

  const currency = result.rows[0];

  if (!currency) {
    throw new Error(`Unsupported currency: ${code}`);
  }

  if (!currency.enabled) {
    throw new Error(`Currency is disabled: ${code}`);
  }
}

export async function listSupportedCurrencies(): Promise<SupportedCurrency[]> {
  const result = await dbQuery<{
    code: string;
    name: string;
    currency_type: "FIAT" | "CRYPTO";
    enabled: boolean;
    decimal_places: number;
  }>(
    `
      SELECT
        code,
        name,
        currency_type,
        enabled,
        decimal_places
      FROM supported_currencies
      WHERE enabled = true
      ORDER BY currency_type, code
    `
  );

  return result.rows.map(row => ({
    code: row.code,
    name: row.name,
    currencyType: row.currency_type,
    enabled: row.enabled,
    decimalPlaces: row.decimal_places,
  }));
}

export async function saveExchangeRate(
  input: SaveExchangeRateInput
): Promise<ExchangeRate> {
  const baseCurrency = normalizeCurrency(input.baseCurrency);
  const quoteCurrency = normalizeCurrency(input.quoteCurrency);

  if (baseCurrency === quoteCurrency) {
    throw new Error("Base and quote currencies must be different.");
  }

  if (!input.provider.trim()) {
    throw new Error("Exchange-rate provider is required.");
  }

  validateRate(input.rate);

  if (input.expiresAt && input.expiresAt <= input.observedAt) {
    throw new Error("Exchange-rate expiry must be after the observed time.");
  }

  await assertSupportedCurrency(baseCurrency);
  await assertSupportedCurrency(quoteCurrency);

  const result = await dbQuery<{
    id: string;
    base_currency: string;
    quote_currency: string;
    rate: string;
    provider: string;
    provider_reference: string | null;
    observed_at: Date;
    expires_at: Date | null;
  }>(
    `
      INSERT INTO exchange_rates (
        base_currency,
        quote_currency,
        rate,
        provider,
        provider_reference,
        observed_at,
        expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (
        base_currency,
        quote_currency,
        provider,
        observed_at
      )
      DO UPDATE SET
        rate = EXCLUDED.rate,
        provider_reference = EXCLUDED.provider_reference,
        expires_at = EXCLUDED.expires_at
      RETURNING
        id,
        base_currency,
        quote_currency,
        rate,
        provider,
        provider_reference,
        observed_at,
        expires_at
    `,
    [
      baseCurrency,
      quoteCurrency,
      input.rate,
      input.provider.trim(),
      input.providerReference ?? null,
      input.observedAt,
      input.expiresAt ?? null,
    ]
  );

  const row = result.rows[0];

  return {
    id: row.id,
    baseCurrency: row.base_currency,
    quoteCurrency: row.quote_currency,
    rate: row.rate,
    provider: row.provider,
    providerReference: row.provider_reference,
    observedAt: row.observed_at,
    expiresAt: row.expires_at,
  };
}

export async function getLatestExchangeRate(
  baseCurrency: string,
  quoteCurrency: string
): Promise<ExchangeRate | null> {
  const result = await dbQuery<{
    id: string;
    base_currency: string;
    quote_currency: string;
    rate: string;
    provider: string;
    provider_reference: string | null;
    observed_at: Date;
    expires_at: Date | null;
  }>(
    `
      SELECT
        id,
        base_currency,
        quote_currency,
        rate,
        provider,
        provider_reference,
        observed_at,
        expires_at
      FROM exchange_rates
      WHERE base_currency = $1
        AND quote_currency = $2
      ORDER BY observed_at DESC
      LIMIT 1
    `,
    [normalizeCurrency(baseCurrency), normalizeCurrency(quoteCurrency)]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    baseCurrency: row.base_currency,
    quoteCurrency: row.quote_currency,
    rate: row.rate,
    provider: row.provider,
    providerReference: row.provider_reference,
    observedAt: row.observed_at,
    expiresAt: row.expires_at,
  };
}

export async function getFreshExchangeRate(
  baseCurrency: string,
  quoteCurrency: string
): Promise<ExchangeRate | null> {
  const result = await dbQuery<{
    id: string;
    base_currency: string;
    quote_currency: string;
    rate: string;
    provider: string;
    provider_reference: string | null;
    observed_at: Date;
    expires_at: Date | null;
  }>(
    `
      SELECT
        id,
        base_currency,
        quote_currency,
        rate,
        provider,
        provider_reference,
        observed_at,
        expires_at
      FROM exchange_rates
      WHERE base_currency = $1
        AND quote_currency = $2
        AND (
          expires_at IS NULL
          OR expires_at > now()
        )
      ORDER BY observed_at DESC
      LIMIT 1
    `,
    [normalizeCurrency(baseCurrency), normalizeCurrency(quoteCurrency)]
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    baseCurrency: row.base_currency,
    quoteCurrency: row.quote_currency,
    rate: row.rate,
    provider: row.provider,
    providerReference: row.provider_reference,
    observedAt: row.observed_at,
    expiresAt: row.expires_at,
  };
}
