"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Upload, Download, FileText } from "lucide-react"

// Define types for better type safety
type EmissionScope = "scope1" | "scope2" | "scope3"

interface Material {
  id: number
  name: string
  category: string
  unit: string
  factor: number
  source: string
}

interface MaterialsData {
  scope1: Material[]
  scope2: Material[]
  scope3: Material[]
}

// Mock data
const materials: MaterialsData = {
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
  ],
}

export default function MaterialLibrary() {
  const [activeScope, setActiveScope] = useState<EmissionScope>("scope1")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Emission Factors Library</CardTitle>
          <CardDescription>Configure emission factors for different materials and activities</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Sample CSV
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scope1" onValueChange={(value) => setActiveScope(value as EmissionScope)}>
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
                            <Button variant="ghost" size="icon">
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
  )
}

