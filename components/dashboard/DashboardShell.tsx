"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { apiJson } from "@/lib/api-client";
import { clearSession } from "@/lib/auth";
import { kycLabel, type DeskMe } from "@/lib/desk";

const nav = [
  { href: "/dashboard", label: "Overview", icon: OverviewIcon },
  { href: "/dashboard/accounts", label: "Accounts", icon: AccountsIcon },
  { href: "/dashboard/orders", label: "Orders", icon: OrdersIcon },
  { href: "/dashboard/challenges", label: "New challenge", icon: ChallengeIcon },
  { href: "/dashboard/payouts", label: "Payouts", icon: PayoutIcon },
  { href: "/dashboard/certificates", label: "Certificates", icon: CertIcon },
  { href: "/dashboard/profile", label: "Profile & KYC", icon: ProfileIcon },
  { href: "/dashboard/support", label: "Support", icon: SupportIcon },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<DeskMe | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiJson<DeskMe>("/api/me").then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        clearSession();
        router.replace("/login");
        return;
      }
      setMe(result.data);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready || !me) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading trader desk…
      </div>
    );
  }

  const items = me.role === "admin" ? [...nav, { href: "/admin", label: "Admin", icon: AdminIcon }] : nav;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
          <a href="/" className="flex items-center gap-2 border-b border-border px-4 py-4">
            <Logo className="h-7 w-7" />
            <span className="text-sm font-bold tracking-tight">
              Mix<span className="text-[color:var(--accent)]">Funded</span>
            </span>
          </a>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {items.map((item) => {
              const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-[13px] font-medium transition ${
                    active
                      ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon />
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div className="border-t border-border p-4 text-xs text-muted-foreground">
            Next payout · {me.nextPayout}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-border lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{me.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {kycLabel(me.kyc_status)} · {me.role === "admin" ? "admin desk" : "trader desk"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" className="hidden rounded-[6px] border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground sm:inline-flex">
                Marketing site
              </a>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  clearSession();
                  router.replace("/login");
                }}
                className="rounded-[6px] border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Log out
              </button>
            </div>
          </header>

          {open && (
            <div className="border-b border-border bg-card p-3 lg:hidden">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-[6px] px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          <main className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function OverviewIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function AccountsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2h12l1 4H5z" />
      <path d="M6 6h12v14H6z" />
      <path d="M9 10h6M9 14h6" />
    </svg>
  );
}
function ChallengeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function PayoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9 10h4.5a1.5 1.5 0 0 1 0 3H9" />
    </svg>
  );
}
function CertIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3h8l5 5v13H3V3h5z" />
      <path d="M15 3v6h6" />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7z" />
    </svg>
  );
}
