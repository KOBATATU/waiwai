import { BadException, ExceptionEnum } from "../../core/exception"
import { getServerSession } from "../../core/session"

export type UserRole = "user" | "admin"

export const checkUserRole = async (permissions: UserRole[]) => {
  const session = await getServerSession()
  if (session && !permissions.includes(session.user.role)) {
    throw new BadException({
      fieldsError: {
        role: [ExceptionEnum.userRoleBad.message],
      },
      message: ExceptionEnum.userRoleBad.message,
      code: ExceptionEnum.userRoleBad.code,
    })
  }
}
