import ForgotPasswordWindow from "@/components/auth/ForgotPasswordWindow";

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(63,182,139,0.12),_transparent_55%)]" />
      <div className="relative w-full">
        <ForgotPasswordWindow />
      </div>
    </main>
  );
}
