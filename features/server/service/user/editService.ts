import { editUserRepository } from "@/features/server/repository/user/editRepository"

export const editUserService = {
  /**
   *
   * @param role
   * @returns
   */
  editUserRoleByAdmin: async (userId: string, role: string) => {
    return await editUserRepository.editUserRoleByAdmin(userId, role)
  },
}
