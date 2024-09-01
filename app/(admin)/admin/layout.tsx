import { SiteHeader } from "@/components/Header/Header"
import { SectionMenu } from "@/components/Layout/SectionMenu"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="">
        <SiteHeader />
        <section className="sm:container px-2 grid items-center gap-6 pb-8 pt-6 md:py-10">
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
          <div className="w-max">{children}</div>
        </section>
      </div>
    </>
  )
}
