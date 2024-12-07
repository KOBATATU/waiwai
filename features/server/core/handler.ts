import { notFound } from "next/navigation"
import {
  BadException,
  NotFoundException,
} from "@/features/server/core/exception"
import { getServerSession } from "@/features/server/core/session"
import { UserRole } from "@/features/server/domain/user/service"
import { parseWithZod } from "@conform-to/zod"
import { Session } from "next-auth"
import { z } from "zod"

import logger from "@/lib/logger"

type HandlerOptions<T> = {
  name: string
  auth: boolean
  permissions?: UserRole[]
  handler: () => Promise<T>
}
export const getHandler = async <T>({
  name,
  auth,
  permissions,
  handler,
}: HandlerOptions<T>): Promise<T> => {
  const start = Date.now()
  const session = await getServerSession()
  try {
    if (auth) {
      if (
        !session ||
        !session.user ||
        (permissions && !permissions.includes(session.user.role))
      ) {
        throw new NotFoundException("userAuthBad", ["role"])
      }
    }

    const result = await handler()
    logger.info({
      name,
      user: session?.user.id,
      takeTime: `${Date.now() - start}ms`,
    })
    return result
  } catch (e: unknown) {
    if (e instanceof NotFoundException) {
      logger.info({
        name,
        user: session?.user.id,
        data: {
          ...e,
        },
      })
      return notFound()
    }
    if (e instanceof Error) {
      logger.error({
        name,
        user: session?.user.id,
        data: e.message,
      })
    }

    throw e
  }
}

type ActionHandlerType<T> = {
  name: string
  formData: FormData
  schema: z.ZodType<T>
  callback: (user: Session["user"], parsedData: T) => Promise<any>
  permissions?: UserRole[]
}
export const actionHandler = async <T>({
  name,
  formData,
  schema,
  callback,
  permissions = ["user", "admin"],
}: ActionHandlerType<T>) => {
  const start = Date.now()
  const session = await getServerSession()
  const user = session?.user
  const submission = parseWithZod(formData, {
    schema,
  })

  try {
    if (!user || !permissions.includes(user.role)) {
      throw new NotFoundException("userAuthBad", ["role"])
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

    logger.info({
      name,
      user: user.id,
      takeTime: `${Date.now() - start}ms`,
    })
    return {
      submission: submission.reply(),
      value: null,
    }
  } catch (e) {
    if (e instanceof NotFoundException) {
      logger.info({
        name,
        user: session?.user.id,
        data: {
          ...e,
        },
      })
      return notFound()
    } else if (e instanceof BadException) {
      logger.info({
        name,
        user: session?.user.id,
        data: {
          ...e,
        },
      })
      return {
        submission: submission.reply({
          fieldErrors: e.fieldsError,
        }),
        value: {
          message: e.message,
          code: e.code,
        },
      }
    } else if (e instanceof Error) {
      logger.error({
        name,
        user: session?.user.id,
        data: e.message,
      })
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
    if (e instanceof BadException) {
      console.log(e)
      return {
        submission: submission.reply({
          fieldErrors: e.fieldsError,
        }),
        value: {
          message: e.message,
          code: e.code,
        },
      }
    } else if (e instanceof Error) {
      console.error(e.stack)
    }
    throw e
  }
}
