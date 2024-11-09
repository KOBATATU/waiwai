"use client"

import * as React from "react"
import { GetTeamServiceType } from "@/features/client/team/service/getTeamService"
import { ScoreRecord } from "@/features/server/repository/team/getRepository"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type PublicLeaderBoardType = Omit<
  ScoreRecord,
  "private_best_score" | "private_rank"
>

type PublicLeaderBoardProps = {
  publicLeaderBoard: GetTeamServiceType["getTeamPrivateScoresByCompetitionId"]
  userId?: string
}

export const PublicLeaderBoard = ({
  publicLeaderBoard,
  userId,
}: PublicLeaderBoardProps) => {
  const columns: ColumnDef<PublicLeaderBoardType>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
    },
    {
      accessorKey: "team_name",
      header: "name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("team_name")}</div>
      ),
    },
    {
      accessorKey: "members",
      header: "members",
      cell: ({ row }) => {
        const members = row.getValue(
          "members"
        ) as PublicLeaderBoardType["members"]

        return (
          <div className="lowercase flex gap-1">
            {members.map((member) => {
              return (
                <div key={member.user_id}>
                  <Avatar>
                    <AvatarImage
                      width={"20"}
                      height={"20"}
                      src={member.image || ""}
                      alt={member.name || "User"}
                    />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      accessorKey: "public_best_score",
      header: "public_best_score",
      cell: ({ row }) => {
        return (
          <div className=" font-medium">
            {row.getValue("public_best_score")}
          </div>
        )
      },
    },
    {
      accessorKey: "cnt_team_submissions",
      header: "entries",
      cell: ({ row }) => {
        return (
          <div className=" font-medium">
            {row.getValue("cnt_team_submissions")}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: publicLeaderBoard.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full mt-4">
      <p className="text-sm text-gray-500">
        This leaderboard is calculated with approximately 35% of the test data.
        The final results will be based on the other 65%, so the final standings
        may be different.
      </p>
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={row.original.is_user_member ? "bg-green-100" : ""}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
