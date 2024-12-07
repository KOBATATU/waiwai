"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { UserAvatarSchema } from "@/features/server/domain/user/user"
import { editUserService } from "@/features/server/service/user/editService"
import { userUploadImageService } from "@/features/server/service/user/uploadImageService"
import { SubmissionResult } from "@conform-to/react"

/**
 * upload avatar
 * @param prevState
 * @param formData
 * @returns
 */
export const uploadUserAvatarAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    name: "uploadUserAvatarAction",
    permissions: ["user", "admin"],
    formData: formData,
    schema: UserAvatarSchema,
    callback: async (user, payload) => {
      const filepath = await userUploadImageService.uploadImage(
        payload.file,
        user.id
      )
      const editUser = await editUserService.editUserAvatarById(
        user.id,
        filepath
      )
      revalidatePath("/user/me/")
      return editUser
    },
  })
}
