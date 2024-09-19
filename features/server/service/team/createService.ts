import { createTeamRepository } from "../../repository/team/createRepository"

export const createTeamService = {
  /**
   *
   * @param userName
   * @param competitionId
   * @returns
   */
  createTeam: async (
    userId: string,
    userName: string,
    competitionId: string
  ) => {
    return await createTeamRepository.createTeam(
      userId,
      userName,
      competitionId
    )
  },

  /**
   *
   * @param teamId
   * @param userId
   * @returns
   */
  createTeamMember: async (teamId: string, userId: string) => {
    return await createTeamRepository.createTeamMember(teamId, userId)
  },
}
