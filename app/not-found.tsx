import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-mono-nums text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The trade you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-[6px] bg-[color:var(--accent)] px-5 text-sm font-semibold text-[color:var(--accent-foreground)]"
      >
        Back to home
      </Link>
    </main>
  );
}
