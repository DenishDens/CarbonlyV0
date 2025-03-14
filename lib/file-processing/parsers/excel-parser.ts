import * as XLSX from "xlsx"

/**
 * Get all sheet names from an Excel file
 */
export async function getExcelSheets(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        resolve(workbook.SheetNames)
      } catch (error) {
        reject(new Error("Failed to read Excel file sheets"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parse Excel file and return JSON data
 */
export async function parseExcel(file: File, sheetName?: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // Use specified sheet or first sheet
        const sheet = sheetName ? workbook.Sheets[sheetName] : workbook.Sheets[workbook.SheetNames[0]]

        if (!sheet) {
          reject(new Error(`Sheet "${sheetName}" not found in Excel file`))
          return
        }

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          defval: "",
          raw: false,
        })

        resolve(jsonData)
      } catch (error) {
        reject(new Error("Failed to parse Excel file"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsArrayBuffer(file)
  })
}

