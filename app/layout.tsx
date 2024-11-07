import "@/styles/globals.css"

import { Toaster } from "@/components/ui/toaster"

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <Toaster />
          {children}
        </body>
      </html>
    </>
  )
}
