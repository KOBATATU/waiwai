import { BadException, ExceptionEnum } from "@/features/server/core/exception"
import {
  CompetitionOptionalDefaultsSchema,
  CompetitionSchema,
} from "@/prisma/generated/zod"
import { boolean, z } from "zod"

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
      testDataRate: true,
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

export const CompetitionCompleteSchema = CompetitionSchema.pick({
  id: true,
})

/**
 * user can upload submission file or select submission file
 * @param open
 * @param endDate
 */
export const isNowBeforeEndDate = (
  open: boolean,
  endDate: Date,
  throwException: boolean = true
) => {
  const now = createDateWithTimezone(new Date())
  const canSubmit = open && now.getTime() < endDate.getTime()
  if (!canSubmit && throwException) {
    throw new BadException({
      fieldsError: {
        endDate: [ExceptionEnum.competitionEnd.message],
      },
      message: ExceptionEnum.competitionEnd.message,
      code: ExceptionEnum.competitionEnd.code,
    })
  }
  return canSubmit
}

export const isNowAfterStartDate = (
  open: boolean,
  startDate: Date,
  throwException: boolean = true
) => {
  const now = createDateWithTimezone(new Date())
  const _isNowAfterStartDate = open && now.getTime() > startDate.getTime()
  if (throwException && !_isNowAfterStartDate) {
    throw new BadException({
      fieldsError: {
        endDate: [ExceptionEnum.competitionNotStart.message],
      },
      message: ExceptionEnum.competitionNotStart.message,
      code: ExceptionEnum.competitionNotStart.code,
    })
  }
  return _isNowAfterStartDate
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

export const getUseMax = (problem: string, evaluationFunc: string): boolean => {
  const selectedProblem =
    problem in EvaluationFuncEnum
      ? EvaluationFuncEnum[problem as ProblemKeys]
      : EvaluationFuncEnum["regression"]

  // @ts-ignore
  return selectedProblem[evaluationFunc]?.order === "max"
}
