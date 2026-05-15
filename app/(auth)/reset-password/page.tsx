import { ResetForm } from "./reset-form"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Lien invalide</h1>
        <p className="text-sm text-muted-foreground">
          Le lien de réinitialisation est incomplet. Demandez-en un nouveau.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Nouveau mot de passe</h1>
        <p className="text-sm text-muted-foreground">
          Choisissez un mot de passe sécurisé pour votre compte.
        </p>
      </div>
      <ResetForm token={token} />
    </div>
  )
}
