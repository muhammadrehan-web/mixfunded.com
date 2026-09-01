import type { ChallengePlan, ChallengeProgram } from "@/lib/data";
import { sql } from "@/lib/db";
import { accountInsertValues } from "@/lib/desk";

type Db = ReturnType<typeof sql>;

export async function provisionAccount(
  db: Db,
  input: {
    userId: string;
    orderId: string;
    program: ChallengeProgram;
    plan: ChallengePlan;
    platform: string;
  },
) {
  const existing = await db`SELECT id FROM accounts WHERE order_id = ${input.orderId} LIMIT 1`;
  if (existing[0]) return existing[0];

  const fields = accountInsertValues(input);
  const rows = await db`
    INSERT INTO accounts (
      user_id, order_id, login, password_plain, platform, server, program, program_id,
      phase, size, balance, equity, profit, profit_target, status
    )
    VALUES (
      ${input.userId},
      ${input.orderId},
      ${fields.login},
      ${fields.password},
      ${input.platform},
      ${"MixFunded-Demo"},
      ${input.program.label},
      ${input.program.id},
      ${fields.phase},
      ${fields.size},
      ${fields.size},
      ${fields.size},
      ${0},
      ${fields.profitTarget},
      ${fields.status}
    )
    RETURNING id
  `;

  if (input.program.id === "instant") {
    await db`
      INSERT INTO certificates (user_id, account_id, title, account_label)
      VALUES (
        ${input.userId},
        ${rows[0].id},
        ${"Instant Funding"},
        ${input.plan.size + " funded"}
      )
    `;
  }

  return rows[0];
}

export async function ensureCertificate(
  db: Db,
  input: { userId: string; accountId: string; title: string; accountLabel: string },
) {
  const existing = await db`
    SELECT id FROM certificates
    WHERE account_id = ${input.accountId} AND title = ${input.title}
    LIMIT 1
  `;
  if (existing.length > 0) return;
  await db`
    INSERT INTO certificates (user_id, account_id, title, account_label)
    VALUES (${input.userId}, ${input.accountId}, ${input.title}, ${input.accountLabel})
  `;
}
