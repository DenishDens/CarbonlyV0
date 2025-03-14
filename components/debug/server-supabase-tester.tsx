"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function ServerSupabaseTester() {
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const testServerConnection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/test-supabase")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server returned status ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setTestResult({
          success: true,
          message: data.message || "Successfully connected to Supabase from server",
          details: "Server-side connection test completed successfully.",
        })
      } else {
        setTestResult({
          success: false,
          message: "Failed to connect to Supabase from server",
          details: data.error || "Unknown error",
        })
      }
    } catch (error) {
      console.error("Error testing server Supabase connection:", error)

      setTestResult({
        success: false,
        message: "Failed to connect to Supabase from server",
        details: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Server-Side Supabase Connection Tester</CardTitle>
        <CardDescription>Verify that your server can connect to Supabase using the service role key</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This test uses the server-side service role key to connect to Supabase, which has higher privileges than the
          anonymous key used in the browser.
        </p>

        <Button onClick={testServerConnection} disabled={isLoading} className="flex items-center">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Server Connection...
            </>
          ) : (
            "Test Server Supabase Connection"
          )}
        </Button>

        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            <AlertTitle>{testResult.message}</AlertTitle>
            {testResult.details && <AlertDescription>{testResult.details}</AlertDescription>}
          </Alert>
        )}

        {!testResult?.success && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="font-medium text-red-800">Troubleshooting Steps</h3>
            <ul className="text-sm text-red-700 mt-1 list-disc list-inside space-y-1">
              <li>Check that the SUPABASE_SERVICE_ROLE_KEY is correctly set in your deployment platform</li>
              <li>Verify that your Supabase URL is correct</li>
              <li>Ensure that your Supabase project is active and not in maintenance mode</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

