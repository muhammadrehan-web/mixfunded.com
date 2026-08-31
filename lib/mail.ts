import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";

function gmailUser() {
  return String(process.env.GMAIL_USER || "").trim();
}

function gmailPass() {
  return String(process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || "").replace(/\s/g, "");
}

export function hasMailer() {
  return Boolean(gmailUser() && gmailPass());
}

function appOrigin() {
  return String(process.env.NEXT_PUBLIC_SITE_URL || "https://mixfundedcom.vercel.app").replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function transporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: gmailUser(),
      pass: gmailPass(),
    },
  });
}

function welcomeEmailHtml(input: { safeName: string; dashboard: string; login: string }) {
  const { safeName, dashboard, login } = input;
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>Welcome to MixFunded</title>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
    <style>
      :root { color-scheme: dark; supported-color-schemes: dark; }
      html, body { margin: 0 !important; padding: 0 !important; height: auto !important; width: 100% !important; }
      body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background: #101312 !important; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
      img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }
      a { text-decoration: none; }
      h1, p { word-break: break-word; overflow-wrap: anywhere; }
      .card, .btn, .shell { width: 100% !important; max-width: 100% !important; }
      .btn { min-height: 48px; line-height: 20px; }

      @media only screen and (max-width: 374px) {
        .outer { padding: 12px 8px !important; }
        .pad-top { padding: 18px 14px 6px !important; }
        .pad-mid { padding: 6px 14px 0 !important; }
        .pad-bot { padding: 16px 14px 18px !important; }
        .kicker { font-size: 10px !important; letter-spacing: 0.12em !important; }
        .title { font-size: 20px !important; line-height: 1.28 !important; }
        .copy, .item { font-size: 14px !important; line-height: 1.55 !important; }
        .btn { font-size: 15px !important; padding: 14px 12px !important; }
        .foot { font-size: 11px !important; }
      }

      @media only screen and (min-width: 375px) and (max-width: 600px) {
        .outer { padding: 16px 12px !important; }
        .pad-top { padding: 22px 18px 8px !important; }
        .pad-mid { padding: 8px 18px 0 !important; }
        .pad-bot { padding: 20px 18px 22px !important; }
        .title { font-size: 22px !important; line-height: 1.3 !important; }
        .copy, .item { font-size: 15px !important; line-height: 1.6 !important; }
        .btn { font-size: 16px !important; padding: 14px 16px !important; }
      }

      @media only screen and (min-width: 601px) and (max-width: 1023px) {
        .outer { padding: 32px 28px !important; }
        .shell { width: 90% !important; max-width: 680px !important; }
        .pad-top { padding: 32px 32px 10px !important; }
        .pad-mid { padding: 10px 32px 0 !important; }
        .pad-bot { padding: 28px 32px 32px !important; }
        .title { font-size: 28px !important; line-height: 1.28 !important; }
        .copy, .item { font-size: 16px !important; line-height: 1.65 !important; }
        .btn { font-size: 16px !important; padding: 16px 20px !important; }
      }

      @media only screen and (min-width: 1024px) {
        .outer { padding: 48px 32px !important; }
        .shell { width: 600px !important; max-width: 600px !important; }
        .pad-top { padding: 40px 40px 12px !important; }
        .pad-mid { padding: 12px 40px 0 !important; }
        .pad-bot { padding: 32px 40px 40px !important; }
        .title { font-size: 30px !important; line-height: 1.25 !important; }
        .copy, .item { font-size: 16px !important; line-height: 1.7 !important; }
        .btn { font-size: 16px !important; padding: 16px 24px !important; }
      }

      @media only screen and (max-height: 480px) and (orientation: landscape) {
        .outer { padding: 12px 16px !important; }
        .title { font-size: 22px !important; }
        .pad-top, .pad-mid, .pad-bot { padding-top: 12px !important; padding-bottom: 12px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#101312;font-family:Arial,Helvetica,sans-serif;color:#e8e6df;width:100%;min-width:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
      Your MixFunded desk is open — challenges, payouts, and Monday USDT.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#101312;width:100%;min-width:100%;">
      <tr>
        <td class="outer" align="center" valign="top" style="padding:20px 12px;background:#101312;">
          <!--[if mso]>
          <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" width="600"><tr><td>
          <![endif]-->
          <table role="presentation" class="shell" align="center" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;margin:0 auto;">
            <tr>
              <td>
                <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#181c1a;border:1px solid #2a312e;border-radius:6px;">
                  <tr>
                    <td class="pad-top" style="padding:22px 18px 8px;">
                      <p class="kicker" style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#3fb68b;font-weight:700;">Trader desk</p>
                      <h1 class="title" style="margin:12px 0 0;font-size:22px;line-height:1.3;color:#e8e6df;font-weight:700;">
                        Welcome to Mix<span style="color:#3fb68b;">Funded</span>, ${safeName}.
                      </h1>
                      <p class="copy" style="margin:14px 0 0;font-size:15px;line-height:1.6;color:#8a8f8b;">
                        Your account is stored and ready. Open the desk for challenges, payouts, and Monday USDT.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td class="pad-mid" style="padding:8px 18px 0;">
                      <p class="item" style="margin:0;font-size:15px;line-height:1.6;color:#8a8f8b;">01 — Challenges from $5</p>
                      <p class="item" style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#8a8f8b;">02 — Payouts every Monday in USDT</p>
                      <p class="item" style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#8a8f8b;">03 — Every TXID on the public ledger</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="pad-bot" style="padding:20px 18px 22px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <a class="btn" href="${dashboard}" style="display:block;width:100%;max-width:100%;box-sizing:border-box;background:#3fb68b;color:#0b0d0c;text-decoration:none;font-size:16px;font-weight:700;padding:14px 16px;border-radius:6px;text-align:center;min-height:20px;">Open dashboard</a>
                          </td>
                        </tr>
                      </table>
                      <p class="copy" style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#8a8f8b;">
                        Already closed the tab? <a href="${login}" style="color:#3fb68b;font-weight:700;">Log in</a> with the email you registered.
                      </p>
                    </td>
                  </tr>
                </table>
                <p class="foot" style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#8a8f8b;text-align:center;">
                  ${escapeHtml(SITE.legal)} · ${escapeHtml(SITE.email)}
                </p>
              </td>
            </tr>
          </table>
          <!--[if mso]>
          </td></tr></table>
          <![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendWelcomeEmail(input: { name: string; email: string }) {
  if (!hasMailer()) {
    console.warn("Gmail is not configured; skipped welcome email.");
    return { sent: false as const, skipped: true as const };
  }

  const firstName = input.name.split(/\s+/)[0] || "trader";
  const origin = appOrigin();
  const dashboard = `${origin}/dashboard`;
  const login = `${origin}/login`;
  const safeName = escapeHtml(firstName);

  await transporter().sendMail({
    from: `"${SITE.name}" <${gmailUser()}>`,
    replyTo: SITE.email,
    to: input.email,
    subject: `Welcome to ${SITE.name} — your desk is open`,
    text: [
      `Hi ${firstName},`,
      "",
      `Your ${SITE.name} account is ready. Challenges start from $5, payouts go out every Monday in USDT, and every TXID sits on the public ledger.`,
      "",
      `Open your desk: ${dashboard}`,
      `Log in later: ${login}`,
      "",
      `${SITE.legal}`,
    ].join("\n"),
    html: welcomeEmailHtml({ safeName, dashboard, login }),
  });

  return { sent: true as const, skipped: false as const };
}

export async function sendOrderEmail(input: {
  name: string;
  email: string;
  program: string;
  size: string;
  fee: string;
  platform: string;
}) {
  if (!hasMailer()) {
    console.warn("Gmail is not configured; skipped order email.");
    return { sent: false as const, skipped: true as const };
  }

  const firstName = input.name.split(/\s+/)[0] || "trader";
  const origin = appOrigin();
  const orders = `${origin}/dashboard/orders`;
  const safeName = escapeHtml(firstName);
  const program = escapeHtml(input.program);
  const size = escapeHtml(input.size);
  const fee = escapeHtml(input.fee);
  const platform = escapeHtml(input.platform);

  await transporter().sendMail({
    from: `"${SITE.name}" <${gmailUser()}>`,
    replyTo: SITE.email,
    to: input.email,
    subject: `Order confirmed — ${input.program} ${input.size}`,
    text: [
      `Hi ${firstName},`,
      "",
      `Your MixFunded challenge order is in.`,
      `${input.program} · ${input.size} · ${input.platform} · $${input.fee} USDT (demo desk).`,
      "",
      `View orders: ${orders}`,
      "",
      `${SITE.legal}`,
    ].join("\n"),
    html: welcomeEmailHtml({ safeName, dashboard: orders, login: `${origin}/login` })
      .replace(
        `Welcome to Mix<span style="color:#3fb68b;">Funded</span>, ${safeName}.`,
        `Order confirmed, ${safeName}.`,
      )
      .replace(
        `Your MixFunded desk is open — challenges, payouts, and Monday USDT.`,
        `${program} ${size} on ${platform} — $${fee} USDT demo order is confirmed.`,
      )
      .replace(
        `Your account is stored and ready. Open the desk for challenges, payouts, and Monday USDT.`,
        `Order saved: ${program} · ${size} · ${platform} · $${fee} USDT (demo). Open the desk to see it under Orders.`,
      )
      .replace("Open dashboard", "View orders"),
  });

  return { sent: true as const, skipped: false as const };
}
