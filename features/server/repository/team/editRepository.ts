import { getPrisma } from "@/features/server/core/prisma"
import { EnumTeamSubmissionStatus } from "@/features/server/domain/team/team"

export const editTeamRepository = {
  /**
   *
   * @param teamSubmissionId
   * @param publicScore
   * @param privateScore
   * @returns
   */
  editTeamSubmission: async (
    teamSubmissionId: string,
    status: keyof typeof EnumTeamSubmissionStatus,
    publicScore?: number,
    privateScore?: number
  ) => {
    const prisma = getPrisma()
    const teamSubmission = await prisma.teamSubmission.update({
      data: {
        privateScore,
        publicScore,
        status,
      },
      where: {
        id: teamSubmissionId,
      },
    })

    return teamSubmission
  },
}
