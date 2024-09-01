import { SiteHeader } from "@/components/Header/Header"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex flex-col  gap-2">
            <h1 className="text-3xl  md:text-4xl">Admin</h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              This is the admin console.
            </p>
          </div>
          <div className="flex-1">{children}</div>
        </section>
      </div>
    </>
  )
}
