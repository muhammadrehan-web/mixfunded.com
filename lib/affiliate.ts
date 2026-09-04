import { sql } from "@/lib/db";
import { DEFAULT_AFFILIATE_RATE, isAffiliateCode, normalizeCode, refFromRequest } from "@/lib/affiliate-cookie";

export { DEFAULT_AFFILIATE_RATE, isAffiliateCode, normalizeCode, refFromRequest } from "@/lib/affiliate-cookie";
export { REF_COOKIE, refCookieAttrs } from "@/lib/affiliate-cookie";

type Db = ReturnType<typeof sql>;

export function makeAffiliateCode(name: string, id: string) {
  const base =
    String(name || "trader")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 12) || "trader";
  const tail = String(id).replace(/-/g, "").slice(0, 6);
  return `${base}-${tail}`;
}

export function commissionAmount(fee: number, rate: number) {
  return Math.round(Number(fee) * Number(rate) * 100) / 100;
}

export function maskEmail(email: string) {
  const [user, domain] = String(email).split("@");
  if (!domain) return "***";
  const start = user.slice(0, 2) || "*";
  return `${start}***@${domain}`;
}

export async function ensureAffiliateCode(db: Db, userId: string, name: string) {
  const rows = await db`SELECT affiliate_code FROM users WHERE id = ${userId} LIMIT 1`;
  if (rows[0]?.affiliate_code) return String(rows[0].affiliate_code);
  let code = makeAffiliateCode(name, userId);
  const clash = await db`SELECT id FROM users WHERE affiliate_code = ${code} AND id <> ${userId} LIMIT 1`;
  if (clash[0]) code = `${code}${String(userId).replace(/-/g, "").slice(6, 10)}`;
  await db`UPDATE users SET affiliate_code = ${code} WHERE id = ${userId}`;
  return code;
}

export async function bindReferrer(db: Db, userId: string, code: string) {
  const normalized = normalizeCode(code);
  if (!isAffiliateCode(normalized)) return null;
  const affiliates = await db`
    SELECT id FROM users WHERE affiliate_code = ${normalized} AND id <> ${userId} LIMIT 1
  `;
  const affiliate = affiliates[0];
  if (!affiliate) return null;
  await db`
    UPDATE users
    SET referred_by = ${affiliate.id}
    WHERE id = ${userId} AND referred_by IS NULL
  `;
  return String(affiliate.id);
}

export async function creditOrderCommission(
  db: Db,
  input: { orderId: string; buyerId: string; fee: number; request: Request },
) {
  const buyers = await db`SELECT id, referred_by FROM users WHERE id = ${input.buyerId} LIMIT 1`;
  const buyer = buyers[0];
  if (!buyer) return null;

  let affiliateId = buyer.referred_by ? String(buyer.referred_by) : "";
  if (!affiliateId) {
    const bound = await bindReferrer(db, input.buyerId, refFromRequest(input.request));
    affiliateId = bound || "";
  }
  if (!affiliateId || affiliateId === String(input.buyerId)) return null;

  const existing = await db`SELECT id FROM affiliate_commissions WHERE order_id = ${input.orderId} LIMIT 1`;
  if (existing[0]) return existing[0];

  const rates = await db`
    SELECT COALESCE(affiliate_rate, ${DEFAULT_AFFILIATE_RATE}) AS rate
    FROM users WHERE id = ${affiliateId} LIMIT 1
  `;
  const rate = Number(rates[0]?.rate) || DEFAULT_AFFILIATE_RATE;
  const amount = commissionAmount(input.fee, rate);
  if (amount <= 0) return null;

  const rows = await db`
    INSERT INTO affiliate_commissions (
      affiliate_id, referred_user_id, order_id, fee_usdt, rate, amount, status
    )
    VALUES (
      ${affiliateId},
      ${input.buyerId},
      ${input.orderId},
      ${input.fee},
      ${rate},
      ${amount},
      ${"pending"}
    )
    RETURNING id, amount, rate
  `;
  return rows[0] ?? null;
}
