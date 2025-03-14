"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EnvironmentChecker() {
  const { toast } = useToast()
  const [isChecking, setIsChecking] = useState(false)
  const [envVars, setEnvVars] = useState({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  })

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: `${name} copied to clipboard`,
        })
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually",
          variant: "destructive",
        })
      })
  }

  const refreshEnvVars = () => {
    setIsChecking(true)

    // Simulate a check by waiting a bit
    setTimeout(() => {
      setEnvVars({
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      })
      setIsChecking(false)
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription>Check the status of your environment variables</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="supabase-url">NEXT_PUBLIC_SUPABASE_URL</Label>
            <div className="flex mt-1">
              <Input
                id="supabase-url"
                value={
                  envVars.NEXT_PUBLIC_SUPABASE_URL
                    ? envVars.NEXT_PUBLIC_SUPABASE_URL
                    : "Not set - Add this variable to your deployment platform"
                }
                readOnly
                className="flex-1"
              />
              {envVars.NEXT_PUBLIC_SUPABASE_URL && (
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => copyToClipboard(envVars.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              {envVars.NEXT_PUBLIC_SUPABASE_URL && (
                <Button variant="ghost" size="icon" className="ml-2">
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="supabase-key">NEXT_PUBLIC_SUPABASE_ANON_KEY</Label>
            <div className="flex mt-1">
              <Input
                id="supabase-key"
                value={
                  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    ? envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    : "Not set - Add this variable to your deployment platform"
                }
                readOnly
                className="flex-1"
              />
              {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() =>
                    copyToClipboard(envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY")
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
                <Button variant="ghost" size="icon" className="ml-2">
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Button onClick={refreshEnvVars} disabled={isChecking} variant="outline" className="mt-4">
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Refresh Environment Variables"
          )}
        </Button>

        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
          <h3 className="font-medium text-amber-800">Environment Variables Help</h3>
          <p className="text-sm text-amber-700 mt-1">If your environment variables are not showing up:</p>
          <ol className="text-sm text-amber-700 mt-2 list-decimal list-inside space-y-1">
            <li>Make sure you've added them to your deployment platform (e.g., Vercel)</li>
            <li>Redeploy your application after adding the variables</li>
            <li>
              For local development, add them to a <code>.env.local</code> file
            </li>
            <li>Remember that changes to environment variables require a restart of your development server</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

