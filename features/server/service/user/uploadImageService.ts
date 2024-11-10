import { checkFileType } from "@/features/server/repository/storage/gcs"
import { userUploadImageRepository } from "@/features/server/repository/user/uploadImageRepository"

import { createRandomFileName } from "@/lib/utils"

export const userUploadImageService = {
  uploadImage: async (file: File, userId: string) => {
    checkFileType(file, "image/png, image/jpeg")
    const objectPath = `${createRandomFileName()}_${file.name}`
    const filename = `users/${userId}/${objectPath}`
    await userUploadImageRepository.uploadImage(file, filename)
    return filename
  },
}
