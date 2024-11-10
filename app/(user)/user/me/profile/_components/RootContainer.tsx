import { redirect } from "next/navigation"
import { EditAvatar } from "@/features/client/user/components/edit/EditAvatar"
import { EditUser } from "@/features/client/user/components/edit/EditUser"
import { getServerSession } from "@/features/server/core/session"

export const RootContainer = async () => {
  const session = await getServerSession()
  if (!session?.user) {
    return redirect("/signin")
  }

  return (
    <div>
      <EditAvatar avatar={session.user.image} />
      <EditUser name={session.user.name ?? ""} />
    </div>
  )
}
