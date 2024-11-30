import {
  ExceptionEnum,
  NotFoundException,
} from "@/features/server/core/exception"
import { checkUserRole, UserRole } from "@/features/server/domain/user/service"
import { getCompetitionRepository } from "@/features/server/repository/competition/getRepository"
import { getTeamRepository } from "@/features/server/repository/team/getRepository"
import { UnwrapObject } from "@/features/server/type"

export const getCompetitionService = {
  /**
   * get competition list
   * @param page
   * @returns
   */
  getCompetitions: async (page: number) => {
    return await getCompetitionRepository.getCompetitions(page)
  },

  /**
   * get unique competition
   * @param id
   * @returns
   */
  getCompetitionById: async (id: string) => {
    const competition = await getCompetitionRepository.getCompeitionById(id)
    if (!competition) {
      throw new NotFoundException("competitionNotFound", ["id"])
    }
    return competition
  },

  /**
   * get competition list By Admin
   * @param page
   * @returns
   */
  getCompetitionsByAdmin: async (page: number) => {
    return await getCompetitionRepository.getCompetitionsByAdmin(page)
  },

  /**
   * get unique competition By Admin
   * @param id
   * @returns
   */
  getCompetitionByIdAndAdmin: async (id: string) => {
    const competition =
      await getCompetitionRepository.getCompeitionByIdAndAdmin(id)

    if (!competition) {
      throw new NotFoundException("competitionNotFound", ["id"])
    }
    return competition
  },

  /**
   * get competition data
   * @param competitionData id
   */
  getCompetitionDataById: async (id: string) => {
    const competitionData =
      await getCompetitionRepository.getCompeitionDataById(id)
    if (!competitionData) {
      throw new NotFoundException("competitionDataNotFound", ["id"])
    }
    return competitionData
  },

  /**
   * check participate competition
   * @param id
   * @param userId
   */
  checkCompetitionParticipateByIdAndUserId: async (
    id: string,
    userId: string
  ) => {
    const competitionParticipate =
      await getCompetitionRepository.getCompetitionParticipateByIdAndUserId(
        id,
        userId
      )

    if (!competitionParticipate) {
      throw new NotFoundException("competitionParticipateNotFound", ["id"])
    }
  },

  getCompetitionParticipateByIdAndUserId: async (
    id: string,
    userId: string
  ) => {
    const competitionParticipate =
      await getCompetitionRepository.getCompetitionParticipateByIdAndUserId(
        id,
        userId
      )
    return competitionParticipate
  },
}

export type GetCompetitionServiceType = UnwrapObject<
  typeof getCompetitionService
>
