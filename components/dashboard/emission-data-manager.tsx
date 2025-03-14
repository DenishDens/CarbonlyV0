"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Upload,
  FileText,
  FileSpreadsheet,
  FileIcon as FilePdf,
  FileImage,
  AlertCircle,
  Plus,
  Filter,
  Search,
  CalendarIcon,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  X,
  Eye,
} from "lucide-react"
import { format } from "date-fns"

export default function EmissionDataManager() {
  const [activeTab, setActiveTab] = useState<"view" | "upload" | "manual">("view")
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [date, setDate] = useState<Date>()
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedScope, setSelectedScope] = useState<string | null>(null)

  // Define categories for each scope based on GHG Protocol
  const scopeCategories = {
    scope1: ["Stationary Combustion", "Mobile Combustion", "Process Emissions", "Fugitive Emissions"],
    scope2: ["Purchased Electricity", "Purchased Steam", "Purchased Heat", "Purchased Cooling"],
    scope3: [
      // Upstream (Supply Chain) Emissions
      "Purchased Goods & Services",
      "Capital Goods",
      "Fuel & Energy-Related Activities",
      "Upstream Transportation & Distribution",
      "Waste Generated in Operations",
      "Business Travel",
      "Employee Commuting",
      "Leased Assets (Upstream)",
      // Downstream (Customer & Product Use) Emissions
      "Downstream Transportation & Distribution",
      "Processing of Sold Products",
      "Use of Sold Products",
      "End-of-Life Treatment of Sold Products",
      "Leased Assets (Downstream)",
      "Franchises",
      "Investments",
    ],
  }

  // Mock data for material library
  const materialLibrary = [
    {
      id: 1,
      name: "Electricity (Grid Average)",
      category: "Purchased Electricity",
      scope: "scope2",
      unit: "kWh",
      factor: 0.42,
    },
    { id: 2, name: "Natural Gas", category: "Stationary Combustion", scope: "scope1", unit: "m³", factor: 2.02 },
    { id: 3, name: "Diesel", category: "Mobile Combustion", scope: "scope1", unit: "L", factor: 2.31 },
    { id: 4, name: "Gasoline", category: "Mobile Combustion", scope: "scope1", unit: "L", factor: 2.68 },
    {
      id: 5,
      name: "Business Travel - Flight (Short Haul)",
      category: "Business Travel",
      scope: "scope3",
      unit: "km",
      factor: 0.15,
    },
    {
      id: 6,
      name: "Business Travel - Flight (Long Haul)",
      category: "Business Travel",
      scope: "scope3",
      unit: "km",
      factor: 0.11,
    },
    {
      id: 7,
      name: "Employee Commuting - Car",
      category: "Employee Commuting",
      scope: "scope3",
      unit: "km",
      factor: 0.17,
    },
    {
      id: 8,
      name: "Waste - Landfill",
      category: "Waste Generated in Operations",
      scope: "scope3",
      unit: "kg",
      factor: 0.58,
    },
    {
      id: 9,
      name: "Purchased Goods - Paper",
      category: "Purchased Goods & Services",
      scope: "scope3",
      unit: "kg",
      factor: 0.94,
    },
    {
      id: 10,
      name: "Refrigerant Leakage - R410A",
      category: "Fugitive Emissions",
      scope: "scope1",
      unit: "kg",
      factor: 2088,
    },
    { id: 11, name: "District Heating", category: "Purchased Heat", scope: "scope2", unit: "kWh", factor: 0.27 },
    { id: 12, name: "Purchased Cooling", category: "Purchased Cooling", scope: "scope2", unit: "kWh", factor: 0.19 },
    { id: 13, name: "Cement Production", category: "Process Emissions", scope: "scope1", unit: "ton", factor: 520 },
  ]

  // Mock emission records data
  const emissionRecords = [
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleUpload = () => {
    if (files.length === 0) {
      setUploadError("Please select at least one file to upload")
      return
    }

    setUploading(true)
    setUploadError(null)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          // Show preview after upload completes
          setShowPreview(true)
          // Generate mock preview data
          setPreviewData([
            {
              date: "2023-04-20",
              category: "Electricity",
              source: "Office Building",
              quantity: 1300,
              unit: "kWh",
              emissionFactor: 0.42,
              emissions: 546,
              confidence: 0.95,
              status: "pending",
            },
            {
              date: "2023-04-20",
              category: "Natural Gas",
              source: "Office Heating",
              quantity: 250,
              unit: "m³",
              emissionFactor: 2.02,
              emissions: 505,
              confidence: 0.88,
              status: "pending",
            },
            {
              date: "2023-04-20",
              category: "Water",
              source: "Office Building",
              quantity: 45,
              unit: "m³",
              emissionFactor: 0.34,
              emissions: 15.3,
              confidence: 0.75,
              status: "pending",
            },
          ])
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleConfirmImport = () => {
    // In a real app, this would send the confirmed data to your backend
    setShowPreview(false)
    setUploadComplete(true)
  }

  const handleAddRecord = () => {
    // In a real app, this would add a new record to your database
    setIsAddDialogOpen(false)
  }

  const handleEditRecord = (record: any) => {
    setSelectedRecord(record)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    // In a real app, this would update the record in your database
    setIsEditDialogOpen(false)
  }

  const handleDeleteRecord = (id: number) => {
    // In a real app, this would delete the record from your database
    console.log(`Delete record ${id}`)
  }

  const getFileIcon = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FilePdf className="h-8 w-8 text-red-500" />
      case "xlsx":
      case "xls":
      case "csv":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileImage className="h-8 w-8 text-blue-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-500" />
    }
  }

  const resetUpload = () => {
    setFiles([])
    setUploadProgress(0)
    setUploadComplete(false)
    setUploadError(null)
    setShowPreview(false)
  }

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

        <div className="flex gap-2">
          {activeTab === "view" && (
            <>
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter Emission Data</h4>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="fuel">Fuel</SelectItem>
                          <SelectItem value="travel">Business Travel</SelectItem>
                          <SelectItem value="waste">Waste</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>From date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>To date</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setFilterOpen(false)}>
                        Reset
                      </Button>
                      <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search emissions..." className="w-[200px] pl-8" />
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Emission Record</DialogTitle>
                    <DialogDescription>
                      Create a new emission record using data from the material library
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="record-date" className="text-right">
                        Date
                      </Label>
                      <Input id="record-date" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="record-material" className="text-right">
                        Material
                      </Label>
                      <Select>
                        <SelectTrigger id="record-material" className="col-span-3">
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialLibrary.map((material) => (
                            <SelectItem key={material.id} value={material.id.toString()}>
                              {material.name} ({material.unit})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="record-source" className="text-right">
                        Source
                      </Label>
                      <Input id="record-source" placeholder="e.g., Office Building" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="record-quantity" className="text-right">
                        Quantity
                      </Label>
                      <Input id="record-quantity" type="number" placeholder="0.00" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="record-notes" className="text-right pt-2">
                        Notes
                      </Label>
                      <Textarea
                        id="record-notes"
                        placeholder="Additional information"
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddRecord}>
                      Add Record
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </>
          )}
        </div>
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
                          <Button variant="ghost" size="icon" onClick={() => handleEditRecord(record)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRecord(record.id)}>
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

        {/* Edit Record Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Emission Record</DialogTitle>
              <DialogDescription>Update the details of this emission record</DialogDescription>
            </DialogHeader>
            {selectedRecord && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-date" className="text-right">
                    Date
                  </Label>
                  <Input id="edit-date" type="date" defaultValue={selectedRecord.date} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-material" className="text-right">
                    Material
                  </Label>
                  <Select defaultValue={selectedRecord.materialId?.toString()}>
                    <SelectTrigger id="edit-material" className="col-span-3">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialLibrary.map((material) => (
                        <SelectItem key={material.id} value={material.id.toString()}>
                          {material.name} ({material.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Category
                  </Label>
                  <Input id="edit-category" defaultValue={selectedRecord.category} className="col-span-3" readOnly />
                  <p className="text-xs text-gray-500 col-span-3 -mt-1">Auto-populated from selected material</p>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-source" className="text-right">
                    Source
                  </Label>
                  <Input id="edit-source" defaultValue={selectedRecord.source} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-data-source" className="text-right">
                    Data Source
                  </Label>
                  <Select defaultValue={selectedRecord.dataSource || "manual"}>
                    <SelectTrigger id="edit-data-source" className="col-span-3">
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Entry</SelectItem>
                      <SelectItem value="import">File Import</SelectItem>
                      <SelectItem value="integration">Third-party Integration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    defaultValue={selectedRecord.quantity}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-unit" className="text-right">
                    Unit
                  </Label>
                  <Input id="edit-unit" defaultValue={selectedRecord.unit} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-factor" className="text-right">
                    Factor
                  </Label>
                  <Input
                    id="edit-factor"
                    type="number"
                    step="0.01"
                    defaultValue={selectedRecord.emissionFactor}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-notes" className="text-right pt-2">
                    Notes
                  </Label>
                  <Textarea id="edit-notes" defaultValue={selectedRecord.notes} className="col-span-3" rows={3} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select defaultValue={selectedRecord.status}>
                    <SelectTrigger id="edit-status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>

      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload Emission Data</CardTitle>
            <CardDescription>Upload files to automatically extract and analyze carbon emissions</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadComplete ? (
              <div className="text-center py-8">
                <div className="bg-green-100 text-green-800 rounded-full p-4 inline-flex mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Your files have been uploaded and the data has been imported. You can now view and manage the data in
                  the View Data tab.
                </p>
                <Button onClick={resetUpload}>Upload More Files</Button>
              </div>
            ) : showPreview ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Data Preview</h3>
                  <p className="text-sm text-gray-500">Review the extracted data before importing</p>
                </div>

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
                        <TableHead className="text-right">Confidence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.category}</TableCell>
                          <TableCell>{record.source}</TableCell>
                          <TableCell className="text-right">{record.quantity.toLocaleString()}</TableCell>
                          <TableCell>{record.unit}</TableCell>
                          <TableCell className="text-right">{record.emissionFactor}</TableCell>
                          <TableCell className="text-right font-medium">{record.emissions.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`${
                                record.confidence > 0.9
                                  ? "text-green-600"
                                  : record.confidence > 0.7
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {Math.round(record.confidence * 100)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Our AI has analyzed your file and extracted the data above. Please review before importing.
                    </p>
                    <div className="flex items-center gap-2">
                      <Checkbox id="verify-data" />
                      <Label htmlFor="verify-data">I've verified this data is correct</Label>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleConfirmImport}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Import
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {uploadError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
                    dragging ? "border-green-500 bg-green-50" : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drag and drop files here</h3>
                  <p className="text-gray-500 mb-4">
                    Support for PDF, Excel, CSV, and image files of invoices, utility bills, and reports
                  </p>
                  <div className="flex justify-center">
                    <Input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
                    />
                    <Label htmlFor="file-upload" asChild>
                      <Button variant="outline">Browse Files</Button>
                    </Label>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center p-3 rounded-lg border border-gray-200">
                          {getFileIcon(file)}
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Uploading and analyzing...</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleUpload}
                    disabled={files.length === 0 || uploading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {uploading ? "Processing..." : "Upload and Analyze"}
                  </Button>
                </div>
              </>
            )}
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
                  <Label htmlFor="emission-scope">Emission Scope</Label>
                  <Select onValueChange={(value) => setSelectedScope(value)}>
                    <SelectTrigger id="emission-scope">
                      <SelectValue placeholder="Select emission scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scope1">Scope 1: Direct Emissions</SelectItem>
                      <SelectItem value="scope2">Scope 2: Indirect Energy Emissions</SelectItem>
                      <SelectItem value="scope3">Scope 3: Value Chain Emissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emission-category">Emission Category</Label>
                  <Select>
                    <SelectTrigger id="emission-category">
                      <SelectValue placeholder="Select emission category" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedScope &&
                        scopeCategories[selectedScope as keyof typeof scopeCategories].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input type="date" id="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input id="source" placeholder="e.g., Office Building" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input type="number" id="quantity" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emission-factor">Emission Factor</Label>
                  <div className="flex items-center space-x-2">
                    <Input type="number" id="emission-factor" placeholder="0.00" readOnly />
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Auto-populated from material library</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional information" rows={3} />
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

