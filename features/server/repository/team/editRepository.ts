import { getPrisma } from "@/features/server/core/prisma"
import { EnumTeamSubmissionStatus } from "@/features/server/domain/team/team"
import { Prisma } from "@prisma/client"

export const editTeamRepository = {
  /**
   *
   * @param teamSubmissionId
   * @param publicScore
   * @param privateScore
   * @returns
   */
  editTeamSubmission: async (
    teamSubmissionId: string,
    status: keyof typeof EnumTeamSubmissionStatus,
    publicScore?: number,
    privateScore?: number
  ) => {
    const prisma = getPrisma()
    const teamSubmission = await prisma.teamSubmission.update({
      data: {
        privateScore,
        publicScore,
        status,
      },
      where: {
        id: teamSubmissionId,
      },
    })

    return teamSubmission
  },

  /**
   *
   * @param teamId
   * @param selected
   * @returns
   */
  editTeamSubmissionSelected: async (id: string, selected: boolean) => {
    const prisma = getPrisma()
    return await prisma.teamSubmission.update({
      data: {
        selected,
      },
      where: {
        id,
      },
    })
  },

  /**
   *
   * @param teamId
   * @param teamName
   * @returns
   */
  editTeamName: async (teamId: string, teamName: string) => {
    const prisma = getPrisma()
    return await prisma.competitionTeam.update({
      data: {
        name: teamName,
      },
      where: {
        id: teamId,
      },
    })
  },

  /**
   *
   * @param competitionId
   */
  editIdsNeedSelecteByCompetitionId: async (
    competitionId: string,
    useMax: boolean
  ) => {
    const order = useMax ? "desc" : "asc"

    const query = Prisma.sql`
      WITH submissions AS (
        SELECT 
          ts.id as id,
          ts."team_id",
          ROW_NUMBER() OVER (partition by ts.team_id ORDER BY public_score ${Prisma.raw(order)}) AS rank,
          COUNT(*) FILTER (WHERE ts.selected = true) OVER (PARTITION BY ts."team_id") AS submission_count,
          ts.selected as selected
        FROM 
          public."TeamSubmission" ts
        INNER JOIN public."CompetitionTeam" ct
          ON ts."team_id" = ct."id"
        WHERE 
          ct."competition_id" =${competitionId} AND ts.status = 'success'
      ), NotAllSelected AS (
  
        SELECT
          id
        FROM submissions s
        WHERE
          s.submission_count = 0 AND s.rank = 1
        UNION ALL 
        SELECT
          id
        FROM submissions s
        WHERE
          s.submission_count = 0 AND s.rank = 2
      ),OnlyOneSelected AS (
        SELECT
          CASE
            WHEN selected = true THEN 
              (SELECT id FROM submissions WHERE rank = 2 AND team_id = s.team_id)
            ELSE
              id
          END AS id
        FROM submissions s
        WHERE
          s.submission_count =1 AND s.rank = 1
      )
    SELECT * FROM NotAllSelected
    UNION ALL
    SELECT * FROM OnlyOneSelected;
      `

    const prisma = getPrisma()
    const results = (await prisma.$queryRaw(query)) as { id: string }[]

    const ids = results
      .map((result) => result.id)
      .filter((id) => id !== null) as string[]

    if (ids.length >= 1) {
      await prisma.teamSubmission.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          selected: true,
        },
      })
    }

    return ids
  },
}
