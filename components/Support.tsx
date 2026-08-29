"use client";

import { EXTERNAL } from "@/lib/site";
import { ArrowRight } from "./Logo";

export default function Support() {
  return (
    <section className="relative bg-background py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[6px] border border-border bg-card p-10 md:p-14">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[color:var(--accent)]/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[color:var(--accent)]/10 blur-[100px]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[color:var(--accent)]">
              Trader Support · Available 24/7
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Human support, every hour, every session.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              We offer human support, available every hour, every trading session. Visit our dedicated Help Center for answers to common questions about challenges, payouts, scaling plans, and crypto platforms. Our live team is ready to support you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => window.dispatchEvent(new Event("mf-open-chat"))}>
                <span className="inline-flex h-10 items-center rounded-md bg-[color:var(--accent)] px-6 py-6 text-sm font-semibold text-[color:var(--accent-foreground)] hover:brightness-110">
                  Contact Support <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </button>
              <a href={EXTERNAL.help}>
                <span className="inline-flex h-10 items-center rounded-md border border-border bg-card px-6 py-6 text-sm font-semibold text-foreground hover:bg-muted">
                  Explore Knowledge Base
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
