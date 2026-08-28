const RULES = [
  {
    n: "01",
    title: "5% Daily Drawdown",
    body: "You can't lose more than 5% of your starting balance in a single trading day.",
    why: "One bad day shouldn't blow up an account. This forces you to size positions like a professional, not a gambler.",
  },
  {
    n: "02",
    title: "10% Max Overall Drawdown",
    body: "Total losses on the account can't exceed 10% of the starting balance at any point.",
    why: "It's the hard stop that keeps the firm solvent — and keeps you from revenge-trading a losing week into a blown account.",
  },
  {
    n: "03",
    title: "Minimum 3 Trading Days per Phase",
    body: "You must trade on at least three separate days before an evaluation phase can pass.",
    why: "Nobody is a consistent trader after one lucky session. Three days is the floor for showing the profit wasn't a single all-in bet.",
  },
  {
    n: "04",
    title: "What's Banned",
    body: "No latency arbitrage, tick-scalping exploits, grid/martingale bots, HFT, or copying signals across multiple funded accounts.",
    why: "These strategies exploit the simulator, not the market. Allowing them would force us to add the same shady rules the big firms hide in their small print.",
  },
];

const BUILT = [
  {
    n: "01",
    title: "Real Traders, Real Experience",
    body: "Founded to provide a high-tier institutional environment for retail crypto traders. We've been in the pit.",
  },
  {
    n: "02",
    title: "Built Around You",
    body: "Our 1-Step and PAPP evaluations are designed based on deep research into what traders actually need to scale.",
  },
  {
    n: "03",
    title: "Industry Leading Plan",
    body: "Scale simulated balances up to $2,000,000 with transparent rules and instant milestone updates.",
  },
  {
    n: "04",
    title: "Quality-Focused",
    body: "We partner with disciplined traders who manage risk effectively. We value quality execution over volume.",
  },
];

export default function FourRules() {
  return (
    <>
      <section id="four-rules" className="relative bg-background py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">Our Rules in Plain English</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">Four rules. No small print.</h2>
            <p className="mt-4 text-muted-foreground">Every rule exists for a reason. Here&apos;s each one, and why it&apos;s there.</p>
          </div>
          <div className="space-y-4">
            {RULES.map((rule) => (
              <div key={rule.n} className="rounded-[6px] border border-border bg-card p-6 md:p-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono-nums text-xs text-[color:var(--accent)]">{rule.n}</span>
                  <h3 className="text-lg font-bold text-foreground md:text-xl">{rule.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{rule.body}</p>
                <p className="mt-3 border-l-2 border-[color:var(--accent)]/40 pl-4 text-sm leading-relaxed text-muted-foreground">
                  <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]/80">Why</span>
                  {rule.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-background py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">Built around traders.</h2>
          </div>
          <div className="border border-border bg-card">
            {BUILT.map((item, i) => (
              <div
                key={item.n}
                className={`grid grid-cols-1 gap-6 p-8 md:grid-cols-[80px_1fr] md:p-10 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div className="font-mono-nums text-xs text-muted-foreground">{item.n}</div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
