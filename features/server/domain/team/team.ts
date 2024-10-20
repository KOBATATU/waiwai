import { CompetitionTeamSchema } from "@/prisma/generated/zod"
import { z } from "zod"

export const TeamSubmitFileSchema = z.object({
  competitionId: z.string(),
  file: z.instanceof(File),
})

export const TeamNameSchema = CompetitionTeamSchema.pick({
  competitionId: true,
  name: true,
})

export const EnumTeamSubmissionStatus = {
  processing: "processing",
  success: "success",
  error: "error",
} as const
