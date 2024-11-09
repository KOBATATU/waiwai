import { EditUser } from "@/features/client/user/components/edit/EditUser"
import { getServerSession } from "@/features/server/core/session"

export const RootContainer = async () => {
  const session = await getServerSession()
  if (!session) {
    return null
  }

  return (
    <div>
      <EditUser name={session.user.name ?? ""} />
    </div>
  )
}