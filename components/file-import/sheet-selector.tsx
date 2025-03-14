"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet } from "lucide-react"

interface SheetSelectorProps {
  sheets: string[]
  selectedSheet: string | null
  onSelect: (sheet: string) => void
}

export function SheetSelector({ sheets, selectedSheet, onSelect }: SheetSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Select a Sheet</h3>
      <p className="text-sm text-muted-foreground mb-6">
        This Excel file contains multiple sheets. Please select which one you want to import.
      </p>

      <RadioGroup value={selectedSheet || ""} onValueChange={onSelect} className="space-y-3">
        {sheets.map((sheet) => (
          <div key={sheet} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
            <RadioGroupItem value={sheet} id={`sheet-${sheet}`} />
            <Label htmlFor={`sheet-${sheet}`} className="flex items-center gap-2 cursor-pointer">
              <FileSpreadsheet className="h-4 w-4" />
              {sheet}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

