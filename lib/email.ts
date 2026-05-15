import { Resend } from "resend"
import { VerificationEmail } from "@/emails/verification"
import { ResetPasswordEmail } from "@/emails/reset-password"
import { WelcomeEmail } from "@/emails/welcome"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL!

export async function sendVerificationEmail(params: {
  to: string
  firstName: string
  verificationUrl: string
}) {
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Vérifiez votre adresse email",
    react: VerificationEmail({
      firstName: params.firstName,
      verificationUrl: params.verificationUrl,
    }),
  })
}

export async function sendResetPasswordEmail(params: {
  to: string
  firstName: string
  resetUrl: string
}) {
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Réinitialisez votre mot de passe",
    react: ResetPasswordEmail({
      firstName: params.firstName,
      resetUrl: params.resetUrl,
    }),
  })
}

export async function sendWelcomeEmail(params: {
  to: string
  firstName: string
  dashboardUrl: string
}) {
  return resend.emails.send({
    from: FROM,
    to: params.to,
    subject: "Votre compte est actif",
    react: WelcomeEmail({
      firstName: params.firstName,
      dashboardUrl: params.dashboardUrl,
    }),
  })
}
