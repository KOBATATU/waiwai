import { redirect } from "next/navigation"
import { Signin } from "@/features/client/user/components/signin/Signin"
import { getServerSession } from "@/features/server/core/session"

import { SiteHeader } from "@/components/Header/Header"

export default async function IndexPage() {
  const user = await getServerSession()
  if (user) {
    redirect("/")
  }
  return (
    <div>
      <SiteHeader />
      <div className="container mt-10 ">
        <Signin />
      </div>
    </div>
  )
}
