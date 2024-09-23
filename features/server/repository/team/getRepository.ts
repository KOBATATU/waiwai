import { getPrisma } from "@/features/server/core/prisma"
import { MINIMUM_REQUIRED_USER_FIELDS } from "@/features/server/repository/user/getRepository"
import { Prisma } from "@prisma/client"

const selectTeamUnique = async (
  userId: string,
  competitionId: string,
  where: Prisma.CompetitionTeamWhereInput
) => {
  const prisma = getPrisma()
  return await prisma.competitionTeam.findFirst({
    select: {
      id: true,
      name: true,
      resultPublicOrder: true,
      resultPrivateOrder: true,
      teamMembers: {
        select: {
          id: true,
          user: {
            select: {
              ...MINIMUM_REQUIRED_USER_FIELDS,
            },
          },
        },
      },
    },
    where: {
      competitionId: competitionId,
      teamMembers: {
        some: {
          userId: {
            equals: userId,
          },
        },
      },
    },
  })
}

type ScoreRecord = {
  team_id: number
  team_name: string
  best_score: number
  total_count: number
  users: {
    user_id: number
    name: string
    image: string | null
  }[]
}
const selectPublicScoresPaginationRecords = async (
  page: number,
  competitionId: string,
  where: Prisma.CompetitionWhereInput,
  limit: number = 20
) => {
  const offset = (page - 1) * limit
  const query = Prisma.sql`
    WITH TeamData AS (
      SELECT
        ct.id AS team_id,
        ct.name AS team_name,
        tm.user_id
      FROM
        "CompetitionTeam" ct
      JOIN
        "TeamMember" tm ON "ct"."id" = "tm"."team_id"
      WHERE
        ct.competition_id = ${competitionId}
    ), GroupSubmission AS (
      SELECT
        td.*,
        ts.public_score
      FROM
        "TeamSubmission" ts
      INNER JOIN 
        TeamData td
      ON
        ts.team_id = td.team_id
    )
    SELECT
      gs.team_id,
      gs.team_name,
      MAX(gs.public_score) AS best_score,
      COUNT(*) OVER() AS total_count,
      json_agg(
        json_build_object(
          'user_id', u.id,
          'name', u.name,
          'image', u.image
        )
      ) AS users
    FROM
      GroupSubmission gs
    JOIN
      "User" u ON gs.user_id = u.id
    GROUP BY
      gs.team_id, gs.team_name
    ORDER BY
      best_score DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  const prisma = getPrisma()
  const result = (await prisma.$queryRaw(query)) as ScoreRecord[]

  const totalCount = Number(result[0]?.total_count ?? 0)
  const totalPages = Math.ceil(totalCount / limit)
  const hasNextPage = page < totalPages

  return {
    data: result,
    meta: {
      totalCount,
      totalPages,
      hasNextPage,
    },
  }
}

export const getTeamRepository = {
  /**
   *
   * @param userId
   * @param competitionId
   */
  getTeamByUserIdAndCompetitionId: async (
    userId: string,
    competitionId: string
  ) => {
    const team = await selectTeamUnique(userId, competitionId, {})

    return team
  },

  /**
   *
   * @param competitionId
   * @param page
   * @param useMax
   * @returns
   */
  getTeamPublicScoresByCompetitionId: async (
    competitionId: string,
    page: number,
    useMax: boolean
  ) => {
    return await selectPublicScoresPaginationRecords(1, competitionId, {})
  },
}
