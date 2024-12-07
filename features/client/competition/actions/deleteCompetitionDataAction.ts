"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { deleteCompetitionService } from "@/features/server/service/competition/base/deleteService"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
import { CompetitionDataSchema } from "@/prisma/generated/zod"
import { SubmissionResult } from "@conform-to/react"

/**
 * create competition
 * @param prevState
 * @param formData
 * @returns
 */
export const deleteCompetitionDataAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    name: "deleteCompetitionDataAction",
    formData: formData,
    schema: CompetitionDataSchema.pick({ id: true }),
    permissions: ["admin"],
    callback: async (user, payload) => {
      await getCompetitionService.getCompetitionDataById(payload.id)
      await deleteCompetitionService.deleteCompetitionDataById(payload.id)

      revalidatePath(`/admin/competitions${payload.id}`)
    },
  })
}
