import { VerifyClient } from "./verify-client"

export default async function VerifyEmailPage({
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
          Le lien de vérification est incomplet.
        </p>
      </div>
    )
  }

  return <VerifyClient token={token} />
}
