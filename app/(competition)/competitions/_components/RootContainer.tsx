import { CompetitionList } from "@/features/client/competition/components/list/CompetitionList"
import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

type RootContainerProps = {}

export const RootContainer = async ({}: RootContainerProps) => {
  const competitions = await getCompetitionClientService.getCompetitions()

  return (
    <div className="sm:container px-2 pb-8 pt-6 md:py-10">
      <div className="flex flex-col  gap-2">
        <h1 className="text-3xl md:text-4xl font-bold">Competitions</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Let's enjoy the company competition
        </p>
      </div>
      <CompetitionList competitions={competitions} className="px-0 mt-4" />
    </div>
  )
}
