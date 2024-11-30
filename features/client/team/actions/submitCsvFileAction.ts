"use server"

import { redirect } from "next/navigation"
import { BadException, ExceptionEnum } from "@/features/server/core/exception"
import { actionHandler } from "@/features/server/core/handler"
import {
  isNowAfterStartDate,
  isNowBeforeEndDate,
} from "@/features/server/domain/competition/competition"
import {
  EnumTeamSubmissionStatus,
  TeamSubmitFileSchema,
} from "@/features/server/domain/team/team"
import { getCompetitionService } from "@/features/server/service/competition/base/getService"
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
      const competition = await getCompetitionService.getCompetitionById(
        payload.competitionId
      )
      isNowAfterStartDate(competition.open, competition.startDate)
      isNowBeforeEndDate(competition.open, competition.endDate)

      const team = await getTeamService.getTeamByUserIdAndCompetitionId(
        user.id,
        payload.competitionId
      )

      if (competition.limitSubmissionNum < team._count.teamSubmissions) {
        throw new BadException("teamSubmitLimit", ["endDate"])
      }

      const { filename, objectPath } =
        await uploadTeamService.uploadSubmissionFile(
          payload.competitionId,
          user.id,
          payload.file
        )
      // async function
      createTeamService
        .createSubmission(team.id, user.id, filename)
        .then(async (teamSubmission) => {
          try {
            const result = await getTeamService.getEvaluationScore(
              payload.competitionId,
              objectPath
            )

            await editTeamService.editTeamSubmission(
              teamSubmission.id,
              EnumTeamSubmissionStatus.success,
              result.public_score,
              result.private_score
            )
          } catch (e) {
            await editTeamService.editTeamSubmission(
              teamSubmission.id,
              EnumTeamSubmissionStatus.error,
              undefined,
              undefined
            )
          }
        })

      redirect(`/competitions/${payload.competitionId}/submissions`)
    },
  })
}
