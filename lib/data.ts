export type ChallengePlan = {
  size: string;
  fee: string;
  popular?: boolean;
  leverage: string;
  profitTarget: string;
  dailyDrawdown: string;
  maxDrawdown: string;
  split: string;
  href: string;
};

export type ChallengeProgram = {
  id: string;
  label: string;
  goldBadge?: string;
  plans: ChallengePlan[];
};

function plans(
  programId: string,
  fees: string[],
  profitTarget = "10%",
): ChallengePlan[] {
  const sizes = ["$10,000", "$25,000", "$50,000", "$100,000", "$200,000", "$500,000"];
  return sizes.map((size, i) => ({
    size,
    fee: fees[i],
    popular: i === 3,
    leverage: "1:100",
    profitTarget,
    dailyDrawdown: "5% (equity / balance)",
    maxDrawdown: "10%",
    split: "80 / 20",
    href: `/checkout?program=${programId}&size=${encodeURIComponent(size)}`,
  }));
}

export const PROGRAMS: ChallengeProgram[] = [
  {
    id: "one",
    label: "1-Phase",
    plans: plans("one", ["45", "95", "175", "299", "598", "929"]),
  },
  {
    id: "two",
    label: "2-Phase",
    plans: plans("two", ["39", "79", "149", "249", "479", "799"], "8% / 5%"),
  },
  {
    id: "instant",
    label: "Instant Funding",
    goldBadge: "Premium",
    plans: plans("instant", ["89", "189", "329", "549", "899", "1499"], "None"),
  },
  {
    id: "papp",
    label: "Pay After Passing",
    goldBadge: "Popular",
    plans: plans("papp", ["5", "5", "5", "5", "5", "5"]),
  },
];

export const PLATFORMS = ["MT5", "MT4"] as const;
export type Platform = (typeof PLATFORMS)[number];

export function findPlan(programId: string, size: string) {
  const program = PROGRAMS.find((item) => item.id === programId);
  const plan = program?.plans.find((item) => item.size === size);
  if (!program || !plan) return null;
  return { program, plan };
}

export const LEDGER = [
  { date: "24 Aug 2026", trader: "Omar ******", amount: "1,603.00", tx: "6d524c1d…a476eb" },
  { date: "24 Aug 2026", trader: "Yehor B****", amount: "1,158.00", tx: "bd8da395…e341c0" },
  { date: "24 Aug 2026", trader: "Anna ******", amount: "2,000.00", tx: "4b186078…73f193" },
  { date: "24 Aug 2026", trader: "JACK ******", amount: "229.00", tx: "d5adbb85…9a730a" },
  { date: "24 Aug 2026", trader: "Oliver *****", amount: "3,900.00", tx: "cd45b746…4d0cb2" },
  { date: "24 Aug 2026", trader: "Muhammad G*****", amount: "5,000.00", tx: "299397c2…9372ec" },
  { date: "24 Aug 2026", trader: "Kai *******", amount: "1,161.00", tx: "361cd64b…67ffe5" },
  { date: "24 Aug 2026", trader: "Anthony M***", amount: "566.00", tx: "e4ac52c0…8c2f20" },
  { date: "17 Aug 2026", trader: "Kai *******", amount: "2,050.00", tx: "29bb8f2f…f750a1" },
  { date: "03 Aug 2026", trader: "Kai *******", amount: "1,200.00", tx: "ad33c6cc…1f93c8" },
] as const;
