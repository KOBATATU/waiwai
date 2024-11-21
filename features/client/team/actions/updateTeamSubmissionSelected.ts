"use server"

import { revalidatePath } from "next/cache"
import { actionHandler } from "@/features/server/core/handler"
import {
  isNowAfterStartDate,
  isNowBeforeEndDate,
} from "@/features/server/domain/competition/competition"
import {
  EnumTeamSubmissionStatus,
  isStatusSuccess,
  TeamSubmissionSelectedSchema,
} from "@/features/server/domain/team/team"
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
      const competition = await getCompetitionService.getCompetitionById(
        payload.competitionId
      )
      isNowAfterStartDate(competition.open, competition.startDate)
      isNowBeforeEndDate(competition.open, competition.endDate)

      const team = await getTeamService.getTeamByUserIdAndCompetitionId(
        user.id,
        payload.competitionId
      )
      const teamSubmission =
        await getTeamService.getTeamSubmissionByIdAndTeamId(payload.id, team.id)
      isStatusSuccess(teamSubmission.status as EnumTeamSubmissionStatus)

      const selected = payload.selected === "on"
      if (selected) {
        await getTeamService.getTeamSubmissionCountByTeamId(team.id)
      }
      const result = await editTeamService.editTeamSubmissionSelected(
        payload.id,
        payload.selected === "on"
      )
      revalidatePath(`competitions/${payload.competitionId}/submissions`)
      return result
    },
  })
}
