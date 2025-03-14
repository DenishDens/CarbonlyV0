"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface ColumnMapperProps {
  columns: string[]
  mappings: Record<string, string>
  onChange: (mappings: Record<string, string>) => void
}

export function ColumnMapper({ columns, mappings, onChange }: ColumnMapperProps) {
  const [localMappings, setLocalMappings] = useState<Record<string, string>>(mappings)

  // Standard field options
  const standardFields = [
    { value: "material", label: "Material Name" },
    { value: "description", label: "Description" },
    { value: "category", label: "Category" },
    { value: "quantity", label: "Quantity" },
    { value: "unit", label: "Unit of Measure" },
    { value: "date", label: "Date" },
    { value: "supplier", label: "Supplier" },
    { value: "cost", label: "Cost" },
    { value: "notes", label: "Notes" },
  ]

  useEffect(() => {
    // Auto-map columns based on name similarity
    const autoMappings: Record<string, string> = {}

    columns.forEach((column) => {
      const normalizedColumn = column.toLowerCase().trim()

      // Try to find a matching standard field
      for (const field of standardFields) {
        if (
          normalizedColumn === field.value ||
          normalizedColumn === field.label.toLowerCase() ||
          normalizedColumn.includes(field.value) ||
          field.value.includes(normalizedColumn)
        ) {
          autoMappings[column] = field.value
          break
        }
      }

      // Special cases
      if (!autoMappings[column]) {
        if (
          normalizedColumn.includes("uom") ||
          normalizedColumn.includes("unit") ||
          normalizedColumn.includes("measure")
        ) {
          autoMappings[column] = "unit"
        } else if (
          normalizedColumn.includes("qty") ||
          normalizedColumn.includes("amount") ||
          normalizedColumn.includes("volume")
        ) {
          autoMappings[column] = "quantity"
        }
      }
    })

    // Only set auto-mappings if we don't have existing mappings
    if (Object.keys(mappings).length === 0) {
      setLocalMappings(autoMappings)
      onChange(autoMappings)
    }
  }, [columns, standardFields, mappings, onChange])

  const handleMappingChange = (column: string, value: string) => {
    const newMappings = { ...localMappings }

    if (value === "") {
      delete newMappings[column]
    } else {
      newMappings[column] = value
    }

    setLocalMappings(newMappings)
    onChange(newMappings)
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Map Columns</h3>
      <p className="text-sm text-muted-foreground mb-4">Map your file columns to standard fields for processing</p>

      <div className="space-y-4">
        {columns.map((column) => (
          <div key={column} className="grid grid-cols-2 gap-4 items-center">
            <div>
              <Label className="text-sm font-medium">{column}</Label>
            </div>
            <div>
              <Select value={localMappings[column] || ""} onValueChange={(value) => handleMappingChange(column, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ignore">Ignore this column</SelectItem>
                  <Separator className="my-1" />
                  {standardFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

