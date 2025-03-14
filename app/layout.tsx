import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "../components/theme-provider"
import { AuthProvider } from "../context/auth-context"
import { SimpleToastProvider } from "../components/simple-toast"
import { EnvWarning } from "../components/env-warning"
import { ChatProvider } from "../contexts/chat-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Carbonly AI",
  description: "AI-powered carbon emissions tracking and management platform",
  keywords: ["carbon emissions", "sustainability", "climate change", "carbon footprint", "environmental impact"],
  authors: [{ name: "Carbonly Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ChatProvider>
              <SimpleToastProvider>
                {children}
                <EnvWarning />
              </SimpleToastProvider>
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'