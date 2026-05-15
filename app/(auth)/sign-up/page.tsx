import Link from "next/link"
import { SignUpForm } from "./sign-up-form"
import { APP_NAME } from "@/lib/config"

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Créer un compte</h1>
        <p className="text-sm text-muted-foreground">
          Rejoignez {APP_NAME} en quelques secondes.
        </p>
      </div>
      <SignUpForm />
      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/sign-in" className="font-medium text-foreground hover:underline">
          Connectez-vous
        </Link>
      </p>
    </div>
  )
}
