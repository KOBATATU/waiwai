import { deleteCompetitionRepository } from "@/features/server/repository/competition/deleteRepository"

export const deleteCompetitionService = {
  /**
   * delete competition
   * @param id
   */
  deleteCompetitionById: async (id: string) => {
    await deleteCompetitionRepository.deleteCompetitionById(id)
  },
}
