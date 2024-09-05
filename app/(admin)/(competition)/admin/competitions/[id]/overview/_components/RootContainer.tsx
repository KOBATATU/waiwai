import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

import { Markdown } from "@/components/Markdown/Markdown"

type RootContainerProps = {
  id: string
}

export const RootContainer = async ({ id }: RootContainerProps) => {
  const competition =
    await getCompetitionClientService.getCompetitionByAdmin(id)
  return (
    <div>
      <div className="flex">
        <Markdown body={competition.description} />
      </div>
    </div>
  )
}
