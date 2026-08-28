import { SITE } from "@/lib/site";

export default function ChatWidget() {
  return (
    <a
      href={`mailto:${SITE.email}`}
      aria-label="Open support chat"
      className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--background)]/80 text-[var(--accent)] transition hover:scale-105"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      </svg>
    </a>
  );
}
