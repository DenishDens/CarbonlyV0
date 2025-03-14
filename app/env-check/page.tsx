"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function EnvCheckPage() {
  const [envVars, setEnvVars] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEnvVars = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/env-check")

      if (!response.ok) {
        throw new Error(`Error checking environment variables: ${response.statusText}`)
      }

      const data = await response.json()
      setEnvVars(data.variables)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      console.error("Error checking environment variables:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkEnvVars()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Environment Variables Check</h1>
          <p className="text-muted-foreground mt-2">
            This page checks if your environment variables are properly set on the server.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Server Environment Variables</CardTitle>
            <CardDescription>These are the environment variables available on the server.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTitle>Error checking environment variables</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : envVars ? (
              <div className="space-y-2">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}</span>
                    <span className={value === "Not set" ? "text-destructive" : "text-green-600"}>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertTitle>No data available</AlertTitle>
                <AlertDescription>Could not retrieve environment variables information.</AlertDescription>
              </Alert>
            )}

            <Button onClick={checkEnvVars} disabled={loading} className="mt-4">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Refresh Check"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Environment Variables</CardTitle>
            <CardDescription>These are the environment variables available on the client.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"}
                </span>
              </div>
            </div>

            <Alert className="mt-4">
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                Only environment variables prefixed with NEXT_PUBLIC_ are available on the client.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>If your environment variables are not being recognized, try these steps:</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Create a <code>.env.local</code> file in your project root with the following content:
                <pre className="bg-muted p-2 rounded-md mt-2 text-xs overflow-x-auto">
                  NEXT_PUBLIC_SUPABASE_URL=https://ssmlioeunpqifbkwafct.supabase.co
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzbWxpb2V1bnBxaWZia3dhZmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTIxMDUsImV4cCI6MjA1NzE4ODEwNX0.Q65N6BDg9iSwTiUWHx30eqqyw_YlLlYEUWHBX8JWACU
                  <br />
                  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzbWxpb2V1bnBxaWZia3dhZmN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTYxMjEwNSwiZXhwIjoyMDU3MTg4MTA1fQ.HnFDZC3-GuxmZqzlmbutcsQnf1Dt1HbRmWv4mq52Lvc
                </pre>
              </li>
              <li>Restart your development server completely (stop and start again)</li>
              <li>
                If using a deployment platform like Vercel, make sure to add these environment variables in your project
                settings
              </li>
              <li>
                Check if your <code>.gitignore</code> file includes <code>.env.local</code> to prevent accidentally
                committing your secrets
              </li>
              <li>Try clearing your browser cache or using an incognito window</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

