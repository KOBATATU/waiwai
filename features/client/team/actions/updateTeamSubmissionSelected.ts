"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import { canSubmitAndSelectedData } from "@/features/server/domain/competition/competition"
import { TeamSubmissionSelectedSchema } from "@/features/server/domain/team/team"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
import { editTeamService } from "@/features/server/service/team/editService"
import { getTeamService } from "@/features/server/service/team/getService"
import { SubmissionResult } from "@conform-to/react"

/**
 * update submission selected
 * @param prevState
 * @param formData
 * @returns
 */
export const updateTeamSubmissionSelectedAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    formData: formData,
    schema: TeamSubmissionSelectedSchema,
    permissions: ["admin", "user"],
    callback: async (user, payload) => {
      const team = await getTeamService.getTeamByUserIdAndCompetitionId(
        user.id,
        payload.competitionId
      )
      await getTeamService.getTeamSubmissionByIdAndTeamId(payload.id, team.id)

      const competition = await getCompetitionService.getCompetitionById(
        payload.competitionId
      )
      canSubmitAndSelectedData(competition.open, competition.endDate)

      const selected = payload.selected === "on"
      if (selected) {
        await getTeamService.getTeamSubmissionCountByTeamId(team.id)
      }
      const teamSubmission = await editTeamService.editTeamSubmissionSelected(
        payload.id,
        payload.selected === "on"
      )
      revalidatePath(`competitions/${payload.competitionId}/submissions`)
      return teamSubmission
    },
  })
}