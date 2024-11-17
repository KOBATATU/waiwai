import { getPrisma } from "@/features/server/core/prisma"
import { UserRole } from "@/features/server/domain/user/service"
import { Prisma } from "@prisma/client"

import { createDateWithTimezone } from "@/lib/utils"

const MINIMUM_COMPETITION_FIELDS = {
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
  completed: true,
  createdAt: true,
  updatedAt: true,
  testDataRate: true,
  competitionDatas: {
    select: {
      id: true,
      dataPath: true,
    },
  },
  _count: {
    select: {
      competitionParticipates: true,
      teams: true,
    },
  },
}

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
  const competitions = await prisma.competition
    .paginate({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        ...MINIMUM_COMPETITION_FIELDS,
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

  competitions[0].forEach((competition) => {
    if (competition?.endDate) {
      competition.endDate = createDateWithTimezone(competition.endDate)
    }
    if (competition?.startDate) {
      competition.startDate = createDateWithTimezone(competition.startDate)
    }
  })

  return competitions
}

const selectCompetitionUnique = async (
  id: string,
  where: Prisma.CompetitionWhereInput,
  role: UserRole = "user"
) => {
  /** admin user can get close competition */
  if (role === "user") {
    where.open = {
      equals: true,
    }
  }

  const prisma = getPrisma()
  const competition = await prisma.competition.findUnique({
    select: {
      ...MINIMUM_COMPETITION_FIELDS,
    },
    where: {
      ...where,
      id,
    },
  })
  if (competition?.endDate) {
    competition.endDate = createDateWithTimezone(competition.endDate)
  }
  if (competition?.startDate) {
    competition.startDate = createDateWithTimezone(competition.startDate)
  }

  return competition
}

const selectCompetitionDataUnique = async (
  id: string,
  where: Prisma.CompetitionDataWhereInput
) => {
  const prisma = getPrisma()
  return await prisma.competitionData.findUnique({
    select: {
      id: true,
      dataPath: true,
      competitionId: true,
    },
    where: {
      ...where,
      id,
    },
  })
}

const selectCompetitionParticipateUnique = async (
  id: string,
  userId: string,
  where: Prisma.CompetitionParticipateWhereInput
) => {
  const prisma = getPrisma()
  return await prisma.competitionParticipate.findFirst({
    select: {
      id: true,
      competitionId: true,
    },
    where: {
      ...where,
      competitionId: id,
      userId,
    },
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

  /**
   * get unique competition
   * @param id
   * @returns
   */
  getCompeitionById: async (id: string) => {
    return await selectCompetitionUnique(id, {})
  },

  /**
   * warning: must check this method access user.
   * get competition list
   * @param page
   * @returns
   */
  getCompetitionsByAdmin: async (page: number) => {
    return await selectCompetitionPaginationRecords(page, {}, "admin")
  },

  /**
   * warning: must check this method access user.
   * get unique competition
   * @param id
   * @returns
   */
  getCompeitionByIdAndAdmin: async (id: string) => {
    return await selectCompetitionUnique(id, {}, "admin")
  },

  /**
   * get competition data
   * @param id
   * @returns
   */
  getCompeitionDataById: async (id: string) => {
    return await selectCompetitionDataUnique(id, {})
  },

  /**
   *
   * @param id
   * @param userId
   */
  getCompetitionParticipateByIdAndUserId: async (
    id: string,
    userId: string
  ) => {
    return await selectCompetitionParticipateUnique(id, userId, {})
  },
}
