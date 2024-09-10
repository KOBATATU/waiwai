import { EditData } from "@/features/client/competition/components/edit/EditData"
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
        <EditData
          dataDescription={competition.dataDescription}
          id={competition.id}
        />
        <TOC
          className="w-72 h-max hidden sm:sticky sm:block sm:top-4 "
          body={competition.dataDescription}
        />
      </div>
    </div>
  )
}
