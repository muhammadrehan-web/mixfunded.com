export type AccountStatus = "evaluation" | "funded" | "failed" | "passed";

export type TradingAccount = {
  id: string;
  login: string;
  platform: "MT5" | "MT4";
  server: string;
  program: string;
  phase: string;
  size: number;
  balance: number;
  equity: number;
  profit: number;
  profitTarget: number;
  dailyDdUsed: number;
  dailyDdLimit: number;
  maxDdUsed: number;
  maxDdLimit: number;
  tradingDays: number;
  minTradingDays: number;
  status: AccountStatus;
  started: string;
  password: string;
};

export type Trade = {
  id: string;
  accountId: string;
  symbol: string;
  side: "buy" | "sell";
  lots: number;
  open: string;
  pnl: number;
  status: "open" | "closed";
};

export type Payout = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "processing" | "eligible";
  tx?: string;
  accountId: string;
};

export const TRADER = {
  name: "Muhammad Rehan",
  email: "trader@mixfunded.com",
  country: "Pakistan",
  kyc: "verified" as const,
  wallet: "TXk9…7mQ2",
  joined: "12 Mar 2026",
  nextPayout: "Monday 1 Sep 2026",
};

export const ACCOUNTS: TradingAccount[] = [
  {
    id: "mf-100k-1s",
    login: "8842103",
    platform: "MT5",
    server: "MixFunded-Live",
    program: "1-Phase",
    phase: "Evaluation",
    size: 100000,
    balance: 107420,
    equity: 107186,
    profit: 7420,
    profitTarget: 10000,
    dailyDdUsed: 1.18,
    dailyDdLimit: 5,
    maxDdUsed: 0,
    maxDdLimit: 10,
    tradingDays: 8,
    minTradingDays: 3,
    status: "evaluation",
    started: "04 Aug 2026",
    password: "MxF-demo-8842",
  },
  {
    id: "mf-25k-funded",
    login: "7719044",
    platform: "MT5",
    server: "MixFunded-Live",
    program: "2-Phase",
    phase: "Funded",
    size: 25000,
    balance: 26890,
    equity: 26890,
    profit: 1890,
    profitTarget: 0,
    dailyDdUsed: 0.4,
    dailyDdLimit: 5,
    maxDdUsed: 1.2,
    maxDdLimit: 10,
    tradingDays: 21,
    minTradingDays: 3,
    status: "funded",
    started: "18 Jun 2026",
    password: "MxF-demo-7719",
  },
  {
    id: "mf-10k-papp",
    login: "5501288",
    platform: "MT4",
    server: "MixFunded-Demo",
    program: "Pay After Passing",
    phase: "Step 1",
    size: 10000,
    balance: 10000,
    equity: 10000,
    profit: 0,
    profitTarget: 1000,
    dailyDdUsed: 0,
    dailyDdLimit: 5,
    maxDdUsed: 0,
    maxDdLimit: 10,
    tradingDays: 0,
    minTradingDays: 3,
    status: "evaluation",
    started: "22 Aug 2026",
    password: "MxF-demo-5501",
  },
];

export const EQUITY_SERIES = [100000, 100820, 101140, 100410, 102260, 103900, 104550, 105210, 106880, 107420];

export const TRADES: Trade[] = [
  { id: "t1", accountId: "mf-100k-1s", symbol: "XAUUSD", side: "buy", lots: 0.4, open: "28 Aug 09:14", pnl: 312.4, status: "open" },
  { id: "t2", accountId: "mf-100k-1s", symbol: "EURUSD", side: "sell", lots: 1.2, open: "28 Aug 08:02", pnl: -86.1, status: "open" },
  { id: "t3", accountId: "mf-100k-1s", symbol: "NAS100", side: "buy", lots: 0.2, open: "27 Aug 15:41", pnl: 540.0, status: "closed" },
  { id: "t4", accountId: "mf-25k-funded", symbol: "GBPUSD", side: "buy", lots: 0.5, open: "27 Aug 11:20", pnl: 118.6, status: "closed" },
  { id: "t5", accountId: "mf-100k-1s", symbol: "USDJPY", side: "sell", lots: 0.8, open: "26 Aug 07:55", pnl: 204.2, status: "closed" },
];

export const PAYOUTS: Payout[] = [
  { id: "p1", date: "24 Aug 2026", amount: 1512, status: "paid", tx: "6d524c1d…a476eb", accountId: "mf-25k-funded" },
  { id: "p2", date: "10 Aug 2026", amount: 880, status: "paid", tx: "29bb8f2f…f750a1", accountId: "mf-25k-funded" },
  { id: "p3", date: "01 Sep 2026", amount: 1512, status: "eligible", accountId: "mf-25k-funded" },
];

export const CERTIFICATES = [
  { id: "c1", title: "2-Phase Evaluation Passed", account: "$25,000", date: "18 Jun 2026" },
  { id: "c2", title: "First Payout — USDT TRC-20", account: "$25,000 funded", date: "10 Aug 2026" },
];

export const ANNOUNCEMENTS = [
  { title: "Monday payout window is open", body: "Funded accounts can request USDT (TRC-20) until 18:00 UTC Sunday." },
  { title: "No news blackout this week", body: "NFP and CPI are tradable on every program — same as the rulebook." },
];

export function money(n: number, digits = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function pct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function accountProgress(account: TradingAccount) {
  if (!account.profitTarget) return 100;
  return Math.min(100, Math.max(0, (account.profit / account.profitTarget) * 100));
}
