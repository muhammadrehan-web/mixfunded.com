"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { apiJson } from "@/lib/api-client";
import { clearSession } from "@/lib/auth";
import type { DeskMe } from "@/lib/desk";

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [me, setMe] = useState<DeskMe | null>(null);

  useEffect(() => {
    apiJson<DeskMe>("/api/me").then((result) => {
      if (!result.ok || result.data.role !== "admin") {
        router.replace("/dashboard");
        return;
      }
      setMe(result.data);
      setReady(true);
    });
  }, [router]);

  if (!ready || !me) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading admin desk…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl">
        <a href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="text-sm font-bold">
            Mix<span className="text-[color:var(--accent)]">Funded</span> admin
          </span>
        </a>
        <div className="flex items-center gap-2">
          <a href="/dashboard" className="rounded-[6px] border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
            Trader desk
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
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
