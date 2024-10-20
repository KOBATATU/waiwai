"use server"

import { actionHandler } from "@/features/server/core/handler"
import { TeamNameSchema } from "@/features/server/domain/team/team"
import { editTeamService } from "@/features/server/service/team/editService"
import { getTeamService } from "@/features/server/service/team/getService"
import { SubmissionResult } from "@conform-to/react"

/**
 * submission csv file
 * @param prevState
 * @param formData
 * @returns
 */
export const updateTeamNameAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    formData: formData,
    schema: TeamNameSchema,
    permissions: ["admin", "user"],
    callback: async (user, payload) => {
      const team = await getTeamService.getTeamByUserIdAndCompetitionId(
        user.id,
        payload.competitionId
      )

      return await editTeamService.editTeamName(team.id, payload.name)
    },
  })
}
