import { dbQuery } from "../db.js";

export type LedgerEntryType = "DEBIT" | "CREDIT";

export type LedgerAccountType =
  | "USER_WALLET"
  | "PLATFORM"
  | "FEE"
  | "CLEARING"
  | "SUSPENSE";

export type LedgerEntry = {
  id: string;
  transactionId: string;
  accountId: string;
  entryType: LedgerEntryType;
  amount: string;
  createdAt: Date;
};

export type LedgerAccount = {
  id: string;
  ownerUserId: string | null;
  assetId: string;
  accountType: LedgerAccountType;
  accountName: string;
  active: boolean;
};

/**
 * Retrieves a ledger account.
 */
export async function getLedgerAccount(
  accountId: string
): Promise<LedgerAccount | null> {
  const result = await dbQuery<LedgerAccount>(
    `
      SELECT
        id,
        owner_user_id AS "ownerUserId",
        asset_id AS "assetId",
        account_type AS "accountType",
        account_name AS "accountName",
        active
      FROM ledger_accounts
      WHERE id = $1
      LIMIT 1
    `,
    [accountId]
  );

  return result.rows[0] ?? null;
}

/**
 * Creates a ledger entry for an existing financial transaction.
 *
 * This function records the accounting entry only.
 * It does not independently change a user's wallet balance.
 */
export async function createLedgerEntry(input: {
  transactionId: string;
  accountId: string;
  entryType: LedgerEntryType;
  amount: string;
}): Promise<LedgerEntry> {
  if (Number(input.amount) <= 0) {
    throw new Error("Ledger entry amount must be greater than zero");
  }

  const account = await getLedgerAccount(input.accountId);

  if (!account) {
    throw new Error(`Ledger account not found: ${input.accountId}`);
  }

  if (!account.active) {
    throw new Error(`Ledger account is inactive: ${input.accountId}`);
  }

  const result = await dbQuery<LedgerEntry>(
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
        transaction_id AS "transactionId",
        account_id AS "accountId",
        entry_type AS "entryType",
        amount::text AS amount,
        created_at AS "createdAt"
    `,
    [input.transactionId, input.accountId, input.entryType, input.amount]
  );

  return result.rows[0];
}

/**
 * Returns all ledger entries belonging to a transaction.
 */
export async function getTransactionLedgerEntries(
  transactionId: string
): Promise<LedgerEntry[]> {
  const result = await dbQuery<LedgerEntry>(
    `
      SELECT
        id,
        transaction_id AS "transactionId",
        account_id AS "accountId",
        entry_type AS "entryType",
        amount::text AS amount,
        created_at AS "createdAt"
      FROM ledger_entries
      WHERE transaction_id = $1
      ORDER BY created_at ASC
    `,
    [transactionId]
  );

  return result.rows;
}

/**
 * Checks whether the ledger entries for a transaction are balanced.
 *
 * A properly posted double-entry transaction must have:
 *
 * total debits = total credits
 *
 * This function only checks the ledger.
 * It does not post or modify anything.
 */
export async function isTransactionBalanced(
  transactionId: string
): Promise<boolean> {
  const result = await dbQuery<{ debit: string; credit: string }>(
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
        )::text AS debit,

        COALESCE(
          SUM(
            CASE
              WHEN entry_type = 'CREDIT' THEN amount
              ELSE 0
            END
          ),
          0
        )::text AS credit

      FROM ledger_entries
      WHERE transaction_id = $1
    `,
    [transactionId]
  );

  const row = result.rows[0];

  if (!row) {
    return false;
  }

  return Number(row.debit) === Number(row.credit);
}
