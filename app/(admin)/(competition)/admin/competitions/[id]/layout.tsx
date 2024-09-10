import { getCompetitionService } from "@/features/server/service/competition/base/getService"

import { SiteHeader } from "@/components/Header/Header"
import { SectionMenu } from "@/components/Layout/SectionMenu"

interface RootLayoutProps {
  children: React.ReactNode
  params: { id: string }
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const competition = await getCompetitionService.getCompetitionByIdAndAdmin(
    params.id
  )
  return (
    <>
      <div className="">
        <SiteHeader />
        <section className="sm:container px-2 grid items-center gap-6 pb-8 pt-6 md:py-10">
          <SectionMenu
            title={competition.title}
            subtitle={competition.subtitle}
            menus={[
              {
                value: "overview",
                href: `/admin/competitions/${params.id}/overview`,

                label: "overview",
              },
              {
                value: "data",
                href: `/admin/competitions/${params.id}/data`,
                label: "data",
              },
              {
                value: "settings",
                href: `/admin/competitions/${params.id}/settings`,
                label: "settings",
              },
            ]}
            defaultValue="overview"
          />
          <div>{children}</div>
        </section>
      </div>
    </>
  )
}
