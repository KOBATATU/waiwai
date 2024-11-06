"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { CompetitionTitleAndSubtitleSchema } from "@/features/server/domain/competition/competition"
import { createCompetitionService } from "@/features/server/service/competition/base/createService"
import { SubmissionResult } from "@conform-to/react"

/**
 * create competition
 * @param prevState
 * @param formData
 * @returns
 */
export const createCompetitionAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    formData: formData,
    schema: CompetitionTitleAndSubtitleSchema,
    permissions: ["admin"],
    callback: async (user, payload) => {
      const competition =
        await createCompetitionService.createCompetition(payload)

      revalidatePath("/competitions")
      return competition
    },
  })
}
