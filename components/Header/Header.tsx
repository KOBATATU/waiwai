import Link from "next/link"
import { getServerSession } from "@/features/server/core/session"

import { siteConfig } from "@/config/site"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MainNav } from "./Nav"

export async function SiteHeader() {
  const user = await getServerSession()
  return (
    <header className="bg-background  top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user?.user.image || ""} alt="@shadcn" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-[220px]"
                align="end"
                sideOffset={10}
              >
                <DropdownMenuLabel className="px-3 py-2">
                  {user?.user.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3">
                  <Link href={"/user/profile"}>profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3">
                  <Link href={"/user/competition"}>competition</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
