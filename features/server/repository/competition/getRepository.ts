import { getPrisma } from "@/features/server/core/prisma"
import { Prisma } from "@prisma/client"

const selectCompetitionPaginationRecords = async (
  page: number,
  where: Prisma.CompetitionWhereInput,
  role: "user" | "admin" = "user",
  limit: number | null = 20
) => {
  /** admin user can get close competition */
  if (role === "user") {
    where.open = {
      equals: true,
    }
  }
  const prisma = getPrisma("pagination")
  return await prisma.competition
    .paginate({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        dataDescription: true,
        thumbnail: true,
        startDate: true,
        endDate: true,
        open: true,
        evaluationFunc: true,
        problem: true,
        limitSubmissionNum: true,
        createdAt: true,
        updatedAt: true,
        competitionDatas: {
          select: {
            dataPath: true,
          },
        },
        _count: {
          select: {
            competitionParticipates: true,
            teams: true,
          },
        },
      },
      where: {
        ...where,
      },
    })
    .withPages({
      limit: limit,
      page: page,
      includePageCount: true,
    })
}

export const getCompetitionRepository = {
  /**
   * get competition list
   * @param page
   * @returns
   */
  getCompetitions: async (page: number) => {
    return await selectCompetitionPaginationRecords(page, {})
  },
}
