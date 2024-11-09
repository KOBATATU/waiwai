import { getPrisma } from "@/features/server/core/prisma"

export const editUserRepository = {
  /**
   *
   * @param userId
   * @param competitionId
   */
  editUserRoleByAdmin: async (userId: string, role: string) => {
    const prisma = getPrisma()

    const user = prisma.user.update({
      data: {
        role,
      },
      where: {
        id: userId,
      },
    })
    return user
  },

  /**
   *
   * @param userId
   * @param name
   * @returns
   */
  editUserById: async (userId: string, name: string) => {
    const prisma = getPrisma()

    const user = prisma.user.update({
      data: {
        name,
      },
      where: {
        id: userId,
      },
    })
    return user
  },
}
