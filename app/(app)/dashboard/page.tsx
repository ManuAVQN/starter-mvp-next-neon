import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>
      <p className="text-muted-foreground">
        Bienvenue, {session?.user.name}. Votre espace est prêt.
      </p>
    </div>
  )
}
