import { getPrisma } from "@/features/server/core/prisma"

import { createGcs, extractPath } from "../storage/gcs"

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

  /**
   * delete competition data
   * @param id
   */
  deleteCompetitionDataById: async (id: string) => {
    const prisma = getPrisma()
    const competitionData = await prisma.competitionData.delete({
      where: {
        id,
      },
    })

    if (process.env.NODE_ENV !== "test") {
      const gcs = createGcs()
      await gcs.file(extractPath(competitionData.dataPath)).delete()
    }
  },
}
