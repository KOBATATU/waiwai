"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { CompetitionOverviewSchema } from "@/features/server/domain/competition/competition"
import { editCompetitionService } from "@/features/server/service/competition/base/editService"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
import { SubmissionResult } from "@conform-to/react"
import DOMPurify from "isomorphic-dompurify"

/**
 * update competition overview
 * @param prevState
 * @param formData
 * @returns
 */
export const updateCompetitioOverviewAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    name: "updateCompetitioOverviewAction",
    formData: formData,
    schema: CompetitionOverviewSchema,
    permissions: ["admin"],
    callback: async (user, payload) => {
      const competition =
        await getCompetitionService.getCompetitionByIdAndAdmin(payload.id)

      const updatedCompetition = await editCompetitionService.editCompetition({
        ...competition,
        description: DOMPurify.sanitize(payload.description),
      })
      revalidatePath(`/admin/competitions${payload.id}/overview`)

      return updatedCompetition
    },
  })
}
