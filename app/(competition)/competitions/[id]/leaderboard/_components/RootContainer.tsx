import { PrivateLeaderBoard } from "@/features/client/competition/components/detail/PrivateLeaderBoard"
import { PublicLeaderBoard } from "@/features/client/competition/components/detail/PublicLeaderBoard"
import { SubmitCsvFileButton } from "@/features/client/competition/components/detail/SubmitCsvFileButton"
import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"
import { getTeamClientService } from "@/features/client/team/service/getTeamService"
import { getServerSession } from "@/features/server/core/session"
import {
  isNowAfterStartDate,
  isNowBeforeEndDate,
} from "@/features/server/domain/competition/competition"

import { LeaderBoardMenu } from "./LeaderBoardMenu"

type RootContainerProps = {
  id: string
  tabQuery: string
}

export const RootContainer = async ({ id, tabQuery }: RootContainerProps) => {
  const competition = await getCompetitionClientService.getCompetitionById(id)
  const [
    publicLeaderBoard,
    privateLeaderBoard,
    isCompetitionParticipated,
    user,
  ] = await Promise.all([
    getTeamClientService.getTeamPublicScoresByCompetitionId(id, competition),
    getTeamClientService.getTeamPrivateScoresByCompetitionId(id, competition),
    getCompetitionClientService.getCompetitionParticipateByCompetitionId(id),
    getServerSession(),
  ])

  const canSubmit =
    isNowBeforeEndDate(competition.open, competition.endDate, false) &&
    isNowAfterStartDate(competition.open, competition.startDate, false) &&
    isCompetitionParticipated

  return (
    <div className="mt-2">
      <div className="mb-4 flex gap-2 items-center">
        <h2 className="text-xl font-bold ">Leaderboard</h2>
        <SubmitCsvFileButton competitionId={id} canSubmit={canSubmit} />
      </div>

      <LeaderBoardMenu
        id={id}
        tabQuery={tabQuery}
        PublicLeaderBoard={
          <PublicLeaderBoard
            testDataRate={competition.testDataRate}
            publicLeaderBoard={publicLeaderBoard}
            userId={user?.user.id}
          />
        }
        PrivateLeaderBoard={
          <PrivateLeaderBoard
            privateLeaderBoard={privateLeaderBoard}
            userId={user?.user.id}
          />
        }
      />
    </div>
  )
}
