import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"

export async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          AVQN Starter
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">{session.user.name}</span>
              <SignOutButton />
            </>
          ) : (
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
