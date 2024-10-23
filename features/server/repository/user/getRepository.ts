import { getPrisma } from "@/features/server/core/prisma"

export const MINIMUM_REQUIRED_USER_FIELDS = {
  image: true,
  name: true,
  id: true,
  role: true,
} as const

export const getUserRepository = {
  /**
   *
   * @param userId
   * @param competitionId
   */
  getUsersByAdmin: async (page: number) => {
    const prisma = getPrisma("pagination")

    const users = prisma.user
      .paginate({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          ...MINIMUM_REQUIRED_USER_FIELDS,
        },
      })
      .withPages({
        limit: 20,
        page: page,
        includePageCount: true,
      })
    return users
  },
}
