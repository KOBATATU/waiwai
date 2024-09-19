import { PublicLeaderBoard } from "@/features/client/competition/components/detail/PublicLeaderBoard"

import { LeaderBoardMenu } from "./LeaderBoardMenu"

type RootContainerProps = {
  id: string
  tabQuery: string
}

export const RootContainer = async ({ id, tabQuery }: RootContainerProps) => {
  return (
    <div className="mt-2">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>

      <LeaderBoardMenu
        id={id}
        tabQuery={tabQuery}
        PublicLeaderBoard={<PublicLeaderBoard />}
        PrivateLeaderBoard={"hoge"}
      />
    </div>
  )
}
