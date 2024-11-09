"use client"

import * as React from "react"
import { editUserRoleAction } from "@/features/client/user/actions/editUserRoleAction"
import { UserRoleSchema } from "@/features/server/domain/user/user"
import { GetUserServiceType } from "@/features/server/service/user/getService"
import { getInputProps } from "@conform-to/react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { useToast } from "@/hooks/use-toast"
import { ConformStateType, useConform } from "@/hooks/useConform"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AnyField } from "@/components/Form/AnyField"
import { Pagination } from "@/components/Pagination/Pagination"

export type UserAdminTableType = {
  id: string
  name: string | null
  image: string | null
  role: string | null
}

type UserAdminTableProps = {
  users: GetUserServiceType["getUsersByAdmin"]
  userId?: string
}

export const UserAdminTable = ({ users, userId }: UserAdminTableProps) => {
  const columns: ColumnDef<UserAdminTableType>[] = [
    {
      accessorKey: "id",
      header: "id",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "image",
      header: "image",
      cell: ({ row }) => (
        <div>
          <Avatar>
            <AvatarImage
              src={row.getValue("image") || ""}
              alt={row.getValue("name") || "User"}
            />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "name",
      cell: ({ row }) => <div> {row.getValue("name")}</div>,
    },

    {
      accessorKey: "role change",
      header: "role change",
      cell: ({ row }) => {
        const { toast } = useToast()
        const role = row.original.role as string
        const id = row.getValue("id") as string

        const [form, fields, action] = useConform(
          async (prev: ConformStateType, formData: FormData) => {
            const result = await editUserRoleAction(prev, formData)

            if (result.submission.status === "success") {
              toast({
                title: "success",
                description: "success change user role!",
              })
            } else {
              toast({
                variant: "destructive",
                title: "failed",
                description: "failed change user role",
              })
            }

            return result.submission
          },
          {
            schema: UserRoleSchema,
          }
        )
        return (
          <div>
            <AnyField className="w-full px-4 py-2" error={fields.role.errors}>
              <Select
                key={fields.role.key}
                name={fields.role.name}
                defaultValue={role as string}
                onValueChange={async (value) => {
                  const formData = new FormData()
                  formData.append("id", id)
                  formData.append("role", value)
                  fields.role.value = value
                  action(formData)
                }}
              >
                <SelectTrigger disabled={id === userId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "user", label: "user" },
                    { value: "admin", label: "admin" },
                  ].map((option) => {
                    return (
                      <SelectItem value={option.value} key={option.value}>
                        {option.label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </AnyField>
          </div>
        )
      },
    },
  ]

  const data = users[0]
  const table = useReactTable({
    data: data,
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
            nextPagePath={`/admin/users?page=${users[1].nextPage}`}
            previousPagePath={`/admin/users?page=${users[1].previousPage}`}
            meta={users[1]}
          />
        </div>
      </div>
    </div>
  )
}
