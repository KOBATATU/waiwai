import { createGcs } from "../storage/gcs"

export const uploadCompetitionDataRepository = {
  uploadData: async (file: File, fileName: string) => {
    const gcs = createGcs()
    if (process.env.NODE_ENV !== "test") {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      await gcs.file(fileName).save(buffer)
    }
  },
}
