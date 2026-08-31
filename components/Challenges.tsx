"use client";

import { useState } from "react";
import { PROGRAMS } from "@/lib/data";
import { EXTERNAL } from "@/lib/site";
import { ArrowRight, Check } from "./Logo";

export default function Challenges() {
  const [tab, setTab] = useState(PROGRAMS[0].id);
  const [matcher, setMatcher] = useState(false);
  const program = PROGRAMS.find((p) => p.id === tab) ?? PROGRAMS[0];

  return (
    <section id="programs" className="relative border-b border-border bg-background py-20">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Choose your path to funded.
          </h2>
          <p className="mt-4 text-muted-foreground">
            1-Step, 2-Step, Instant or Pay-After-Passing — configure everything on the Challenges page.
          </p>
        </div>

        <div className="mb-10">
          <button
            type="button"
            onClick={() => {
              setMatcher(true);
              setTab("papp");
            }}
            className="group relative mx-auto flex w-full max-w-3xl items-center justify-between gap-4 overflow-hidden rounded-[6px] border border-[color:var(--accent)]/30 bg-card p-5 text-left transition hover:border-[color:var(--accent)]/60"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[color:var(--accent)]/15 ring-1 ring-[color:var(--accent)]/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-[color:var(--accent)]">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-foreground md:text-base">Which challenge is best for me?</div>
                <div className="text-xs text-muted-foreground">
                  Take the 30-Second Matcher — get a personalized recommendation.
                </div>
              </div>
            </div>
            <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--accent)]">
              Start <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </button>
          {matcher && (
            <p className="mx-auto mt-3 max-w-3xl text-center text-xs text-muted-foreground">
              Recommended: Pay After Passing — start at $5, pay the rest after you pass.
            </p>
          )}
        </div>

        <div className="mx-auto flex w-fit max-w-full flex-wrap justify-center border border-border bg-card p-1">
          {PROGRAMS.map((item) => {
            const active = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`relative px-5 py-2 text-sm font-semibold tracking-tight transition-colors ${
                  active
                    ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.goldBadge && (
                  <span className="ml-2 font-mono-nums text-[9px] font-bold uppercase tracking-widest text-[color:var(--gold)]">
                    {item.goldBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {program.plans.map((plan) => (
            <article
              key={plan.size}
              className={`group relative flex flex-col border bg-card p-6 transition-colors ${
                plan.popular
                  ? "border-[color:var(--accent)]/60"
                  : "border-border hover:border-[color:var(--accent)]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-mono-nums text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Account
                </div>
                {plan.popular && (
                  <span className="font-mono-nums text-[9px] font-bold uppercase tracking-widest text-[color:var(--accent)]">
                    Most picked
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono-nums text-4xl font-semibold tracking-tight text-foreground">
                  {plan.size}
                </span>
              </div>
              <ul className="mt-6 space-y-2.5 border-t border-border pt-5">
                {[
                  ["Leverage", plan.leverage],
                  ["Profit Target", plan.profitTarget],
                  ["Daily Drawdown", plan.dailyDrawdown],
                  ["Max Drawdown", plan.maxDrawdown],
                  ["Split", plan.split],
                ].map(([label, value]) => (
                  <li key={label} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--accent)]" />
                    <div className="flex-1 text-xs">
                      <span className="text-muted-foreground">{label}: </span>
                      <span className="font-mono-nums font-semibold text-foreground">{value}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-border pt-5">
                <div className="font-mono-nums text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Fee</div>
                <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                  <span className="font-mono-nums text-4xl font-semibold tracking-tight text-[color:var(--accent)]">
                    ${plan.fee}
                  </span>
                  <span className="font-mono-nums text-xs text-muted-foreground">USDT</span>
                </div>
                <a href={plan.href} className="mt-5 block">
                  <span
                    className={`inline-flex h-9 w-full items-center justify-center rounded-[6px] px-4 text-sm font-semibold shadow-none transition-colors ${
                      plan.popular
                        ? "border border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:brightness-110"
                        : "border border-border bg-transparent text-foreground hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                    }`}
                  >
                    Select Plan <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href={EXTERNAL.checkout}>
            <span className="inline-flex h-10 items-center rounded-[6px] border border-[color:var(--accent)] bg-[color:var(--accent)] px-8 py-6 text-base font-semibold text-[color:var(--accent-foreground)] hover:brightness-110">
              Open the full configurator <ArrowRight className="ml-1 h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
