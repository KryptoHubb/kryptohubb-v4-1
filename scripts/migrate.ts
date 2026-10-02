import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dbQuery, closeDb } from "../server/db";

const here = path.dirname(fileURLToPath(import.meta.url));
const schema = await fs.readFile(
  path.join(here, "../server/db/schema.sql"),
  "utf8"
);
await dbQuery(schema);
console.log("KryptoHubb database schema applied.");
await closeDb();
