import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"
import { getServerSession } from "@/features/server/core/session"

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
  const [competition, isCompetitionParticipated, session] = await Promise.all([
    getCompetitionClientService.getCompetitionById(params.id),
    getCompetitionClientService.getCompetitionParticipateByCompetitionId(
      params.id
    ),
    getServerSession(),
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
    ...(session
      ? [
          ...(isCompetitionParticipated
            ? [
                {
                  value: "team",
                  href: `/competitions/${params.id}/team`,
                  label: "team",
                },
                {
                  value: "submissions",
                  href: `/competitions/${params.id}/submissions`,
                  label: "submissions",
                },
              ]
            : [
                {
                  value: "participate",
                  href: `/competitions/${params.id}/participate`,
                  label: "participate",
                },
              ]),
        ]
      : []),
  ]

  return (
    <>
      <div className="">
        <SiteHeader />
        <section className="sm:container px-2 grid items-center gap-4 pb-8 pt-6 md:py-10">
          <SectionMenu
            title={competition.title}
            subtitle={competition.subtitle}
            menus={menus}
            defaultValue="overview"
          >
            <ul className="flex gap-2 text-sm text-gray-500">
              <li>teams: {competition._count.teams}</li>
              <li>
                participates: {competition._count.competitionParticipates}
              </li>
            </ul>
          </SectionMenu>
          <div>{children}</div>
        </section>
      </div>
    </>
  )
}
