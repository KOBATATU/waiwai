import { redirect } from "next/navigation"
import { Signup } from "@/features/client/user/components/signup/Signup"
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
        <Signup />
      </div>
    </div>
  )
}
