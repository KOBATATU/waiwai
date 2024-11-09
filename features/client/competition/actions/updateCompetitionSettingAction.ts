"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import {
  CompetitionCustomOptionalDefaultsSchema,
  valueToProblemMap,
} from "@/features/server/domain/competition/competition"
import { editCompetitionService } from "@/features/server/service/competition/base/editService"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
import { SubmissionResult } from "@conform-to/react"

import { createDateWithTimezone } from "@/lib/utils"

/**
 * update competition settings
 * @param prevState
 * @param formData
 * @returns
 */
export const updateCompetitionAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    formData: formData,
    schema: CompetitionCustomOptionalDefaultsSchema,
    permissions: ["admin"],
    callback: async (user, payload) => {
      const competition =
        await getCompetitionService.getCompetitionByIdAndAdmin(payload.id)

      const updatedCompetition = await editCompetitionService.editCompetition({
        description: competition.description,
        dataDescription: competition.dataDescription,
        thumbnail: competition.thumbnail,
        completed: competition.completed,
        ...payload,
        startDate: createDateWithTimezone(payload.startDate),
        endDate: createDateWithTimezone(payload.endDate),
        open: !!payload.open,
        problem: valueToProblemMap[payload.evaluationFunc],
      })
      revalidatePath(`/admin/competitions${payload.id}`)

      return updatedCompetition
    },
  })
}
