"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, X } from "lucide-react"

// Sample material data - in a real app, this would come from your Material Library API
const sampleMaterials = [
  {
    id: "m1",
    name: "Aluminum",
    category: "Metal",
    emissionFactor: 8.14,
    unit: "kg CO2e/kg",
  },
  {
    id: "m2",
    name: "Steel (Recycled)",
    category: "Metal",
    emissionFactor: 1.46,
    unit: "kg CO2e/kg",
  },
  {
    id: "m3",
    name: "Concrete",
    category: "Construction",
    emissionFactor: 0.11,
    unit: "kg CO2e/kg",
  },
  {
    id: "m4",
    name: "Cotton",
    category: "Textile",
    emissionFactor: 5.89,
    unit: "kg CO2e/kg",
  },
  {
    id: "m5",
    name: "Polyester",
    category: "Textile",
    emissionFactor: 6.45,
    unit: "kg CO2e/kg",
  },
]

// Activity types
const activityTypes = [
  "Transportation",
  "Electricity",
  "Heating",
  "Manufacturing",
  "Material Usage",
  "Waste Management",
  "Other",
]

// Emission sources
const emissionSources = ["Scope 1 - Direct", "Scope 2 - Indirect", "Scope 3 - Value Chain"]

export function ManualEntryForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [materials, setMaterials] = useState(sampleMaterials)
  const [selectedMaterial, setSelectedMaterial] = useState<string>("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    date: new Date(),
    activity: "",
    material: "",
    quantity: "",
    unit: "kg",
    source: "",
    notes: "",
  })

  // Calculate emission value based on material and quantity
  const [calculatedEmission, setCalculatedEmission] = useState<number | null>(null)

  useEffect(() => {
    if (selectedMaterial && formData.quantity) {
      const material = materials.find((m) => m.id === selectedMaterial)
      if (material) {
        const quantity = Number.parseFloat(formData.quantity)
        if (!isNaN(quantity)) {
          setCalculatedEmission(material.emissionFactor * quantity)
        }
      }
    } else {
      setCalculatedEmission(null)
    }
  }, [selectedMaterial, formData.quantity, materials])

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleMaterialChange = (materialId: string) => {
    setSelectedMaterial(materialId)
    const material = materials.find((m) => m.id === materialId)
    if (material) {
      setFormData({
        ...formData,
        material: material.name,
        unit: material.unit.split("/")[1] || "kg", // Extract the denominator unit
      })
    }
  }

  const handleSubmit = async () => {
    if (!formData.activity || !selectedMaterial || !formData.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const material = materials.find((m) => m.id === selectedMaterial)

      // In a real app, you would save this data to your database
      const emissionRecord = {
        date: formData.date,
        activity: formData.activity,
        material: formData.material,
        quantity: Number.parseFloat(formData.quantity),
        unit: formData.unit,
        emissionFactor: material?.emissionFactor || 0,
        emissionValue: calculatedEmission || 0,
        emissionUnit: material?.unit.split("/")[0] || "kg CO2e",
        source: formData.source,
        notes: formData.notes,
        createdAt: new Date(),
      }

      console.log("Emission record saved:", emissionRecord)

      toast({
        title: "Success",
        description: "Emission data has been saved successfully.",
      })

      // Reset form
      setFormData({
        date: new Date(),
        activity: "",
        material: "",
        quantity: "",
        unit: "kg",
        source: "",
        notes: "",
      })
      setSelectedMaterial("")
      setCalculatedEmission(null)
    } catch (error) {
      console.error("Error saving emission data:", error)
      toast({
        title: "Error",
        description: "Failed to save emission data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form
    setFormData({
      date: new Date(),
      activity: "",
      material: "",
      quantity: "",
      unit: "kg",
      source: "",
      notes: "",
    })
    setSelectedMaterial("")
    setCalculatedEmission(null)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manual Emission Data Entry</CardTitle>
        <CardDescription>Enter emission data manually by selecting materials from your library.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date*</Label>
              <DatePicker date={formData.date} setDate={(date) => handleInputChange("date", date)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Type*</Label>
              <Select value={formData.activity} onValueChange={(value) => handleInputChange("activity", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((activity) => (
                    <SelectItem key={activity} value={activity}>
                      {activity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="material">Material*</Label>
            <Select value={selectedMaterial} onValueChange={handleMaterialChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select material from library" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} ({material.category}) - {material.emissionFactor} {material.unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity*</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                placeholder="Unit of measurement"
              />
            </div>
          </div>

          {calculatedEmission !== null && (
            <div className="p-4 bg-muted rounded-md">
              <div className="font-semibold">Calculated Emission:</div>
              <div className="text-2xl font-bold text-green-600">
                {calculatedEmission.toFixed(2)}{" "}
                {materials.find((m) => m.id === selectedMaterial)?.unit.split("/")[0] || "kg CO2e"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Based on the selected material's emission factor and quantity
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="source">Emission Source</Label>
            <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select emission source" />
              </SelectTrigger>
              <SelectContent>
                {emissionSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional information about this emission data"
              rows={3}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Emission Data
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

