import { EditOverview } from "@/features/client/competition/components/edit/EditOverview"
import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

import TOC from "@/components/Markdown/TableContents"

type RootContainerProps = {
  id: string
}

export const RootContainer = async ({ id }: RootContainerProps) => {
  const competition =
    await getCompetitionClientService.getCompetitionByAdmin(id)
  return (
    <div>
      <div className="flex gap-6">
        <EditOverview
          id={competition.id}
          description={competition.description}
        />
        <TOC
          className="w-72 h-max hidden sm:sticky sm:block sm:top-4 "
          body={competition.description}
        />
      </div>
    </div>
  )
}
