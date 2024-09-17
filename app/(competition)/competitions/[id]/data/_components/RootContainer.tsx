import { DataDownload } from "@/features/client/competition/components/detail/DataDownload"
import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

import { Markdown } from "@/components/Markdown/Markdown"

type RootContainerProps = {
  id: string
}

export const RootContainer = async ({ id }: RootContainerProps) => {
  const [competition, isCompetitionParticipated] = await Promise.all([
    getCompetitionClientService.getCompetitionById(id),
    getCompetitionClientService.getCompetitionParticipateByCompetitionId(id),
  ])

  return (
    <div>
      <div className="flex gap-6">
        <Markdown body={competition.dataDescription} />
        <div className="w-72 h-max hidden sm:sticky sm:block sm:top-4 ">
          <DataDownload
            id={competition.id}
            competitionDatas={competition.competitionDatas}
            isCompetitionParticipated={isCompetitionParticipated}
          />
        </div>
      </div>
    </div>
  )
}
