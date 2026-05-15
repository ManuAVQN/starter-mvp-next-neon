import Link from "next/link"
import { SignInForm } from "./sign-in-form"

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Connexion</h1>
        <p className="text-sm text-muted-foreground">Accédez à votre espace.</p>
      </div>
      <SignInForm />
      <div className="space-y-1 text-center text-sm text-muted-foreground">
        <p>
          <Link href="/forgot-password" className="font-medium text-foreground hover:underline">
            Mot de passe oublié ?
          </Link>
        </p>
        <p>
          Pas encore de compte ?{" "}
          <Link href="/sign-up" className="font-medium text-foreground hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}
