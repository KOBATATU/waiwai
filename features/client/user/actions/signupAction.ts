"use server"

import { redirect } from "next/navigation"
import { BadException, ExceptionEnum } from "@/features/server/core/exception"
import { notAuthActionHandler } from "@/features/server/core/handler"
import { getPrisma } from "@/features/server/core/prisma"
import { UserSignupSchema } from "@/features/server/domain/user/user"
import { SubmissionResult } from "@conform-to/react"
import * as bcrypt from "bcrypt"

/**
 * basic auth action: this action function is used to e2e test or debug user
 * create user
 * @param prevState
 * @param formData
 * @returns
 */
export const signupAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await notAuthActionHandler({
    formData: formData,
    schema: UserSignupSchema,
    callback: async (payload) => {
      const prisma = getPrisma()
      const user = await prisma.user.findUnique({
        where: { email: payload.email },
      })

      if (user) {
        throw new BadException({
          fieldsError: {
            email: [ExceptionEnum.userAlreadyRegisterd.message],
          },
          message: ExceptionEnum.userAlreadyRegisterd.message,
          code: ExceptionEnum.userAlreadyRegisterd.code,
        })
      } else {
        const encodePassword = await bcrypt.hash(payload.password, 10)
        const user = await prisma.user.create({
          data: {
            name: payload.name,
            email: payload.email,
            password: encodePassword,
            role: "user",
            // neko
            image:
              "https://images.unsplash.com/photo-1531040630173-7cfb894c8eaa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D",
          },
        })
      }

      redirect(`/signin`)
    },
  })
}
