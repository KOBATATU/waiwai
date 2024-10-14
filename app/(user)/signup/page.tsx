import { Signup } from "@/features/client/user/components/signup/Signup"

import { SiteHeader } from "@/components/Header/Header"

export default function IndexPage() {
  return (
    <div>
      <SiteHeader />
      <div className="container mt-10 ">
        <Signup />
      </div>
    </div>
  )
}
