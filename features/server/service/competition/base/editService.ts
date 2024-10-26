import { editCompetitionRepository } from "@/features/server/repository/competition/editRepository"
import { Competition } from "@prisma/client"

export const editCompetitionService = {
  /**
   * edit competition
   * @param competition
   * @returns
   */
  editCompetition: async (
    competition: Omit<Competition, "createdAt" | "updatedAt">
  ) => {
    return await editCompetitionRepository.editCompetition(competition)
  },

  editCompetitionComplete: async (id: string, completed: boolean) => {
    return await editCompetitionRepository.editCompetitionComplete(
      id,
      completed
    )
  },
}
