import { getHandler } from "@/features/server/core/handler"
import { getServerSession } from "@/features/server/core/session"
import {
  EvaluationFuncEnum,
  getUseMax,
} from "@/features/server/domain/competition/competition"
import {
  getCompetitionService,
  GetCompetitionServiceType,
} from "@/features/server/service/competition/base/getService"
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

        const useMax = getUseMax(
          competition.problem,
          competition.evaluationFunc
        )

        return await getTeamService.getTeamPublicScoresByCompetitionId(
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

        const useMax = getUseMax(
          competition.problem,
          competition.evaluationFunc
        )

        const now = createDateWithTimezone(new Date())
        if (
          now.getTime() > competition.endDate.getTime() &&
          competition.completed
        ) {
          return await getTeamService.getTeamPrivateScoresByCompetitionId(
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

  /**
   *
   * @param competitionId
   * @returns
   */
  getTeamByUserIdAndCompetitionId: async (competitionId: string) => {
    return await getHandler({
      auth: true,
      permissions: ["user", "admin"],
      handler: async () => {
        const user = await getServerSession()
        return await getTeamService.getTeamByUserIdAndCompetitionId(
          user?.user.id ?? "",
          competitionId
        )
      },
    })()
  },

  /**
   *
   * @param competitionId
   * @returns
   */
  getTeamSubmissionsByTeamId: async (competitionId: string, page: number) => {
    return await getHandler({
      auth: true,
      permissions: ["user", "admin"],
      handler: async () => {
        const user = await getServerSession()
        const competition =
          await getCompetitionService.getCompetitionById(competitionId)
        const team = await getTeamService.getTeamByUserIdAndCompetitionId(
          user?.user.id ?? "",
          competitionId
        )

        const now = createDateWithTimezone(new Date())
        const canGetPrivate = now.getTime() > competition.endDate.getTime()

        return await getTeamService.getTeamSubmissionsByTeamId(
          team.id,
          canGetPrivate,
          page
        )
      },
    })()
  },
}

export type GetTeamServiceType = UnwrapObject<typeof getTeamClientService>
