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

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type PrivateLeaderBoardType = ScoreRecord

type PrivateLeaderBoardProps = {
  privateLeaderBoard: GetTeamServiceType["getTeamPrivateScoresByCompetitionId"]
  userId?: string
}

export const PrivateLeaderBoard = ({
  privateLeaderBoard,
  userId,
}: PrivateLeaderBoardProps) => {
  console.log(privateLeaderBoard)
  const columns: ColumnDef<PrivateLeaderBoardType>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
    },
    {
      accessorKey: "team_name",
      header: "name",
      cell: ({ row }) => {
        const rankDiff =
          row.original.public_rank - (row.original.private_rank ?? 0)
        return (
          <div className="flex gap-2">
            <span
              className={cn(
                "text-sm",
                rankDiff === 0
                  ? "text-gray-500"
                  : rankDiff < 0
                    ? "text-red-500"
                    : "text-green-500"
              )}
            >
              public diff: {rankDiff}
            </span>
            <div className="capitalize">{row.getValue("team_name")}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "members",
      header: "members",
      cell: ({ row }) => {
        const members = row.getValue(
          "members"
        ) as PrivateLeaderBoardType["members"]

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
      accessorKey: "private_best_score",
      header: "private_best_score",
      cell: ({ row }) => {
        return (
          <div className=" font-medium">
            {row.getValue("private_best_score")}
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
    data: privateLeaderBoard.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full mt-4">
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
