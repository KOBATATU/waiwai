"use server"

import { notAuthActionHandler } from "@/features/server/core/handler"
import { UserSigninSchema } from "@/features/server/domain/user/user"
import { SubmissionResult } from "@conform-to/react"

/**
 * singin user(only validation action)
 * @param prevState
 * @param formData
 * @returns
 */
export const signinAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await notAuthActionHandler({
    formData: formData,
    schema: UserSigninSchema,
    callback: async (payload) => {
      return payload
    },
  })
}
