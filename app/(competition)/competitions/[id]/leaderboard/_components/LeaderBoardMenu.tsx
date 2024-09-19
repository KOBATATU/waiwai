"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type LeaderBoardMenuProps = {
  id: string
  tabQuery?: string
  PublicLeaderBoard: ReactNode
  PrivateLeaderBoard: ReactNode
}

export const LeaderBoardMenu = ({
  id,
  tabQuery,
  PublicLeaderBoard,
  PrivateLeaderBoard,
}: LeaderBoardMenuProps) => {
  const router = useRouter()
  const [value, setValue] = useState("public")

  const menus = [
    {
      value: "public",
      href: `/competitions/${id}/leaderboard?tab=public`,
      label: "public",
    },
    {
      value: "private",
      href: `/competitions/${id}/leaderboard?tab=private`,
      label: "private",
    },
  ]

  useEffect(() => {
    console.log(tabQuery)
    menus.forEach((menu) => {
      if (menu.value === tabQuery) {
        setValue(tabQuery)
      }
    })
  }, [tabQuery])

  return (
    <>
      <Tabs
        defaultValue={"public"}
        value={value}
        onValueChange={setValue}
        className="hidden-scrollbar flex flex-col overflow-x-scroll"
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
        <TabsContent value="public">{PublicLeaderBoard}</TabsContent>
        <TabsContent value="private">{PrivateLeaderBoard}</TabsContent>
      </Tabs>
    </>
  )
}
