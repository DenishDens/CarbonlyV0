"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SystemSettings() {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.carbonly.com",
    smtpPort: "587",
    smtpUsername: "notifications@carbonly.com",
    senderName: "Carbonly Notifications",
    enableEmailNotifications: true,
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    apiKey: "sk_live_51NzT7XKGQJxR9O8Y...",
    webhookSecret: "whsec_8f4e5d3c2b1a...",
    enableWebhooks: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    mfaRequired: true,
    sessionTimeout: "30",
    passwordPolicy: "strong",
    ipRestrictions: "",
  })

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure general platform settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Platform Name</Label>
                <Input id="company-name" defaultValue="Carbonly" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@carbonly.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-url">Platform URL</Label>
              <Input id="platform-url" defaultValue="https://app.carbonly.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-timezone">Default Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time (ET)</SelectItem>
                  <SelectItem value="cst">Central Time (CT)</SelectItem>
                  <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance-message">Maintenance Message</Label>
              <Textarea
                id="maintenance-message"
                placeholder="Enter a message to display during maintenance..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="maintenance-mode" />
              <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Configure email server settings and notification templates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-server">SMTP Server</Label>
                <Input
                  id="smtp-server"
                  value={emailSettings.smtpServer}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpServer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-username">SMTP Username</Label>
                <Input
                  id="smtp-username"
                  value={emailSettings.smtpUsername}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender-name">Sender Name</Label>
              <Input
                id="sender-name"
                value={emailSettings.senderName}
                onChange={(e) => setEmailSettings({ ...emailSettings, senderName: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="email-notifications"
                checked={emailSettings.enableEmailNotifications}
                onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableEmailNotifications: checked })}
              />
              <Label htmlFor="email-notifications">Enable Email Notifications</Label>
            </div>
            <div className="space-y-2">
              <Label>Email Templates</Label>
              <div className="rounded-md border">
                <div className="grid grid-cols-2 items-center p-4 hover:bg-muted/50">
                  <div>Welcome Email</div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Edit Template
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center p-4 hover:bg-muted/50">
                  <div>Password Reset</div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Edit Template
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center p-4 hover:bg-muted/50">
                  <div>Report Generated</div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Edit Template
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center p-4 hover:bg-muted/50">
                  <div>Invitation</div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Edit Template
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="integrations">
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>Configure third-party integrations and API settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Payment Processor</h3>
                <p className="text-sm text-muted-foreground">Configure your payment processor integration.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    value={integrationSettings.apiKey}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, apiKey: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <Input
                    id="webhook-secret"
                    value={integrationSettings.webhookSecret}
                    onChange={(e) => setIntegrationSettings({ ...integrationSettings, webhookSecret: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-webhooks"
                  checked={integrationSettings.enableWebhooks}
                  onCheckedChange={(checked) =>
                    setIntegrationSettings({ ...integrationSettings, enableWebhooks: checked })
                  }
                />
                <Label htmlFor="enable-webhooks">Enable Webhooks</Label>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="text-lg font-medium">Supabase Integration</h3>
                <p className="text-sm text-muted-foreground">Configure your Supabase database connection.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">Supabase URL</Label>
                  <Input id="supabase-url" defaultValue="https://xyzabcdef.supabase.co" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supabase-key">Supabase Key</Label>
                  <Input id="supabase-key" defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
                </div>
              </div>
              <Button variant="outline">Test Connection</Button>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="text-lg font-medium">Other Integrations</h3>
                <p className="text-sm text-muted-foreground">Configure additional third-party integrations.</p>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-3 items-center p-4 hover:bg-muted/50">
                  <div className="font-medium">Google Analytics</div>
                  <div className="text-sm text-muted-foreground">Track user behavior</div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center p-4 hover:bg-muted/50">
                  <div className="font-medium">Slack</div>
                  <div className="text-sm text-muted-foreground">Notifications and alerts</div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center p-4 hover:bg-muted/50">
                  <div className="font-medium">Microsoft 365</div>
                  <div className="text-sm text-muted-foreground">Single sign-on</div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security and authentication settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="mfa-required"
                checked={securitySettings.mfaRequired}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, mfaRequired: checked })}
              />
              <Label htmlFor="mfa-required">Require Multi-Factor Authentication</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-policy">Password Policy</Label>
              <Select
                value={securitySettings.passwordPolicy}
                onValueChange={(value) => setSecuritySettings({ ...securitySettings, passwordPolicy: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select password policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                  <SelectItem value="medium">Medium (8+ chars, 1+ number)</SelectItem>
                  <SelectItem value="strong">Strong (8+ chars, mixed case, numbers, symbols)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ip-restrictions">IP Restrictions (one per line)</Label>
              <Textarea
                id="ip-restrictions"
                placeholder="e.g., 192.168.1.0/24"
                className="min-h-[100px]"
                value={securitySettings.ipRestrictions}
                onChange={(e) => setSecuritySettings({ ...securitySettings, ipRestrictions: e.target.value })}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="text-lg font-medium">API Security</h3>
                <p className="text-sm text-muted-foreground">Configure API access and rate limiting.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                  <Input id="rate-limit" defaultValue="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token-expiry">API Token Expiry (days)</Label>
                  <Input id="token-expiry" defaultValue="30" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

