import { PublicLeaderBoard } from "@/features/client/competition/components/detail/PublicLeaderBoard"
import { SubmitCsvFileButton } from "@/features/client/competition/components/detail/SubmitCsvFileButton"
import { getTeamService } from "@/features/server/service/team/getService"

import { LeaderBoardMenu } from "./LeaderBoardMenu"

type RootContainerProps = {
  id: string
  tabQuery: string
}

export const RootContainer = async ({ id, tabQuery }: RootContainerProps) => {
  const publicLeaderBoard =
    await getTeamService.getTeamPublicScoresByCompetitionId(1, id, true)
  console.log(publicLeaderBoard)
  return (
    <div className="mt-2">
      <div className="mb-4 flex gap-2 items-center">
        <h2 className="text-xl font-bold ">Leaderboard</h2>
        <SubmitCsvFileButton competitionId={id} />
      </div>

      <LeaderBoardMenu
        id={id}
        tabQuery={tabQuery}
        PublicLeaderBoard={<PublicLeaderBoard />}
        PrivateLeaderBoard={"hoge"}
      />
    </div>
  )
}
