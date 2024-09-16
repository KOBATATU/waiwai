import { deleteCompetitionRepository } from "@/features/server/repository/competition/deleteRepository"

export const deleteCompetitionService = {
  /**
   * delete competition
   * @param id
   */
  deleteCompetitionById: async (id: string) => {
    await deleteCompetitionRepository.deleteCompetitionById(id)
  },

  /**
   * delete competition Data
   * @param id
   */
  deleteCompetitionDataById: async (id: string) => {
    await deleteCompetitionRepository.deleteCompetitionDataById(id)
  },
}
