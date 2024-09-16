import { uploadCompetitionDataRepository } from "@/features/server/repository/competition/uploadRepositoty"
import { checkFileType } from "@/features/server/repository/storage/gcs"

export const uploadCompetitionService = {
  uploadData: async (id: string, file: File) => {
    checkFileType(file)

    const filename = `competitions/${id}/data/${file.name}`

    await uploadCompetitionDataRepository.uploadData(file, filename)

    return filename
  },
}
