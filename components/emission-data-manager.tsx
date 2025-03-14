"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Download, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

type EmissionRecord = {
  id: number
  date: string
  category: string
  source: string
  quantity: number
  unit: string
  emissionFactor: number
  emissions: number
  status: "verified" | "pending" | "error"
}

// Mock emission records data
const emissionRecords: EmissionRecord[] = [
  {
    id: 1,
    date: "2023-01-15",
    category: "Electricity",
    source: "Office Building",
    quantity: 1500,
    unit: "kWh",
    emissionFactor: 0.42,
    emissions: 630,
    status: "verified",
  },
  {
    id: 2,
    date: "2023-01-20",
    category: "Natural Gas",
    source: "Office Heating",
    quantity: 300,
    unit: "m³",
    emissionFactor: 2.02,
    emissions: 606,
    status: "verified",
  },
  {
    id: 3,
    date: "2023-02-01",
    category: "Business Travel",
    source: "Flight to Conference",
    quantity: 2000,
    unit: "km",
    emissionFactor: 0.15,
    emissions: 300,
    status: "pending",
  },
  {
    id: 4,
    date: "2023-02-10",
    category: "Waste",
    source: "General Waste",
    quantity: 500,
    unit: "kg",
    emissionFactor: 0.58,
    emissions: 290,
    status: "error",
  },
  {
    id: 5,
    date: "2023-03-01",
    category: "Purchased Goods",
    source: "Office Supplies",
    quantity: 100,
    unit: "kg",
    emissionFactor: 0.94,
    emissions: 94,
    status: "verified",
  },
]

export default function EmissionDataManager() {
  const [activeTab, setActiveTab] = useState<"view" | "upload" | "manual">("view")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Tabs defaultValue="view" onValueChange={(value) => setActiveTab(value as "view" | "upload" | "manual")}>
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="view">View Data</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        {activeTab === "view" && (
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search..." className="w-[200px] pl-8" />
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      <TabsContent value="view">
        <Card>
          <CardHeader>
            <CardTitle>Emission Records</CardTitle>
            <CardDescription>View and manage your carbon emission data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="w-[80px]">Unit</TableHead>
                    <TableHead className="text-right">Factor</TableHead>
                    <TableHead className="text-right">Emissions (kgCO₂e)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emissionRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.category}</TableCell>
                      <TableCell>{record.source}</TableCell>
                      <TableCell className="text-right">{record.quantity.toLocaleString()}</TableCell>
                      <TableCell>{record.unit}</TableCell>
                      <TableCell className="text-right">{record.emissionFactor}</TableCell>
                      <TableCell className="text-right font-medium">{record.emissions.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload Emission Data</CardTitle>
            <CardDescription>Upload files to automatically extract and analyze carbon emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p>Drag and drop your emission data files here or click to browse</p>
              <Button variant="outline" className="mt-4">
                Browse Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="manual">
        <Card>
          <CardHeader>
            <CardTitle>Manual Data Entry</CardTitle>
            <CardDescription>Manually enter emission data using the material library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Material</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Select a material</option>
                    <option>Electricity (Grid Average)</option>
                    <option>Natural Gas</option>
                    <option>Diesel</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source</label>
                  <Input placeholder="e.g., Office Building" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">Save Entry</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

