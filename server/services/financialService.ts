import { dbTransaction } from "../db.js";

export type FinancialEntryInput = {
  accountId: string;
  entryType: "DEBIT" | "CREDIT";
  amount: string;
};

export type CreateFinancialOperationInput = {
  transactionType: string;
  referenceType: string;
  referenceId: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
  createdBy?: string | null;
  entries: FinancialEntryInput[];
};

export type FinancialOperationResult = {
  transactionId: string;
  status: "POSTED";
  entries: Array<{
    id: string;
    accountId: string;
    entryType: "DEBIT" | "CREDIT";
    amount: string;
  }>;
};

/**
 * Creates and posts a balanced financial operation.
 *
 * Everything happens inside one PostgreSQL transaction.
 *
 * If any step fails:
 * - financial transaction is not committed
 * - ledger entries are not committed
 * - database changes are rolled back
 *
 * This function does NOT call external providers.
 * Provider confirmation will be added later.
 */
export async function createFinancialOperation(
  input: CreateFinancialOperationInput
): Promise<FinancialOperationResult> {
  if (!input.entries.length) {
    throw new Error("A financial operation requires ledger entries");
  }
  for (const entry of input.entries) {
    if (!/^\d+(?:\.\d{1,18})?$/.test(entry.amount)) {
      throw new Error(`Invalid ledger amount: ${entry.amount}`);
    }

    if (/^0+(?:\.0{1,18})?$/.test(entry.amount)) {
      throw new Error("Ledger entry amounts must be greater than zero");
    }
  }

  return dbTransaction(async client => {
    /*
     * First check whether this idempotency key was already processed.
     */
    const existingTransaction = await client.query<{
      id: string;
      status: "PENDING" | "POSTED" | "REVERSED" | "FAILED";
    }>(
      `
        SELECT
          id,
          status
        FROM financial_transactions
        WHERE idempotency_key = $1
        LIMIT 1
      `,
      [input.idempotencyKey]
    );

    if (existingTransaction.rows.length > 0) {
      const existing = existingTransaction.rows[0];

      if (existing.status !== "POSTED") {
        throw new Error(
          `Transaction already exists with status: ${existing.status}`
        );
      }

      const existingEntries = await client.query<{
        id: string;
        accountId: string;
        entryType: "DEBIT" | "CREDIT";
        amount: string;
      }>(
        `
          SELECT
            id,
            account_id AS "accountId",
            entry_type AS "entryType",
            amount::text AS amount
          FROM ledger_entries
          WHERE transaction_id = $1
          ORDER BY created_at ASC
        `,
        [existing.id]
      );

      return {
        transactionId: existing.id,
        status: "POSTED",
        entries: existingEntries.rows,
      };
    }

    /*
     * Create the financial transaction boundary.
     */
    const transactionResult = await client.query<{
      id: string;
    }>(
      `
        INSERT INTO financial_transactions (
          transaction_type,
          reference_type,
          reference_id,
          idempotency_key,
          status,
          metadata,
          created_by
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          'PENDING',
          $5::jsonb,
          $6
        )
        RETURNING id
      `,
      [
        input.transactionType,
        input.referenceType,
        input.referenceId,
        input.idempotencyKey,
        JSON.stringify(input.metadata ?? {}),
        input.createdBy ?? null,
      ]
    );

    const transactionId = transactionResult.rows[0].id;

    /*
     * Create the ledger entries.
     */
    const createdEntries: FinancialOperationResult["entries"] = [];

    for (const entry of input.entries) {
      const accountResult = await client.query<{
        id: string;
        active: boolean;
      }>(
        `
          SELECT
            id,
            active
          FROM ledger_accounts
          WHERE id = $1
          FOR UPDATE
        `,
        [entry.accountId]
      );

      if (accountResult.rows.length === 0) {
        throw new Error(`Ledger account not found: ${entry.accountId}`);
      }

      if (!accountResult.rows[0].active) {
        throw new Error(`Ledger account is inactive: ${entry.accountId}`);
      }

      const entryResult = await client.query<{
        id: string;
        accountId: string;
        entryType: "DEBIT" | "CREDIT";
        amount: string;
      }>(
        `
          INSERT INTO ledger_entries (
            transaction_id,
            account_id,
            entry_type,
            amount
          )
          VALUES ($1, $2, $3, $4)
          RETURNING
            id,
            account_id AS "accountId",
            entry_type AS "entryType",
            amount::text AS amount
        `,
        [transactionId, entry.accountId, entry.entryType, entry.amount]
      );

      createdEntries.push(entryResult.rows[0]);
    }

    /*
     * Verify the transaction is balanced inside the same
     * database transaction before posting it.
     */
    const balanceResult = await client.query<{
      balanced: boolean;
    }>(
      `
    SELECT
      COALESCE(
        SUM(
          CASE
            WHEN entry_type = 'DEBIT' THEN amount
            ELSE 0
          END
        ),
        0
      ) =
      COALESCE(
        SUM(
          CASE
            WHEN entry_type = 'CREDIT' THEN amount
            ELSE 0
          END
        ),
        0
      ) AS balanced
    FROM ledger_entries
    WHERE transaction_id = $1
  `,
      [transactionId]
    );

    const balance = balanceResult.rows[0];

    if (!balance?.balanced) {
      throw new Error("Financial transaction failed ledger balance check");
    }

    /*
     * Only mark the transaction POSTED after the ledger
     * has successfully balanced.
     */
    await client.query(
      `UPDATE financial_transactions SET status='POSTED' WHERE id=$1`,
      [transactionId]
    );

    return {
      transactionId,
      status: "POSTED",
      entries: createdEntries,
    };
  });
}
