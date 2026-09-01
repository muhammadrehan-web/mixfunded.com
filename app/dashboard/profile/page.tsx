"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiJson } from "@/lib/api-client";
import { kycLabel, type DeskMe } from "@/lib/desk";

const field =
  "h-11 w-full rounded-[6px] border border-border bg-background px-3 text-sm outline-none transition focus:border-[color:var(--accent)]/55";

export default function ProfilePage() {
  const [me, setMe] = useState<DeskMe | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    apiJson<DeskMe>("/api/profile").then((result) => {
      if (!result.ok) setError(result.error);
      else setMe(result.data);
    });
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!me) return;
    const data = new FormData(e.currentTarget);
    setPending(true);
    setError("");
    setSaved("");
    const result = await apiJson<DeskMe>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        country: String(data.get("country") || ""),
        phone: String(data.get("phone") || ""),
        wallet_trc20: String(data.get("wallet") || ""),
        submitKyc: data.get("submitKyc") === "on",
      }),
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMe(result.data);
    setSaved("Profile saved.");
  }

  if (!me && !error) return <p className="text-sm text-muted-foreground">Loading profile…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile & KYC</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Payouts go to the TRC-20 wallet on file after an admin verifies KYC.
        </p>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {me && (
        <form onSubmit={onSubmit} className="space-y-6">
          <section className="rounded-[6px] border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Identity</h2>
              <span className="rounded-full bg-[color:var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--accent)]">
                {kycLabel(me.kyc_status)}
              </span>
            </div>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
              <Field label="Name" value={me.name} />
              <Field label="Email" value={me.email} />
              <Field label="Joined" value={me.joined || "—"} />
              <label className="block text-xs text-muted-foreground">
                Country
                <input name="country" defaultValue={me.country} className={`${field} mt-1`} />
              </label>
              <label className="block text-xs text-muted-foreground sm:col-span-2">
                Phone
                <input name="phone" defaultValue={me.phone} className={`${field} mt-1`} />
              </label>
            </dl>
          </section>
          <section className="rounded-[6px] border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Payout wallet</h2>
            <label className="mt-3 block text-xs text-muted-foreground">
              USDT TRC-20 address
              <input
                name="wallet"
                defaultValue={me.wallet_trc20}
                className={`${field} mt-1 font-mono-nums`}
                placeholder="T…"
              />
            </label>
            {me.kyc_status !== "verified" && (
              <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <input name="submitKyc" type="checkbox" className="accent-[color:var(--accent)]" />
                Submit this profile for KYC review
              </label>
            )}
            {saved && <p className="mt-3 text-xs text-[color:var(--accent)]">{saved}</p>}
            <button
              type="submit"
              disabled={pending}
              className="mt-4 inline-flex h-10 items-center rounded-[6px] bg-[color:var(--accent)] px-4 text-sm font-semibold text-[color:var(--accent-foreground)] disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save profile"}
            </button>
          </section>
        </form>
      )}
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
