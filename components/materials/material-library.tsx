"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, Edit, Trash2, CheckCircle, AlertTriangle, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample material data
const initialMaterials = [
  {
    id: "m1",
    name: "Aluminum",
    category: "Metal",
    emissionFactor: 8.14,
    unit: "kg CO2e/kg",
    source: "EPA",
    verified: true,
    lastUpdated: "2023-05-15",
  },
  {
    id: "m2",
    name: "Steel (Recycled)",
    category: "Metal",
    emissionFactor: 1.46,
    unit: "kg CO2e/kg",
    source: "EPA",
    verified: true,
    lastUpdated: "2023-05-15",
  },
  {
    id: "m3",
    name: "Concrete",
    category: "Construction",
    emissionFactor: 0.11,
    unit: "kg CO2e/kg",
    source: "EPA",
    verified: true,
    lastUpdated: "2023-05-15",
  },
  {
    id: "m4",
    name: "Cotton",
    category: "Textile",
    emissionFactor: 5.89,
    unit: "kg CO2e/kg",
    source: "Industry Average",
    verified: false,
    lastUpdated: "2023-04-10",
  },
  {
    id: "m5",
    name: "Polyester",
    category: "Textile",
    emissionFactor: 6.45,
    unit: "kg CO2e/kg",
    source: "Industry Average",
    verified: false,
    lastUpdated: "2023-04-10",
  },
  {
    id: "m6",
    name: "Glass",
    category: "Construction",
    emissionFactor: 0.85,
    unit: "kg CO2e/kg",
    source: "EPA",
    verified: true,
    lastUpdated: "2023-05-15",
  },
  {
    id: "m7",
    name: "Plastic (PET)",
    category: "Plastic",
    emissionFactor: 2.73,
    unit: "kg CO2e/kg",
    source: "EPA",
    verified: true,
    lastUpdated: "2023-05-15",
  },
  {
    id: "m8",
    name: "Plastic (HDPE)",
    category: "Plastic",
    emissionFactor: 1.93,
    unit: "kg CO2e/kg",
    source: "EPA",
    verified: true,
    lastUpdated: "2023-05-15",
  },
  {
    id: "m9",
    name: "Paper",
    category: "Paper",
    emissionFactor: 1.09,
    unit: "kg CO2e/kg",
    source: "Industry Average",
    verified: false,
    lastUpdated: "2023-04-10",
  },
  {
    id: "m10",
    name: "Cardboard",
    category: "Paper",
    emissionFactor: 0.98,
    unit: "kg CO2e/kg",
    source: "Industry Average",
    verified: false,
    lastUpdated: "2023-04-10",
  },
]

// Material categories
const categories = ["All", "Metal", "Construction", "Textile", "Plastic", "Paper", "Other"]

// Units
const units = ["kg CO2e/kg", "kg CO2e/L", "kg CO2e/m²", "kg CO2e/m³", "kg CO2e/kWh", "kg CO2e/unit"]

// Sources
const sources = ["EPA", "Industry Average", "Custom", "Supplier Data", "Third-party Verified"]

interface Material {
  id: string
  name: string
  category: string
  emissionFactor: number
  unit: string
  source: string
  verified: boolean
  lastUpdated: string
}

interface MaterialFormData {
  name: string
  category: string
  emissionFactor: string
  unit: string
  source: string
  verified: boolean
}

export function MaterialLibrary() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<MaterialFormData>({
    name: "",
    category: "Metal",
    emissionFactor: "",
    unit: "kg CO2e/kg",
    source: "EPA",
    verified: false,
  })

  // Filter materials based on search query and selected category
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || material.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleInputChange = (field: keyof MaterialFormData, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleAddMaterial = () => {
    if (!formData.name || !formData.emissionFactor) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const emissionFactor = Number.parseFloat(formData.emissionFactor)
    if (isNaN(emissionFactor)) {
      toast({
        title: "Validation Error",
        description: "Emission factor must be a valid number.",
        variant: "destructive",
      })
      return
    }

    const newMaterial: Material = {
      id: `m${materials.length + 1}`,
      name: formData.name,
      category: formData.category,
      emissionFactor: emissionFactor,
      unit: formData.unit,
      source: formData.source,
      verified: formData.verified,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    if (editingMaterial) {
      // Update existing material
      setMaterials(materials.map((m) => (m.id === editingMaterial.id ? { ...newMaterial, id: editingMaterial.id } : m)))
      toast({
        title: "Material Updated",
        description: `${newMaterial.name} has been updated successfully.`,
      })
    } else {
      // Add new material
      setMaterials([...materials, newMaterial])
      toast({
        title: "Material Added",
        description: `${newMaterial.name} has been added to your library.`,
      })
    }

    // Reset form and close dialog
    setFormData({
      name: "",
      category: "Metal",
      emissionFactor: "",
      unit: "kg CO2e/kg",
      source: "EPA",
      verified: false,
    })
    setEditingMaterial(null)
    setShowAddDialog(false)
  }

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material)
    setFormData({
      name: material.name,
      category: material.category,
      emissionFactor: material.emissionFactor.toString(),
      unit: material.unit,
      source: material.source,
      verified: material.verified,
    })
    setShowAddDialog(true)
  }

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
    toast({
      title: "Material Deleted",
      description: "The material has been removed from your library.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditingMaterial(null)
            setFormData({
              name: "",
              category: "Metal",
              emissionFactor: "",
              unit: "kg CO2e/kg",
              source: "EPA",
              verified: false,
            })
            setShowAddDialog(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </div>

      <Tabs defaultValue="All" onValueChange={setSelectedCategory}>
        <div className="flex items-center justify-between">
          <TabsList className="overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center text-sm text-muted-foreground">
            <Filter className="mr-1 h-4 w-4" />
            {filteredMaterials.length} materials
          </div>
        </div>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle>{category === "All" ? "All Materials" : `${category} Materials`}</CardTitle>
                <CardDescription>
                  {category === "All"
                    ? "View and manage all materials in your library"
                    : `View and manage ${category.toLowerCase()} materials in your library`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Emission Factor</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaterials.length > 0 ? (
                        filteredMaterials.map((material) => (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium">{material.name}</TableCell>
                            <TableCell>{material.category}</TableCell>
                            <TableCell className="text-right">{material.emissionFactor}</TableCell>
                            <TableCell>{material.unit}</TableCell>
                            <TableCell>{material.source}</TableCell>
                            <TableCell>
                              {material.verified ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-amber-200 text-amber-800">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Unverified
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{material.lastUpdated}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditMaterial(material)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteMaterial(material.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No materials found. Try adjusting your search or add a new material.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingMaterial ? "Edit Material" : "Add New Material"}</DialogTitle>
            <DialogDescription>
              {editingMaterial
                ? "Update the details of this material in your library."
                : "Add a new material to your library with its emission factor."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category*
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c !== "All")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emissionFactor" className="text-right">
                Emission Factor*
              </Label>
              <Input
                id="emissionFactor"
                type="number"
                step="0.01"
                value={formData.emissionFactor}
                onChange={(e) => handleInputChange("emissionFactor", e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unit*
              </Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source*
              </Label>
              <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="verified" className="text-right">
                Verified
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => handleInputChange("verified", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="verified" className="text-sm font-normal">
                  This material's emission factor is verified by a trusted source
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMaterial}>{editingMaterial ? "Update Material" : "Add Material"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

