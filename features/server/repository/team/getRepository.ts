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
  cnt_team_submissions: number
  latest_created_at: Date
  total_count: number
  is_user_member: boolean
  members: {
    user_id: string
    name: string
    image: string | null
  }[]
}
const selectPublicScoresPaginationRecords = async (
  page: number,
  competitionId: string,
  userId: string,
  order: "desc" | "asc",
  where: Prisma.CompetitionWhereInput,
  limit: number = 20
) => {
  const offset = (page - 1) * limit

  const query = Prisma.sql`
  WITH TeamData AS (
    SELECT
      ct.id AS team_id,
      ct.name AS team_name,
      tm.user_id,
      u.name AS user_name,
      u.image AS user_image,
      CASE WHEN user_id = ${userId} THEN true ELSE false END as is_user_member
    FROM
      "CompetitionTeam" ct
    JOIN
      "TeamMember" tm ON ct.id = tm.team_id
    JOIN
      "User" u ON tm.user_id = u.id
    WHERE
      ct.competition_id = ${competitionId}
  ), GroupSubmission AS (
    SELECT
      td.team_id,
      td.team_name,
      td.is_user_member,
      ts.public_score,
      ts.created_at
    FROM
      "TeamSubmission" ts
    INNER JOIN 
      TeamData td ON ts.team_id = td.team_id AND ts.user_id = td.user_id
  ), UniqueMembers AS (
    SELECT 
      team_id,
      json_build_object(
        'user_id', user_id,
        'name', user_name,
        'image', user_image
      ) AS member_info
    FROM
      TeamData
  )
  SELECT
    gs.team_id,
    gs.team_name,
    MAX(gs.public_score) AS best_score,
    CAST(COUNT(*) AS INTEGER) AS cnt_team_submissions,
    CAST(COUNT(*) OVER() AS INTEGER) AS total_count,
    MAX(gs.created_at) AS latest_created_at,
    bool_or(gs.is_user_member) AS is_user_member,
    (SELECT json_agg(member_info) FROM UniqueMembers um WHERE um.team_id = gs.team_id) AS members
  FROM
    GroupSubmission gs
  GROUP BY
    gs.team_id, gs.team_name
  ORDER BY
    best_score ${Prisma.raw(order)} 
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
    userId: string,
    useMax: boolean
  ) => {
    return await selectPublicScoresPaginationRecords(
      1,
      competitionId,
      userId,
      useMax ? "desc" : "asc",
      {}
    )
  },
}
