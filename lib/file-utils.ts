import type { FileType } from "@/types/emission-data"
import * as XLSX from "xlsx"
import Papa from "papaparse"

export function detectFileType(fileName: string): FileType {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "csv":
      return "csv"
    case "xlsx":
    case "xls":
      return "excel"
    case "json":
      return "json"
    case "pdf":
      return "pdf"
    case "jpg":
    case "jpeg":
    case "png":
      return "image"
    case "txt":
      return "txt"
    default:
      return "txt" // Default fallback
  }
}

export async function parseStructuredFile(fileBuffer: ArrayBuffer, fileType: FileType) {
  try {
    if (fileType === "csv") {
      const text = new TextDecoder().decode(fileBuffer)
      const result = Papa.parse(text, { header: true })
      return {
        headers: result.meta.fields || [],
        data: result.data,
        rowCount: result.data.length,
      }
    }

    if (fileType === "excel") {
      const workbook = XLSX.read(fileBuffer)
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const data = XLSX.utils.sheet_to_json(worksheet)
      const headers = data.length > 0 ? Object.keys(data[0]) : []

      return {
        headers,
        data,
        rowCount: data.length,
      }
    }

    if (fileType === "json") {
      const text = new TextDecoder().decode(fileBuffer)
      const data = JSON.parse(text)
      const isArray = Array.isArray(data)

      if (isArray) {
        const headers = data.length > 0 ? Object.keys(data[0]) : []
        return {
          headers,
          data,
          rowCount: data.length,
        }
      } else {
        // Handle non-array JSON
        return {
          headers: Object.keys(data),
          data: [data],
          rowCount: 1,
        }
      }
    }

    return {
      headers: [],
      data: [],
      rowCount: 0,
      error: "Unsupported file type for structured parsing",
    }
  } catch (error) {
    console.error("Error parsing structured file:", error)
    return {
      headers: [],
      data: [],
      rowCount: 0,
      error: `Failed to parse file: ${error.message}`,
    }
  }
}

export function extractSampleValues(data: any[], count = 5) {
  const samples: Record<string, any[]> = {}

  if (data.length === 0) return samples

  const headers = Object.keys(data[0])

  headers.forEach((header) => {
    samples[header] = []

    for (let i = 0; i < Math.min(count, data.length); i++) {
      if (data[i][header] !== undefined) {
        samples[header].push(data[i][header])
      }
    }
  })

  return samples
}

