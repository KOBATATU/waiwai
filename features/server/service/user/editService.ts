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

  /**
   *
   * @param userId
   * @param filename
   * @returns
   */
  editUserAvatarById: async (userId: string, filename: string) => {
    const objectPath = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${filename}`
    return await editUserRepository.editUserAvatarById(userId, objectPath)
  },
}
