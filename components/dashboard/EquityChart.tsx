import { EQUITY_SERIES } from "@/lib/dashboard";

export default function EquityChart({ className = "" }: { className?: string }) {
  const w = 560;
  const h = 180;
  const pad = 8;
  const min = Math.min(...EQUITY_SERIES);
  const max = Math.max(...EQUITY_SERIES);
  const span = max - min || 1;
  const points = EQUITY_SERIES.map((v, i) => {
    const x = pad + (i / (EQUITY_SERIES.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const last = EQUITY_SERIES[EQUITY_SERIES.length - 1];
  const first = EQUITY_SERIES[0];
  const up = last >= first;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-full w-full ${className}`} role="img" aria-label="Equity curve">
      <defs>
        <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fb68b" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3fb68b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="url(#eqFill)"
        stroke="none"
        points={`${pad},${h - pad} ${points} ${w - pad},${h - pad}`}
      />
      <polyline
        fill="none"
        stroke={up ? "#3fb68b" : "#d46a6a"}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}
