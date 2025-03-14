import { createClient } from "@/lib/supabase/client"

const isDevelopment = process.env.NODE_ENV === "development"

export const logger = {
  info: (module: string, message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[INFO][${module}] ${message}`, data ? data : "")
    }
  },
  error: (module: string, message: string, error?: any) => {
    console.error(`[ERROR][${module}] ${message}`, error ? error : "")
    // In production, you might want to send this to an error tracking service
  },
  warn: (module: string, message: string, data?: any) => {
    console.warn(`[WARN][${module}] ${message}`, data ? data : "")
  },
  debug: (module: string, message: string, data?: any) => {
    if (isDevelopment) {
      console.debug(`[DEBUG][${module}] ${message}`, data ? data : "")
    }
  }
}

// Database operation logging middleware
export const createLoggingClient = () => {
  const supabase = createClient()
  
  return {
    ...supabase,
    from: (table: string) => {
      const original = supabase.from(table)
      return {
        ...original,
        select: (...args: any[]) => {
          logger.debug("Database", `SELECT from ${table}`)
          return original.select(...args)
        },
        insert: (values: any, options?: any) => {
          logger.debug("Database", `INSERT into ${table}`, values)
          return original.insert(values, options)
        },
        update: (values: any, options?: any) => {
          logger.debug("Database", `UPDATE in ${table}`, values)
          return original.update(values, options)
        },
        delete: (options?: any) => {
          logger.debug("Database", `DELETE from ${table}`)
          return original.delete(options)
        }
      }
    }
  }
} 