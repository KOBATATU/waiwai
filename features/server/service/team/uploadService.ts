import { uploadCompetitionDataRepository } from "@/features/server/repository/competition/uploadRepositoty"
import { checkFileType } from "@/features/server/repository/storage/gcs"

import { createRandomFileName } from "@/lib/utils"

export const uploadTeamService = {
  uploadSubmissionFile: async (
    competitionId: string,
    userId: string,
    file: File
  ) => {
    checkFileType(file)

    const filename = `competitions/${competitionId}/submission/${userId}/${createRandomFileName()}_${file.name}`

    await uploadCompetitionDataRepository.uploadData(file, filename)

    return filename
  },
}
