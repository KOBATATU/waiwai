import { SubmissionTable } from "@/features/client/team/components/submission/SubmissionTable"
import { getTeamClientService } from "@/features/client/team/service/getTeamService"

import { QueryParameters } from "@/lib/utils"

type RootContainerProps = {
  id: string
  queryParameter: QueryParameters
}

export const RootContainer = async ({
  id,
  queryParameter,
}: RootContainerProps) => {
  const teamSubmissions = await getTeamClientService.getTeamSubmissionsByTeamId(
    id,
    queryParameter.page
  )

  return (
    <div className="mt-2">
      <div className="mb-4 flex gap-2 items-center">
        <h2 className="text-xl font-bold ">Your Team Submissions</h2>
      </div>
      <SubmissionTable submissions={teamSubmissions} competitionId={id} />
    </div>
  )
}
