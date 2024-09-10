import { EditSettings } from "@/features/client/competition/components/edit/EditSettings"
import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

type RootContainerProps = {
  id: string
}

export const RootContainer = async ({ id }: RootContainerProps) => {
  const competition =
    await getCompetitionClientService.getCompetitionByAdmin(id)
  return (
    <div>
      <div className="flex">
        <EditSettings competition={competition} />
      </div>
    </div>
  )
}
