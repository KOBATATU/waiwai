import { getPrisma } from "@/features/server/core/prisma"

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
}
