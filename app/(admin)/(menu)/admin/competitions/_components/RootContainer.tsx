import { CreateCompetitionButton } from "@/features/client/competition/components/create/CreateCompetitionButton"
import { CompetitionList } from "@/features/client/competition/components/list/CompetitionList"
import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

import { QueryParameters } from "@/lib/utils"

type RootContainerProps = {
  queryParameter: QueryParameters
}

export const RootContainer = async ({ queryParameter }: RootContainerProps) => {
  const competitions = await getCompetitionClientService.getCompetitionsByAdmin(
    queryParameter.page
  )
  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="font-bold text-xl"> Competitions </div>
        <CreateCompetitionButton />
      </div>
      <CompetitionList competitions={competitions} isAdminPage />
    </div>
  )
}
