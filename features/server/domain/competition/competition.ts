import { CompetitionOptionalDefaultsSchema } from "@/prisma/generated/zod"
import { z } from "zod"

export const CompetitionCustomOptionalDefaultsSchema =
  CompetitionOptionalDefaultsSchema.refine(
    (data) => data.startDate < data.endDate,
    {
      message: "startDate must not be later than endDate.",
      path: ["startDate"],
    }
  )

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

export const EvaluationFuncEnum = {
  regression: {
    rmse: "rmse",
  },
  classification: {
    logistic: "logistic",
  },
} as const

export const ProblemEnum = {
  regression: "regression",
  classification: "classification",
} as const
