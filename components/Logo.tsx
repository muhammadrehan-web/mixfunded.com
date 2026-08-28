export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MixFunded"
      className={`${className} text-[#1A1E1C] dark:text-[#E8E6DF]`}
    >
      <rect x="18.5" y="8" width="3" height="10" fill="currentColor" />
      <rect x="12" y="18" width="16" height="60" fill="currentColor" />
      <rect x="48.5" y="30" width="3" height="10" fill="#C8A24A" />
      <rect x="42" y="40" width="16" height="38" fill="#C8A24A" />
      <rect x="78.5" y="8" width="3" height="10" fill="currentColor" />
      <rect x="72" y="18" width="16" height="60" fill="currentColor" />
      <rect x="8" y="84" width="84" height="5.5" fill="#3FB68B" />
    </svg>
  );
}

export function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function Check({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
