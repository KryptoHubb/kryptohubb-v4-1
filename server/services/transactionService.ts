import { dbQuery } from "../db.js";

export type TransactionStatus = "PENDING" | "POSTED" | "REVERSED" | "FAILED";

export type CreateTransactionInput = {
  transactionType: string;
  referenceType: string;
  referenceId: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
  createdBy?: string | null;
};

export type FinancialTransaction = {
  id: string;
  transactionType: string;
  referenceType: string;
  referenceId: string;
  idempotencyKey: string;
  status: TransactionStatus;
  metadata: Record<string, unknown>;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Creates a financial transaction boundary.
 *
 * This does NOT move money by itself.
 * Ledger entries and balance changes will be handled by
 * the appropriate services later.
 *
 * The idempotency key prevents the same financial request
 * from being processed more than once.
 */
export async function createTransaction(
  input: CreateTransactionInput
): Promise<FinancialTransaction> {
  const existing = await dbQuery<FinancialTransaction>(
    `
      SELECT
        id,
        transaction_type AS "transactionType",
        reference_type AS "referenceType",
        reference_id AS "referenceId",
        idempotency_key AS "idempotencyKey",
        status,
        metadata,
        created_by AS "createdBy",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM financial_transactions
      WHERE idempotency_key = $1
      LIMIT 1
    `,
    [input.idempotencyKey]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const result = await dbQuery<FinancialTransaction>(
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
      VALUES ($1, $2, $3, $4, 'PENDING', $5::jsonb, $6)
      RETURNING
        id,
        transaction_type AS "transactionType",
        reference_type AS "referenceType",
        reference_id AS "referenceId",
        idempotency_key AS "idempotencyKey",
        status,
        metadata,
        created_by AS "createdBy",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
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

  return result.rows[0];
}

/**
 * Retrieves a financial transaction by its database ID.
 */
export async function getTransaction(
  transactionId: string
): Promise<FinancialTransaction | null> {
  const result = await dbQuery<FinancialTransaction>(
    `
      SELECT
        id,
        transaction_type AS "transactionType",
        reference_type AS "referenceType",
        reference_id AS "referenceId",
        idempotency_key AS "idempotencyKey",
        status,
        metadata,
        created_by AS "createdBy",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM financial_transactions
      WHERE id = $1
      LIMIT 1
    `,
    [transactionId]
  );

  return result.rows[0] ?? null;
}

/**
 * Updates the lifecycle status of a transaction.
 *
 * Business rules around when a transaction may move between
 * statuses will be enforced more strictly as the ledger,
 * provider and risk services are added.
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: TransactionStatus
): Promise<FinancialTransaction> {
  const result = await dbQuery<FinancialTransaction>(
    `
      UPDATE financial_transactions
      SET
        status = $2,
        updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        transaction_type AS "transactionType",
        reference_type AS "referenceType",
        reference_id AS "referenceId",
        idempotency_key AS "idempotencyKey",
        status,
        metadata,
        created_by AS "createdBy",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [transactionId, status]
  );

  if (result.rows.length === 0) {
    throw new Error(`Financial transaction not found: ${transactionId}`);
  }

  return result.rows[0];
}
