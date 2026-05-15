import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const startHref = session ? "/dashboard" : "/sign-up"

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        AVQN Starter Kit
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">
        Une base Next.js minimale et moderne pour démarrer vos MVPs.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href={startHref}>Start</Link>
      </Button>
    </div>
  )
}
