"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Upload, Download, FileText, AlertCircle, X, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function MaterialLibrary() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeScope, setActiveScope] = useState("scope1")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [addDialogScope, setAddDialogScope] = useState("scope1")

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)

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

  // Mock data - in a real app, this would come from your API
  const materials = {
    scope1: [
      {
        id: 1,
        name: "Natural Gas",
        category: "Stationary Combustion",
        unit: "m³",
        factor: 2.02,
        source: "GHG Protocol",
      },
      { id: 2, name: "Diesel", category: "Mobile Combustion", unit: "L", factor: 2.68, source: "EPA" },
      { id: 3, name: "Gasoline", category: "Mobile Combustion", unit: "L", factor: 2.31, source: "EPA" },
      { id: 4, name: "Propane", category: "Stationary Combustion", unit: "L", factor: 1.51, source: "GHG Protocol" },
    ],
    scope2: [
      {
        id: 5,
        name: "Electricity (Grid Average)",
        category: "Purchased Electricity",
        unit: "kWh",
        factor: 0.42,
        source: "EPA eGRID",
      },
      {
        id: 6,
        name: "Electricity (Renewable)",
        category: "Purchased Electricity",
        unit: "kWh",
        factor: 0.0,
        source: "GHG Protocol",
      },
      { id: 7, name: "Steam", category: "Purchased Heat", unit: "kg", factor: 0.27, source: "GHG Protocol" },
    ],
    scope3: [
      {
        id: 8,
        name: "Business Travel - Flight (Short Haul)",
        category: "Business Travel",
        unit: "km",
        factor: 0.15,
        source: "DEFRA",
      },
      {
        id: 9,
        name: "Business Travel - Flight (Long Haul)",
        category: "Business Travel",
        unit: "km",
        factor: 0.11,
        source: "DEFRA",
      },
      {
        id: 10,
        name: "Employee Commuting - Car",
        category: "Employee Commuting",
        unit: "km",
        factor: 0.17,
        source: "EPA",
      },
      { id: 11, name: "Waste - Landfill", category: "Waste Disposal", unit: "kg", factor: 0.58, source: "EPA" },
      { id: 12, name: "Purchased Goods - Paper", category: "Purchased Goods", unit: "kg", factor: 0.94, source: "EPA" },
    ],
  }

  const handleEditMaterial = (material: any) => {
    setSelectedMaterial(material)
    setIsEditDialogOpen(true)
  }

  const handleSaveMaterial = () => {
    setIsEditDialogOpen(false)
    // In a real app, this would save the updated material data
  }

  /**
   * Handles file selection for CSV import
   * Updates the importFile state with the selected file
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
      setImportError(null)
    }
  }

  /**
   * Handles the CSV import process
   * 1. Validates the selected file
   * 2. Simulates the import process with progress
   * 3. Updates the material library with imported data
   *
   * TODO: Implement actual CSV parsing and validation
   */
  const handleImportCSV = async () => {
    if (!importFile) {
      setImportError("Please select a CSV file to import")
      return
    }

    // Validate file type
    if (!importFile.name.endsWith(".csv")) {
      setImportError("Please select a valid CSV file")
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportError(null)

    try {
      // Simulate import process with progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i)
        // Add delay to simulate processing
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // TODO: Implement actual CSV parsing and data import
      // Example implementation:
      // 1. Read the file contents
      // const fileContent = await importFile.text()
      //
      // 2. Parse CSV data
      // const parsedData = parseCSV(fileContent)
      //
      // 3. Validate the data structure
      // const validationResult = validateCSVStructure(parsedData)
      // if (!validationResult.isValid) {
      //   throw new Error(validationResult.error)
      // }
      //
      // 4. Import the data to your state or API
      // await importMaterialsToAPI(parsedData)

      // Show success message
      setImportSuccess(true)

      // Reset after 3 seconds
      setTimeout(() => {
        setIsImportDialogOpen(false)
        setImportFile(null)
        setImportSuccess(false)
        // TODO: Refresh material library data after import
      }, 3000)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Failed to import CSV file")
    } finally {
      setIsImporting(false)
    }
  }

  /**
   * Exports the current material library to a CSV file
   *
   * TODO: Implement actual CSV generation and download
   */
  const handleExportCSV = () => {
    // TODO: Implement actual CSV export
    // Example implementation:
    // 1. Convert materials data to CSV format
    // const csvContent = convertToCSV(materials[activeScope])
    //
    // 2. Create a Blob with the CSV content
    // const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    //
    // 3. Create a download link and trigger download
    // const link = document.createElement('a')
    // const url = URL.createObjectURL(blob)
    // link.setAttribute('href', url)
    // link.setAttribute('download', `carbonly-materials-${activeScope}-${new Date().toISOString().split('T')[0]}.csv`)
    // link.style.visibility = 'hidden'
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)

    // For demo purposes, just show an alert
    alert(`Exporting ${activeScope} materials to CSV...`)
  }

  /**
   * Downloads a sample CSV template for material import
   *
   * TODO: Implement actual sample CSV generation
   */
  const handleDownloadSampleCSV = () => {
    // TODO: Implement actual sample CSV generation and download
    // Example implementation:
    // 1. Create sample CSV content based on the material structure
    // const sampleCSV = createSampleCSV(activeScope)
    //
    // 2. Create a Blob with the CSV content
    // const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' })
    //
    // 3. Create a download link and trigger download
    // const link = document.createElement('a')
    // const url = URL.createObjectURL(blob)
    // link.setAttribute('href', url)
    // link.setAttribute('download', `carbonly-materials-sample-${activeScope}.csv`)
    // link.style.visibility = 'hidden'
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)

    // For demo purposes, just show an alert
    alert(`Downloading sample CSV template for ${activeScope} materials...`)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Emission Factors Library</CardTitle>
            <CardDescription>Configure emission factors for different materials and activities</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDownloadSampleCSV} className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Sample CSV
            </Button>
            <Button variant="outline" onClick={handleExportCSV} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Materials from CSV</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file to import materials into your library.
                    <Button variant="link" className="p-0 h-auto text-sm" onClick={handleDownloadSampleCSV}>
                      Download a sample CSV
                    </Button>{" "}
                    to see the required format.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {importSuccess ? (
                    <div className="text-center py-4">
                      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Import Successful</h3>
                      <p className="text-gray-600">Your materials have been successfully imported.</p>
                    </div>
                  ) : (
                    <>
                      {importError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{importError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
                        <p className="text-gray-500 mb-4">
                          The CSV file should include name, category, unit, factor, and source columns
                        </p>
                        <div className="flex justify-center">
                          <Input
                            type="file"
                            id="csv-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".csv"
                          />
                          <Label htmlFor="csv-upload" asChild>
                            <Button variant="outline">Browse Files</Button>
                          </Label>
                        </div>
                      </div>

                      {importFile && (
                        <div className="flex items-center p-3 rounded-lg border border-gray-200">
                          <FileText className="h-5 w-5 text-gray-500 mr-3" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{importFile.name}</p>
                            <p className="text-xs text-gray-500">{(importFile.size / 1024).toFixed(2)} KB</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setImportFile(null)} className="h-8 w-8">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {isImporting && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Importing...</span>
                            <span className="text-sm text-gray-500">{importProgress}%</span>
                          </div>
                          <Progress value={importProgress} className="h-2" />
                        </div>
                      )}
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleImportCSV}
                    disabled={!importFile || isImporting || importSuccess}
                  >
                    {isImporting ? "Importing..." : "Import Materials"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Material</DialogTitle>
                  <DialogDescription>Add a new material or activity with its emission factor</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" placeholder="Material name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="scope" className="text-right">
                      Scope
                    </Label>
                    <Select onValueChange={(value) => setAddDialogScope(value)}>
                      <SelectTrigger id="scope" className="col-span-3">
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scope1">Scope 1: Direct Emissions</SelectItem>
                        <SelectItem value="scope2">Scope 2: Indirect Energy Emissions</SelectItem>
                        <SelectItem value="scope3">Scope 3: Value Chain Emissions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger id="category" className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {scopeCategories[addDialogScope as keyof typeof scopeCategories].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit" className="text-right">
                      Unit
                    </Label>
                    <Input id="unit" placeholder="Unit of measurement" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="factor" className="text-right">
                      Emission Factor
                    </Label>
                    <Input id="factor" type="number" step="0.01" placeholder="0.00" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="source" className="text-right">
                      Source
                    </Label>
                    <Input id="source" placeholder="Data source" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsAddDialogOpen(false)}>
                    Add Material
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scope1" onValueChange={setActiveScope}>
            <TabsList className="mb-6">
              <TabsTrigger value="scope1">Scope 1</TabsTrigger>
              <TabsTrigger value="scope2">Scope 2</TabsTrigger>
              <TabsTrigger value="scope3">Scope 3</TabsTrigger>
            </TabsList>

            {(["scope1", "scope2", "scope3"] as const).map((scope) => (
              <TabsContent key={scope} value={scope}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Emission Factor (kgCO₂e)</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials[scope].map((material) => (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">{material.name}</TableCell>
                          <TableCell>{material.category}</TableCell>
                          <TableCell>{material.unit}</TableCell>
                          <TableCell className="text-right">{material.factor.toFixed(2)}</TableCell>
                          <TableCell>{material.source}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditMaterial(material)}>
                                <Pencil className="h-4 w-4" />
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
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription>Update emission factor details for this material</DialogDescription>
          </DialogHeader>
          {selectedMaterial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input id="edit-name" defaultValue={selectedMaterial.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <Select defaultValue={selectedMaterial.category}>
                  <SelectTrigger id="edit-category" className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {scopeCategories[activeScope as keyof typeof scopeCategories].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-unit" className="text-right">
                  Unit
                </Label>
                <Input id="edit-unit" defaultValue={selectedMaterial.unit} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-factor" className="text-right">
                  Emission Factor
                </Label>
                <Input
                  id="edit-factor"
                  type="number"
                  step="0.01"
                  defaultValue={selectedMaterial.factor}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-source" className="text-right">
                  Source
                </Label>
                <Input id="edit-source" defaultValue={selectedMaterial.source} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveMaterial}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

