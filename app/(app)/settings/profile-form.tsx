"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/lib/actions/account"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Props = {
  defaultValues: { firstName: string; lastName: string; email: string }
}

export function ProfileForm({ defaultValues }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function action(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.success) {
        setMessage({ type: "success", text: "Profil mis à jour." })
        router.refresh()
      } else {
        setMessage({ type: "error", text: result.error })
      }
    })
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" defaultValue={defaultValues.firstName} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" defaultValue={defaultValues.lastName} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultValues.email} required />
      </div>
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Sauvegarde..." : "Sauvegarder"}
      </Button>
    </form>
  )
}
