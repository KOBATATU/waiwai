import { getPrisma } from "@/features/server/core/prisma"
import { CompetitionOptionalDefaults } from "@/prisma/generated/zod"

export const createCompetitionRepository = {
  /**
   * create competition
   * @param competition
   * @returns
   */
  createCompetition: async (competition: CompetitionOptionalDefaults) => {
    const prisma = getPrisma()
    return await prisma.competition.create({
      data: competition,
    })
  },
  /**
   * create competition data
   * @param id
   * @param dataPath
   * @returns
   */
  createCompetitionData: async (id: string, dataPath: string) => {
    const prisma = getPrisma()
    return await prisma.competitionData.create({
      data: {
        competitionId: id,
        dataPath,
      },
    })
  },
}
