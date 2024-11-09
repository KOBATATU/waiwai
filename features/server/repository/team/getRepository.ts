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

export type ScoreRecord = {
  team_id: number
  team_name: string
  public_best_score: number
  public_rank: number
  private_best_score?: number
  private_rank?: number
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
const selectScoresPaginationRecords = async (
  competitionId: string,
  userId: string,
  order: "desc" | "asc",
  scoreboard: "public" | "private"
) => {
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
      CASE 
        WHEN ts.selected THEN ts.private_score 
        ELSE NULL 
      END AS private_score,
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
  ), BestScores AS (
  SELECT
    gs.team_id,
    gs.team_name,
    CASE 
      WHEN  ${order} = 'desc' THEN MAX(gs.public_score)
      ELSE MIN(gs.public_score)
    END AS public_best_score,
    CASE 
      WHEN  ${order}= 'desc' THEN MAX(gs.private_score)
      ELSE MIN(gs.private_score)
    END AS private_best_score,
    CAST(COUNT(*) AS INTEGER) AS cnt_team_submissions,
    CAST(COUNT(*) OVER() AS INTEGER) AS total_count,
    MAX(gs.created_at) AS latest_created_at,
    bool_or(gs.is_user_member) AS is_user_member,
    (SELECT json_agg(member_info) FROM UniqueMembers um WHERE um.team_id = gs.team_id) AS members
  FROM
    GroupSubmission gs
  GROUP BY
    gs.team_id, gs.team_name
  )
  SELECT
    *,
    CAST(RANK() OVER (ORDER BY public_best_score ${Prisma.raw(order)}) AS INTEGER) AS public_rank,
    CAST(RANK() OVER (ORDER BY private_best_score ${Prisma.raw(order)}) AS INTEGER ) AS private_rank
  FROM BestScores
  ORDER BY
    public_best_score ${Prisma.raw(order)} 
  `

  const prisma = getPrisma()
  const result = (await prisma.$queryRaw(query)) as ScoreRecord[]

  const formattedResult =
    scoreboard === "public"
      ? result.map(({ private_best_score, private_rank, ...rest }) => rest)
      : result

  return {
    data: formattedResult,
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
    userId: string,
    useMax: boolean
  ) => {
    return await selectScoresPaginationRecords(
      competitionId,
      userId,
      useMax ? "desc" : "asc",
      "public"
    )
  },

  getTeamPrivateScoresByCompetitionId: async (
    competitionId: string,
    userId: string,
    useMax: boolean
  ) => {
    return await selectScoresPaginationRecords(
      competitionId,
      userId,
      useMax ? "desc" : "asc",
      "private"
    )
  },

  /**
   *
   * @param teamId
   * @param canGetPrivate
   * @param page
   * @param limit
   * @returns
   */
  getTeamSubmissionsByTeamId: async (
    teamId: string,
    canGetPrivate: boolean,
    page: number,
    limit: number = 20
  ) => {
    const prisma = getPrisma("pagination")
    const teamSubmissions = await prisma.teamSubmission
      .paginate({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          sourceFile: true,
          status: true,
          publicScore: true,
          privateScore: canGetPrivate,
          selected: true,
          createdAt: true,
          user: {
            select: {
              ...MINIMUM_REQUIRED_USER_FIELDS,
            },
          },
        },
        where: {
          teamId,
        },
      })
      .withPages({
        limit: limit,
        page: page,
        includePageCount: true,
      })

    teamSubmissions[0] = teamSubmissions[0].map((teamSubmission) => {
      return {
        ...teamSubmission,
        sourceFile:
          teamSubmission.sourceFile?.split("/").pop()?.substring(9) ?? null,
      }
    })
    return teamSubmissions
  },

  /**
   *
   * @param id
   * @returns
   */
  getTeamSubmissionByIdAndTeamId: async (id: string, teamId: string) => {
    const prisma = getPrisma()
    return await prisma.teamSubmission.findUnique({
      select: {
        id: true,
      },
      where: {
        id,
        teamId,
      },
    })
  },

  /**
   *
   * @param teamId
   * @returns
   */
  getTeamSubmissionCountByTeamId: async (teamId: string) => {
    const prisma = getPrisma()
    const count = await prisma.teamSubmission.count({
      where: {
        teamId,
        selected: true,
      },
    })
    return count
  },
}
