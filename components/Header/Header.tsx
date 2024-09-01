import { getServerSession } from "@/features/server/core/session"

import { siteConfig } from "@/config/site"

import { MainNav } from "./Nav"
import { UserNav } from "./UserNav"

export async function SiteHeader() {
  const session = await getServerSession()
  return (
    <header className="bg-background  top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav session={session} />
        </div>
      </div>
    </header>
  )
}
