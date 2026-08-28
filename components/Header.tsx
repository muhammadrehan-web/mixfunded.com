"use client";

import { useEffect, useState } from "react";
import { EXTERNAL } from "@/lib/site";
import Logo, { ArrowRight } from "./Logo";

const nav = [
  { label: "Home", href: "/" },
  { label: "Challenges", href: EXTERNAL.programs },
  { label: "Platforms", href: EXTERNAL.platforms },
  { label: "Symbols", href: EXTERNAL.symbols },
  { label: "Tools", href: EXTERNAL.tools },
  { label: "Calendar", href: EXTERNAL.calendar },
  { label: "Leaderboard", href: EXTERNAL.leaderboard },
  { label: "Community", href: EXTERNAL.community },
];

const learn = [
  { label: "Academy", href: "#rules" },
  { label: "Blog", href: "#rules" },
  { label: "Help Center", href: EXTERNAL.help },
  { label: "Trading Rules", href: EXTERNAL.rules },
  { label: "Community", href: EXTERNAL.community },
  { label: "Affiliates", href: "#programs" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.classList.contains("light") ? "light" : "dark";
    setTheme(current);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("mf-theme", next);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <Logo />
          <span className="text-lg font-bold leading-none tracking-tight">
            Mix<span className="text-[color:var(--accent)]">Funded</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`transition-colors ${item.label === "Home" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item.label}
            </a>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLearnOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-muted-foreground outline-none transition-colors hover:text-foreground"
            >
              Learn
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {learnOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 min-w-44 rounded-[6px] border border-border bg-card py-2 shadow-xl">
                {learn.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setLearnOpen(false)}
                    className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="hidden h-9 w-9 items-center justify-center rounded-[6px] border border-border bg-transparent text-muted-foreground transition-colors hover:border-[color:var(--accent)]/50 hover:text-foreground sm:inline-flex"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </svg>
            )}
          </button>
          <a href={EXTERNAL.auth} className="hidden sm:inline-flex">
            <span className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-foreground transition hover:-translate-y-px hover:bg-muted">
              Login
            </span>
          </a>
          <a href={EXTERNAL.programs} className="hidden sm:inline-flex">
            <span className="inline-flex h-8 items-center rounded-[6px] border border-[color:var(--accent)] bg-[color:var(--accent)] px-3 text-xs font-semibold text-[color:var(--accent-foreground)] shadow-none hover:brightness-110">
              Start Challenge <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </span>
          </a>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-border text-foreground lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              {open ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border px-4 py-3 lg:hidden">
          {[...nav, ...learn].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-[6px] px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
