import Papa from "papaparse"

/**
 * Parse CSV file and return JSON data
 */
export async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.warn("CSV parsing warnings:", results.errors)
        }
        resolve(results.data)
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV file: ${error}`))
      },
    })
  })
}

