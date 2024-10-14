import { notFound } from "next/navigation"
import {
  BadException,
  ExceptionEnum,
  NotFoundException,
} from "@/features/server/core/exception"
import { getServerSession } from "@/features/server/core/session"
import { UserRole } from "@/features/server/domain/user/user"
import { parseWithZod } from "@conform-to/zod"
import { Session } from "next-auth"
import { z } from "zod"

type HandlerFunction<T, P extends any[]> = (...params: P) => Promise<T>
type HandlerOptions<T, P extends any[]> = {
  auth: boolean
  permissions?: UserRole[]
  handler: HandlerFunction<T, P>
}
export const getHandler = <T, P extends any[]>({
  auth,
  permissions,
  handler,
}: HandlerOptions<T, P>) => {
  return async (...params: P): Promise<T> => {
    try {
      if (auth) {
        const session = await getServerSession()
        if (
          !session ||
          !session.user ||
          (permissions && !permissions.includes(session.user.role))
        ) {
          throw new NotFoundException({
            message: ExceptionEnum.userAuthBad.message,
            code: ExceptionEnum.userAuthBad.code,
            fieldsError: {},
          })
        }
      }
      return await handler(...params)
    } catch (e) {
      if (e instanceof NotFoundException) {
        notFound()
      }
      throw e
    }
  }
}

type ActionHandlerType<T> = {
  formData: FormData
  schema: z.ZodType<T>
  callback: (user: Session["user"], parsedData: T) => Promise<any>
  permissions?: UserRole[]
}
export const actionHandler = async <T>({
  formData,
  schema,
  callback,
  permissions = ["user", "admin"],
}: ActionHandlerType<T>) => {
  const session = await getServerSession()
  const user = session?.user
  const submission = parseWithZod(formData, {
    schema,
  })

  try {
    if (!user || !permissions.includes(user.role)) {
      throw new NotFoundException({
        message: ExceptionEnum.userAuthBad.message,
        code: ExceptionEnum.userAuthBad.code,
        fieldsError: {},
      })
    }

    if (submission.status === "error") {
      return {
        submission: submission.reply(),
        value: null,
      }
    }
    if (submission.status === "success") {
      return {
        submission: submission.reply(),
        value: await callback(user, submission.value),
      }
    }
    return {
      submission: submission.reply(),
      value: null,
    }
  } catch (e) {
    if (e instanceof NotFoundException) {
      notFound()
    } else if (e instanceof BadException) {
      return {
        submission: submission.reply({
          fieldErrors: e.fieldsError,
        }),
        value: null,
      }
    }
    throw e
  }
}
type NotActionHandlerType<T> = {
  formData: FormData
  schema: z.ZodType<T>
  callback: (parsedData: T) => Promise<any>
}
export const notAuthActionHandler = async <T>({
  formData,
  schema,
  callback,
}: NotActionHandlerType<T>) => {
  const submission = parseWithZod(formData, {
    schema,
  })

  try {
    if (submission.status === "error") {
      return {
        submission: submission.reply(),
        value: null,
      }
    }
    if (submission.status === "success") {
      return {
        submission: submission.reply(),
        value: await callback(submission.value),
      }
    }
    return {
      submission: submission.reply(),
      value: null,
    }
  } catch (e) {
    // エラーハンドリング
    if (e instanceof BadException) {
      return {
        submission: submission.reply({
          fieldErrors: e.fieldsError,
        }),
        value: null,
      }
    }
    throw e
  }
}
