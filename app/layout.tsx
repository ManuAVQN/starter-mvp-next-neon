import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/config"
import "./globals.css"

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={GeistSans.className}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
