"use client"

import { useState } from "react"
import { differenceInDays } from "date-fns"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, Calendar, Mail, MoreHorizontal, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { UserWithUploads } from "@/lib/api"
import { UploadHistoryModal } from "./upload-history-modal"

export function MissingUploadsTable({ data }: { data: UserWithUploads[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedUser, setSelectedUser] = useState<UserWithUploads | null>(null)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)

  // Filter users with no uploads or uploads older than 30 days
  const usersWithMissingUploads = data.filter((user) => {
    if (user.uploadCount === 0) return true
    if (!user.lastUpload) return true

    const daysSinceLastUpload = differenceInDays(new Date(), new Date(user.lastUpload))

    return daysSinceLastUpload > 30
  })

  const columns: ColumnDef<UserWithUploads>[] = [
    {
      accessorKey: "clerk_id",
      header: "User ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="truncate max-w-[180px]">{row.getValue("clerk_id")}</span>
        </div>
      ),
    },
    {
      accessorKey: "uploadCount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const count = row.getValue("uploadCount") as number

        if (count === 0) {
          return <Badge variant="destructive">Never uploaded</Badge>
        }

        return <Badge variant="secondary">Outdated uploads</Badge>
      },
    },
    {
      accessorKey: "lastUpload",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Last Activity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const lastUpload = row.getValue("lastUpload") as Date | null

        if (!lastUpload) {
          return <span className="text-muted-foreground">No activity</span>
        }

        const daysSince = differenceInDays(new Date(), new Date(lastUpload))

        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{daysSince} days ago</span>
          </div>
        )
      },
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as Date | null
        const b = rowB.getValue(columnId) as Date | null

        if (!a && !b) return 0
        if (!a) return 1
        if (!b) return -1

        return new Date(a).getTime() - new Date(b).getTime()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.clerk_id)}>
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setHistoryModalOpen(true)
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View upload history
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send reminder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: usersWithMissingUploads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter users..."
          value={(table.getColumn("clerk_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("clerk_id")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  All users have recent uploads. Great job!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>

      <UploadHistoryModal user={selectedUser} open={historyModalOpen} onOpenChange={setHistoryModalOpen} />
    </div>
  )
}

