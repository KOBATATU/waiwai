import { Storage } from "@google-cloud/storage"

import { BadException, ExceptionEnum } from "../../core/exception"

/**
 *
 * you have to set env file
 */
export const createGcs = () => {
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: process.env.GCS_APPLICATION_CREDENTIALS,
  })
  if (!process.env.GCS_BUCKET) {
    throw new Error("you have to set gcs env bucket name")
  }
  const bucket = storage.bucket(process.env.GCS_BUCKET)

  return bucket
}

export const checkFileType = (file: File) => {
  if (file.type !== "text/csv") {
    throw new BadException({
      fieldsError: {
        role: [ExceptionEnum.competitionDataUploadBad.message],
      },
      message: ExceptionEnum.competitionDataUploadBad.message,
      code: ExceptionEnum.competitionDataUploadBad.code,
    })
  }
}

export const extractPath = (url: string): string => {
  const parts = url.split(`https://storage.googleapis.com/`)
  return parts.length > 1 ? parts[1] : ""
}