import Logo from "@/components/Logo";
import { CERTIFICATES } from "@/lib/dashboard";

export default function CertificatesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Certificates</h1>
      <p className="mt-1 text-sm text-muted-foreground">Passed evaluations and payout confirmations for this login.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {CERTIFICATES.map((cert) => (
          <article key={cert.id} className="relative overflow-hidden rounded-[6px] border border-border bg-card p-6">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--accent)]/10" />
            <Logo className="h-8 w-8" />
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[color:var(--gold)]">MixFunded</p>
            <h2 className="mt-2 text-xl font-semibold">{cert.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{cert.account}</p>
            <p className="mt-6 font-mono-nums text-xs text-muted-foreground">{cert.date}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
