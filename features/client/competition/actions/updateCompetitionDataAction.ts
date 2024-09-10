"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { CompetitionDataSchema } from "@/features/server/domain/competition/competition"
import { editCompetitionService } from "@/features/server/service/competition/base/editService"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
import { SubmissionResult } from "@conform-to/react"
import DOMPurify from "isomorphic-dompurify"

/**
 * update competition data
 * @param prevState
 * @param formData
 * @returns
 */
export const updateCompetitioDataAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    formData: formData,
    schema: CompetitionDataSchema,
    permissions: ["admin"],
    callback: async (user, payload) => {
      const competition =
        await getCompetitionService.getCompetitionByIdAndAdmin(payload.id)

      const updatedCompetition = await editCompetitionService.editCompetition({
        ...competition,
        dataDescription: DOMPurify.sanitize(payload.dataDescription),
      })
      revalidatePath(`/admin/competitions${payload.id}/overview`)

      return updatedCompetition
    },
  })
}
