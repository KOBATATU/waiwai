import {
  ExceptionEnum,
  NotFoundException,
} from "@/features/server/core/exception"
import { getCompetitionRepository } from "@/features/server/repository/competition/getRepository"
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
      throw new NotFoundException({
        fieldsError: {
          id: [ExceptionEnum.competitionNotFound.message],
        },
        message: ExceptionEnum.competitionNotFound.message,
        code: ExceptionEnum.competitionNotFound.code,
      })
    }
    return competition
  },
}

export type GetCompetitionServiceType = UnwrapObject<
  typeof getCompetitionService
>
