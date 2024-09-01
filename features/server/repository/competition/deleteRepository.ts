import { getPrisma } from "@/features/server/core/prisma"

export const deleteCompetitionRepository = {
  /**
   * delete competition
   * @param id
   */
  deleteCompetitionById: async (id: string) => {
    const prisma = getPrisma()
    await prisma.competition.delete({
      where: {
        id,
      },
    })
  },
}
