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

    const objectPath = `${createRandomFileName()}_${file.name}`
    const filename = `competitions/${competitionId}/submission/${userId}/${objectPath}`

    await uploadCompetitionDataRepository.uploadData(file, filename)

    return { filename, objectPath }
  },
}
