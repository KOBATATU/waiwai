"use server"

import { redirect } from "next/navigation"
import { actionHandler } from "@/features/server/core/handler"
import {
  EnumTeamSubmissionStatus,
  TeamSubmitFileSchema,
} from "@/features/server/domain/team/team"
import { createTeamService } from "@/features/server/service/team/createService"
import { editTeamService } from "@/features/server/service/team/editService"
import { getTeamService } from "@/features/server/service/team/getService"
import { uploadTeamService } from "@/features/server/service/team/uploadService"
import { SubmissionResult } from "@conform-to/react"

/**
 * submission csv file
 * @param prevState
 * @param formData
 * @returns
 */
export const submitCsvFileAction = async (
  prevState: SubmissionResult<string[]> | undefined,
  formData: FormData
) => {
  return await actionHandler({
    formData: formData,
    schema: TeamSubmitFileSchema,
    permissions: ["admin", "user"],
    callback: async (user, payload) => {
      const team = await getTeamService.getTeamByUserIdAndCompetitionId(
        user.id,
        payload.competitionId
      )

      const filename = await uploadTeamService.uploadSubmissionFile(
        payload.competitionId,
        user.id,
        payload.file
      )
      // async function
      createTeamService
        .createSubmission(team.id, user.id, filename)
        .then(async (teamSubmission) => {
          try {
            //TODO: evaluation

            await editTeamService.editTeamSubmission(
              teamSubmission.id,
              EnumTeamSubmissionStatus.success,
              0,
              0
            )
          } catch (e) {
            await editTeamService.editTeamSubmission(
              teamSubmission.id,
              EnumTeamSubmissionStatus.error,
              0,
              0
            )
          }
        })

      redirect(`/competitions/${payload.competitionId}/team`)
      return {}
    },
  })
}
