import { notFound } from "next/navigation"

import { UserRole } from "../domain/user/user"
import { ExceptionEnum, NotFoundException } from "./exception"
import { getServerSession } from "./session"

type HandlerFunction<T, P extends any[]> = (...params: P) => Promise<T>

interface HandlerOptions<T, P extends any[]> {
  auth: boolean
  permissions: UserRole[]
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
          !permissions.includes(session.user.role)
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
