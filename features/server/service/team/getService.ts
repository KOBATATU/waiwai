import {
  ExceptionEnum,
  NotFoundException,
} from "@/features/server/core/exception"
import { getTeamRepository } from "@/features/server/repository/team/getRepository"

export const getTeamService = {
  /**
   *
   * @param userId
   * @param competitionId
   * @returns
   */
  getTeamByUserIdAndCompetitionId: async (
    userId: string,
    competitionId: string
  ) => {
    const team = await getTeamRepository.getTeamByUserIdAndCompetitionId(
      userId,
      competitionId
    )

    if (!team) {
      throw new NotFoundException({
        fieldsError: {
          id: [ExceptionEnum.competitionTeamNotFound.message],
        },
        message: ExceptionEnum.competitionTeamNotFound.message,
        code: ExceptionEnum.competitionTeamNotFound.code,
      })
    }

    return team
  },

  /**
   *
   * @param page
   * @param competitionId
   * @param useMax
   * @returns
   */
  getTeamPublicScoresByCompetitionId: async (
    page: number,
    competitionId: string,
    userId: string,
    useMax: boolean
  ) => {
    return await getTeamRepository.getTeamPublicScoresByCompetitionId(
      competitionId,
      page,
      userId,
      useMax
    )
  },

  getTeamPrivateScoresByCompetitionId: async (
    page: number,
    competitionId: string,
    userId: string,
    useMax: boolean
  ) => {
    return await getTeamRepository.getTeamPrivateScoresByCompetitionId(
      competitionId,
      page,
      userId,
      useMax
    )
  },
}
