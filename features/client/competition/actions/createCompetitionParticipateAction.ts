"use server"

import { revalidatePath } from "next/cache"
import { BadException, ExceptionEnum } from "@/features/server/core/exception"
import { actionHandler } from "@/features/server/core/handler"
import { doTransaction } from "@/features/server/core/prisma"
import {
  isNowAfterStartDate,
  isNowBeforeEndDate,
} from "@/features/server/domain/competition/competition"
import { createCompetitionService } from "@/features/server/service/competition/base/createService"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
import { createTeamService } from "@/features/server/service/team/createService"
import { CompetitionSchema } from "@/prisma/generated/zod"
import { SubmissionResult } from "@conform-to/react"

/**
 * create participate competition
 * @param prevState
 * @param formData
 * @returns
 */
export const createCompetitionParticipateAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    name: "createCompetitionParticipateAction",
    formData: formData,
    schema: CompetitionSchema.pick({ id: true }),
    permissions: ["admin", "user"],
    callback: async (user, payload) => {
      const competition = await getCompetitionService.getCompetitionById(
        payload.id
      )
      isNowAfterStartDate(competition.open, competition.startDate)
      isNowBeforeEndDate(competition.open, competition.endDate)
      const isCompetitionParticipated =
        !!(await getCompetitionService.getCompetitionParticipateByIdAndUserId(
          payload.id,
          user.id
        ))

      if (isCompetitionParticipated) {
        throw new BadException("competitionParticipateBad", ["id"])
      }

      await doTransaction(async () => {
        await createCompetitionService.createCompetitionParticipate(
          payload.id,
          user.id
        )
        const team = await createTeamService.createTeam(
          user.id,
          user.name ?? "hoge",
          payload.id
        )
        return await createTeamService.createTeamMember(team.id, user.id)
      })

      revalidatePath(`/competitions${payload.id}`)
      return {}
    },
  })
}
