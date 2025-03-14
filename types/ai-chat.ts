export type TimeFrame = "day" | "week" | "month" | "quarter" | "year" | "financial_year"

export type OrganizationalUnit = "company" | "business_unit" | "project" | "department" | "facility"

export type QueryIntent = "single_value" | "time_series" | "comparison" | "breakdown" | "ranking" | "prediction"

export type ChartType = "none" | "bar" | "line" | "pie" | "doughnut" | "radar" | "scatter" | "area" | "prediction"

export interface EmissionQuery {
  materialType?: string
  category?: string
  timeFrame?: TimeFrame
  timeValue?: string | number
  organizationalUnit?: OrganizationalUnit
  organizationalValue?: string
  comparison?: boolean
  limit?: number
  intent?: QueryIntent
  aggregation?: "sum" | "average" | "min" | "max" | "count"
  groupBy?: string[]
  chartType?: ChartType
  predictionPeriods?: number
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface QueryResult {
  query: EmissionQuery
  data: any
  summary: string
  chartData?: any
  singleValue?: {
    value: number
    unit: string
    label: string
    change?: {
      value: number
      percentage: number
      direction: "increase" | "decrease" | "no_change"
      comparedTo: string
    }
  }
  prediction?: {
    data: any[]
    methodology: string
    confidence: number
  }
}

