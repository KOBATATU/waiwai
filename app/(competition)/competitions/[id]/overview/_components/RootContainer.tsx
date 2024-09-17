import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

import { Markdown } from "@/components/Markdown/Markdown"
import TOC from "@/components/Markdown/TableContents"

type RootContainerProps = {
  id: string
}

export const RootContainer = async ({ id }: RootContainerProps) => {
  const competition = await getCompetitionClientService.getCompetitionById(id)

  return (
    <div>
      <div className="flex gap-6">
        <Markdown body={competition.description} />
        <TOC
          className=" h-max hidden sm:sticky sm:block sm:top-4 "
          body={competition.description}
        />
      </div>
    </div>
  )
}
