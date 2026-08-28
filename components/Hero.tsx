import { EXTERNAL } from "@/lib/site";
import { ArrowRight } from "./Logo";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_120%,color-mix(in_oklab,var(--accent)_16%,transparent)_0%,transparent_65%)]" />
        <svg className="absolute h-0 w-0" aria-hidden="true">
          <defs>
            <filter id="mf-liquid" x="-45%" y="-45%" width="190%" height="190%">
              <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.011" numOctaves="2" seed="7" result="broadNoise" />
              <feDisplacementMap in="SourceGraphic" in2="broadNoise" scale="82" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <div className="mf-liquid">
          <div className="mf-liquid-rings mf-liquid-rings--a" />
          <div className="mf-liquid-rings mf-liquid-rings--b" />
          <div className="mf-liquid-rings mf-liquid-rings--c" />
        </div>
        <div className="mf-liquid-sheen" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mf-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M 56 0 L 0 0 0 56" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mf-grid)" className="text-[color:var(--accent)]" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--background)_25%,transparent)_0%,color-mix(in_oklab,var(--background)_78%,transparent)_72%,var(--background)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-20 text-center md:px-6 md:pb-28 md:pt-28">
        <div className="mf-hero-in" style={{ ["--mf-delay" as string]: "0ms" }}>
          <div className="mx-auto inline-flex items-center gap-2 px-1 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            Payouts every Monday in USDT (TRC-20)
          </div>
        </div>
        <h1 className="mt-8 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-7xl">
          <span className="mf-hero-in block" style={{ ["--mf-delay" as string]: "140ms" }}>
            A prop firm that starts at{" "}
            <span className="mf-text-jade-gold font-mono-nums">$5</span>
          </span>
          <span className="mf-hero-in block" style={{ ["--mf-delay" as string]: "280ms" }}>
            and shows you <span className="mf-text-jade-gold">everything.</span>
          </span>
        </h1>
        <p
          className="mf-hero-in mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
          style={{ ["--mf-delay" as string]: "420ms" }}
        >
          New firm. Real rules.{" "}
          <span className="font-semibold text-foreground">Every payout published on-chain.</span>
        </p>
        <div className="mf-hero-in" style={{ ["--mf-delay" as string]: "540ms" }}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="mf-cta-wrap relative inline-block">
              <span aria-hidden="true" className="mf-cta-border" />
              <a href={EXTERNAL.programs} className="relative z-10 inline-block">
                <span className="inline-flex h-10 items-center rounded-[6px] border border-[color:var(--accent)] bg-[color:var(--accent)] px-8 py-6 text-base font-semibold text-[color:var(--accent-foreground)] hover:brightness-110">
                  Start Challenge <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </a>
            </span>
            <a href={EXTERNAL.instagram} target="_blank" rel="noreferrer">
              <span className="inline-flex h-10 items-center rounded-[6px] border border-border bg-transparent px-8 py-6 text-base font-semibold text-foreground hover:bg-card">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 h-4 w-4" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                Follow on Instagram
              </span>
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            <span className="font-mono-nums">$5</span> refers to our Pay After Passing entry — full pricing on Challenges.
          </p>
        </div>
      </div>
    </section>
  );
}
