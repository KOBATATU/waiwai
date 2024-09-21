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
}
