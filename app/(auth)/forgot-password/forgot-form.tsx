"use client"

import { useState } from "react"
import { z } from "zod"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const schema = z.object({ email: z.string().email("Email invalide") })

export function ForgotForm() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const parsed = schema.safeParse({ email: formData.get("email") })

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Email invalide")
      setLoading(false)
      return
    }

    const { error } = await authClient.requestPasswordReset({
      email: parsed.data.email,
      redirectTo: "/reset-password",
    })

    if (error) {
      setError(error.message ?? "Une erreur est survenue")
      setLoading(false)
      return
    }

    setMessage("Si un compte existe pour cette adresse, un email de réinitialisation a été envoyé.")
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Envoi..." : "Envoyer le lien"}
      </Button>
    </form>
  )
}
