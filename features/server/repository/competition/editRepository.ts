import { getPrisma } from "@/features/server/core/prisma"
import { Competition } from "@/prisma/generated/zod"

export const editCompetitionRepository = {
  /**
   * edit competition
   * @param competition
   * @returns
   */
  editCompetition: async (
    competition: Omit<Competition, "createdAt" | "updatedAt">
  ) => {
    const prisma = getPrisma()
    return await prisma.competition.update({
      data: {
        title: competition.title,
        subtitle: competition.subtitle,
        description: competition.description,
        dataDescription: competition.dataDescription,
        thumbnail: competition.thumbnail,
        startDate: competition.startDate,
        endDate: competition.endDate,
        open: competition.open,
        evaluationFunc: competition.evaluationFunc,
        problem: competition.problem,
        limitSubmissionNum: competition.limitSubmissionNum,
      },
      where: {
        id: competition.id,
      },
    })
  },

  editCompetitionComplete: async (id: string, completed: boolean) => {
    const prisma = getPrisma()

    return await prisma.competition.update({
      data: {
        completed,
      },
      where: {
        id,
      },
    })
  },
}
