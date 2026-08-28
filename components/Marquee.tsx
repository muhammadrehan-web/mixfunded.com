const ITEMS = [
  { label: "MetaTrader 4" },
  { label: "MetaTrader 5" },
  { label: "TradingView", tv: true },
  { label: "USDT · TRC-20" },
  { label: "Payouts On-Chain" },
  { label: "Trustpilot", stars: true },
];

function TradingViewMark() {
  return (
    <svg viewBox="0 0 36 22" aria-hidden="true" className="h-3.5 w-auto shrink-0 fill-current opacity-80">
      <path d="M0 0h13v22H6.5V7H0V0Z" />
      <circle cx="18.5" cy="4.5" r="4.5" />
      <path d="M25.5 0H36l-7.5 22H18L25.5 0Z" />
    </svg>
  );
}

function TrustStars() {
  return (
    <span className="flex shrink-0 items-center gap-0.5" aria-label="Trustpilot 4 out of 5 stars">
      {Array.from({ length: 4 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-80">
          <rect width="24" height="24" className="fill-current" />
          <path d="M12 4.2 14 10h6.1l-4.9 3.6 1.9 5.9L12 15.8 6.9 19.5l1.9-5.9L3.9 10H10L12 4.2Z" className="fill-card" />
        </svg>
      ))}
    </span>
  );
}

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section id="platforms" className="border-y border-border bg-card/40">
      <div className="overflow-hidden py-8">
        <div className="animate-marquee flex w-max items-center gap-14 pl-14">
          {row.map((item, i) => (
            <span
              key={`${item.label}-${i}`}
              className="flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            >
              {item.label}
              {item.tv && <TradingViewMark />}
              {item.stars && <TrustStars />}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
