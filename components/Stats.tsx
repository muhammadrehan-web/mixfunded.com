export default function Stats() {
  return (
    <section className="relative bg-background py-20">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Paying traders since{" "}
            <span className="font-mono-nums text-[color:var(--accent)]">December 2024</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            New site, new on-chain payout system — not new to paying traders.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
          <div className="bg-card p-8">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
              <span className="font-mono-nums text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Paid to Traders Since Dec 2024
              </span>
            </div>
            <span className="mt-4 block font-mono-nums text-4xl font-semibold tracking-tight text-[color:var(--gold)] md:text-5xl">
              £620,000+
            </span>
            <div className="mt-2 text-sm text-muted-foreground">
              Paid via bank transfer. All new payouts settle in USDT (TRC-20) and are published on-chain below.
            </div>
          </div>
          <div className="bg-card p-8">
            <div className="font-mono-nums text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Trader Accounts
            </div>
            <span className="mt-4 block font-mono-nums text-5xl font-semibold tracking-tight text-[color:var(--gold)] md:text-6xl">
              286
            </span>
            <p className="mt-2 text-sm text-muted-foreground">Opened since December 2024.</p>
          </div>
          <div className="bg-card p-8">
            <div className="font-mono-nums text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Evaluations Run
            </div>
            <span className="mt-4 block font-mono-nums text-5xl font-semibold tracking-tight text-[color:var(--gold)] md:text-6xl">
              374
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              Across 1-step, 2-step, instant, and PAPP challenges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
