"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X, Copy, Check } from "lucide-react"
import { checkRequiredEnvVars } from "@/lib/env"

interface EnvStatus {
  isComplete: boolean
  missing: string[]
  missingServer: string[]
}

export function EnvWarning() {
  const [isVisible, setIsVisible] = useState(false)
  const [envStatus, setEnvStatus] = useState<EnvStatus>({ isComplete: true, missing: [], missingServer: [] })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return

    const status = checkRequiredEnvVars()
    setEnvStatus(status)
    setIsVisible(!status.isComplete)
  }, [])

  if (!isVisible) return null

  const copyEnvTemplate = () => {
    const template = `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`

    navigator.clipboard.writeText(template).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-amber-50 border border-amber-200 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="ml-3 w-full">
            <h3 className="text-sm font-medium text-amber-800">Missing Environment Variables</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>The following environment variables are missing:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {envStatus.missing.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
              <p className="mt-2">
                Add these to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file.
              </p>
              <div className="mt-2">
                <button
                  onClick={copyEnvTemplate}
                  className="inline-flex items-center px-2.5 py-1.5 border border-amber-300 text-xs font-medium rounded text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <button className="flex-shrink-0 ml-2" onClick={() => setIsVisible(false)} aria-label="Close">
            <X className="h-4 w-4 text-amber-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
