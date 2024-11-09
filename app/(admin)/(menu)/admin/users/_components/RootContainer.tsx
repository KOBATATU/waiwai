import { UserAdminTable } from "@/features/client/user/components/user-admin-table/UserAdminTable"
import { getUserClientService } from "@/features/client/user/service/getUserService"
import { getServerSession } from "@/features/server/core/session"

import { QueryParameters } from "@/lib/utils"

type RootContainerProps = {
  queryParameter: QueryParameters
}

export const RootContainer = async ({ queryParameter }: RootContainerProps) => {
  const users = await getUserClientService.getUsersByAdmin(queryParameter.page)
  const user = await getServerSession()
  return (
    <div>
      <div className="flex items-centergap-5">
        <div className="font-bold text-xl"> users </div>
      </div>
      <UserAdminTable users={users} userId={user?.user.id} />
    </div>
  )
}
