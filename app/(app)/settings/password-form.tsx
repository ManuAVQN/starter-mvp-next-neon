"use client"

import { useRef, useState, useTransition } from "react"
import { updatePassword } from "@/lib/actions/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PasswordForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function action(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await updatePassword(formData)
      if (result.success) {
        setMessage({ type: "success", text: "Mot de passe mis à jour." })
        formRef.current?.reset()
      } else {
        setMessage({ type: "error", text: result.error })
      }
    })
  }

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input id="newPassword" name="newPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Sauvegarde..." : "Changer le mot de passe"}
      </Button>
    </form>
  )
}
