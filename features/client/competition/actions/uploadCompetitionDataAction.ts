"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { CompetitionDataFileSchema } from "@/features/server/domain/competition/competition"
import { createCompetitionService } from "@/features/server/service/competition/base/createService"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
import { uploadCompetitionService } from "@/features/server/service/competition/base/uploadService"
import { SubmissionResult } from "@conform-to/react"

/**
 * upload competition data
 * @param prevState
 * @param formData
 * @returns
 */
export const uploadCompetitionDataAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    formData: formData,
    schema: CompetitionDataFileSchema,
    permissions: ["admin"],
    callback: async (user, payload) => {
      const competition =
        await getCompetitionService.getCompetitionByIdAndAdmin(payload.id)

      const filename = await uploadCompetitionService.uploadData(
        competition.id,
        payload.file
      )
      const result = await createCompetitionService.createCompetitionData(
        competition.id,
        filename
      )
      revalidatePath(`/admin/competitions${competition.id}`)

      return {
        id: result.id,
      }
    },
  })
}
