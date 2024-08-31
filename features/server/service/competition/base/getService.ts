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
}

export type GetCompetitionServiceType = UnwrapObject<
  typeof getCompetitionService
>
