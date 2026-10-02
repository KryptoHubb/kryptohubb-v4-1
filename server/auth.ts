import crypto from "crypto";
import { dbQuery, getPool } from "./db";

type Role =
  | "USER"
  | "ADMIN"
  | "SUPER_ADMIN"
  | "COMPLIANCE"
  | "FINANCE"
  | "SUPPORT"
  | "VIEW_ONLY";
type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: string;
};

const memoryUsers = new Map<string, User>();
const memorySessions = new Map<string, { userId: string; expires: number }>();

function hash(password: string) {
  return crypto
    .scryptSync(
      password,
      process.env.AUTH_PEPPER || "kryptohubb-dev-pepper",
      32
    )
    .toString("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function seed() {
  if (!getPool()) {
    if (!memoryUsers.size) {
      const p = hash(process.env.ADMIN_PASSWORD || "ChangeMeNow!123");
      memoryUsers.set("admin", {
        id: "admin",
        name: "KryptoHubb Admin",
        email: normalizeEmail(
          process.env.ADMIN_EMAIL || "admin@kryptohubb.local"
        ),
        passwordHash: p,
        role: "SUPER_ADMIN",
        status: "ACTIVE",
      });
    }
    return;
  }
  const email = normalizeEmail(
    process.env.ADMIN_EMAIL || "admin@kryptohubb.local"
  );
  const password = process.env.ADMIN_PASSWORD || "ChangeMeNow!123";
  const exists = await dbQuery<{ id: string }>(
    "SELECT id FROM users WHERE email=$1",
    [email]
  );
  if (!exists.rowCount) {
    await dbQuery(
      "INSERT INTO users (email, full_name, password_hash, role, status, email_verified_at) VALUES ($1,$2,$3,'SUPER_ADMIN','ACTIVE',now())",
      [email, "KryptoHubb Admin", hash(password)]
    );
  }
}

export async function register(name: string, email: string, password: string) {
  email = normalizeEmail(email);
  if (getPool()) {
    const existing = await dbQuery("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    if (existing.rowCount) throw new Error("Email already registered");
    const result = await dbQuery<User>(
      "INSERT INTO users (email,full_name,password_hash,role,status) VALUES ($1,$2,$3,'USER','ACTIVE') RETURNING id, full_name AS name, email, password_hash AS \"passwordHash\", role, status",
      [email, name.trim(), hash(password)]
    );
    await dbQuery("INSERT INTO kyc_profiles (user_id) VALUES ($1)", [
      result.rows[0].id,
    ]);
    return createSession(result.rows[0]);
  }
  if ([...memoryUsers.values()].some(u => u.email === email))
    throw new Error("Email already registered");
  const id = crypto.randomUUID();
  const user = {
    id,
    name: name.trim(),
    email,
    passwordHash: hash(password),
    role: "USER" as Role,
    status: "ACTIVE",
  };
  memoryUsers.set(id, user);
  return createSession(user);
}

export async function login(email: string, password: string) {
  email = normalizeEmail(email);
  if (getPool()) {
    const result = await dbQuery<User>(
      'SELECT id, full_name AS name, email, password_hash AS "passwordHash", role, status FROM users WHERE email=$1 LIMIT 1',
      [email]
    );
    const user = result.rows[0];
    if (
      !user ||
      !user.passwordHash ||
      user.passwordHash !== hash(password) ||
      ["SUSPENDED", "CLOSED"].includes(user.status)
    )
      throw new Error("Invalid email or password");
    return createSession(user);
  }
  const user = [...memoryUsers.values()].find(u => u.email === email);
  if (!user || user.passwordHash !== hash(password))
    throw new Error("Invalid email or password");
  return createSession(user);
}

async function createSession(user: User) {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  if (getPool()) {
    await dbQuery(
      "INSERT INTO sessions (token_hash,user_id,expires_at) VALUES ($1,$2,$3)",
      [hash(sessionId), user.id, expires]
    );
  } else {
    memorySessions.set(sessionId, {
      userId: user.id,
      expires: expires.getTime(),
    });
  }
  return { sessionId, user: publicUser(user) };
}

export async function getSession(id: string | undefined) {
  if (!id) return null;
  if (getPool()) {
    const result = await dbQuery<User>(
      'SELECT u.id, u.full_name AS name, u.email, u.password_hash AS "passwordHash", u.role, u.status FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now() LIMIT 1',
      [hash(id)]
    );
    return result.rows[0] || null;
  }
  const s = memorySessions.get(id);
  if (!s || s.expires < Date.now()) {
    if (s) memorySessions.delete(id);
    return null;
  }
  return memoryUsers.get(s.userId) || null;
}

export async function revokeSession(id: string | undefined) {
  if (!id) return;
  if (getPool())
    await dbQuery("DELETE FROM sessions WHERE token_hash=$1", [hash(id)]);
  else memorySessions.delete(id);
}

function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function counts() {
  if (!getPool())
    return {
      users: memoryUsers.size,
      deposits: 0,
      withdrawals: 0,
      trades: 0,
      pendingKyc: 0,
      pendingWithdrawals: 0,
      openTickets: 0,
    };
  const q = await dbQuery<{
    users: string;
    deposits: string;
    withdrawals: string;
    trades: string;
    pendingkyc: string;
    pendingwithdrawals: string;
    opentickets: string;
  }>(`
    SELECT
      (SELECT count(*) FROM users) users,
      (SELECT count(*) FROM deposits) deposits,
      (SELECT count(*) FROM withdrawals) withdrawals,
      (SELECT count(*) FROM trades) trades,
      (SELECT count(*) FROM kyc_profiles WHERE status='PENDING') pendingKyc,
      (SELECT count(*) FROM withdrawals WHERE status='PENDING') pendingWithdrawals,
      (SELECT count(*) FROM support_tickets WHERE status IN ('OPEN','PENDING')) openTickets
  `);
  const row = q.rows[0] as any;
  return {
    users: Number(row.users),
    deposits: Number(row.deposits),
    withdrawals: Number(row.withdrawals),
    trades: Number(row.trades),
    pendingKyc: Number(row.pendingkyc),
    pendingWithdrawals: Number(row.pendingwithdrawals),
    openTickets: Number(row.opentickets),
  };
}

export async function listUsers(limit = 50) {
  if (!getPool())
    return [...memoryUsers.values()].map(publicUser).slice(0, limit);
  const r = await dbQuery(
    'SELECT id,full_name AS name,email,role,status,created_at AS "createdAt" FROM users ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
  return r.rows;
}
