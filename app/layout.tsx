import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import ConvexClientProvider from "@/components/ConvexClientProvider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Updated metadata for LifeLink PWA
export const metadata: Metadata = {
  title: "LifeLink - Blood Donation Platform",
  description: "Connect donors with patients in need. Save lives with LifeLink.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  // Added PWA metadata
  manifest: "/manifest.json",
  themeColor: "#E63946",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LifeLink",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
