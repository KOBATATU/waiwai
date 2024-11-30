import { BadException, ExceptionEnum } from "@/features/server/core/exception"
import {
  CompetitionTeamSchema,
  TeamSubmissionSchema,
} from "@/prisma/generated/zod"
import { z } from "zod"

export const TeamSubmitFileSchema = z.object({
  competitionId: z.string(),
  file: z.instanceof(File),
})

export const TeamNameSchema = CompetitionTeamSchema.pick({
  competitionId: true,
  name: true,
})

export const TeamSubmissionSelectedSchema = z.object({
  competitionId: z.string(),
  id: z.string(),
  selected: z.string(),
})

export const EnumTeamSubmissionStatus = {
  processing: "processing",
  success: "success",
  error: "error",
} as const
export type EnumTeamSubmissionStatus = keyof typeof EnumTeamSubmissionStatus
export const isStatusSuccess = (
  status: EnumTeamSubmissionStatus,
  throwException: boolean = true
) => {
  const valid = status !== EnumTeamSubmissionStatus.success
  if (status !== EnumTeamSubmissionStatus.success && throwException) {
    throw new BadException("teamSubmitMustSuccessStatus", ["endDate"])
  }
  return valid
}
