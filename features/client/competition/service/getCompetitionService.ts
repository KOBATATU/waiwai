import { getHandler } from "@/features/server/core/handler"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"

export const getCompetitionClientService = {
  getCompetitionsByAdmin: async () => {
    return await getHandler({
      auth: true,
      permissions: ["admin"],
      handler: async () => {
        return await getCompetitionService.getCompetitionsByAdmin(1)
      },
    })()
  },
}
