"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Status = "loading" | "success" | "error"

export function VerifyClient({ token }: { token: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("loading")
  const [message, setMessage] = useState("Vérification en cours...")

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
          method: "GET",
        })
        if (cancelled) return
        if (res.ok) {
          setStatus("success")
          setMessage("Email vérifié. Redirection en cours...")
          setTimeout(() => router.push("/dashboard"), 1500)
        } else {
          setStatus("error")
          setMessage("Le lien est invalide ou expiré.")
        }
      } catch {
        if (cancelled) return
        setStatus("error")
        setMessage("Une erreur réseau est survenue.")
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token, router])

  return (
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold">
        {status === "success" ? "Compte vérifié" : status === "error" ? "Vérification impossible" : "Vérification..."}
      </h1>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
