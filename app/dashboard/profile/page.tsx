import { TRADER } from "@/lib/dashboard";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile & KYC</h1>
        <p className="mt-1 text-sm text-muted-foreground">Identity is verified. Payouts go to the TRC-20 wallet on file.</p>
      </div>
      <section className="rounded-[6px] border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Identity</h2>
          <span className="rounded-full bg-[color:var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--accent)]">
            KYC verified
          </span>
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
          <Field label="Name" value={TRADER.name} />
          <Field label="Email" value={TRADER.email} />
          <Field label="Country" value={TRADER.country} />
          <Field label="Joined" value={TRADER.joined} />
        </dl>
      </section>
      <section className="rounded-[6px] border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Payout wallet</h2>
        <p className="mt-3 font-mono-nums text-lg">{TRADER.wallet}</p>
        <p className="mt-1 text-xs text-muted-foreground">USDT · TRC-20 · last 4 shown for this demo desk</p>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
