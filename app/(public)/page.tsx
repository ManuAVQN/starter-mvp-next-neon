import Link from "next/link"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/config"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const startHref = session ? "/dashboard" : "/sign-up"

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
        {APP_NAME}
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">
        {APP_DESCRIPTION}
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href={startHref}>Start</Link>
      </Button>
    </div>
  )
}
