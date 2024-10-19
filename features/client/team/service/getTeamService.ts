import { getHandler } from "@/features/server/core/handler"
import { getServerSession } from "@/features/server/core/session"
import { EvaluationFuncEnum } from "@/features/server/domain/competition/competition"
import { GetCompetitionServiceType } from "@/features/server/service/competition/base/getService"
import { getTeamService } from "@/features/server/service/team/getService"
import { UnwrapObject } from "@/features/server/type"

import { createDateWithTimezone } from "@/lib/utils"

export const getTeamClientService = {
  /**
   *
   * @param competitionId
   * @returns
   */
  getTeamPublicScoresByCompetitionId: async (
    competitionId: string,
    competition: GetCompetitionServiceType["getCompetitionById"]
  ) => {
    return await getHandler({
      auth: false,
      handler: async () => {
        const session = await getServerSession()
        const userId = session?.user.id ?? ""
        type ProblemKeys = keyof typeof EvaluationFuncEnum
        const problem =
          competition.problem in EvaluationFuncEnum
            ? EvaluationFuncEnum[competition.problem as ProblemKeys]
            : EvaluationFuncEnum["regression"]
        // @ts-ignore
        const useMax = problem[competition.evaluationFunc].order === "max"

        return await getTeamService.getTeamPublicScoresByCompetitionId(
          1,
          competitionId,
          userId,
          useMax
        )
      },
    })()
  },

  /**
   *
   * @param competitionId
   * @returns
   */
  getTeamPrivateScoresByCompetitionId: async (
    competitionId: string,
    competition: GetCompetitionServiceType["getCompetitionById"]
  ) => {
    return await getHandler({
      auth: false,
      handler: async () => {
        const session = await getServerSession()
        const userId = session?.user.id ?? ""
        type ProblemKeys = keyof typeof EvaluationFuncEnum
        const problem =
          competition.problem in EvaluationFuncEnum
            ? EvaluationFuncEnum[competition.problem as ProblemKeys]
            : EvaluationFuncEnum["regression"]
        // @ts-ignore
        const useMax = problem[competition.evaluationFunc].order === "max"

        const now = createDateWithTimezone(new Date())
        if (now.getTime() > competition.endDate.getTime()) {
          return await getTeamService.getTeamPrivateScoresByCompetitionId(
            1,
            competitionId,
            userId,
            useMax
          )
        }
        return {
          data: [],
        }
      },
    })()
  },
}

export type GetTeamServiceType = UnwrapObject<typeof getTeamClientService>
