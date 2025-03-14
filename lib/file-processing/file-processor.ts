import { parseCSV } from "./parsers/csv-parser"
import { parseExcel, getExcelSheets } from "./parsers/excel-parser"
import { parseJSON } from "./parsers/json-parser"
import { parsePDF } from "./parsers/pdf-parser"
import { MaterialMatcher } from "../material-library/material-matcher"
import { UnitConverter } from "../unit-conversion/unit-converter"
import { AIProcessor } from "../ai/ai-processor"
import { FileValidationError } from "../errors/file-validation-error"

export type FileType = "csv" | "excel" | "json" | "pdf" | "unknown"
export type ProcessingMode = "standard" | "preview" | "bulk"

export interface ProcessingOptions {
  organizationId: string
  projectId?: string
  mode: ProcessingMode
  selectedSheet?: string
  columnMappings?: Record<string, string>
  defaultUoM?: Record<string, string>
  aiProcessingThreshold?: number // 0-1, confidence threshold for AI processing
}

export interface ProcessingResult {
  success: boolean
  data: {
    matched: any[]
    unmatched: any[]
    needsReview: any[]
  }
  sheets?: string[] // For Excel files with multiple sheets
  columns?: string[] // Detected columns
  errors?: string[]
  aiProcessed?: number
  totalRecords?: number
}

export class FileProcessor {
  private materialMatcher: MaterialMatcher
  private unitConverter: UnitConverter
  private aiProcessor: AIProcessor

  constructor() {
    this.materialMatcher = new MaterialMatcher()
    this.unitConverter = new UnitConverter()
    this.aiProcessor = new AIProcessor()
  }

  /**
   * Detects the type of file based on extension and content
   */
  public detectFileType(file: File): FileType {
    const extension = file.name.split(".").pop()?.toLowerCase()

    if (extension === "csv") return "csv"
    if (["xls", "xlsx", "xlsm"].includes(extension || "")) return "excel"
    if (extension === "json") return "json"
    if (extension === "pdf") return "pdf"

    return "unknown"
  }

  /**
   * Process a file and return structured data
   */
  public async processFile(file: File, options: ProcessingOptions): Promise<ProcessingResult> {
    try {
      const fileType = this.detectFileType(file)
      let parsedData: any[] = []
      let sheets: string[] = []

      // Parse file based on type
      switch (fileType) {
        case "csv":
          parsedData = await parseCSV(file)
          break
        case "excel":
          // Check if the file has multiple sheets
          sheets = await getExcelSheets(file)

          if (sheets.length > 1 && !options.selectedSheet) {
            // Return sheet names for user selection if multiple sheets exist
            return {
              success: false,
              data: { matched: [], unmatched: [], needsReview: [] },
              sheets,
              errors: ["Multiple sheets detected. Please select a sheet to process."],
            }
          }

          parsedData = await parseExcel(file, options.selectedSheet || sheets[0])
          break
        case "json":
          parsedData = await parseJSON(file)
          break
        case "pdf":
          parsedData = await parsePDF(file)
          break
        default:
          throw new FileValidationError("Unsupported file type")
      }

      // If in preview mode, just return the parsed data with column detection
      if (options.mode === "preview") {
        const columns = parsedData.length > 0 ? Object.keys(parsedData[0]) : []
        return {
          success: true,
          data: { matched: parsedData, unmatched: [], needsReview: [] },
          columns,
          sheets,
          totalRecords: parsedData.length,
        }
      }

      // Process the data
      return await this.processData(parsedData, options)
    } catch (error) {
      console.error("File processing error:", error)
      return {
        success: false,
        data: { matched: [], unmatched: [], needsReview: [] },
        errors: [(error as Error).message],
      }
    }
  }

