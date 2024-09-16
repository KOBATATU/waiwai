import { UploadData } from "@/features/client/competition/components/create/UploadData"
import { EditData } from "@/features/client/competition/components/edit/EditData"
import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

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
        <div className="w-72 h-max hidden sm:sticky sm:block sm:top-4 ">
          <UploadData
            id={competition.id}
            competitionDatas={competition.competitionDatas}
          />
        </div>
      </div>
    </div>
  )
}
