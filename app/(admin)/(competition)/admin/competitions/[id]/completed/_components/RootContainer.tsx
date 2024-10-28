import { CompleteButton } from "@/features/client/competition/components/edit/CompleteButton"
import { getCompetitionClientService } from "@/features/client/competition/service/getCompetitionService"

type RootContainerProps = {
  id: string
}

export const RootContainer = async ({ id }: RootContainerProps) => {
  const competition =
    await getCompetitionClientService.getCompetitionByAdmin(id)

  if (competition.completed) {
    return <div>already completed</div>
  }

  return (
    <div>
      <h2 className="font-bold text-xl">Completed</h2>
      <p className="text-sm text-gray-500">
        The <code>completed</code> button is used to finalize the competition
        rankings. When this button is pressed, the following actions occur:
      </p>
      <ul className="text-sm text-gray-500 list-decimal">
        <li className="ml-10 mt-2">
          The submitted data from the user is marked as <code>selected</code>.
          If fewer than two <code>selected</code> scores are present, the best
          score will be marked as <code>selected</code>.
        </li>
        <li className="ml-10 mt-2">
          The private score will be displayed on the leaderboard. However, it
          will not be shown if the competition deadline has not passed.
        </li>
      </ul>
      <CompleteButton id={id} />
    </div>
  )
}
