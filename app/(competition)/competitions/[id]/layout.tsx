import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

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
  const [competition, isCompetitionParticipated] = await Promise.all([
    getCompetitionClientService.getCompetitionById(params.id),
    getCompetitionClientService.getCompetitionParticipateByCompetitionId(
      params.id
    ),
  ])

  const menus = [
    {
      value: "overview",
      href: `/competitions/${params.id}/overview`,

      label: "overview",
    },
    {
      value: "data",
      href: `/competitions/${params.id}/data`,
      label: "data",
    },
    {
      value: "discussion",
      href: `/competitions/${params.id}/discussion`,
      label: "discussion",
    },
    {
      value: "leaderboard",
      href: `/competitions/${params.id}/leaderboard`,
      label: "leaderboard",
    },
    ...(!isCompetitionParticipated
      ? [
          {
            value: "participate",
            href: `/competitions/${params.id}/participate`,
            label: "participate",
          },
        ]
      : []),
  ]

  return (
    <>
      <div className="">
        <SiteHeader />
        <section className="sm:container px-2 grid items-center gap-6 pb-8 pt-6 md:py-10">
          <SectionMenu
            title={competition.title}
            subtitle={competition.subtitle}
            menus={menus}
            defaultValue="overview"
          />
          <div>{children}</div>
        </section>
      </div>
    </>
  )
}
