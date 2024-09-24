import { PublicLeaderBoard } from "@/features/client/competition/components/detail/PublicLeaderBoard"
import { SubmitCsvFileButton } from "@/features/client/competition/components/detail/SubmitCsvFileButton"
import { getTeamClientService } from "@/features/client/team/service/getTeamService"
import { getServerSession } from "@/features/server/core/session"

import { LeaderBoardMenu } from "./LeaderBoardMenu"

type RootContainerProps = {
  id: string
  tabQuery: string
}

export const RootContainer = async ({ id, tabQuery }: RootContainerProps) => {
  const publicLeaderBoard =
    await getTeamClientService.getTeamPublicScoresByCompetitionId(id)

  const user = await getServerSession()
  return (
    <div className="mt-2">
      <div className="mb-4 flex gap-2 items-center">
        <h2 className="text-xl font-bold ">Leaderboard</h2>
        <SubmitCsvFileButton competitionId={id} />
      </div>

      <LeaderBoardMenu
        id={id}
        tabQuery={tabQuery}
        PublicLeaderBoard={
          <PublicLeaderBoard
            publicLeaderBoard={publicLeaderBoard}
            userId={user?.user.id}
          />
        }
        PrivateLeaderBoard={"hoge"}
      />
    </div>
  )
}
