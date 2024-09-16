import {
  CompetitionOptionalDefaultsSchema,
  CompetitionSchema,
} from "@/prisma/generated/zod"
import { z } from "zod"

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

export const EvaluationFuncEnum = {
  regression: {
    rmse: "rmse",
  },
  classification: {
    logistic: "logistic",
  },
} as const
export const evaluationFuncOptions = Object.entries(EvaluationFuncEnum).flatMap(
  ([problem, metrics]) =>
    Object.entries(metrics).map(([metricName, metricValue]) => ({
      label: `${metricValue}(${problem})`,
      value: metricValue,
      problem,
    }))
)
export const valueToProblemMap = Object.entries(EvaluationFuncEnum).reduce(
  (acc, [problem, metric]) => {
    Object.entries(metric).forEach(([key, value]) => {
      acc[value] = problem
    })
    return acc
  },
  {} as Record<string, string>
)
export const ProblemEnum = {
  regression: "regression",
  classification: "classification",
} as const
