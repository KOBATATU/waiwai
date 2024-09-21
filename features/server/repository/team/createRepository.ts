import { getPrisma } from "@/features/server/core/prisma"
import { EnumTeamSubmissionStatus } from "@/features/server/domain/team/team"

export const createTeamRepository = {
  /**
   * create competition
   * @param competition
   * @returns
   */
  createTeam: async (
    userId: string,
    userName: string,
    competitionId: string
  ) => {
    const prisma = getPrisma()
    const team = await prisma.competitionTeam.create({
      data: {
        name: userName,
        competitionId: competitionId,
      },
    })

    return team
  },

  /**
   *
   * @param teamId
   * @param userId
   */
  createTeamMember: async (teamId: string, userId: string) => {
    const prisma = getPrisma()
    return await prisma.teamMember.create({
      data: {
        userId,
        teamId,
      },
    })
  },

  /**
   *
   * @param teamId
   * @param userId
   */
  createSubmission: async (
    teamId: string,
    userId: string,
    filename: string
  ) => {
    const prisma = getPrisma()
    return await prisma.teamSubmission.create({
      data: {
        userId,
        teamId,
        status: EnumTeamSubmissionStatus.processing,
        sourceFile: filename,
      },
    })
  },
}
