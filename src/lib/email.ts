import { Resend } from 'resend'

const FROM = process.env.EMAIL_FROM ?? 'USIASDHR Academy <noreply@usiasdhr.org>'

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Reset your USIASDHR Academy password',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#1e293b">
        <p style="font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#7c3aed;margin:0 0 24px">USIASDHR Academy</p>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 12px">Reset your password</h1>
        <p style="color:#475569;margin:0 0 24px;line-height:1.6">
          We received a request to reset the password for your account. Click the button below to choose a new password.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;font-weight:600;font-size:14px;border-radius:8px;text-decoration:none">
          Reset password
        </a>
        <p style="color:#94a3b8;font-size:13px;margin:24px 0 0;line-height:1.6">
          This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
        <p style="color:#cbd5e1;font-size:12px;margin:0">
          United States Institute of Autism Spectrum Disorder and Human Rights
        </p>
      </div>
    `,
  })
}
