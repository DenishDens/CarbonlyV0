"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getAppUrl, isProduction, isVercelPreview, getAllPublicEnv } from "@/lib/env"

export default function EnvironmentDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [currentUrl, setCurrentUrl] = useState<string>("")

  useEffect(() => {
    setEnvVars(getAllPublicEnv())
    setCurrentUrl(window.location.origin)
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Environment Debug</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Environment</CardTitle>
            <CardDescription>Information about the current runtime environment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium mb-2">Environment Type</h3>
                <Badge variant={isProduction() ? "default" : "secondary"}>
                  {isProduction() ? "Production" : isVercelPreview() ? "Preview" : "Development"}
                </Badge>
              </div>

              <div>
                <h3 className="font-medium mb-2">Current URL</h3>
                <code className="bg-muted p-2 rounded text-sm block">{currentUrl}</code>
              </div>

              <div>
                <h3 className="font-medium mb-2">Computed App URL</h3>
                <code className="bg-muted p-2 rounded text-sm block">{getAppUrl()}</code>
                {currentUrl !== getAppUrl() && (
                  <p className="text-sm text-yellow-600 mt-2">
                    Warning: Current URL does not match computed App URL. This may cause authentication issues.
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Custom Domain</h3>
                <code className="bg-muted p-2 rounded text-sm block">https://carbonly.vercel.app</code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Public environment variables available to the application</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variable</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(envVars).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-mono text-sm">{key}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {value ? (key.includes("KEY") ? `${value.substring(0, 8)}...` : value) : "undefined"}
                    </TableCell>
                    <TableCell>
                      {value ? <Badge variant="success">Set</Badge> : <Badge variant="destructive">Missing</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

