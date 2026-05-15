"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
})

export function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showResend, setShowResend] = useState(false)
  const [resendEmail, setResendEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setShowResend(false)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const parsed = schema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Données invalides")
      setLoading(false)
      return
    }

    const { email, password } = parsed.data

    const { error } = await authClient.signIn.email({ email, password })

    if (error) {
      if (error.status === 403 || /verif/i.test(error.message ?? "")) {
        setError("Veuillez vérifier votre adresse email avant de vous connecter.")
        setResendEmail(email)
        setShowResend(true)
      } else {
        setError(error.message ?? "Identifiants invalides")
      }
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  async function resendVerification() {
    if (!resendEmail) return
    setLoading(true)
    await authClient.sendVerificationEmail({
      email: resendEmail,
      callbackURL: "/dashboard",
    })
    setLoading(false)
    setShowResend(false)
    setError("Email de vérification renvoyé.")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {showResend && (
        <Button type="button" variant="outline" className="w-full" onClick={resendVerification} disabled={loading}>
          Renvoyer l&apos;email de vérification
        </Button>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  )
}
