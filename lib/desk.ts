import type { ChallengePlan, ChallengeProgram } from "@/lib/data";
import type { Payout, Trade, TradingAccount } from "@/lib/dashboard";

export function parseAccountSize(size: string) {
  return Number(String(size).replace(/[^0-9.]/g, "")) || 0;
}

export function profitTargetFor(program: ChallengeProgram, size: number) {
  if (program.id === "instant") return 0;
  if (program.id === "two") return Math.round(size * 0.08);
  return Math.round(size * 0.1);
}

export function newDeskCredentials() {
  const login = String(8000000 + Math.floor(Math.random() * 1999999));
  const password = `MxF-${login.slice(-4)}-${Math.random().toString(16).slice(2, 6)}`;
  return { login, password };
}

export function mapAccount(row: Record<string, unknown>): TradingAccount {
  const size = Number(row.size) || 0;
  const started = row.started ? new Date(String(row.started)) : new Date();
  return {
    id: String(row.id),
    login: String(row.login),
    platform: row.platform === "MT4" ? "MT4" : "MT5",
    server: String(row.server || "MixFunded-Demo"),
    program: String(row.program),
    phase: String(row.phase || "Evaluation"),
    size,
    balance: Number(row.balance) || 0,
    equity: Number(row.equity) || 0,
    profit: Number(row.profit) || 0,
    profitTarget: Number(row.profit_target) || 0,
    dailyDdUsed: Number(row.daily_dd_used) || 0,
    dailyDdLimit: Number(row.daily_dd_limit) || 5,
    maxDdUsed: Number(row.max_dd_used) || 0,
    maxDdLimit: Number(row.max_dd_limit) || 10,
    tradingDays: Number(row.trading_days) || 0,
    minTradingDays: Number(row.min_trading_days) || 3,
    status: (String(row.status) as TradingAccount["status"]) || "evaluation",
    started: started.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    password: String(row.password_plain || ""),
  };
}

export function accountInsertValues(input: {
  program: ChallengeProgram;
  plan: ChallengePlan;
  platform: string;
}) {
  const size = parseAccountSize(input.plan.size);
  const { login, password } = newDeskCredentials();
  const profitTarget = profitTargetFor(input.program, size);
  const phase = input.program.id === "instant" ? "Funded" : input.program.id === "two" ? "Step 1" : "Evaluation";
  const status = input.program.id === "instant" ? "funded" : "evaluation";
  return { login, password, size, profitTarget, phase, status };
}

export function mapTrade(row: Record<string, unknown>): Trade {
  const opened = row.opened_at ? new Date(String(row.opened_at)) : new Date();
  return {
    id: String(row.id),
    accountId: String(row.account_id),
    symbol: String(row.symbol),
    side: row.side === "sell" ? "sell" : "buy",
    lots: Number(row.lots) || 0,
    open: opened.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    pnl: Number(row.pnl) || 0,
    status: row.status === "open" ? "open" : "closed",
  };
}

export function mapPayout(row: Record<string, unknown>): Payout {
  const created = row.created_at ? new Date(String(row.created_at)) : new Date();
  return {
    id: String(row.id),
    date: created.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    amount: Number(row.amount) || 0,
    status: (String(row.status) as Payout["status"]) || "processing",
    tx: row.tx ? String(row.tx) : undefined,
    accountId: String(row.account_id),
  };
}

export function nextPayoutLabel() {
  const now = new Date();
  const day = now.getUTCDay();
  const add = day === 1 ? 0 : (8 - day) % 7;
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + add));
  return next.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
}

export function isTrc20(address: string) {
  return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address.trim());
}

export function fakeTxid() {
  const hex = () => Math.random().toString(16).slice(2);
  return `${hex()}${hex()}`.slice(0, 16) + "…" + hex().slice(0, 6);
}

export function equitySeriesFor(account: TradingAccount) {
  const start = account.size;
  const end = account.equity || account.balance || account.size;
  return Array.from({ length: 10 }, (_, i) => Math.round(start + ((end - start) * i) / 9));
}

export function kycLabel(status: string) {
  if (status === "verified") return "KYC verified";
  if (status === "pending") return "KYC pending";
  if (status === "rejected") return "KYC rejected";
  return "KYC unverified";
}

export type DeskMe = {
  id: string;
  name: string;
  email: string;
  role: string;
  country: string;
  phone: string;
  kyc_status: string;
  kyc_label?: string;
  wallet_trc20: string;
  joined: string;
  nextPayout: string;
};

export function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}
