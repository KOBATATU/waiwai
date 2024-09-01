import { BadException, ExceptionEnum } from "../../core/exception"

export type UserRole = "user" | "admin"

export const checkUserRole = (yourRole?: UserRole, expect?: UserRole) => {
  if (yourRole !== expect) {
    throw new BadException({
      fieldsError: {
        role: [ExceptionEnum.userRoleBad.message],
      },
      message: ExceptionEnum.userRoleBad.message,
      code: ExceptionEnum.userRoleBad.code,
    })
  }
}
