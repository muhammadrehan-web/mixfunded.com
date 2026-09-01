import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

function loadEnv() {
  try {
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* no .env.local */
  }
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scryptAsync(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}

function parseSize(size) {
  return Number(String(size).replace(/[^0-9.]/g, "")) || 0;
}

function loginFromOrder(orderId) {
  const n = parseInt(String(orderId).replace(/-/g, "").slice(0, 8), 16) % 1999999;
  return String(8000000 + n);
}

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing in .env.local");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS country text`;
await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text`;
await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_status text NOT NULL DEFAULT 'unverified'`;
await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_trc20 text`;
await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'trader'`;

await sql`
  CREATE TABLE IF NOT EXISTS support_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text,
    role text NOT NULL,
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email text NOT NULL,
    program_id text NOT NULL,
    program_label text NOT NULL,
    account_size text NOT NULL,
    fee_usdt numeric NOT NULL,
    platform text NOT NULL DEFAULT 'MT5',
    status text NOT NULL DEFAULT 'paid',
    payment_method text NOT NULL DEFAULT 'demo_usdt',
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text NOT NULL UNIQUE,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
    login text NOT NULL UNIQUE,
    password_plain text NOT NULL,
    platform text NOT NULL,
    server text NOT NULL DEFAULT 'MixFunded-Demo',
    program text NOT NULL,
    program_id text NOT NULL,
    phase text NOT NULL,
    size numeric NOT NULL,
    balance numeric NOT NULL,
    equity numeric NOT NULL,
    profit numeric NOT NULL DEFAULT 0,
    profit_target numeric NOT NULL DEFAULT 0,
    daily_dd_used numeric NOT NULL DEFAULT 0,
    daily_dd_limit numeric NOT NULL DEFAULT 5,
    max_dd_used numeric NOT NULL DEFAULT 0,
    max_dd_limit numeric NOT NULL DEFAULT 10,
    trading_days integer NOT NULL DEFAULT 0,
    min_trading_days integer NOT NULL DEFAULT 3,
    status text NOT NULL DEFAULT 'evaluation',
    started timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts (user_id)`;

await sql`
  CREATE TABLE IF NOT EXISTS trades (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol text NOT NULL,
    side text NOT NULL,
    lots numeric NOT NULL,
    opened_at timestamptz NOT NULL DEFAULT now(),
    pnl numeric NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'closed'
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS payouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    status text NOT NULL DEFAULT 'processing',
    tx text,
    created_at timestamptz NOT NULL DEFAULT now(),
    paid_at timestamptz
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject text NOT NULL,
    status text NOT NULL DEFAULT 'open',
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS ticket_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    role text NOT NULL,
    body text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS certificates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
    title text NOT NULL,
    account_label text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )
`;

const demoEmail = "trader@mixfunded.com";
const existing = await sql`SELECT id FROM users WHERE email = ${demoEmail} LIMIT 1`;
if (existing.length === 0) {
  const passwordHash = await hashPassword("mixfunded");
  await sql`
    INSERT INTO users (name, email, password_hash, role, kyc_status, country)
    VALUES ('Muhammad Rehan', ${demoEmail}, ${passwordHash}, 'admin', 'verified', 'Pakistan')
  `;
  console.log("Seeded demo trader@mixfunded.com as admin");
} else {
  await sql`
    UPDATE users
    SET role = 'admin', kyc_status = 'verified', country = COALESCE(NULLIF(country, ''), 'Pakistan')
    WHERE email = ${demoEmail}
  `;
}

const unpaid = await sql`
  SELECT o.id, o.user_id, o.program_id, o.program_label, o.account_size, o.platform, o.created_at
  FROM orders o
  WHERE NOT EXISTS (SELECT 1 FROM accounts a WHERE a.order_id = o.id)
`;

for (const order of unpaid) {
  const size = parseSize(order.account_size);
  const instant = order.program_id === "instant";
  const profitTarget = instant ? 0 : order.program_id === "two" ? Math.round(size * 0.08) : Math.round(size * 0.1);
  const login = loginFromOrder(order.id);
  const password = `MxF-${login.slice(-4)}-desk`;
  const phase = instant ? "Funded" : order.program_id === "two" ? "Step 1" : "Evaluation";
  const status = instant ? "funded" : "evaluation";
  await sql`
    INSERT INTO accounts (
      user_id, order_id, login, password_plain, platform, server, program, program_id,
      phase, size, balance, equity, profit, profit_target, status, started
    )
    VALUES (
      ${order.user_id},
      ${order.id},
      ${login},
      ${password},
      ${order.platform || "MT5"},
      ${"MixFunded-Demo"},
      ${order.program_label},
      ${order.program_id},
      ${phase},
      ${size},
      ${size},
      ${size},
      ${0},
      ${profitTarget},
      ${status},
      ${order.created_at}
    )
    ON CONFLICT (login) DO NOTHING
  `;
}

if (unpaid.length > 0) {
  console.log(`Backfilled ${unpaid.length} trading account(s) from paid orders.`);
}

console.log("Neon schema ready.");
