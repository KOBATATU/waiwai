import { EnumTeamSubmissionStatus } from "@/features/server/domain/team/team"
import { editTeamRepository } from "@/features/server/repository/team/editRepository"

export const editTeamService = {
  /**
   * edit submission
   * @param competition
   * @returns
   */
  editTeamSubmission: async (
    teamSubmissionId: string,
    status: keyof typeof EnumTeamSubmissionStatus,
    publicScore?: number,
    privateScore?: number
  ) => {
    return await editTeamRepository.editTeamSubmission(
      teamSubmissionId,
      status,
      publicScore,
      privateScore
    )
  },
}
