import { dbQuery } from "../db.js";

export type Wallet = {
  id: string;
  userId: string;
  assetId: string;
  available: string;
  locked: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getWallet(
  userId: string,
  assetId: string
): Promise<Wallet | null> {
  const result = await dbQuery<Wallet>(
    `
      SELECT
        id,
        user_id AS "userId",
        asset_id AS "assetId",
        available::text AS available,
        locked::text AS locked,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM wallets
      WHERE user_id = $1
        AND asset_id = $2
      LIMIT 1
    `,
    [userId, assetId]
  );

  return result.rows[0] ?? null;
}

export async function getUserWallets(userId: string): Promise<Wallet[]> {
  const result = await dbQuery<Wallet>(
    `
      SELECT
        id,
        user_id AS "userId",
        asset_id AS "assetId",
        available::text AS available,
        locked::text AS locked,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM wallets
      WHERE user_id = $1
      ORDER BY created_at ASC
    `,
    [userId]
  );

  return result.rows;
}

/**
 * Creates a wallet for a user and asset.
 *
 * Wallet creation does not deposit funds.
 */
export async function createWallet(
  userId: string,
  assetId: string
): Promise<Wallet> {
  const existing = await getWallet(userId, assetId);

  if (existing) {
    return existing;
  }

  const result = await dbQuery<Wallet>(
    `
      INSERT INTO wallets (
        user_id,
        asset_id,
        available,
        locked
      )
      VALUES ($1, $2, 0, 0)
      RETURNING
        id,
        user_id AS "userId",
        asset_id AS "assetId",
        available::text AS available,
        locked::text AS locked,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [userId, assetId]
  );

  return result.rows[0];
}

/**
 * Locks part of a user's available balance.
 *
 * This is useful for pending withdrawals or orders.
 */
export async function lockWalletFunds(
  walletId: string,
  amount: string
): Promise<Wallet> {
  if (Number(amount) <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const result = await dbQuery<Wallet>(
    `
      UPDATE wallets
      SET
        available = available - $2,
        locked = locked + $2,
        updated_at = NOW()
      WHERE id = $1
        AND available >= $2
      RETURNING
        id,
        user_id AS "userId",
        asset_id AS "assetId",
        available::text AS available,
        locked::text AS locked,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [walletId, amount]
  );

  if (result.rows.length === 0) {
    throw new Error(
      "Unable to lock wallet funds: wallet not found or insufficient available balance"
    );
  }

  return result.rows[0];
}

/**
 * Releases previously locked funds back into available balance.
 */
export async function unlockWalletFunds(
  walletId: string,
  amount: string
): Promise<Wallet> {
  if (Number(amount) <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const result = await dbQuery<Wallet>(
    `
      UPDATE wallets
      SET
        available = available + $2,
        locked = locked - $2,
        updated_at = NOW()
      WHERE id = $1
        AND locked >= $2
      RETURNING
        id,
        user_id AS "userId",
        asset_id AS "assetId",
        available::text AS available,
        locked::text AS locked,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [walletId, amount]
  );

  if (result.rows.length === 0) {
    throw new Error(
      "Unable to unlock wallet funds: wallet not found or insufficient locked balance"
    );
  }

  return result.rows[0];
}

/**
 * Moves locked funds out of the wallet after a successful
 * financial operation.
 *
 * This does not create a ledger entry by itself.
 * The transaction and ledger services remain responsible
 * for accounting records.
 */
export async function consumeLockedFunds(
  walletId: string,
  amount: string
): Promise<Wallet> {
  if (Number(amount) <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  const result = await dbQuery<Wallet>(
    `
      UPDATE wallets
      SET
        locked = locked - $2,
        updated_at = NOW()
      WHERE id = $1
        AND locked >= $2
      RETURNING
        id,
        user_id AS "userId",
        asset_id AS "assetId",
        available::text AS available,
        locked::text AS locked,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [walletId, amount]
  );

  if (result.rows.length === 0) {
    throw new Error(
      "Unable to consume locked funds: wallet not found or insufficient locked balance"
    );
  }

  return result.rows[0];
}
