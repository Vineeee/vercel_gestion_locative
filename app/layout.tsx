import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import EnhancedSidebar from "@/components/enhanced-sidebar"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gestion Locative Immobilière",
  description: "Application de gestion locative immobilière",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            <EnhancedSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <div className="flex-1 overflow-auto">{children}</div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
