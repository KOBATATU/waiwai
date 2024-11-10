import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"
import { getServerSession } from "@/features/server/core/session"

import { SiteHeader } from "@/components/Header/Header"
import { SectionMenu } from "@/components/Layout/SectionMenu"

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession()

  const menus = [
    {
      value: "profile",
      href: `/user/me/profile`,
      label: "profile",
    },
  ]

  return (
    <>
      <div className="">
        <SiteHeader />
        <section className="sm:container px-2 grid items-center gap-6 pb-8 pt-6 md:py-10">
          <SectionMenu
            title={`${session?.user.name}`}
            subtitle={""}
            menus={menus}
            defaultValue="profile"
          />
          <div>{children}</div>
        </section>
      </div>
    </>
  )
}
