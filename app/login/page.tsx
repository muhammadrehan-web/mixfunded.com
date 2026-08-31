import { Suspense } from "react";
import LoginWindow from "@/components/auth/LoginWindow";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(63,182,139,0.12),_transparent_55%)]" />
      <div className="relative w-full">
        <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Loading…</p>}>
          <LoginWindow />
        </Suspense>
      </div>
    </main>
  );
}
