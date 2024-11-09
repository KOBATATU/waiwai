"use client"

import * as React from "react"
import { updateTeamSubmissionSelectedAction } from "@/features/client/team/actions/updateTeamSubmissionSelected"
import { GetTeamServiceType } from "@/features/client/team/service/getTeamService"
import { TeamSubmissionSelectedSchema } from "@/features/server/domain/team/team"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { CircleHelp } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { ConformStateType, useConform } from "@/hooks/useConform"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Pagination } from "@/components/Pagination/Pagination"

export type SubmissionTableType = {
  id: string
  sourceFile: string | null
  privateScore?: number | null
  publicScore: number | null
  status: string
  selected: boolean
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
  competitionId: string
}

export const SubmissionTable = ({
  submissions,
  competitionId,
}: SubmissionTableProps) => {
  const selectedCount = React.useMemo(() => {
    return submissions[0].filter((submission) => submission.selected).length
  }, [submissions])
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
    {
      accessorKey: "selected",
      header: "selected",
      cell: ({ row }) => {
        const { toast } = useToast()
        const [form, fields, action] = useConform(
          async (prev: ConformStateType, formData: FormData) => {
            const result = await updateTeamSubmissionSelectedAction(
              prev,
              formData
            )

            if (result.submission.status === "success") {
              toast({
                title: "success",
                description: "success selected data!",
              })
            } else {
              toast({
                variant: "destructive",
                title: "failed",
                description: "failed selected data",
              })
            }
            return result.submission
          },
          {
            schema: TeamSubmissionSelectedSchema,
          }
        )

        return (
          <Checkbox
            disabled={
              selectedCount === 2 && row.original.selected === false
                ? true
                : false
            }
            defaultChecked={row.original.selected}
            onCheckedChange={(value) => {
              const formData = new FormData()
              formData.append("competitionId", competitionId)
              formData.append("id", row.original.id)
              formData.append("selected", value ? "on" : "off")
              action(formData)
            }}
          />
        )
      },
    },
  ]

  const table = useReactTable({
    data: submissions[0],
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
          <Pagination
            nextPagePath={`/competitions/${competitionId}/submissions?page=${submissions[1].nextPage}`}
            previousPagePath={`/competitions/${competitionId}/submissions?page=${submissions[1].previousPage}`}
            meta={submissions[1]}
          />
        </div>
      </div>
    </div>
  )
}
