"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@/lib/supabase/server"
import type { EmissionQuery, QueryResult, TimeFrame, OrganizationalUnit } from "@/types/ai-chat"
import { v4 as uuidv4 } from "uuid"
import { getUserOrganizations } from "@/lib/auth-helpers"

// Add to existing query patterns
const INCIDENT_PATTERNS = [
  {
    pattern: /incidents? (in|for|at) (.+)/i,
    type: "incidents_by_location",
  },
  {
    pattern: /(open|resolved|in progress) incidents/i,
    type: "incidents_by_status",
  },
  {
    pattern: /(high|medium|low) severity incidents/i,
    type: "incidents_by_severity",
  },
]

// Helper function to parse natural language into structured query with intent detection
async function parseQuery(query: string): Promise<EmissionQuery> {
  const systemPrompt = `
    You are an AI assistant for a carbon emissions tracking platform. 
    Parse the following query about carbon emissions data into a structured format.
    
    Extract the following information if present:
    - Material type (e.g., electricity, fuel, gas, water)
    - Category (Scope 1, Scope 2, Scope 3)
    - Time frame (day, week, month, quarter, year, financial_year)
    - Time value (specific period like "last", "this", "2023", "January")
    - Organizational unit (company, business_unit, project, department, facility)
    - Organizational value (name of the specific unit)
    - Comparison (boolean, if they want to compare to previous periods)
    - Limit (number of results to return)
    
    Additionally, determine the query intent from these options:
    - single_value: User wants a single aggregated value (e.g., "total electricity usage last month")
    - time_series: User wants to see data over time (e.g., "electricity usage trend this year")
    - comparison: User wants to compare two periods (e.g., "compare emissions between Q1 and Q2")
    - breakdown: User wants to see data broken down by category (e.g., "breakdown of emissions by material type")
    - ranking: User wants to see top/bottom items (e.g., "top 5 emission sources")
    - prediction: User wants a forecast or prediction (e.g., "predict our emissions for next quarter")
    
    Determine the appropriate aggregation method:
    - sum: Total of values (default for emissions)
    - average: Average of values
    - min: Minimum value
    - max: Maximum value
    - count: Count of records
    
    Determine appropriate groupBy fields based on the query (e.g., material_name, category, project_name)
    
    Recommend the best chart type for visualizing this data:
    - none: No chart needed (for single values)
    - bar: For comparisons across categories
    - line: For time series data
    - pie: For showing composition/breakdown
    - doughnut: Alternative to pie chart
    - radar: For comparing multiple variables
    - scatter: For showing correlation
    - area: For cumulative time series
    - prediction: For forecasting charts
    
    If prediction is requested, include predictionPeriods (number of future periods to predict)
    
    Return ONLY a JSON object with these fields, nothing else.
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: query,
    })

    // Parse the JSON response
    return JSON.parse(text) as EmissionQuery
  } catch (error) {
    console.error("Error parsing query:", error)
    return {}
  }
}

// Helper function to generate optimized SQL based on the parsed query
async function generateSQL(query: EmissionQuery): Promise<{ sql: string; params: any[] }> {
  let selectClause = ""
  let groupByClause = ""
  let orderByClause = ""
  const params: any[] = []
  let paramIndex = 1

  // Get user's authorized organizations
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized: User not authenticated")
  }

  // Get organizations the user has access to
  const userOrganizations = await getUserOrganizations(user.id)

  if (!userOrganizations || userOrganizations.length === 0) {
    throw new Error("Unauthorized: User has no organization access")
  }

  // Extract organization IDs
  const orgIds = userOrganizations.map((org) => org.id)

  // Determine what to select based on intent and aggregation
  if (query.intent === "single_value") {
    // For single value queries, we just need the aggregated value
    const aggregationFunc = query.aggregation || "sum"
    selectClause = `${aggregationFunc.toUpperCase()}(e.total_emissions) as value`
  } else if (query.intent === "time_series") {
    // For time series, we need date and aggregated value
    const aggregationFunc = query.aggregation || "sum"
    selectClause = `
      DATE_TRUNC('${getDateTruncUnit(query.timeFrame || "month")}', e.transaction_date) as period,
      ${aggregationFunc.toUpperCase()}(e.total_emissions) as value
    `
    groupByClause = `GROUP BY period`
    orderByClause = `ORDER BY period`
  } else if (query.intent === "breakdown") {
    // For breakdown, we need the breakdown field and aggregated value
    const aggregationFunc = query.aggregation || "sum"
    const groupByField = query.groupBy?.[0] || "e.material_name"
    selectClause = `
      ${groupByField} as category,
      ${aggregationFunc.toUpperCase()}(e.total_emissions) as value
    `
    groupByClause = `GROUP BY ${groupByField}`
    orderByClause = `ORDER BY value DESC`
  } else if (query.intent === "ranking") {
    // For ranking, we need the ranked field and aggregated value
    const aggregationFunc = query.aggregation || "sum"
    const groupByField = query.groupBy?.[0] || "e.material_name"
    selectClause = `
      ${groupByField} as category,
      ${aggregationFunc.toUpperCase()}(e.total_emissions) as value
    `
    groupByClause = `GROUP BY ${groupByField}`
    orderByClause = `ORDER BY value DESC LIMIT ${query.limit || 5}`
  } else if (query.intent === "comparison") {
    // For comparison, we need to handle this differently
    // This will be implemented in a separate function
    return generateComparisonSQL(query, orgIds)
  } else {
    // Default case - select all relevant fields
    selectClause = `
      e.id,
      e.material_code,
      e.material_name,
      e.category,
      e.amount,
      e.unit_of_measure,
      e.emission_factor,
      e.total_emissions,
      e.transaction_date,
      p.name as project_name,
      bu.name as business_unit_name,
      o.name as organization_name
    `
  }

  let sql = `
    SELECT ${selectClause}
    FROM emission_data e
    LEFT JOIN projects p ON e.project_id = p.id
    LEFT JOIN business_units bu ON p.business_unit_id = bu.id
    LEFT JOIN organizations o ON bu.organization_id = o.id
    WHERE o.id = ANY($${paramIndex})
  `
  params.push(orgIds)
  paramIndex++

  // Add material type filter
  if (query.materialType) {
    sql += ` AND LOWER(e.material_name) LIKE $${paramIndex}`
    params.push(`%${query.materialType.toLowerCase()}%`)
    paramIndex++
  }

  // Add category filter
  if (query.category) {
    sql += ` AND LOWER(e.category) = $${paramIndex}`
    params.push(query.category.toLowerCase())
    paramIndex++
  }

  // Add time frame filter
  if (query.timeFrame && query.timeValue) {
    const timeSQL = getTimeFrameSQL(query.timeFrame, query.timeValue)
    if (timeSQL) {
      sql += ` AND ${timeSQL.sql}`
      params.push(...timeSQL.params)
      paramIndex += timeSQL.params.length
    }
  }

  // Add organizational unit filter
  if (query.organizationalUnit && query.organizationalValue) {
    const orgSQL = getOrganizationalUnitSQL(query.organizationalUnit, query.organizationalValue)
    if (orgSQL) {
      sql += ` AND ${orgSQL.sql}`
      params.push(...orgSQL.params)
      paramIndex += orgSQL.params.length
    }
  }

  // Add group by, order by, and limit clauses
  if (groupByClause) {
    sql += ` ${groupByClause}`
  }

  if (orderByClause) {
    sql += ` ${orderByClause}`
  } else if (!query.intent || (query.intent !== "single_value" && query.intent !== "ranking")) {
    // Default limit if not already specified in orderByClause
    sql += ` LIMIT ${query.limit || 100}`
  }

  return { sql, params }
}

// Helper function to generate SQL for comparison queries
async function generateComparisonSQL(query: EmissionQuery, orgIds: string[]): Promise<{ sql: string; params: any[] }> {
  const aggregationFunc = query.aggregation || "sum"
  const params: any[] = []

  // Get current period time frame
  const currentPeriodSQL = getTimeFrameSQL(query.timeFrame || "month", query.timeValue || "current")

  // Get previous period time frame
  const previousPeriodSQL = getPreviousPeriodSQL(query.timeFrame || "month", query.timeValue || "current")

  // Add organization ids as first param
  params.push(orgIds)

  // Build the SQL for both periods
  const sql = `
    WITH current_period AS (
      SELECT ${aggregationFunc.toUpperCase()}(total_emissions) as value
      FROM emission_data e
      JOIN projects p ON e.project_id = p.id
      JOIN business_units bu ON p.business_unit_id = bu.id
      JOIN organizations o ON bu.organization_id = o.id
      WHERE o.id = ANY($1)
      AND ${currentPeriodSQL.sql}
      ${query.materialType ? `AND LOWER(e.material_name) LIKE '%${query.materialType.toLowerCase()}%'` : ""}
      ${query.category ? `AND LOWER(e.category) = '${query.category.toLowerCase()}'` : ""}
    ),
    previous_period AS (
      SELECT ${aggregationFunc.toUpperCase()}(total_emissions) as value
      FROM emission_data e
      JOIN projects p ON e.project_id = p.id
      JOIN business_units bu ON p.business_unit_id = bu.id
      JOIN organizations o ON bu.organization_id = o.id
      WHERE o.id = ANY($1)
      AND ${previousPeriodSQL.sql}
      ${query.materialType ? `AND LOWER(e.material_name) LIKE '%${query.materialType.toLowerCase()}%'` : ""}
      ${query.category ? `AND LOWER(e.category) = '${query.category.toLowerCase()}'` : ""}
    )
    SELECT 
      (SELECT value FROM current_period) as current_value,
      (SELECT value FROM previous_period) as previous_value,
      CASE 
        WHEN (SELECT value FROM previous_period) = 0 THEN NULL
        ELSE (((SELECT value FROM current_period) - (SELECT value FROM previous_period)) / (SELECT value FROM previous_period)) * 100
      END as percentage_change
  `

  // Add parameters
  params.push(...currentPeriodSQL.params, ...previousPeriodSQL.params)

  return { sql, params }
}

// Helper function to get the appropriate DATE_TRUNC unit
function getDateTruncUnit(timeFrame: TimeFrame): string {
  switch (timeFrame) {
    case "day":
      return "day"
    case "week":
      return "week"
    case "month":
      return "month"
    case "quarter":
      return "quarter"
    case "year":
      return "year"
    case "financial_year":
      return "year" // This is simplified; financial year would need custom handling
    default:
      return "month"
  }
}

// Helper function to generate SQL for time frame filters
function getTimeFrameSQL(timeFrame: TimeFrame, timeValue: string | number): { sql: string; params: any[] } {
  const now = new Date()
  let startDate: Date | null = null
  let endDate: Date | null = null

  // Parse the time value
  if (typeof timeValue === "string") {
    if (timeValue.toLowerCase() === "last" || timeValue.toLowerCase() === "previous") {
      // Last/previous period
      switch (timeFrame) {
        case "day":
          startDate = new Date(now)
          startDate.setDate(startDate.getDate() - 1)
          endDate = new Date(now)
          break
        case "week":
          startDate = new Date(now)
          startDate.setDate(startDate.getDate() - 7)
          endDate = new Date(now)
          break
        case "month":
          startDate = new Date(now)
          startDate.setMonth(startDate.getMonth() - 1)
          endDate = new Date(now)
          break
        case "quarter":
          startDate = new Date(now)
          startDate.setMonth(startDate.getMonth() - 3)
          endDate = new Date(now)
          break
        case "year":
          startDate = new Date(now)
          startDate.setFullYear(startDate.getFullYear() - 1)
          endDate = new Date(now)
          break
        case "financial_year":
          // Assuming financial year starts in July
          const currentYear = now.getFullYear()
          const currentMonth = now.getMonth()
          if (currentMonth >= 6) {
            // July or later
            startDate = new Date(currentYear - 1, 6, 1) // July 1st of previous year
            endDate = new Date(currentYear, 5, 30) // June 30th of current year
          } else {
            startDate = new Date(currentYear - 2, 6, 1) // July 1st of year before previous
            endDate = new Date(currentYear - 1, 5, 30) // June 30th of previous year
          }
          break
      }
    } else if (timeValue.toLowerCase() === "this" || timeValue.toLowerCase() === "current") {
      // This/current period
      switch (timeFrame) {
        case "day":
          startDate = new Date(now.setHours(0, 0, 0, 0))
          endDate = new Date(now.setHours(23, 59, 59, 999))
          break
        case "week":
          const dayOfWeek = now.getDay()
          startDate = new Date(now)
          startDate.setDate(startDate.getDate() - dayOfWeek)
          endDate = new Date(startDate)
          endDate.setDate(endDate.getDate() + 6)
          break
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          break
        case "quarter":
          const quarter = Math.floor(now.getMonth() / 3)
          startDate = new Date(now.getFullYear(), quarter * 3, 1)
          endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0)
          break
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1)
          endDate = new Date(now.getFullYear(), 11, 31)
          break
        case "financial_year":
          // Assuming financial year starts in July
          const currentYear = now.getFullYear()
          const currentMonth = now.getMonth()
          if (currentMonth >= 6) {
            // July or later
            startDate = new Date(currentYear, 6, 1) // July 1st of current year
            endDate = new Date(currentYear + 1, 5, 30) // June 30th of next year
          } else {
            startDate = new Date(currentYear - 1, 6, 1) // July 1st of previous year
            endDate = new Date(currentYear, 5, 30) // June 30th of current year
          }
          break
      }
    } else {
      // Try to parse as a specific year, month, etc.
      // This would require more complex parsing logic
      // For now, we'll just handle numeric years
      const numericValue = Number.parseInt(timeValue)
      if (!isNaN(numericValue)) {
        if (timeFrame === "year") {
          startDate = new Date(numericValue, 0, 1)
          endDate = new Date(numericValue, 11, 31)
        } else if (timeFrame === "financial_year") {
          startDate = new Date(numericValue, 6, 1) // July 1st
          endDate = new Date(numericValue + 1, 5, 30) // June 30th of next year
        }
      }
    }
  }

  if (startDate && endDate) {
    return {
      sql: `e.transaction_date >= $2 AND e.transaction_date <= $3`,
      params: [startDate.toISOString(), endDate.toISOString()],
    }
  }

  return { sql: "", params: [] }
}

// Helper function to get previous period SQL
function getPreviousPeriodSQL(timeFrame: TimeFrame, timeValue: string | number): { sql: string; params: any[] } {
  const now = new Date()
  let startDate: Date | null = null
  let endDate: Date | null = null

  // Calculate previous period based on current period
  if (typeof timeValue === "string" && (timeValue.toLowerCase() === "this" || timeValue.toLowerCase() === "current")) {
    switch (timeFrame) {
      case "day":
        // Previous day
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        break
      case "week":
        // Previous week
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 7 - now.getDay())
        endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 6)
        break
      case "month":
        // Previous month
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case "quarter":
        // Previous quarter
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), (quarter - 1) * 3, 1)
        endDate = new Date(now.getFullYear(), quarter * 3, 0)
        break
      case "year":
        // Previous year
        startDate = new Date(now.getFullYear() - 1, 0, 1)
        endDate = new Date(now.getFullYear() - 1, 11, 31)
        break
      case "financial_year":
        // Previous financial year
        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()
        if (currentMonth >= 6) {
          // July or later
          startDate = new Date(currentYear - 1, 6, 1) // July 1st of previous year
          endDate = new Date(currentYear, 5, 30) // June 30th of current year
        } else {
          startDate = new Date(currentYear - 2, 6, 1) // July 1st of two years ago
          endDate = new Date(currentYear - 1, 5, 30) // June 30th of previous year
        }
        break
    }
  } else if (
    typeof timeValue === "string" &&
    (timeValue.toLowerCase() === "last" || timeValue.toLowerCase() === "previous")
  ) {
    // If we're already looking at the previous period, go back one more
    switch (timeFrame) {
      case "day":
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 2)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        break
      case "week":
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 14)
        endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 6)
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        endDate = new Date(now.getFullYear(), now.getMonth() - 1, 0)
        break
      case "quarter":
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        endDate = new Date(now.getFullYear(), now.getMonth() - 3, 0)
        break
      case "year":
        startDate = new Date(now.getFullYear() - 2, 0, 1)
        endDate = new Date(now.getFullYear() - 2, 11, 31)
        break
      case "financial_year":
        const currentYear = now.getFullYear()
        startDate = new Date(currentYear - 2, 6, 1)
        endDate = new Date(currentYear - 1, 5, 30)
        break
    }
  }

  if (startDate && endDate) {
    return {
      sql: `e.transaction_date >= $2 AND e.transaction_date <= $3`,
      params: [startDate.toISOString(), endDate.toISOString()],
    }
  }

  return { sql: "", params: [] }
}

// Helper function to generate SQL for organizational unit filters
function getOrganizationalUnitSQL(unit: OrganizationalUnit, value: string): { sql: string; params: any[] } {
  switch (unit) {
    case "company":
    case "organization":
      return {
        sql: `LOWER(o.name) LIKE $4`,
        params: [`%${value.toLowerCase()}%`],
      }
    case "business_unit":
      return {
        sql: `LOWER(bu.name) LIKE $4`,
        params: [`%${value.toLowerCase()}%`],
      }
    case "project":
      return {
        sql: `LOWER(p.name) LIKE $4`,
        params: [`%${value.toLowerCase()}%`],
      }
    case "department":
      return {
        sql: `LOWER(e.department) LIKE $4`,
        params: [`%${value.toLowerCase()}%`],
      }
    case "facility":
      return {
        sql: `LOWER(e.facility) LIKE $4`,
        params: [`%${value.toLowerCase()}%`],
      }
    default:
      return { sql: "", params: [] }
  }
}

// Function to generate predictions based on historical data
async function generatePrediction(data: any[], periods = 3): Promise<any> {
  // If we don't have enough data for prediction, return null
  if (!data || data.length < 4) {
    return null
  }

  // Sort data by date if it's time series data
  if (data[0].period) {
    data.sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
  }

  // Extract values for prediction
  const values = data.map((item) => item.value || 0)

  // Simple moving average prediction
  // For a real implementation, you might want to use a more sophisticated algorithm
  const windowSize = Math.min(3, Math.floor(values.length / 2))
  const lastValues = values.slice(-windowSize)
  const average = lastValues.reduce((sum, val) => sum + val, 0) / windowSize

  // Calculate trend
  const trend = (values[values.length - 1] - values[values.length - 1 - windowSize]) / windowSize

  // Generate predictions
  const predictions = []
  let lastPeriod = data[data.length - 1].period
  const lastValue = values[values.length - 1]

  for (let i = 1; i <= periods; i++) {
    // Calculate next period date
    let nextPeriod
    if (lastPeriod) {
      const date = new Date(lastPeriod)
      // Assuming monthly data - adjust as needed
      date.setMonth(date.getMonth() + 1)
      nextPeriod = date.toISOString().split("T")[0]
    } else {
      nextPeriod = `Period ${data.length + i}`
    }

    // Calculate predicted value with trend
    const predictedValue = lastValue + trend * i

    predictions.push({
      period: nextPeriod,
      value: predictedValue,
      isPrediction: true,
    })

    lastPeriod = nextPeriod
  }

  return {
    data: predictions,
    methodology: "Moving average with trend analysis",
    confidence: 0.7, // Simplified confidence score
  }
}

// Helper function to generate a summary of the query results
async function generateSummary(query: EmissionQuery, data: any, singleValue?: any, prediction?: any): Promise<string> {
  if ((!data || (Array.isArray(data) && data.length === 0)) && !singleValue) {
    return "No data found for your query."
  }

  // Create a context for the AI to generate a summary
  const context: any = {
    query,
    intent: query.intent || "unknown",
    materialType: query.materialType || "all materials",
    category: query.category || "all categories",
    timeFrame: query.timeFrame || "period",
    organizationalUnit: query.organizationalUnit
      ? `${query.organizationalUnit} (${query.organizationalValue})`
      : "all units",
  }

  // Add data-specific context
  if (singleValue) {
    context.singleValue = singleValue.value
    context.unit = singleValue.unit
    context.change = singleValue.change
  } else if (Array.isArray(data)) {
    context.recordCount = data.length

    if (data.length > 0 && data[0].value !== undefined) {
      // For aggregated data
      context.totalValue = data.reduce((sum, item) => sum + (item.value || 0), 0)

      if (data[0].category) {
        // For breakdown data
        context.categories = data.map((item) => item.category).join(", ")
        context.topCategory = data[0].category
        context.topValue = data[0].value
      }
    } else {
      // For raw data
      context.totalEmissions = data.reduce((sum, item) => sum + (item.total_emissions || 0), 0)
      const materialTypes = [...new Set(data.map((item) => item.material_name))]
      context.materialTypes = materialTypes.join(", ")
    }
  }

  // Add prediction context
  if (prediction) {
    context.hasPrediction = true
    context.predictionPeriods = prediction.data.length
    context.lastPredictedValue = prediction.data[prediction.data.length - 1].value
    context.methodology = prediction.methodology
    context.confidence = prediction.confidence
  }

  // Generate prompt based on query intent
  let prompt = ""

  if (query.intent === "single_value") {
    prompt = `
      Based on the carbon emissions data:
      - Value: ${context.singleValue} ${context.unit || "tonnes CO2e"}
      - Material: ${context.materialType}
      - Time frame: ${context.timeFrame} ${query.timeValue || ""}
      - Organizational unit: ${context.organizationalUnit}
      ${context.change ? `- Change: ${context.change.value.toFixed(2)} (${context.change.percentage.toFixed(2)}%) ${context.change.direction} compared to ${context.change.comparedTo}` : ""}
      
      Generate a concise, informative summary that answers the original query about ${context.materialType} emissions.
      Keep it under 2 sentences and focus on the key number and its significance.
    `
  } else if (query.intent === "time_series") {
    prompt = `
      Based on the carbon emissions time series data:
      - Total emissions: ${context.totalValue?.toFixed(2) || "N/A"} tonnes CO2e
      - Number of periods: ${context.recordCount}
      - Material: ${context.materialType}
      - Time frame: ${context.timeFrame}
      - Organizational unit: ${context.organizationalUnit}
      ${context.hasPrediction ? `- Prediction: ${context.lastPredictedValue.toFixed(2)} tonnes CO2e in ${context.predictionPeriods} periods (${context.confidence * 100}% confidence)` : ""}
      
      Generate a concise summary that highlights the trend in ${context.materialType} emissions over time.
      Include any notable patterns or changes. Keep it under   emissions over time.
      Include any notable patterns or changes. Keep it under 3 sentences.
    `
  } else if (query.intent === "breakdown") {
    prompt = `
      Based on the carbon emissions breakdown data:
      - Total emissions: ${context.totalValue?.toFixed(2) || "N/A"} tonnes CO2e
      - Categories: ${context.categories || "N/A"}
      - Top category: ${context.topCategory || "N/A"} (${context.topValue?.toFixed(2) || "N/A"} tonnes CO2e)
      - Material: ${context.materialType}
      - Time frame: ${context.timeFrame} ${query.timeValue || ""}
      - Organizational unit: ${context.organizationalUnit}
      
      Generate a concise summary that highlights the composition of ${context.materialType} emissions.
      Focus on the most significant categories and their relative importance. Keep it under 3 sentences.
    `
  } else if (query.intent === "ranking") {
    prompt = `
      Based on the carbon emissions ranking data:
      - Top items: ${context.categories || "N/A"}
      - Highest value: ${context.topCategory || "N/A"} (${context.topValue?.toFixed(2) || "N/A"} tonnes CO2e)
      - Material: ${context.materialType}
        || "N/A"} tonnes CO2e)
      - Material: ${context.materialType}
      - Time frame: ${context.timeFrame} ${query.timeValue || ""}
      - Organizational unit: ${context.organizationalUnit}
      
      Generate a concise summary that highlights the top emission sources and their significance.
      Keep it under 2 sentences and focus on the key insights from the ranking.
    `
  } else if (query.intent === "comparison") {
    prompt = `
      Based on the carbon emissions comparison data:
      - Current value: ${context.singleValue} ${context.unit || "tonnes CO2e"}
      - Change: ${context.change?.value.toFixed(2) || "N/A"} (${context.change?.percentage.toFixed(2) || "N/A"}%)
      - Direction: ${context.change?.direction || "N/A"}
      - Compared to: ${context.change?.comparedTo || "previous period"}
      - Material: ${context.materialType}
      - Time frame: ${context.timeFrame} ${query.timeValue || ""}
      - Organizational unit: ${context.organizationalUnit}
      
      Generate a concise summary that highlights the comparison between periods for ${context.materialType} emissions.
      Focus on the magnitude and direction of change. Keep it under 2 sentences.
    `
  } else if (query.intent === "prediction") {
    prompt = `
      Based on the carbon emissions prediction data:
      - Predicted value: ${context.lastPredictedValue?.toFixed(2) || "N/A"} tonnes CO2e
      - Prediction periods: ${context.predictionPeriods || "N/A"}
      - Methodology: ${context.methodology || "N/A"}
      - Confidence: ${(context.confidence * 100)?.toFixed(0) || "N/A"}%
      - Material: ${context.materialType}
      - Time frame: ${context.timeFrame}
      - Organizational unit: ${context.organizationalUnit}
      
      Generate a concise summary that explains the prediction for ${context.materialType} emissions.
      Include the predicted value, time frame, and confidence level. Keep it under 3 sentences.
    `
  } else {
    prompt = `
      Based on the following data about carbon emissions:
      - Total emissions: ${context.totalEmissions?.toFixed(2) || "N/A"} tonnes CO2e
      - Number of records: ${context.recordCount || "N/A"}
      - Material types: ${context.materialTypes || "N/A"}
      - Time frame: ${context.timeFrame} ${query.timeValue || ""}
      - Organizational unit: ${context.organizationalUnit}

      Generate a concise, informative summary of the emissions data that answers the original query.
      Include key insights and any notable patterns. Keep it under 3 sentences.
    `
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })
    return text
  } catch (error) {
    console.error("Error generating summary:", error)

    // Fallback summary based on query intent
    if (query.intent === "single_value" && singleValue) {
      return `${singleValue.value.toFixed(2)} ${singleValue.unit || "tonnes CO2e"} of ${context.materialType} emissions for the specified period.`
    } else if (Array.isArray(data) && data.length > 0) {
      return `Found ${data.length} records with total emissions of ${context.totalValue?.toFixed(2) || context.totalEmissions?.toFixed(2) || "N/A"} tonnes CO2e.`
    } else {
      return `No data found for your query about ${context.materialType} emissions.`
    }
  }
}

// Add to existing query handler
async function handleIncidentQuery(type: string, matches: RegExpExecArray): Promise<QueryResult> {
  const supabase = createClient()

  // Get user's authorized organizations
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized: User not authenticated")
  }

  // Get organizations the user has access to
  const userOrganizations = await getUserOrganizations(user.id)

  if (!userOrganizations || userOrganizations.length === 0) {
    throw new Error("Unauthorized: User has no organization access")
  }

  // Extract organization IDs
  const orgIds = userOrganizations.map((org) => org.id)

  const query = supabase
    .from("incidents")
    .select(`
      *,
      business_units!inner (
        name,
        organization_id
      ),
      incident_types (name)
    `)
    .in("business_units.organization_id", orgIds)

  switch (type) {
    case "incidents_by_location":
      const location = matches[2]
      query.ilike("business_units.name", `%${location}%`)
      break
    case "incidents_by_status":
      const status = matches[1].toLowerCase().replace(" ", "_")
      query.eq("status", status)
      break

    case "incidents_by_severity":
      const severity = matches[1].toLowerCase()
      query.eq("severity", severity)
      break
  }

  const { data, error } = await query
  if (error) throw error

  return {
    type: "incidents",
    data,
    visualization: "table",
  }
}

// Main function to process a natural language query
export async function processNaturalLanguageQuery(query: string): Promise<QueryResult> {
  try {
    // Check for incident-related queries first
    for (const pattern of INCIDENT_PATTERNS) {
      const matches = pattern.pattern.exec(query)
      if (matches) {
        return await handleIncidentQuery(pattern.type, matches)
      }
    }

    // Handle emissions-related queries
    // Parse the natural language query
    const supabase = createClient()
    const parsedQuery = await parseQuery(query)

    // Verify user authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error("Unauthorized: User not authenticated")
    }

    // Generate SQL
    const { sql, params } = await generateSQL(parsedQuery)

    // Execute the query
    const { data, error } = await supabase.rpc("execute_query", {
      query_text: sql,
      query_params: params,
    })

    if (error) {
      console.error("Error executing query:", error)
      return {
        query: parsedQuery,
        data: [],
        summary: "Error retrieving data. Please try again.",
      }
    }

    // Process the results based on query intent
    const processedData = data || []
    let singleValue = undefined
    let chartData = undefined
    let prediction = undefined

    // Handle single value queries
    if (parsedQuery.intent === "single_value" && processedData.length > 0) {
      const value = processedData[0].value || 0
      const unit = "tonnes CO2e"

      singleValue = {
        value,
        unit,
        label: `${parsedQuery.materialType || "Total"} Emissions`,
      }

      // If this is a comparison query, add change information
      if (
        parsedQuery.comparison &&
        processedData[0].current_value !== undefined &&
        processedData[0].previous_value !== undefined
      ) {
        const currentValue = processedData[0].current_value || 0
        const previousValue = processedData[0].previous_value || 0
        const change = currentValue - previousValue
        const percentageChange = previousValue !== 0 ? (change / previousValue) * 100 : 0

        singleValue.change = {
          value: change,
          percentage: percentageChange,
          direction: change > 0 ? "increase" : change < 0 ? "decrease" : "no_change",
          comparedTo: "previous period",
        }
      }
    }

    // Generate chart data based on query intent
    if (processedData.length > 0) {
      if (parsedQuery.intent === "time_series") {
        // Line chart for time series
        chartData = {
          type: "line",
          data: {
            labels: processedData.map((item) => {
              const date = new Date(item.period)
              return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
            }),
            datasets: [
              {
                label: `${parsedQuery.materialType || "Total"} Emissions`,
                data: processedData.map((item) => item.value || 0),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.1,
              },
            ],
          },
        }

        // Generate prediction if requested
        if (parsedQuery.intent === "prediction" || parsedQuery.predictionPeriods) {
          prediction = await generatePrediction(processedData, parsedQuery.predictionPeriods || 3)

          if (prediction && chartData) {
            // Add prediction data to chart
            const predictionLabels = prediction.data.map((item) => {
              const date = new Date(item.period)
              return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
            })

            const predictionValues = prediction.data.map((item) => item.value || 0)

            chartData.data.labels = [...chartData.data.labels, ...predictionLabels]
            chartData.data.datasets.push({
              label: "Predicted Emissions",
              data: [...Array(processedData.length).fill(null), ...predictionValues],
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderDash: [5, 5],
              tension: 0.1,
            })
          }
        }
      } else if (parsedQuery.intent === "breakdown" || parsedQuery.intent === "ranking") {
        // Pie/doughnut chart for breakdown, bar chart for ranking
        const chartType = parsedQuery.intent === "breakdown" ? parsedQuery.chartType || "pie" : "bar"

        // Generate colors
        const colors = processedData.map((_, i) => {
          const hue = (i * 137) % 360 // Golden angle approximation
          return `hsl(${hue}, 70%, 60%)`
        })

        chartData = {
          type: chartType,
          data: {
            labels: processedData.map((item) => item.category || "Unknown"),
            datasets: [
              {
                label: `${parsedQuery.materialType || "Total"} Emissions`,
                data: processedData.map((item) => item.value || 0),
                backgroundColor: colors,
                borderColor: colors.map((color) => color.replace("60%", "50%")),
                borderWidth: 1,
              },
            ],
          },
        }
      } else if (parsedQuery.intent === "comparison") {
        // Bar chart for comparison
        chartData = {
          type: "bar",
          data: {
            labels: ["Current Period", "Previous Period"],
            datasets: [
              {
                label: `${parsedQuery.materialType || "Total"} Emissions`,
                data: [processedData[0]?.current_value || 0, processedData[0]?.previous_value || 0],
                backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
                borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
                borderWidth: 1,
              },
            ],
          },
        }
      }
    }

    // Generate summary
    const summary = await generateSummary(parsedQuery, processedData, singleValue, prediction)

    return {
      query: parsedQuery,
      data: processedData,
      summary,
      chartData,
      singleValue,
      prediction,
    }
  } catch (error) {
    console.error("Error processing query:", error)
    return {
      query: {},
      data: [],
      summary:
        error instanceof Error
          ? `Error: ${error.message}`
          : "An error occurred processing your query. Please try again.",
    }
  }
}

// Function to save a chat message
export async function saveChatMessage(sessionId: string, message: { role: "user" | "assistant"; content: string }) {
  const supabase = createClient()

  // Verify user authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized: User not authenticated")
  }

  const { data: session, error: sessionError } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id) // Only allow access to the user's own chat sessions
    .single()

  if (sessionError) {
    // Create a new session if it doesn't exist
    if (sessionError.code === "PGRST116") {
      const { error: createError } = await supabase.from("chat_sessions").insert({
        id: sessionId,
        user_id: user.id, // Associate the chat session with the user
        title: message.content.substring(0, 50) + "...",
        messages: [
          {
            id: uuidv4(),
            role: message.role,
            content: message.content,
            timestamp: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (createError) {
        console.error("Error creating chat session:", createError)
      }
      return
    }

    console.error("Error fetching chat session:", sessionError)
    return
  }

  // Update existing session
  const updatedMessages = [
    ...(session.messages || []),
    {
      id: uuidv4(),
      role: message.role,
      content: message.content,
      timestamp: new Date().toISOString(),
    },
  ]

  const { error: updateError } = await supabase
    .from("chat_sessions")
    .update({
      messages: updatedMessages,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("user_id", user.id) // Ensure the user can only update their own chat sessions

  if (updateError) {
    console.error("Error updating chat session:", updateError)
  }
}

// Function to get predefined questions
export async function getPredefinedQuestions(): Promise<string[]> {
  return [
    "How much electricity did we use last quarter?",
    "What were our Scope 1 emissions for 2023?",
    "Compare our water usage between this month and last month",
    "Show me the top 5 emission sources for Project Alpha",
    "What's our total carbon footprint for the current financial year?",
    "How much fuel did the Marketing department use last month?",
    "What's the breakdown of Scope 3 emissions by business unit?",
    "Show me emissions from natural gas for all facilities in 2023",
    "Which project had the highest emissions last quarter?",
    "Predict our emissions for the next quarter based on historical data",
  ]
}

