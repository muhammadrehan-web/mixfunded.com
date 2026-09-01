"use client";

import Logo from "@/components/Logo";
import { useApi } from "@/components/dashboard/useApi";

type Certificate = { id: string; title: string; account: string; date: string };

export default function CertificatesPage() {
  const { data, error, loading } = useApi<{ certificates: Certificate[] }>("/api/certificates");

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Certificates</h1>
      <p className="mt-1 text-sm text-muted-foreground">Passed evaluations and payout confirmations for this login.</p>
      {loading && <p className="mt-6 text-sm text-muted-foreground">Loading certificates…</p>}
      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      {!loading && (data?.certificates.length ?? 0) === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No certificates yet. They appear when an evaluation is passed or a payout is marked paid.</p>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {data?.certificates.map((cert) => (
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
