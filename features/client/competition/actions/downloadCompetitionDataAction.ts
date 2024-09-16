"use server"

import { actionHandler } from "@/features/server/core/handler"
import { CompetitionDataDownloadSchema } from "@/features/server/domain/competition/competition"
import { downloadCompetitionDataService } from "@/features/server/service/competition/base/downloadService"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
import { SubmissionResult } from "@conform-to/react"

/**
 * download competition data
 * @param prevState
 * @param formData
 * @returns
 */
export const downloadCompetitionDataAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    formData: formData,
    schema: CompetitionDataDownloadSchema,
    permissions: ["admin", "user"],
    callback: async (user, payload) => {
      const competitionData =
        await getCompetitionService.getCompetitionDataById(
          payload.competitionDataId
        )

      if (user.role === "user") {
        await getCompetitionService.getCompetitionParticipateByIdAndUserId(
          competitionData.id,
          user.id
        )
      }

      const url = await downloadCompetitionDataService.downloadData(
        competitionData.dataPath
      )
      return {
        url,
      }
    },
  })
}
