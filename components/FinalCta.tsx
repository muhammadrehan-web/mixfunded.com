import { EXTERNAL, SITE } from "@/lib/site";
import Logo, { ArrowRight } from "./Logo";

export default function FinalCta() {
  return (
    <section className="relative bg-background py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="relative border border-border bg-card p-12 text-center md:p-16">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Your funded account is <br className="hidden md:block" />
            one trade away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start the <span className="font-mono-nums">$5</span> challenge. Pass. Get paid — in USDT (TRC-20), on the next Monday payout run.
          </p>
          <div className="mt-8">
            <a href={EXTERNAL.programs}>
              <span className="inline-flex h-10 items-center rounded-[6px] border border-[color:var(--accent)] bg-[color:var(--accent)] px-8 py-6 text-base font-semibold text-[color:var(--accent-foreground)] hover:brightness-110">
                Start Your Challenge — <span className="font-mono-nums ml-1">$5</span> <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const TRADE = [
  ["Challenges", EXTERNAL.programs],
  ["Platforms", EXTERNAL.platforms],
  ["Symbols", EXTERNAL.symbols],
  ["Tools", EXTERNAL.tools],
  ["Calendar", EXTERNAL.calendar],
  ["Leaderboard", EXTERNAL.leaderboard],
  ["Ledger", EXTERNAL.ledger],
];

const LEARN = [
  ["Academy", "#four-rules"],
  ["Blog", "#four-rules"],
  ["Help Center", EXTERNAL.help],
  ["Trading Rules", EXTERNAL.rules],
  ["Community", EXTERNAL.community],
  ["Affiliates", EXTERNAL.programs],
  ["Telegram", EXTERNAL.telegram],
  ["Discord", EXTERNAL.community],
  ["Instagram", EXTERNAL.instagram],
];

const GUIDES = [
  "Best prop firms 2026",
  "Pay after passing",
  "MixFunded vs FTMO",
  "The $5 challenge",
  "Funded trading accounts",
  "Prop firm funding",
  "Crypto prop trading",
  "No time limits",
  "News trading allowed",
  "How payouts work",
  "Trading education",
  "Glossary",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <a href="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-lg font-bold tracking-tight text-foreground">
                Mix<span className="text-[color:var(--accent)]">Funded</span>
              </span>
            </a>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              A small, honest prop firm.
              <br />
              Real rules. Payouts every Monday in USDT (TRC-20). On-chain.
            </p>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Trade</div>
            <ul className="mt-4 space-y-3">
              {TRADE.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm text-muted-foreground transition hover:text-foreground">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Learn</div>
            <ul className="mt-4 space-y-3">
              {LEARN.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm text-muted-foreground transition hover:text-foreground">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Guides</div>
            <ul className="mt-4 space-y-3">
              {GUIDES.map((label) => (
                <li key={label}>
                  <a href="#programs" className="text-sm text-muted-foreground transition hover:text-foreground">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">Legal</div>
            <ul className="mt-4 space-y-3">
              <li><a href="#four-rules" className="text-sm text-muted-foreground transition hover:text-foreground">Terms of Service</a></li>
              <li><a href="#four-rules" className="text-sm text-muted-foreground transition hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#four-rules" className="text-sm text-muted-foreground transition hover:text-foreground">Disclaimers</a></li>
              <li><a href={EXTERNAL.trustpilot} className="text-sm text-muted-foreground transition hover:text-foreground" target="_blank" rel="noreferrer">Reviews on Trustpilot</a></li>
              <li><a href={`mailto:${SITE.email}`} className="text-sm text-muted-foreground transition hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-14 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground/80">{SITE.legal}</span> · Registered in England and Wales · Company Address: 128 City Road, London, EC1V 2NX, United Kingdom. Operating as <span className="text-foreground/80">MixFunded</span>.
          </p>
          <p className="mt-4 max-w-4xl text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground/70">Risk Disclaimer:</span> Mix Analytics Ltd provides simulated trading accounts for educational and evaluation purposes only. All funds provided are virtual, and no live brokerage accounts are managed. Trading financial instruments carries a high level of risk and may not be suitable for all investors. Past performance is not indicative of future results. Nothing on this website constitutes investment advice.
          </p>
          <p className="mt-6 text-xs text-muted-foreground">© 2026 Mix Analytics Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
