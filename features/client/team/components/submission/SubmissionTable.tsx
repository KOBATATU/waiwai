"use client"

import * as React from "react"
import { GetTeamServiceType } from "@/features/client/team/service/getTeamService"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { CircleHelp } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type SubmissionTableType = {
  sourceFile: string | null
  privateScore?: number | null
  publicScore: number | null
  status: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    image: string | null
    role: string | null
  }
}

type SubmissionTableProps = {
  submissions: GetTeamServiceType["getTeamSubmissionsByTeamId"]
  userId?: string
}

export const SubmissionTable = ({
  submissions,
  userId,
}: SubmissionTableProps) => {
  const columns: ColumnDef<SubmissionTableType>[] = [
    {
      accessorKey: "submittedBy",
      header: "submittedBy",
      cell: ({ row }) => {
        return <div>{row.original.user.name}</div>
      },
    },
    {
      accessorKey: "sourceFile",
      header: "sourceFile",
      cell: ({ row }) => <div>{row.getValue("sourceFile")}</div>,
    },
    {
      accessorKey: "privateScore",
      header: () => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex  items-center gap-1">
                privateScore
                <CircleHelp className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  The term "null" indicates that the calculation is currently in
                  progress/error <br /> or that the competition has not yet
                  concluded, and data cannot be retrieved.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      cell: ({ row }) => <div>{row.original.privateScore ?? "null"}</div>,
    },
    {
      accessorKey: "publicScore",
      header: "publicScore",
      cell: ({ row }) => {
        return <div>{row.original.publicScore ?? "null"}</div>
      },
    },
    {
      accessorKey: "uploadedAt",
      header: "uploadedAt",
      cell: ({ row }) => {
        return <div>{row.original.createdAt.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "status",
      header: "status",
      cell: ({ row }) => {
        return <div>{row.getValue("status")}</div>
      },
    },
  ]

  const table = useReactTable({
    data: submissions[0],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
