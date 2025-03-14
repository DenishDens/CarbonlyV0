import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { FileUpload } from "@/components/file-import/file-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/server"

// Add this export to make the page dynamic
export const dynamic = "force-dynamic"

export default async function ImportPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Get user's organizations
  const { data: organizations } = await supabase
    .from("organization_members")
    .select(`
      organization_id,
      organizations (
        id,
        name
      )
    `)
    .eq("user_id", session.user.id)

  // Get user's projects
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, organization_id")
    .in("organization_id", organizations?.map((org) => org.organization_id) || [])

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Import Data</h1>

      <Tabs defaultValue="file" className="space-y-6">
        <TabsList>
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <FileUpload organizationId={organizations?.[0]?.organization_id || ""} projectId={projects?.[0]?.id} />
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Import Tips</CardTitle>
                  <CardDescription>Get the most out of your data imports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Supported File Types</h3>
                    <p className="text-sm text-muted-foreground">
                      CSV, Excel (.xlsx, .xls), and JSON files are supported.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Column Mapping</h3>
                    <p className="text-sm text-muted-foreground">
                      Map your file columns to our standard fields for better results.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Material Matching</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll try to match your materials automatically. Review any uncertain matches.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Units of Measure</h3>
                    <p className="text-sm text-muted-foreground">
                      Include units of measure in your data for accurate conversion.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>Connect your systems directly to our API</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Use our API to automate data imports from your existing systems.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">API Endpoint</h3>
                  <pre className="bg-muted p-2 rounded text-sm mt-1">https://api.carbonly.ai/v1/import</pre>
                </div>

                <div>
                  <h3 className="font-medium">Authentication</h3>
                  <p className="text-sm text-muted-foreground">Use your API key to authenticate requests.</p>
                </div>

                <div>
                  <h3 className="font-medium">Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    View our API documentation for detailed integration instructions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Upload</CardTitle>
              <CardDescription>Upload data from your mobile device</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Use our mobile app to scan and upload data on the go.</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Mobile App</h3>
                  <p className="text-sm text-muted-foreground">
                    Download our mobile app from the App Store or Google Play.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Scan Documents</h3>
                  <p className="text-sm text-muted-foreground">Use your camera to scan invoices and receipts.</p>
                </div>

                <div>
                  <h3 className="font-medium">Offline Mode</h3>
                  <p className="text-sm text-muted-foreground">Capture data even when offline and sync later.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

