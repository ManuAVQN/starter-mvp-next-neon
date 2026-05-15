import { Navbar } from "@/components/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16">{children}</main>
    </>
  )
}
