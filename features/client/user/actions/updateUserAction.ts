"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { UserNameSchema } from "@/features/server/domain/user/user"
import { editUserService } from "@/features/server/service/user/editService"
import { SubmissionResult } from "@conform-to/react"

/**
 * edit user (only name now)
 * @param prevState
 * @param formData
 * @returns
 */
export const updateUserAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    name: "updateUserAction",
    permissions: ["user", "admin"],
    formData: formData,
    schema: UserNameSchema,
    callback: async (user, payload) => {
      await editUserService.editUserById(user.id, payload.name)
      revalidatePath("/user/me/")

      return payload
    },
  })
}
