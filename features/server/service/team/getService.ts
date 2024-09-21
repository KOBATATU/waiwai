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
}
