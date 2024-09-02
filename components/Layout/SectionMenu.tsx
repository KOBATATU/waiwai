"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SectionMenuProps = {
  title: string
  subtitle: string
  defaultValue: string
  menus: {
    value: string
    label: string
    href?: string
  }[]
}

export const SectionMenu = ({
  title,
  subtitle,
  defaultValue,
  menus,
}: SectionMenuProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const pathSegments = pathname.split("/")
    const name = pathSegments[pathSegments.length - 1]
    const matchedMenu = menus.find((menu) => menu.value === name)
    if (matchedMenu) {
      setValue(matchedMenu.value)
    }
  }, [pathname])

  return (
    <>
      <div className="flex flex-col  gap-2">
        <h1 className="text-3xl  md:text-4xl">{title}</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {subtitle}
        </p>
      </div>
      <Tabs
        defaultValue={defaultValue}
        value={value}
        className="border-b hidden-scrollbar flex flex-col overflow-x-scroll"
      >
        <TabsList>
          {menus.length > 0
            ? menus.map((menu) => (
                <TabsTrigger
                  key={menu.value}
                  value={menu.value}
                  onClick={() => {
                    if (menu.href) {
                      router.push(menu.href)
                    }
                  }}
                >
                  {menu.label}
                </TabsTrigger>
              ))
            : null}
        </TabsList>
      </Tabs>
    </>
  )
}
