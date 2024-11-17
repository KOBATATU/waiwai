import { CompetitionTitleAndSubtitle } from "@/features/server/domain/competition/competition"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import { checkUserRole } from "@/features/server/domain/user/service"
import { createCompetitionRepository } from "@/features/server/repository/competition/createRepository"

export const createCompetitionService = {
  /**
   * create competition
   * @param competition
   * @returns
   */
  createCompetition: async (requestBody: CompetitionTitleAndSubtitle) => {
    const competition = {
      title: requestBody.title,
      subtitle: requestBody.subtitle,
      description: createCompetitionDefaultValue.description,
      dataDescription: createCompetitionDefaultValue.dataDescription,
      startDate: createCompetitionDefaultValue.startDate,
      endDate: createCompetitionDefaultValue.endDate,
      open: createCompetitionDefaultValue.open,
      evaluationFunc: createCompetitionDefaultValue.evaluationFunc,
      problem: createCompetitionDefaultValue.problem,
      testDataRate: createCompetitionDefaultValue.testDataRate,
      limitSubmissionNum: createCompetitionDefaultValue.limitSubmissionNum,
    }
    return await createCompetitionRepository.createCompetition(competition)
  },

  createCompetitionData: async (id: string, filename: string) => {
    await checkUserRole(["admin"])

    const dataPath = `https://storage.googleapis.com/${filename}`

    await createCompetitionRepository.createCompetitionData(id, dataPath)
  },

  /**
   *
   * @param id
   * @param filename
   */
  createCompetitionParticipate: async (
    competitionId: string,
    userId: string
  ) => {
    await createCompetitionRepository.createCompetitionParticipate(
      competitionId,
      userId
    )
  },
}
