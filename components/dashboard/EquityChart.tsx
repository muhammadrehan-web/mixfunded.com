import { EQUITY_SERIES } from "@/lib/dashboard";

export default function EquityChart({ className = "", series }: { className?: string; series?: number[] }) {
  const data = series && series.length > 1 ? series : EQUITY_SERIES;
  const w = 560;
  const h = 180;
  const pad = 8;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const last = data[data.length - 1];
  const first = data[0];
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
