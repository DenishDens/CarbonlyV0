/**
 * Material Library Service
 *
 * This service handles API interactions for the Material Library,
 * including importing and exporting materials.
 */

import { parseCSV, validateCSVStructure } from "@/utils/csv-templates"

/**
 * Imports materials from a CSV file
 * @param file The CSV file to import
 * @param scope The emission scope (scope1, scope2, scope3)
 * @returns Promise that resolves when import is complete
 */
export async function importMaterialsFromCSV(
  file: File,
  scope: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    // Read the file content
    const fileContent = await file.text()

    // Parse the CSV data
    const parsedData = parseCSV(fileContent)

    // Validate the data structure
    const validationResult = validateCSVStructure(parsedData)
    if (!validationResult.isValid) {
      return { success: false, message: validationResult.error }
    }

    // TODO: Implement API call to import materials
    // Example:
    // const response = await fetch('/api/materials/import', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     scope,
    //     materials: parsedData
    //   }),
    // });
    //
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Failed to import materials');
    // }
    //
    // const result = await response.json();
    // return { success: true, message: `Successfully imported ${result.count} materials` };

    // For demo purposes, just return success
    return {
      success: true,
      message: `Successfully imported ${parsedData.length} materials to ${scope}`,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to import materials",
    }
  }
}

/**
 * Exports materials to a CSV file
 * @param scope The emission scope (scope1, scope2, scope3)
 * @returns Promise that resolves with the CSV content
 */
export async function exportMaterialsToCSV(scope: string): Promise<string> {
  try {
    // TODO: Implement API call to get materials
    // Example:
    // const response = await fetch(`/api/materials?scope=${scope}`);
    // if (!response.ok) {
    //   throw new Error('Failed to fetch materials');
    // }
    // const materials = await response.json();

    // For demo purposes, use mock data
    const materials = getMockMaterials(scope)

    // Convert materials to CSV
    const csvContent = convertToCSV(materials)
    return csvContent
  } catch (error) {
    throw new Error(`Failed to export materials: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Gets mock materials for demo purposes
 * @param scope The emission scope
 * @returns Array of material objects
 */
function getMockMaterials(scope: string): any[] {
  // This is just for demo purposes
  // In a real implementation, this would come from your API
  const materials = {
    scope1: [
      { name: "Natural Gas", category: "Stationary Combustion", unit: "m³", factor: 2.02, source: "GHG Protocol" },
      { name: "Diesel", category: "Mobile Combustion", unit: "L", factor: 2.68, source: "EPA" },
      { name: "Gasoline", category: "Mobile Combustion", unit: "L", factor: 2.31, source: "EPA" },
      { name: "Propane", category: "Stationary Combustion", unit: "L", factor: 1.51, source: "GHG Protocol" },
    ],
    scope2: [
      {
        name: "Electricity (Grid Average)",
        category: "Purchased Electricity",
        unit: "kWh",
        factor: 0.42,
        source: "EPA eGRID",
      },
      {
        name: "Electricity (Renewable)",
        category: "Purchased Electricity",
        unit: "kWh",
        factor: 0.0,
        source: "GHG Protocol",
      },
      { name: "Steam", category: "Purchased Heat", unit: "kg", factor: 0.27, source: "GHG Protocol" },
    ],
    scope3: [
      {
        name: "Business Travel - Flight (Short Haul)",
        category: "Business Travel",
        unit: "km",
        factor: 0.15,
        source: "DEFRA",
      },
      {
        name: "Business Travel - Flight (Long Haul)",
        category: "Business Travel",
        unit: "km",
        factor: 0.11,
        source: "DEFRA",
      },
      { name: "Employee Commuting - Car", category: "Employee Commuting", unit: "km", factor: 0.17, source: "EPA" },
      { name: "Waste - Landfill", category: "Waste Disposal", unit: "kg", factor: 0.58, source: "EPA" },
      { name: "Purchased Goods - Paper", category: "Purchased Goods", unit: "kg", factor: 0.94, source: "EPA" },
    ],
  }

  return materials[scope as keyof typeof materials] || []
}

// Import this function from utils/csv-templates.ts
function convertToCSV(materials: any[]): string {
  if (!materials || materials.length === 0) {
    return "name,category,unit,factor,source\n"
  }

  // Get the column names from the first material object
  const columns = ["name", "category", "unit", "factor", "source"]

  // Create the header row
  let csvContent = columns.join(",") + "\n"

  // Add each material as a row
  materials.forEach((material) => {
    const row = columns.map((column) => {
      // Wrap values in quotes and escape any quotes in the value
      const value = material[column] !== undefined ? String(material[column]) : ""
      return `"${value.replace(/"/g, '""')}"`
    })
    csvContent += row.join(",") + "\n"
  })

  return csvContent
}

