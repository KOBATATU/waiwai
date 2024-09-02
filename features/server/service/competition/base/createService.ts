import {
  CompetitionCustomOptionalDefaults,
  CompetitionTitleAndSubtitle,
} from "@/features/server/domain/competition/competition"
import { createCompetitionDefaultValue } from "@/features/server/domain/competition/value"
import { checkUserRole } from "@/features/server/domain/user/user"
import { createCompetitionRepository } from "@/features/server/repository/competition/createRepository"

export const createCompetitionService = {
  /**
   * create competition
   * @param competition
   * @returns
   */
  createCompetition: async (requestBody: CompetitionTitleAndSubtitle) => {
    await checkUserRole(["admin"])
    const competition: CompetitionCustomOptionalDefaults = {
      title: requestBody.title,
      subtitle: requestBody.subtitle,
      description: createCompetitionDefaultValue.description,
      dataDescription: createCompetitionDefaultValue.dataDescription,
      startDate: createCompetitionDefaultValue.startDate,
      endDate: createCompetitionDefaultValue.endDate,
      open: createCompetitionDefaultValue.open,
      evaluationFunc: createCompetitionDefaultValue.evaluationFunc,
      problem: createCompetitionDefaultValue.problem,
      limitSubmissionNum: createCompetitionDefaultValue.limitSubmissionNum,
    }
    return await createCompetitionRepository.createCompetition(competition)
  },
}
