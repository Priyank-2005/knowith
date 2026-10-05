import { Resend } from 'resend';

/**
 * Sends a sign-in code. Uses Resend with OTP_FROM_EMAIL
 * (e.g. "Knowith Capital <invest@knowithcapital.com>", on a domain verified in Resend).
 * In local development without a key, the code is logged to the server console.
 */
export async function sendOtpEmail(to: string, code: string, name?: string | null): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.OTP_FROM_EMAIL;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email sending is not configured (RESEND_API_KEY / OTP_FROM_EMAIL)');
    }
    console.log(`[OTP] Sign-in code for ${to}: ${code} (email not configured — dev only)`);
    return;
  }

  const greeting = name ? `Hello ${name.split(' ')[0]},` : 'Hello,';
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0B2E33;background:#F6F3EC">
    <div style="font-family:Georgia,serif;font-size:22px;margin-bottom:4px">Knowith</div>
    <div style="font-size:10px;letter-spacing:3px;color:#6B7876;margin-bottom:28px">CAPITAL · UDAIPUR</div>
    <p style="margin:0 0 16px">${greeting}</p>
    <p style="margin:0 0 20px">Use this code to sign in to Knowith Capital. It expires in 10 minutes.</p>
    <div style="font-size:32px;letter-spacing:10px;font-weight:bold;background:#fff;border:1px solid #e3ddd0;padding:16px;text-align:center;margin-bottom:20px">${code}</div>
    <p style="margin:0;font-size:12px;color:#6B7876">If you didn't request this, you can ignore this email — no one can sign in without the code.</p>
  </div>`;

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    subject: `${code} is your Knowith Capital sign-in code`,
    html,
    text: `${greeting}\n\nYour Knowith Capital sign-in code is ${code}. It expires in 10 minutes.\n\nIf you didn't request this, ignore this email.`,
  });
  if (error) throw new Error(error.message);
}
