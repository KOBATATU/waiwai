import { createGcs } from "@/features/server/repository/storage/gcs"

export const userUploadImageRepository = {
  uploadImage: async (file: File, fileName: string) => {
    const gcs = createGcs()
    if (process.env.NODE_ENV !== "test") {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const fileUpload = gcs.file(fileName)
      await fileUpload.save(buffer)
      await fileUpload.makePublic()
    }
  },
}
