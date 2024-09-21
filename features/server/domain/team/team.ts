import { z } from "zod"

export const TeamSubmitFileSchema = z.object({
  competitionId: z.string(),
  file: z.instanceof(File),
})

export const EnumTeamSubmissionStatus = {
  processing: "processing",
  success: "success",
  error: "error",
} as const
