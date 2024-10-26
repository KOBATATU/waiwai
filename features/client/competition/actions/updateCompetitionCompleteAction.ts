"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { doTransaction } from "@/features/server/core/prisma"
import {
  CompetitionCompleteSchema,
  getUseMax,
} from "@/features/server/domain/competition/competition"
import { editCompetitionService } from "@/features/server/service/competition/base/editService"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
import { editTeamService } from "@/features/server/service/team/editService"
import { SubmissionResult } from "@conform-to/react"

/**
 * update competition completed
 * @param prevState
 * @param formData
 * @returns
 */
export const updateCompetitionCompleteAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    formData: formData,
    schema: CompetitionCompleteSchema,
    permissions: ["admin"],
    callback: async (user, payload) => {
      const competition =
        await getCompetitionService.getCompetitionByIdAndAdmin(payload.id)

      const useMax = getUseMax(competition.problem, competition.evaluationFunc)

      const updatedCompetition = await doTransaction(async () => {
        const updatedCompetition =
          await editTeamService.editIdsNeedSelecteByCompetitionId(
            competition.id,
            useMax
          )
        await editCompetitionService.editCompetitionComplete(
          competition.id,
          true
        )
        return updatedCompetition
      })

      revalidatePath(`/admin/competitions${payload.id}/completed`)

      return updatedCompetition
    },
  })
}
