import { BadException, ExceptionEnum } from "@/features/server/core/exception"
import {
  CompetitionOptionalDefaultsSchema,
  CompetitionSchema,
} from "@/prisma/generated/zod"
import { z } from "zod"

import { createDateWithTimezone } from "@/lib/utils"

export const CompetitionCustomOptionalDefaultsSchema =
  CompetitionOptionalDefaultsSchema.merge(
    z.object({
      id: z.string(),
      open: z.string().optional(),
    })
  )
    .pick({
      id: true,
      title: true,
      subtitle: true,
      thumbnail: true,
      startDate: true,
      endDate: true,
      open: true,
      evaluationFunc: true,
      limitSubmissionNum: true,
    })
    .refine((data) => data.startDate < data.endDate, {
      message: "startDate must not be later than endDate.",
      path: ["startDate"],
    })
export type CompetitionCustomOptionalDefaults = z.infer<
  typeof CompetitionCustomOptionalDefaultsSchema
>

export const CompetitionTitleAndSubtitleSchema =
  CompetitionOptionalDefaultsSchema.pick({
    title: true,
    subtitle: true,
  })
export type CompetitionTitleAndSubtitle = z.infer<
  typeof CompetitionTitleAndSubtitleSchema
>

export const CompetitionOverviewSchema = CompetitionSchema.pick({
  id: true,
  description: true,
})
export type CompetitionOverviewSchema = z.infer<
  typeof CompetitionOverviewSchema
>

export const CompetitionDataSchema = CompetitionSchema.pick({
  id: true,
  dataDescription: true,
})
export type CompetitionData = z.infer<typeof CompetitionDataSchema>

export const CompetitionDataFileSchema = z.object({
  file: z.instanceof(File),
  id: z.string(),
})

export const CompetitionDataDownloadSchema = z.object({
  competitionDataId: z.string(),
})

/**
 * user can upload submission file or select submission file
 * @param open
 * @param endDate
 */
export const canSubmitAndSelectedData = (open: boolean, endDate: Date) => {
  const now = createDateWithTimezone(new Date())

  if (!open || now.getTime() > endDate.getTime()) {
    throw new BadException({
      fieldsError: {
        endDate: [ExceptionEnum.competitionSubmitBad.message],
      },
      message: ExceptionEnum.competitionSubmitBad.message,
      code: ExceptionEnum.competitionSubmitBad.code,
    })
  }
}

export const EvaluationFuncEnum = {
  regression: {
    rmse: {
      value: "rmse",
      order: "min",
    },
  },
  classification: {
    f1: {
      value: "f1",
      order: "max",
    },
  },
} as const
type EvaluationFuncEnumType = typeof EvaluationFuncEnum
export type ProblemKeys = keyof EvaluationFuncEnumType
export type EvaluationFuncKeys<T extends ProblemKeys> =
  keyof EvaluationFuncEnumType[T]
export const evaluationFuncOptions = Object.entries(EvaluationFuncEnum).flatMap(
  ([problem, metrics]) =>
    Object.entries(metrics).map(([metricName, metricObj]) => ({
      label: `${metricObj.value}(${problem})`,
      value: metricObj.value,
      problem,
    }))
)

export const valueToProblemMap = Object.entries(EvaluationFuncEnum).reduce(
  (acc, [problem, metrics]) => {
    Object.values(metrics).forEach((metricObj) => {
      acc[metricObj.value] = problem
    })
    return acc
  },
  {} as Record<string, string>
)

export const ProblemEnum = {
  regression: "regression",
  classification: "classification",
} as const
