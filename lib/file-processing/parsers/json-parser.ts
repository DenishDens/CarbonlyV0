/**
 * Parse JSON file and return data
 */
export async function parseJSON(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)

        // Handle both array and object formats
        if (Array.isArray(jsonData)) {
          resolve(jsonData)
        } else if (typeof jsonData === "object" && jsonData !== null) {
          // Check if it's a nested structure with a data array
          if (jsonData.data && Array.isArray(jsonData.data)) {
            resolve(jsonData.data)
          } else {
            // Single object - wrap in array
            resolve([jsonData])
          }
        } else {
          reject(new Error("Invalid JSON format - expected array or object"))
        }
      } catch (error) {
        reject(new Error("Failed to parse JSON file"))
      }
    }

    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }

    reader.readAsText(file)
  })
}

