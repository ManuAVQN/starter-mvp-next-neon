import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "@/db"
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
} from "@/lib/email"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        to: user.email,
        firstName: (user as { firstName?: string }).firstName ?? user.name,
        resetUrl: url,
      })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      // Construct custom URL pointing to our /verify-email page (per spec).
      // The page will call Better Auth's API to actually verify the token.
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/verify-email?token=${encodeURIComponent(token)}`
      await sendVerificationEmail({
        to: user.email,
        firstName: (user as { firstName?: string }).firstName ?? user.name,
        verificationUrl,
      })
    },
    afterEmailVerification: async (user) => {
      await sendWelcomeEmail({
        to: user.email,
        firstName: (user as { firstName?: string }).firstName ?? user.name,
        dashboardUrl: `${process.env.BETTER_AUTH_URL}/dashboard`,
      })
    },
  },
  user: {
    additionalFields: {
      firstName: { type: "string", required: true, input: true },
      lastName: { type: "string", required: true, input: true },
    },
  },
  plugins: [nextCookies()],
})
