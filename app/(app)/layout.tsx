import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserMenu } from "@/components/user-menu"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b border-border px-4">
          <SidebarTrigger />
          <UserMenu name={session.user.name} />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
