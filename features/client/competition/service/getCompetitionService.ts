import { getHandler } from "@/features/server/core/handler"
import { getServerSession } from "@/features/server/core/session"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"

export const getCompetitionClientService = {
  getCompetitionsByAdmin: async (page: number) => {
    return await getHandler({
      name: "getCompetitionsByAdmin",
      auth: true,
      permissions: ["admin"],
      handler: async () => {
        return await getCompetitionService.getCompetitionsByAdmin(page)
      },
    })
  },

  getCompetitionByAdmin: async (id: string) => {
    return await getHandler({
      name: "getCompetitionByAdmin",
      auth: true,
      permissions: ["admin"],
      handler: async () => {
        return await getCompetitionService.getCompetitionByIdAndAdmin(id)
      },
    })
  },
  getCompetitions: async (page: number) => {
    return await getHandler({
      name: "getCompetitions",
      auth: false,
      handler: async () => {
        return await getCompetitionService.getCompetitions(page)
      },
    })
  },
  getCompetitionById: async (id: string) => {
    return await getHandler({
      name: "getCompetitionById",
      auth: false,
      handler: async () => {
        return await getCompetitionService.getCompetitionById(id)
      },
    })
  },
  getCompetitionParticipateByCompetitionId: async (id: string) => {
    return await getHandler({
      name: "getCompetitionParticipateByCompetitionId",
      auth: false,
      handler: async () => {
        const user = await getServerSession()
        const competitionParticipate =
          await getCompetitionService.getCompetitionParticipateByIdAndUserId(
            id,
            user?.user.id ?? ""
          )
        return !!competitionParticipate
      },
    })
  },
}
