import { redirect } from "next/navigation"
import { ParticipateCompetition } from "@/features/client/competition/components/detail/ParticipateCompetition"
import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

type RootContainerProps = {
  id: string
}

export const RootContainer = async ({ id }: RootContainerProps) => {
  const [competition, isCompetitionParticipated] = await Promise.all([
    getCompetitionClientService.getCompetitionById(id),
    getCompetitionClientService.getCompetitionParticipateByCompetitionId(id),
  ])

  if (isCompetitionParticipated) {
    redirect(`/competitions/${id}/overview`)
  }

  return (
    <div className="mt-4">
      <ParticipateCompetition id={id} />
    </div>
  )
}
