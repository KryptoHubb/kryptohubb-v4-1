import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import {
  seed,
  register,
  login,
  getSession,
  revokeSession,
  counts,
  listUsers,
} from "./auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

const sessionFrom = (req: express.Request) => {
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (bearer) return bearer;
  const cookie = req.headers.cookie
    ?.split(";")
    .map(v => v.trim())
    .find(v => v.startsWith("kh_session="));
  return cookie?.slice("kh_session=".length);
};
const setSessionCookie = (res: express.Response, token: string) =>
  res.setHeader(
    "Set-Cookie",
    `kh_session=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
  );
const requireUser = async (req: express.Request, res: express.Response) => {
  const user = await getSession(sessionFrom(req));
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return user;
};
const requireAdmin = async (req: express.Request, res: express.Response) => {
  const user = await requireUser(req, res);
  if (!user) return null;
  if (!["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }
  return user;
};

app.get("/api/health", async (_req, res) =>
  res.json({
    ok: true,
    service: "kryptohubb-api",
    mode: process.env.NODE_ENV || "development",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    timestamp: new Date().toISOString(),
  })
);

app.post("/api/auth/register", async (req, res) => {
  const parsed = z
    .object({
      name: z.string().trim().min(2).max(100),
      email: z.string().email().max(255),
      password: z.string().min(8).max(128),
    })
    .safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({
        error:
          "Name, valid email and an 8–128 character password are required.",
      });
  try {
    const result = await register(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password
    );
    setSessionCookie(res, result.sessionId);
    return res.status(201).json({ user: result.user });
  } catch (e) {
    return res
      .status(409)
      .json({ error: e instanceof Error ? e.message : "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = z
    .object({ email: z.string().email(), password: z.string().min(1) })
    .safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Valid email and password are required." });
  try {
    const result = await login(parsed.data.email, parsed.data.password);
    setSessionCookie(res, result.sessionId);
    return res.json({ user: result.user });
  } catch (e) {
    return res
      .status(401)
      .json({ error: e instanceof Error ? e.message : "Login failed" });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  await revokeSession(sessionFrom(req));
  res.setHeader(
    "Set-Cookie",
    "kh_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );
  res.status(204).end();
});
app.get("/api/me", async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });
});
app.get("/api/admin/summary", async (req, res) => {
  const user = await requireAdmin(req, res);
  if (!user) return;
  res.json(await counts());
});
app.get("/api/admin/users", async (req, res) => {
  const user = await requireAdmin(req, res);
  if (!user) return;
  res.json(await listUsers(Math.min(Number(req.query.limit || 50), 200)));
});

seed().catch(err => {
  console.error("KryptoHubb startup seed failed:", err);
  if (process.env.NODE_ENV === "production") process.exit(1);
});

const staticPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");
app.use(express.static(staticPath));
app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));
const port = Number(process.env.PORT || 3000);
server.listen(port, () =>
  console.log(`KryptoHubb server running on http://localhost:${port}`)
);
