import { getPrisma } from "@/features/server/core/prisma"
import { Competition } from "@/prisma/generated/zod"

export const editCompetitionRepository = {
  /**
   * edit competition
   * @param competition
   * @returns
   */
  editCompetition: async (competition: Competition) => {
    const prisma = getPrisma()
    return await prisma.competition.update({
      data: competition,
      where: {
        id: competition.id,
      },
    })
  },
}
