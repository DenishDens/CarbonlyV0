/**
 * CSV Templates for Material Library Import/Export
 *
 * This file contains functions to generate sample CSV templates for different scopes
 * and to convert material data to/from CSV format.
 */

/**
 * Creates a sample CSV template for the specified scope
 * @param scope The emission scope (scope1, scope2, scope3)
 * @returns CSV content as a string
 */
export function createSampleCSV(scope: string): string {
  // CSV header
  let csvContent = "name,category,unit,factor,source\n"

  // Add sample rows based on scope
  if (scope === "scope1") {
    csvContent += [
      '"Natural Gas","Stationary Combustion","m³",2.02,"GHG Protocol"',
      '"Diesel","Mobile Combustion","L",2.68,"EPA"',
      '"Gasoline","Mobile Combustion","L",2.31,"EPA"',
      '"Propane","Stationary Combustion","L",1.51,"GHG Protocol"',
    ].join("\n")
  } else if (scope === "scope2") {
    csvContent += [
      '"Electricity (Grid Average)","Purchased Electricity","kWh",0.42,"EPA eGRID"',
      '"Electricity (Renewable)","Purchased Electricity","kWh",0.0,"GHG Protocol"',
      '"Steam","Purchased Heat","kg",0.27,"GHG Protocol"',
    ].join("\n")
  } else if (scope === "scope3") {
    csvContent += [
      '"Business Travel - Flight (Short Haul)","Business Travel","km",0.15,"DEFRA"',
      '"Business Travel - Flight (Long Haul)","Business Travel","km",0.11,"DEFRA"',
      '"Employee Commuting - Car","Employee Commuting","km",0.17,"EPA"',
      '"Waste - Landfill","Waste Disposal","kg",0.58,"EPA"',
      '"Purchased Goods - Paper","Purchased Goods","kg",0.94,"EPA"',
    ].join("\n")
  }

  return csvContent
}

/**
 * Converts CSV content to material objects
 * @param csvContent The CSV content as a string
 * @returns Array of material objects
 *
 * TODO: Implement proper CSV parsing with validation
 */
export function parseCSV(csvContent: string): any[] {
  // Split the CSV content into lines
  const lines = csvContent.split("\n")

  // Extract the header line and remove it from the lines array
  const header = lines.shift()

  if (!header) {
    throw new Error("CSV file is empty or invalid")
  }

  // Parse the header to get column names
  const columns = header.split(",")

  // Validate required columns
  const requiredColumns = ["name", "category", "unit", "factor", "source"]
  for (const col of requiredColumns) {
    if (!columns.includes(col)) {
      throw new Error(`CSV is missing required column: ${col}`)
    }
  }

  // Parse each line into a material object
  const materials = lines
    .filter((line) => line.trim() !== "") // Skip empty lines
    .map((line, index) => {
      try {
        // This is a simple CSV parser that doesn't handle quoted values properly
        // In a real implementation, use a proper CSV parsing library
        const values = line.split(",")

        // Create a material object
        const material: any = {}
        columns.forEach((column, i) => {
          if (column === "factor") {
            // Convert factor to number
            material[column] = Number.parseFloat(values[i])
          } else {
            material[column] = values[i]
          }
        })

        return material
      } catch (error) {
        throw new Error(`Error parsing line ${index + 2}: ${error instanceof Error ? error.message : String(error)}`)
      }
    })

  return materials
}

/**
 * Converts material objects to CSV content
 * @param materials Array of material objects
 * @returns CSV content as a string
 */
export function convertToCSV(materials: any[]): string {
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

/**
 * Validates the structure of parsed CSV data
 * @param data The parsed CSV data
 * @returns Validation result object
 */
export function validateCSVStructure(data: any[]): { isValid: boolean; error?: string } {
  if (!data || data.length === 0) {
    return { isValid: false, error: "CSV file contains no data" }
  }

  // Check each row for required fields
  for (let i = 0; i < data.length; i++) {
    const row = data[i]

    // Check required fields
    if (!row.name) {
      return { isValid: false, error: `Row ${i + 2}: Missing name` }
    }
    if (!row.category) {
      return { isValid: false, error: `Row ${i + 2}: Missing category` }
    }
    if (!row.unit) {
      return { isValid: false, error: `Row ${i + 2}: Missing unit` }
    }
    if (row.factor === undefined || isNaN(row.factor)) {
      return { isValid: false, error: `Row ${i + 2}: Invalid or missing factor` }
    }
    if (!row.source) {
      return { isValid: false, error: `Row ${i + 2}: Missing source` }
    }
  }

  return { isValid: true }
}

