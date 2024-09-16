import { downloadCompetitionDataRepository } from "@/features/server/repository/competition/downloadRepository"

export const downloadCompetitionDataService = {
  downloadData: async (filename: string) => {
    const url = await downloadCompetitionDataRepository.downloadData(filename)

    return url
  },
}
