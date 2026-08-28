import { Check } from "./Logo";

const PERKS = [
  { title: "No consistency rule", body: "Your best trading day can be your entire month's profit." },
  { title: "News trading allowed", body: "Trade every release on every program — no blackout windows." },
  { title: "No time limits", body: "Take as long as you need to hit the target." },
  { title: "EAs permitted", body: "Automated strategies welcome — as long as the logic is yours." },
  { title: "Overnight & weekend holds", body: "Standard swap fees apply. Nothing else." },
  { title: "Weekly payouts on Monday", body: "USDT (TRC-20), published on-chain, no exceptions." },
];

export default function Perks() {
  return (
    <section id="rules" className="relative border-y border-border bg-background py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 max-w-2xl">
          <div className="font-mono-nums text-[10px] uppercase tracking-[0.22em] text-[color:var(--accent)]">
            The rulebook — in plain English
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            No traps. No fine print.
          </h2>
          <p className="mt-3 text-muted-foreground">
            The full rules live on <a href="#four-rules" className="text-foreground underline decoration-dotted underline-offset-4">/rules</a>. Here&apos;s what most traders actually want to know.
          </p>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((perk) => (
            <div key={perk.title} className="bg-card p-6">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[color:var(--accent)]" />
                <div className="text-sm font-semibold text-foreground">{perk.title}</div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{perk.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <a href="#four-rules" className="inline-flex items-center gap-1.5 font-mono-nums text-xs uppercase tracking-widest text-[color:var(--accent)] hover:text-foreground">
            Read the full rulebook
          </a>
        </div>
      </div>
    </section>
  );
}
