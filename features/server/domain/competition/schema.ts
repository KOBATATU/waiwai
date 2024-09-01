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
