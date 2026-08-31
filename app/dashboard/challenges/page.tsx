"use client";

import { useState } from "react";
import { PROGRAMS } from "@/lib/data";

export default function ChallengesPage() {
  const [tab, setTab] = useState(PROGRAMS[0].id);
  const program = PROGRAMS.find((p) => p.id === tab) ?? PROGRAMS[0];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">New challenge</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Same plans as the marketing site. Select a plan to open MixFunded checkout.
      </p>

      <div className="mt-6 inline-flex flex-wrap border border-border bg-card p-1">
        {PROGRAMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === item.id ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]" : "text-muted-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {program.plans.map((plan) => (
          <article key={plan.size} className="rounded-[6px] border border-border bg-card p-5">
            {plan.popular && (
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[color:var(--gold)]">Most picked</p>
            )}
            <h2 className="text-lg font-semibold">{plan.size}</h2>
            <p className="mt-1 font-mono-nums text-2xl text-[color:var(--accent)]">
              ${plan.fee} <span className="text-xs text-muted-foreground">USDT</span>
            </p>
            <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
              <li>Leverage {plan.leverage}</li>
              <li>Profit target {plan.profitTarget}</li>
              <li>Daily DD {plan.dailyDrawdown}</li>
              <li>Max DD {plan.maxDrawdown}</li>
              <li>Split {plan.split}</li>
            </ul>
            <a
              href={plan.href}
              className="mt-5 inline-flex h-9 w-full items-center justify-center rounded-[6px] bg-[color:var(--accent)] text-xs font-semibold text-[color:var(--accent-foreground)]"
            >
              Select plan
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
