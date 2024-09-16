import { createGcs, extractPath } from "../storage/gcs"

export const downloadCompetitionDataRepository = {
  downloadData: async (fileName: string) => {
    const gcs = createGcs()
    const [url] = await gcs.file(extractPath(fileName)).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000,
    })

    return url
  },
}
