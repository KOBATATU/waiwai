import { getUserRepository } from "@/features/server/repository/user/getRepository"

import { UnwrapObject } from "../../type"

export const getUserService = {
  /**
   *
   * @param userId
   * @param competitionId
   */
  getUsersByAdmin: async (page: number) => {
    const users = await getUserRepository.getUsersByAdmin(page)
    return users
  },
}

export type GetUserServiceType = UnwrapObject<typeof getUserService>
