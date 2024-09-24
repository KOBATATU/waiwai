import { getHandler } from "@/features/server/core/handler"
import { getTeamService } from "@/features/server/service/team/getService"
import { UnwrapObject } from "@/features/server/type"

export const getTeamClientService = {
  /**
   *
   * @param competitionId
   * @returns
   */
  getTeamPublicScoresByCompetitionId: async (competitionId: string) => {
    return await getHandler({
      auth: false,
      handler: async () => {
        return await getTeamService.getTeamPublicScoresByCompetitionId(
          1,
          competitionId,
          true
        )
      },
    })()
  },
}

export type GetTeamServiceType = UnwrapObject<typeof getTeamClientService>
