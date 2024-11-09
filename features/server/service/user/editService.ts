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

  /**
   *
   * @param userId
   * @param name
   * @returns
   */
  editUserById: async (userId: string, name: string) => {
    return await editUserRepository.editUserById(userId, name)
  },
}
