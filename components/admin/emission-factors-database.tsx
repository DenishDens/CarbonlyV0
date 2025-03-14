"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Database, Download, Filter, MoreHorizontal, Search, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const emissionFactors = [
  {
    id: "1",
    name: "Electricity - US Grid Average",
    category: "Electricity",
    scope: "Scope 2",
    value: "0.42",
    unit: "kg CO2e/kWh",
    source: "EPA eGRID 2021",
    lastUpdated: "Jan 15, 2023",
    status: "active",
  },
  {
    id: "2",
    name: "Natural Gas Combustion",
    category: "Stationary Combustion",
    scope: "Scope 1",
    value: "2.02",
    unit: "kg CO2e/m3",
    source: "IPCC 2019",
    lastUpdated: "Feb 3, 2023",
    status: "active",
  },
  {
    id: "3",
    name: "Diesel - Mobile Combustion",
    category: "Mobile Combustion",
    scope: "Scope 1",
    value: "2.68",
    unit: "kg CO2e/L",
    source: "GHG Protocol",
    lastUpdated: "Mar 10, 2023",
    status: "active",
  },
  {
    id: "4",
    name: "Business Travel - Air (Long Haul)",
    category: "Business Travel",
    scope: "Scope 3",
    value: "0.15",
    unit: "kg CO2e/passenger-km",
    source: "DEFRA 2022",
    lastUpdated: "Nov 22, 2022",
    status: "active",
  },
  {
    id: "5",
    name: "Waste to Landfill - Mixed",
    category: "Waste",
    scope: "Scope 3",
    value: "0.58",
    unit: "kg CO2e/kg waste",
    source: "EPA WARM Model",
    lastUpdated: "Apr 5, 2023",
    status: "pending",
  },
  {
    id: "6",
    name: "Employee Commuting - Car",
    category: "Employee Commuting",
    scope: "Scope 3",
    value: "0.17",
    unit: "kg CO2e/km",
    source: "GHG Protocol",
    lastUpdated: "Dec 12, 2022",
    status: "active",
  },
  {
    id: "7",
    name: "Purchased Goods - Paper",
    category: "Purchased Goods",
    scope: "Scope 3",
    value: "0.94",
    unit: "kg CO2e/kg",
    source: "DEFRA 2022",
    lastUpdated: "May 18, 2023",
    status: "active",
  },
  {
    id: "8",
    name: "Refrigerant - R410A",
    category: "Fugitive Emissions",
    scope: "Scope 1",
    value: "2088",
    unit: "GWP (CO2e)",
    source: "IPCC AR5",
    lastUpdated: "Feb 28, 2023",
    status: "active",
  },
]

export function EmissionFactorsDatabase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddFactorOpen, setIsAddFactorOpen] = useState(false)

  const filteredFactors = emissionFactors.filter(
    (factor) =>
      factor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factor.scope.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Emission Factors</CardTitle>
            <CardDescription>Manage the emission factors database used across the platform.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddFactorOpen} onOpenChange={setIsAddFactorOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Database className="mr-2 h-4 w-4" />
                  Add Factor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Emission Factor</DialogTitle>
                  <DialogDescription>Add a new emission factor to the database.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="factor-name">Name</Label>
                      <Input id="factor-name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="factor-category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="stationary">Stationary Combustion</SelectItem>
                          <SelectItem value="mobile">Mobile Combustion</SelectItem>
                          <SelectItem value="fugitive">Fugitive Emissions</SelectItem>
                          <SelectItem value="waste">Waste</SelectItem>
                          <SelectItem value="business-travel">Business Travel</SelectItem>
                          <SelectItem value="employee-commuting">Employee Commuting</SelectItem>
                          <SelectItem value="purchased-goods">Purchased Goods</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="factor-scope">Scope</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scope1">Scope 1</SelectItem>
                          <SelectItem value="scope2">Scope 2</SelectItem>
                          <SelectItem value="scope3">Scope 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="factor-source">Source</Label>
                      <Input id="factor-source" placeholder="e.g., EPA, IPCC, GHG Protocol" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="factor-value">Value</Label>
                      <Input id="factor-value" type="number" step="0.0001" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="factor-unit">Unit</Label>
                      <Input id="factor-unit" placeholder="e.g., kg CO2e/kWh" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="factor-description">Description</Label>
                    <Input id="factor-description" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddFactorOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddFactorOpen(false)}>Add Factor</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Factors</TabsTrigger>
              <TabsTrigger value="scope1">Scope 1</TabsTrigger>
              <TabsTrigger value="scope2">Scope 2</TabsTrigger>
              <TabsTrigger value="scope3">Scope 3</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search factors..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Category</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked>Electricity</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Stationary Combustion</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Mobile Combustion</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Fugitive Emissions</DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>Pending</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <TabsContent value="all" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <span>Name</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <span>Category</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <span>Scope</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFactors.map((factor) => (
                    <TableRow key={factor.id}>
                      <TableCell className="font-medium">{factor.name}</TableCell>
                      <TableCell>{factor.category}</TableCell>
                      <TableCell>{factor.scope}</TableCell>
                      <TableCell>{factor.value}</TableCell>
                      <TableCell>{factor.unit}</TableCell>
                      <TableCell>{factor.source}</TableCell>
                      <TableCell>{factor.lastUpdated}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            factor.status === "active"
                              ? "default"
                              : factor.status === "pending"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {factor.status.charAt(0).toUpperCase() + factor.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit factor</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Deactivate factor</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

