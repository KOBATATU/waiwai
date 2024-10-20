import { TeamName } from "@/features/client/team/components/detail/TeamName"
import { getTeamClientService } from "@/features/client/team/service/getTeamService"

type RootContainerProps = {
  id: string
}

export const RootContainer = async ({ id }: RootContainerProps) => {
  const team = await getTeamClientService.getTeamByUserIdAndCompetitionId(id)

  return (
    <div className="mt-2">
      <div className="mb-4 flex gap-2 items-center">
        <h2 className="text-xl font-bold ">Your Team</h2>
      </div>
      <TeamName competitionId={id} teamName={team.name} />

      <div className="mt-4">
        <h2 className="text-xl font-bold ">Team Member</h2>
        {team.teamMembers.map((teamMember) => {
          return (
            <div key={teamMember.id} className="flex gap-2">
              {teamMember.user.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