  /**
   * Process parsed data through material matching, UoM conversion, and AI if needed
   */
  private async processData(data: any[], options: ProcessingOptions): Promise<ProcessingResult> {
    const matched: any[] = []
    const unmatched: any[] = []
    const needsReview: any[] = []
    let aiProcessed = 0

    // Apply column mappings if provided
    if (options.columnMappings) {
      data = this.applyColumnMappings(data, options.columnMappings)
    }

    // Process each record
    for (const record of data) {
      // Step 1: Try to match material from library
      const materialMatch = await this.materialMatcher.findMatch(record.material || record.description || "")

      // Step 2: Convert units if possible
      let processedRecord = { ...record }

      if (record.unit || record.uom) {
        const unitResult = this.unitConverter.convert(
          record.quantity || record.amount || 1,
          record.unit || record.uom,
          materialMatch?.standardUnit,
        )

        if (unitResult.success) {
          processedRecord.standardQuantity = unitResult.value
          processedRecord.standardUnit = unitResult.toUnit
        } else if (options.defaultUoM && options.defaultUoM[record.material]) {
          // Use default UoM if provided
          const defaultUnitResult = this.unitConverter.convert(
            record.quantity || record.amount || 1,
            record.unit || record.uom,
            options.defaultUoM[record.material],
          )

          if (defaultUnitResult.success) {
            processedRecord.standardQuantity = defaultUnitResult.value
            processedRecord.standardUnit = defaultUnitResult.toUnit
          } else {
            processedRecord.needsUoMReview = true
          }
        } else {
          processedRecord.needsUoMReview = true
        }
      }

      // Step 3: Categorize the record
      if (materialMatch && materialMatch.confidence > 0.8) {
        // High confidence match from material library
        processedRecord = {
          ...processedRecord,
          materialId: materialMatch.id,
          materialName: materialMatch.name,
          category: materialMatch.category,
          matchConfidence: materialMatch.confidence,
          emissionFactor: materialMatch.emissionFactor,
        }

        if (processedRecord.needsUoMReview) {
          needsReview.push(processedRecord)
        } else {
          matched.push(processedRecord)
        }
      } else if (materialMatch && materialMatch.confidence > 0.5) {
        // Medium confidence match - needs review
        processedRecord = {
          ...processedRecord,
          materialId: materialMatch.id,
          materialName: materialMatch.name,
          category: materialMatch.category,
          matchConfidence: materialMatch.confidence,
          emissionFactor: materialMatch.emissionFactor,
          needsReview: true,
        }

        needsReview.push(processedRecord)
      } else {
        // No good match - try AI if threshold allows
        const threshold = options.aiProcessingThreshold || 0.5

        if (threshold > 0) {
          const aiResult = await this.aiProcessor.processMaterial(
            record.material || record.description || "",
            record.quantity || record.amount || 1,
            record.unit || record.uom,
          )

          aiProcessed++

          if (aiResult.confidence >= threshold) {
            processedRecord = {
              ...processedRecord,
              materialId: aiResult.materialId,
              materialName: aiResult.materialName,
              category: aiResult.category,
              matchConfidence: aiResult.confidence,
              emissionFactor: aiResult.emissionFactor,
              aiProcessed: true,
            }

            if (aiResult.confidence > 0.8) {
              matched.push(processedRecord)
            } else {
              needsReview.push(processedRecord)
            }
          } else {
            processedRecord.aiProcessed = true
            processedRecord.matchConfidence = aiResult.confidence
            unmatched.push(processedRecord)
          }
        } else {
          unmatched.push(processedRecord)
        }
      }
    }

    return {
      success: true,
      data: { matched, unmatched, needsReview },
      aiProcessed,
      totalRecords: data.length,
    }
  }

  /**
   * Apply column mappings to standardize data
   */
  private applyColumnMappings(data: any[], mappings: Record<string, string>): any[] {
    return data.map((record) => {
      const mappedRecord: Record<string, any> = {}

      for (const [sourceKey, targetKey] of Object.entries(mappings)) {
        if (record[sourceKey] !== undefined) {
          mappedRecord[targetKey] = record[sourceKey]
        }
      }

      return mappedRecord
    })
  }
}

