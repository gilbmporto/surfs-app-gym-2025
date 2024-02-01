import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import Providers from "@/components/Providers"

export const fetchCache = "force-no-store"

export const metadata: Metadata = {
  title: "Surf's Gym App",
  description:
    "An app solely built for Surf's App Users to register their trainings.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center p-20 max-w-6xl mx-auto">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
