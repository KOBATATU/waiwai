import { cookies } from "next/headers"
import {
  BadException,
  ExceptionEnum,
  NotFoundException,
} from "@/features/server/core/exception"
import { post } from "@/features/server/repository/evaluate/evaluate"
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

  /**
   *
   * @param teamId
   * @param canGetPrivate
   * @param page
   * @returns
   */
  getTeamSubmissionsByTeamId: async (
    teamId: string,
    canGetPrivate: boolean,
    page: number
  ) => {
    return await getTeamRepository.getTeamSubmissionsByTeamId(
      teamId,
      canGetPrivate,
      page
    )
  },

  /**
   *
   * @param id
   * @param teamId
   * @returns
   */
  getTeamSubmissionByIdAndTeamId: async (id: string, teamId: string) => {
    const teamSubmission =
      await getTeamRepository.getTeamSubmissionByIdAndTeamId(id, teamId)

    if (!teamSubmission) {
      throw new NotFoundException({
        fieldsError: {
          id: [ExceptionEnum.competitionTeamSubmissionNotFound.message],
        },
        message: ExceptionEnum.competitionTeamSubmissionNotFound.message,
        code: ExceptionEnum.competitionTeamSubmissionNotFound.code,
      })
    }
    return teamSubmission
  },

  /**
   *
   * @param teamId
   */
  getTeamSubmissionCountByTeamId: async (teamId: string) => {
    const count = await getTeamRepository.getTeamSubmissionCountByTeamId(teamId)

    if (count >= 2) {
      throw new BadException({
        fieldsError: {
          id: [ExceptionEnum.teamSubmissionCountOver.message],
        },
        message: ExceptionEnum.teamSubmissionCountOver.message,
        code: ExceptionEnum.teamSubmissionCountOver.code,
      })
    }
  },

  /**
   *
   * @param competitionId
   * @param object_path hoge.csv
   */
  getEvaluationScore: async (competitionId: string, object_path: string) => {
    return await post<{ public_score: number; private_score: number }>(
      "/evaluate/",
      { object_path: object_path, competition_id: competitionId }
    )
  },
}
