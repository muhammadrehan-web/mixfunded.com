import { SITE } from "@/lib/site";

export default function TeamNote() {
  return (
    <section className="relative bg-background py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="rounded-[6px] border border-border bg-card p-8 md:p-14">
          <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-start md:gap-12">
            <div className="mx-auto md:mx-0">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--accent)]/20 to-transparent ring-1 ring-border md:h-32 md:w-32">
                <span className="font-mono-nums text-4xl font-bold text-[color:var(--accent)]">V</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)]">
                A note from the founder
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Vladyslav — founder of MixFunded
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  I started MixFunded after watching too many talented traders fail evaluations designed to work against them—not because they lacked skill, but because the rules kept changing. Hidden consistency metrics, delayed payouts, and promised refunds that never arrived had become the norm.
                </p>
                <p>So I built MixFunded differently.</p>
                <p>
                  Every payout is settled in USDT and published on-chain, which means you don&apos;t have to take my word for it—you can verify every payment yourself.
                </p>
                <p>
                  I personally review every funded account. Any rule changes are announced before they take effect, never after. And every payout is recorded publicly on-chain for complete transparency.
                </p>
                <p>
                  If you get funded here, you can email me directly. There are no layers of support, no anonymous decision-makers, and no hiding behind fine print.
                </p>
                <p>
                  That&apos;s the promise:{" "}
                  <span className="text-foreground">clear rules, transparent payouts, and one person who stands behind every decision.</span>
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                Direct line:{" "}
                <a href={`mailto:${SITE.founderEmail}`} className="font-semibold text-foreground hover:text-[color:var(--accent)]">
                  {SITE.founderEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
