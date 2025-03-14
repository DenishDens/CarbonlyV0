"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { logEnvironmentInfo, getAllPublicEnv } from "@/lib/env"
import { supabase } from "@/lib/supabase"

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [supabaseStatus, setSupabaseStatus] = useState<"loading" | "success" | "error">("loading")
  const [supabaseMessage, setSupabaseMessage] = useState("Testing connection...")
  const [serverStatus, setServerStatus] = useState<"loading" | "success" | "error">("loading")
  const [serverMessage, setServerMessage] = useState("Not tested yet")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Log environment info to console
    logEnvironmentInfo()

    // Get all public environment variables
    setEnvVars(getAllPublicEnv())

    // Test Supabase connection
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    setSupabaseStatus("loading")
    setSupabaseMessage("Testing connection...")

    try {
      // Simple test to check if Supabase is configured
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setSupabaseStatus("error")
        setSupabaseMessage(`Error connecting to Supabase: ${error.message}`)
        return
      }

      setSupabaseStatus("success")
      setSupabaseMessage("Successfully connected to Supabase!")
    } catch (error) {
      setSupabaseStatus("error")
      setSupabaseMessage(`Error connecting to Supabase: ${(error as Error).message}`)
    }
  }

  const testServerConnection = async () => {
    setServerStatus("loading")
    setServerMessage("Testing server connection...")

    try {
      const response = await fetch("/api/test-supabase")
      const data = await response.json()

      if (response.ok) {
        setServerStatus("success")
        setServerMessage(data.message || "Successfully connected to Supabase from server!")
      } else {
        setServerStatus("error")
        setServerMessage(data.error || "Failed to connect to Supabase from server")
      }
    } catch (error) {
      setServerStatus("error")
      setServerMessage(`Error testing server connection: ${(error as Error).message}`)
    }
  }

  const refreshEnvironmentVariables = async () => {
    setIsRefreshing(true)

    // Simulate a refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update environment variables
    setEnvVars(getAllPublicEnv())

    // Test connections again
    await testSupabaseConnection()

    setIsRefreshing(false)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Debug Information</h1>
      <p className="text-muted-foreground">
        Use this page to troubleshoot issues with your Carbon Emission Tracker application
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Check the status of your environment variables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL</span>
              {envVars["NEXT_PUBLIC_SUPABASE_URL"] ? (
                <Badge variant="success">Set</Badge>
              ) : (
                <Badge variant="destructive">Not set - Add this variable to your deployment platform</Badge>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              {envVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ? (
                <Badge variant="success">Set</Badge>
              ) : (
                <Badge variant="destructive">Not set - Add this variable to your deployment platform</Badge>
              )}
            </div>
          </div>

          <Button onClick={refreshEnvironmentVariables} disabled={isRefreshing} className="w-full">
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              "Refresh Environment Variables"
            )}
          </Button>

          <Alert>
            <AlertTitle>Environment Variables Help</AlertTitle>
            <AlertDescription className="text-sm">
              <p>If your environment variables are not showing up:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Make sure you've added them to your deployment platform (e.g., Vercel)</li>
                <li>Redeploy your application after adding the variables</li>
                <li>For local development, add them to a .env.local file</li>
                <li>Remember that changes to environment variables require a restart of your development server</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Tester</CardTitle>
          <CardDescription>Verify that your application can connect to Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Environment Variables Status</h3>
            <ul className="space-y-1">
              <li className="flex items-center">
                <span className="mr-2">NEXT_PUBLIC_SUPABASE_URL:</span>
                {envVars["NEXT_PUBLIC_SUPABASE_URL"] ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="ml-1 text-sm text-muted-foreground">
                  {envVars["NEXT_PUBLIC_SUPABASE_URL"] ? "Present" : "Missing"}
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                {envVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="ml-1 text-sm text-muted-foreground">
                  {envVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ? "Present" : "Missing"}
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">SUPABASE_SERVICE_ROLE_KEY:</span>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="ml-1 text-sm text-muted-foreground">Cannot check (Server-side only)</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={testSupabaseConnection}
            variant={supabaseStatus === "success" ? "success" : supabaseStatus === "error" ? "destructive" : "default"}
            className="w-full"
          >
            {supabaseStatus === "loading" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Supabase Connection"
            )}
          </Button>

          <Alert
            variant={supabaseStatus === "success" ? "success" : supabaseStatus === "error" ? "destructive" : "default"}
          >
            <AlertTitle>
              {supabaseStatus === "success" ? "Success" : supabaseStatus === "error" ? "Error" : "Testing"}
            </AlertTitle>
            <AlertDescription>{supabaseMessage}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

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

          <Button
            onClick={testServerConnection}
            variant={serverStatus === "success" ? "success" : serverStatus === "error" ? "destructive" : "default"}
            className="w-full"
          >
            {serverStatus === "loading" ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Test Server Supabase Connection"
            )}
          </Button>

          <Alert
            variant={serverStatus === "success" ? "success" : serverStatus === "error" ? "destructive" : "default"}
          >
            <AlertTitle>
              {serverStatus === "success" ? "Success" : serverStatus === "error" ? "Error" : "Not Tested"}
            </AlertTitle>
            <AlertDescription>{serverMessage}</AlertDescription>
          </Alert>

          {serverStatus === "error" && (
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium mb-1">Troubleshooting Steps</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check that the SUPABASE_SERVICE_ROLE_KEY is correctly set in your deployment platform</li>
                <li>Verify that your Supabase URL is correct</li>
                <li>Ensure that your Supabase project is active and not in maintenance mode</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
          <CardDescription>Details about your application configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Next.js Environment</h3>
            <p>NODE_ENV: {process.env.NODE_ENV}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Build Information</h3>
            <p>This page was rendered at: {new Date().toISOString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Steps</CardTitle>
          <CardDescription>Common issues and how to resolve them</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">401 Errors with Supabase</h3>
            <p className="text-sm text-muted-foreground">
              A 401 error when testing the connection is actually expected behavior. It means your connection to
              Supabase is working, but you're not authorized to access certain endpoints directly with the anonymous
              key, which is the correct security model.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Missing Environment Variables</h3>
            <p className="text-sm text-muted-foreground">
              If you see "Missing Supabase environment variables" errors, make sure your environment variables are
              correctly set in your .env.local file or deployment platform.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Restarting Your Server</h3>
            <p className="text-sm text-muted-foreground">
              After adding or changing environment variables, you may need to restart your development server for the
              changes to take effect.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

