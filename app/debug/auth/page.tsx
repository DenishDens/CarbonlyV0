"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabase } from "@/lib/supabase"

export default function AuthDebugPage() {
  const { user, session, isLoading, isConfigured } = useAuth()
  const [serverSession, setServerSession] = useState<any>(null)
  const [isCheckingServer, setIsCheckingServer] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkServerSession = async () => {
    setIsCheckingServer(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/session")
      const data = await response.json()
      setServerSession(data)
    } catch (err) {
      console.error("Error checking server session:", err)
      setError("Failed to check server session")
    } finally {
      setIsCheckingServer(false)
    }
  }

  const refreshSession = async () => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error("Error refreshing session:", error)
        setError(`Failed to refresh session: ${error.message}`)
      } else {
        console.log("Session refreshed:", data)
        alert("Session refreshed successfully")
      }
    } catch (err) {
      console.error("Error refreshing session:", err)
      setError("Failed to refresh session")
    }
  }

  useEffect(() => {
    // Check server session on page load
    checkServerSession()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Authentication Debug</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client-Side Auth State</CardTitle>
            <CardDescription>Current authentication state in the browser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Status</h3>
                <p>{isLoading ? "Loading..." : isConfigured ? "Configured" : "Not Configured"}</p>
              </div>

              <div>
                <h3 className="font-medium">User</h3>
                {user ? (
                  <pre className="mt-2 rounded bg-muted p-4 text-sm">
                    {JSON.stringify({ id: user.id, email: user.email }, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground">No user logged in</p>
                )}
              </div>

              <div>
                <h3 className="font-medium">Session</h3>
                {session ? (
                  <pre className="mt-2 rounded bg-muted p-4 text-sm">
                    {JSON.stringify(
                      {
                        expires_at: session.expires_at,
                        access_token: session.access_token ? "[REDACTED]" : null,
                      },
                      null,
                      2,
                    )}
                  </pre>
                ) : (
                  <p className="text-muted-foreground">No active session</p>
                )}
              </div>

              <Button onClick={refreshSession}>Refresh Session</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Server-Side Auth State</CardTitle>
            <CardDescription>Authentication state on the server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

              <div>
                <h3 className="font-medium">Server Session</h3>
                {serverSession ? (
                  <pre className="mt-2 rounded bg-muted p-4 text-sm">{JSON.stringify(serverSession, null, 2)}</pre>
                ) : (
                  <p className="text-muted-foreground">{isCheckingServer ? "Checking..." : "No server session data"}</p>
                )}
              </div>

              <Button onClick={checkServerSession} disabled={isCheckingServer}>
                {isCheckingServer ? "Checking..." : "Check Server Session"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
          <CardDescription>Common authentication issues and solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Session Not Persisting</h3>
              <p className="text-sm text-muted-foreground">
                If your session is not persisting between page refreshes, check that cookies are being properly set and
                that your domain configuration is correct.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Redirect Issues</h3>
              <p className="text-sm text-muted-foreground">
                If redirects are not working correctly after login, ensure that the auth state change is being properly
                detected and that the router is being used correctly.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Environment Variables</h3>
              <p className="text-sm text-muted-foreground">
                Make sure all required environment variables are set: NEXT_PUBLIC_SUPABASE_URL,
                NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_APP_URL.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

