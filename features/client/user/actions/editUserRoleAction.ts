"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { UserRoleSchema } from "@/features/server/domain/user/user"
import { editUserService } from "@/features/server/service/user/editService"
import { SubmissionResult } from "@conform-to/react"

/**
 * singin user(only validation action)
 * @param prevState
 * @param formData
 * @returns
 */
export const editUserRoleAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    permissions: ["admin"],
    formData: formData,
    schema: UserRoleSchema,
    callback: async (user, payload) => {
      await editUserService.editUserRoleByAdmin(payload.id, payload.role)
      revalidatePath("/")

      return payload
    },
  })
}
