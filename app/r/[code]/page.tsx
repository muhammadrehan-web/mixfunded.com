import { redirect } from "next/navigation";
import { isAffiliateCode, normalizeCode } from "@/lib/affiliate-cookie";

export default async function AffiliateRedirectPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const normalized = normalizeCode(code);
  if (!isAffiliateCode(normalized)) {
    redirect("/");
  }
  redirect(`/?ref=${encodeURIComponent(normalized)}`);
}
