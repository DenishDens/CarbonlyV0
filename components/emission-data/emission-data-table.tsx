"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export type EmissionRecord = {
  id: string
  date: string
  activity: string
  emission_value: number
  unit: string
  source: string
  verified: boolean
  notes?: string
}

const data: EmissionRecord[] = [
  {
    id: "1",
    date: "2023-10-15",
    activity: "Business Travel",
    emission_value: 125.5,
    unit: "kg CO2e",
    source: "Flight Records",
    verified: true,
    notes: "Round trip flight from London to New York",
  },
  {
    id: "2",
    date: "2023-10-10",
    activity: "Electricity",
    emission_value: 78.2,
    unit: "kg CO2e",
    source: "Utility Bill",
    verified: true,
  },
  {
    id: "3",
    date: "2023-10-05",
    activity: "Company Vehicle",
    emission_value: 45.8,
    unit: "kg CO2e",
    source: "Fuel Receipt",
    verified: false,
  },
  {
    id: "4",
    date: "2023-09-28",
    activity: "Natural Gas",
    emission_value: 102.3,
    unit: "kg CO2e",
    source: "Utility Bill",
    verified: true,
  },
  {
    id: "5",
    date: "2023-09-20",
    activity: "Waste Disposal",
    emission_value: 15.7,
    unit: "kg CO2e",
    source: "Waste Management Report",
    verified: false,
  },
]

export function EmissionDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRecord, setSelectedRecord] = useState<EmissionRecord | null>(null)
  const { toast } = useToast()

  const columns: ColumnDef<EmissionRecord>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "activity",
      header: "Activity",
      cell: ({ row }) => <div>{row.getValue("activity")}</div>,
    },
    {
      accessorKey: "emission_value",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Emission Value
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("emission_value"))
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(amount)

        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "unit",
      header: "Unit",
      cell: ({ row }) => <div>{row.getValue("unit")}</div>,
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => <div>{row.getValue("source")}</div>,
    },
    {
      accessorKey: "verified",
      header: "Status",
      cell: ({ row }) => {
        const verified = row.getValue("verified")
        return (
          <Badge variant={verified ? "default" : "outline"}>
            {verified ? (
              <div className="flex items-center">
                <Check className="mr-1 h-3 w-3" />
                Verified
              </div>
            ) : (
              "Pending"
            )}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original

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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRecord(record)
                  toast({
                    title: "Viewing emission details",
                    description: `Showing details for ${record.activity} on ${record.date}`,
                  })
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Verification requested",
                    description: `Verification requested for ${record.activity} on ${record.date}`,
                  })
                }}
              >
                Request Verification
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Record exported",
                    description: "The record has been exported to CSV",
                  })
                }}
              >
                Export Record
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter activities..."
          value={(table.getColumn("activity")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("activity")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      {/* Emission Record Details Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Emission Record Details</DialogTitle>
            <DialogDescription>Detailed information about this emission record</DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedRecord.activity}</CardTitle>
                <CardDescription>Recorded on {selectedRecord.date}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Emission Value</p>
                    <p className="text-lg">
                      {selectedRecord.emission_value} {selectedRecord.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant={selectedRecord.verified ? "default" : "outline"} className="mt-1">
                      {selectedRecord.verified ? (
                        <div className="flex items-center">
                          <Check className="mr-1 h-3 w-3" />
                          Verified
                        </div>
                      ) : (
                        "Pending Verification"
                      )}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Source</p>
                  <p>{selectedRecord.source}</p>
                </div>

                {selectedRecord.notes && (
                  <div>
                    <p className="text-sm font-medium">Notes</p>
                    <p>{selectedRecord.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium">Carbon Impact</p>
                  <p>This emission is equivalent to:</p>
                  <ul className="list-disc list-inside text-sm pl-4 mt-2 space-y-1">
                    <li>{(selectedRecord.emission_value * 4.3).toFixed(1)} miles driven by an average car</li>
                    <li>{(selectedRecord.emission_value * 0.12).toFixed(1)} gallons of gasoline consumed</li>
                    <li>
                      {(selectedRecord.emission_value * 0.11).toFixed(1)} trees needed to offset this carbon for one
                      year
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Report generated",
                      description: "A detailed report has been generated for this record",
                    })
                    setSelectedRecord(null)
                  }}
                >
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

