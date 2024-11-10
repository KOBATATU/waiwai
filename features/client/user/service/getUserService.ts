import { getHandler } from "@/features/server/core/handler"
import { getUserService } from "@/features/server/service/user/getService"

export const getUserClientService = {
  /**
   *
   * @param competitionId
   * @returns
   */
  getUsersByAdmin: async (page: number) => {
    return await getHandler({
      auth: true,
      permissions: ["admin"],
      handler: async () => {
        return getUserService.getUsersByAdmin(page)
      },
    })
  },
}
