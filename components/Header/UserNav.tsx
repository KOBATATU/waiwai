"use client"

import Link from "next/link"
import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserNav = {
  session: Session | null
}

export const UserNav = ({ session }: UserNav) => {
  return (
    <nav className="flex items-center space-x-1">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={session.user.image || ""}
                alt={session.user.name || "User"}
              />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[220px]"
            align="end"
            sideOffset={10}
          >
            <DropdownMenuLabel className="px-3 py-2">
              {session.user.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3">
              <Link href="/user/profile">profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3">
              <Link href="/user/competition">competition</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3" onClick={() => signOut()}>
              signout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => signIn("github")}>login</Button>
      )}
    </nav>
  )
}
