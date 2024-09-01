import { CompetitionCustomOptionalDefaults } from "@/features/server/domain/competition/schema"
import { createCompetitionRepository } from "@/features/server/repository/competition/createRepository"

export const createCompetitionService = {
  /**
   * create competition
   * @param competition
   * @returns
   */
  createCompetition: async (competition: CompetitionCustomOptionalDefaults) => {
    return await createCompetitionRepository.createCompetition(competition)
  },
}
