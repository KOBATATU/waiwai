import { SiteHeader } from "@/components/Header/Header"
import { SectionMenu } from "@/components/Layout/SectionMenu"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <SectionMenu
            title="Admin"
            subtitle=" This is the admin console."
            menus={[
              {
                value: "competitions",
                href: "/admin/competitions",
                label: "competition",
              },
              {
                value: "users",
                href: "/admin/users",
                label: "user setting",
              },
            ]}
            defaultValue="competition"
          />
          <div className="flex-1">{children}</div>
        </section>
      </div>
    </>
  )
}
