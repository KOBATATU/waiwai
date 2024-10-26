import { SubmissionTable } from "@/features/client/team/components/submission/SubmissionTable"
import { getTeamClientService } from "@/features/client/team/service/getTeamService"

type RootContainerProps = {
  id: string
}

export const RootContainer = async ({ id }: RootContainerProps) => {
  const teamSubmissions =
    await getTeamClientService.getTeamSubmissionsByTeamId(id)

  return (
    <div className="mt-2">
      <div className="mb-4 flex gap-2 items-center">
        <h2 className="text-xl font-bold ">Your Team Submissions</h2>
      </div>
      <SubmissionTable submissions={teamSubmissions} competitionId={id} />
    </div>
  )
}
