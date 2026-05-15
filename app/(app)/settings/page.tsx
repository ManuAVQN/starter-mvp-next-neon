import { headers } from "next/headers"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { user } from "@/db/schema"
import { ProfileForm } from "./profile-form"
import { PasswordForm } from "./password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  const [account] = await db.select().from(user).where(eq(user.id, session.user.id))

  if (!account) redirect("/sign-in")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Paramètres du compte</h1>
        <p className="text-sm text-muted-foreground">
          Mettez à jour vos informations personnelles et votre mot de passe.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Modifiez vos informations personnelles.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              firstName: account.firstName,
              lastName: account.lastName,
              email: account.email,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mot de passe</CardTitle>
          <CardDescription>Changez votre mot de passe.</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
