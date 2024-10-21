import { UserAdminTable } from "@/features/client/user/components/user-admin-table/UserAdminTable"
import { getUserClientService } from "@/features/client/user/service/getUserService"
import { getServerSession } from "@/features/server/core/session"

export const RootContainer = async () => {
  const users = await getUserClientService.getUsersByAdmin(1)
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
