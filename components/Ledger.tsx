import { LEDGER } from "@/lib/data";
import { EXTERNAL } from "@/lib/site";

export default function Ledger() {
  return (
    <section id="ledger" className="relative border-y border-border bg-background py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="font-mono-nums text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              /public-ledger
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Public Payout Ledger
            </h2>
          </div>
          <div className="hidden text-right font-mono-nums text-[11px] text-muted-foreground md:block">
            Ledger last updated: <span className="text-foreground">2026-08-28</span>
          </div>
        </div>
        <div className="overflow-hidden rounded-[6px] border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm font-mono-nums">
              <thead className="border-b border-border bg-background/40">
                <tr className="text-left text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Trader</th>
                  <th className="px-4 py-3 text-right font-medium">Amount (USDT)</th>
                  <th className="px-4 py-3 font-medium">TXID</th>
                </tr>
              </thead>
              <tbody>
                {LEDGER.map((row) => (
                  <tr key={row.tx} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-4 py-3 text-foreground">{row.trader}</td>
                    <td className="px-4 py-3 text-right text-[color:var(--accent)]">{row.amount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.tx}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          Updated every Monday, good week or bad. TXIDs link to the TRON explorer so you can verify every payout without trusting us. Pre-2026 payouts were made by bank transfer and are included in the £620,000+ total above.
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <a
            href={EXTERNAL.ledger}
            className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent)] underline underline-offset-4"
          >
            View full ledger →
          </a>
        </div>
      </div>
    </section>
  );
}
