import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { getServerSession } from "@/features/server/core/session"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

interface MainNavProps {
  items?: NavItem[]
}

export async function MainNav({ items }: MainNavProps) {
  const user = await getServerSession()

  return (
    <div className="flex gap-2 md:gap-6">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-2">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground hover:border-b",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
          {user?.user.role === "admin" && (
            <Link
              href={"/admin/competitions"}
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground hover:border-b"
              )}
            >
              admin
            </Link>
          )}
        </nav>
      ) : null}
    </div>
  )
}
