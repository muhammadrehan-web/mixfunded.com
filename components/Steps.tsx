const STEPS = [
  {
    title: "Prove Your Edge",
    body: "Pass the evaluation by hitting the profit target while respecting the drawdown.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative h-6 w-6 text-[color:var(--accent)]">
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    title: "Get Funded",
    body: "Receive a simulated funded account within 24 hours of passing the evaluation.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative h-6 w-6 text-[color:var(--accent)]">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Scale & Withdraw",
    body: "Keep up to 80% of profits. Payouts processed every Monday in USDT (TRC-20).",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative h-6 w-6 text-[color:var(--accent)]">
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      </svg>
    ),
  },
];

export default function Steps() {
  return (
    <section id="how" className="relative bg-background py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">How it works</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Three steps to funded.</h2>
        </div>
        <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          <div className="dotted-line pointer-events-none absolute left-[16%] right-[16%] top-8 hidden h-[2px] md:block" />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-background ring-1 ring-border">
                <div className="absolute inset-0 rounded-full bg-[color:var(--accent)]/10 blur-xl" />
                {step.icon}
              </div>
              <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/40">
                Step {i + 1}
              </div>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
