"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
      },
    })
    setLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={loading}>
      Sign out
    </Button>
  )
}
