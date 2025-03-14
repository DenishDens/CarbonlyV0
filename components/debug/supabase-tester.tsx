"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export function SupabaseTester() {
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    details?: string
    status?: number
  } | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [envVars, setEnvVars] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing",
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Set (Server-side only)" : "✗ Missing (Server-side only)",
  })

  useEffect(() => {
    // Check if environment variables are available
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing",
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing",
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Set (Server-side only)" : "✗ Missing (Server-side only)",
    })
  }, [])

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      // First, check if we can get the Supabase client
      let client
      try {
        client = getSupabase()
      } catch (error) {
        throw new Error(
          `Failed to initialize Supabase client: ${error instanceof Error ? error.message : String(error)}`,
        )
      }

      // Try to get the auth session
      const { error: sessionError } = await client.auth.getSession()

      if (sessionError) {
        throw new Error(`Auth session check failed: ${sessionError.message}`)
      }

      setTestResult({
        success: true,
        message: "Successfully connected to Supabase!",
        details: "Connection test completed. Authentication is working correctly.",
      })
    } catch (error) {
      console.error("Error testing Supabase connection:", error)

      setTestResult({
        success: false,
        message: "Failed to connect to Supabase",
        details: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Connection Tester</CardTitle>
        <CardDescription>Verify that your application can connect to Supabase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Environment Variables Status</h3>
          <ul className="text-sm">
            <li>NEXT_PUBLIC_SUPABASE_URL: {envVars.url}</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envVars.key}</li>
            <li>SUPABASE_SERVICE_ROLE_KEY: {envVars.serviceKey}</li>
          </ul>
        </div>

        <Button onClick={testConnection} disabled={isLoading} className="flex items-center">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Supabase Connection"
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
              <li>Check that your environment variables are correctly set in your deployment platform</li>
              <li>Verify that your Supabase URL and API keys are correct</li>
              <li>Try adding the environment variables again using the Vercel UI</li>
              <li>Redeploy your application after updating the environment variables</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

