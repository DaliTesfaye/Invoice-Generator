import { env } from "../config/env";

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  if (!env.resendApiKey) {
    if (env.isProduction) {
      throw new Error("RESEND_API_KEY is required to send email in production");
    }
    return;
  }

  const resetUrl = `${env.frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to: [email],
      subject: "Reset your Invoice Generator password",
      text: `Reset your password using this link: ${resetUrl}\n\nThis link expires in one hour.`,
      html: `<p>Reset your password using the link below. It expires in one hour.</p><p><a href="${resetUrl}">Reset password</a></p>`,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend email request failed (${response.status}): ${details}`);
  }
}
