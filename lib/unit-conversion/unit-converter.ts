export interface ConversionResult {
  success: boolean
  value: number
  fromUnit: string
  toUnit: string
  error?: string
}

export class UnitConverter {
  // Unit conversion factors to standard units
  private conversionFactors: Record<string, Record<string, number>> = {
    // Mass units to kg
    mass: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      ton: 1000,
      tonne: 1000,
      t: 1000,
      lb: 0.45359237,
      oz: 0.0283495,
    },
    // Volume units to m³
    volume: {
      m3: 1,
      "m³": 1,
      l: 0.001,
      liter: 0.001,
      litre: 0.001,
      ml: 0.000001,
      gal: 0.00378541,
      gallon: 0.00378541,
    },
    // Energy units to kWh
    energy: {
      kwh: 1,
      kWh: 1,
      mwh: 1000,
      MWh: 1000,
      j: 0.000000278,
      J: 0.000000278,
      kj: 0.000278,
      kJ: 0.000278,
      mj: 0.278,
      MJ: 0.278,
      btu: 0.000293,
    },
    // Distance units to km
    distance: {
      km: 1,
      m: 0.001,
      mi: 1.60934,
      mile: 1.60934,
      miles: 1.60934,
    },
    // Area units to m²
    area: {
      m2: 1,
      "m²": 1,
      ha: 10000,
      hectare: 10000,
      acre: 4046.86,
      ft2: 0.092903,
      "ft²": 0.092903,
    },
  }

  // Unit aliases for normalization
  private unitAliases: Record<string, string> = {
    // Mass
    kilogram: "kg",
    kilograms: "kg",
    gram: "g",
    grams: "g",
    milligram: "mg",
    milligrams: "mg",
    tons: "ton",
    tonnes: "tonne",
    "metric ton": "tonne",
    "metric tons": "tonne",
    pounds: "lb",
    pound: "lb",
    ounce: "oz",
    ounces: "oz",

    // Volume
    "cubic meter": "m³",
    "cubic meters": "m³",
    "cubic metre": "m³",
    "cubic metres": "m³",
    liter: "l",
    liters: "l",
    litre: "l",
    litres: "l",
    milliliter: "ml",
    milliliters: "ml",
    millilitre: "ml",
    millilitres: "ml",
    gallons: "gal",
    gallon: "gal",

    // Energy
    "kilowatt hour": "kWh",
    "kilowatt hours": "kWh",
    "kilowatt-hour": "kWh",
    "kilowatt-hours": "kWh",
    "megawatt hour": "MWh",
    "megawatt hours": "MWh",
    "megawatt-hour": "MWh",
    "megawatt-hours": "MWh",
    joule: "J",
    joules: "J",
    kilojoule: "kJ",
    kilojoules: "kJ",
    megajoule: "MJ",
    megajoules: "MJ",
    "british thermal unit": "btu",
    "british thermal units": "btu",

    // Distance
    kilometer: "km",
    kilometers: "km",
    kilometre: "km",
    kilometres: "km",
    meter: "m",
    meters: "m",
    metre: "m",
    metres: "m",

    // Area
    "square meter": "m²",
    "square meters": "m²",
    "square metre": "m²",
    "square metres": "m²",
    hectares: "ha",
    acres: "acre",
    "square foot": "ft²",
    "square feet": "ft²",
  }

  // Map of standard units for each category
  private standardUnits: Record<string, string> = {
    mass: "kg",
    volume: "m³",
    energy: "kWh",
    distance: "km",
    area: "m²",
  }

  /**
   * Convert a value from one unit to another
   */
  public convert(value: number | string, fromUnit: string, toUnit?: string): ConversionResult {
    // Parse value if it's a string
    const numValue = typeof value === "string" ? Number.parseFloat(value) : value

    // Handle invalid values
    if (isNaN(numValue)) {
      return {
        success: false,
        value: 0,
        fromUnit,
        toUnit: toUnit || "",
        error: "Invalid numeric value",
      }
    }

    // Normalize units
    const normalizedFromUnit = this.normalizeUnit(fromUnit)

    if (!normalizedFromUnit) {
      return {
        success: false,
        value: numValue,
        fromUnit,
        toUnit: toUnit || "",
        error: "Unknown unit of measure",
      }
    }

    // Determine the category and standard unit if toUnit not specified
    const category = this.getUnitCategory(normalizedFromUnit)
    const normalizedToUnit = toUnit ? this.normalizeUnit(toUnit) : category ? this.standardUnits[category] : ""

    if (!normalizedToUnit) {
      return {
        success: false,
        value: numValue,
        fromUnit: normalizedFromUnit,
        toUnit: toUnit || "",
        error: "Unknown target unit of measure",
      }
    }

    // Check if units are in the same category
    const toCategory = this.getUnitCategory(normalizedToUnit)

    if (category !== toCategory) {
      return {
        success: false,
        value: numValue,
        fromUnit: normalizedFromUnit,
        toUnit: normalizedToUnit,
        error: "Cannot convert between different unit categories",
      }
    }

    // Perform conversion
    if (normalizedFromUnit === normalizedToUnit) {
      // Same unit, no conversion needed
      return {
        success: true,
        value: numValue,
        fromUnit: normalizedFromUnit,
        toUnit: normalizedToUnit,
      }
    }

    // Get conversion factors
    const fromFactor = this.conversionFactors[category][normalizedFromUnit]
    const toFactor = this.conversionFactors[category][normalizedToUnit]

    if (fromFactor === undefined || toFactor === undefined) {
      return {
        success: false,
        value: numValue,
        fromUnit: normalizedFromUnit,
        toUnit: normalizedToUnit,
        error: "Conversion factor not found",
      }
    }

    // Convert to standard unit then to target unit
    const standardValue = numValue * fromFactor
    const convertedValue = standardValue / toFactor

    return {
      success: true,
      value: convertedValue,
      fromUnit: normalizedFromUnit,
      toUnit: normalizedToUnit,
    }
  }

  /**
   * Normalize a unit string to a standard format
   */
  private normalizeUnit(unit: string): string {
    if (!unit) return ""

    // Clean up the unit string
    const cleanUnit = unit.toLowerCase().trim()

    // Check if it's already a standard unit
    for (const category of Object.keys(this.conversionFactors)) {
      if (cleanUnit in this.conversionFactors[category]) {
        return cleanUnit
      }
    }

    // Check aliases
    if (cleanUnit in this.unitAliases) {
      return this.unitAliases[cleanUnit]
    }

    return ""
  }

  /**
   * Get the category of a unit
   */
  private getUnitCategory(unit: string): string {
    for (const [category, units] of Object.entries(this.conversionFactors)) {
      if (unit in units) {
        return category
      }
    }

    return ""
  }

  /**
   * Get all supported units
   */
  public getSupportedUnits(): Record<string, string[]> {
    const result: Record<string, string[]> = {}

    for (const [category, units] of Object.entries(this.conversionFactors)) {
      result[category] = Object.keys(units)
    }

    return result
  }
}

