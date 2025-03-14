"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Building, Bell, Key, Lock, Globe, Upload, RefreshCw, Copy, Eye, EyeOff } from "lucide-react"

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isResetApiKeyDialogOpen, setIsResetApiKeyDialogOpen] = useState(false)

  // Mock data - in a real app, this would come from your API
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "JD",
    jobTitle: "Sustainability Manager",
    phone: "+1 (555) 123-4567",
    organization: {
      name: "Acme Corporation",
      industry: "Manufacturing",
      size: "1000-5000 employees",
      logo: "/placeholder.svg?height=100&width=100",
      address: "123 Main St, San Francisco, CA 94105",
      website: "https://example.com",
    },
    apiKey: "carb_sk_1234567890abcdefghijklmnopqrstuvwxyz",
    notificationSettings: {
      emailSummary: true,
      newUploads: true,
      teamChanges: true,
      emissionAlerts: true,
      productUpdates: false,
    },
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(userData.apiKey)
    // In a real app, you would show a toast notification here
  }

  const resetApiKey = () => {
    setIsResetApiKeyDialogOpen(false)
    // In a real app, this would generate a new API key
  }

  return (
    <Tabs defaultValue="profile" onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="profile">
          <User className="h-4 w-4 mr-2" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="organization">
          <Building className="h-4 w-4 mr-2" />
          Organization
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="api">
          <Key className="h-4 w-4 mr-2" />
          API
        </TabsTrigger>
        <TabsTrigger value="security">
          <Lock className="h-4 w-4 mr-2" />
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="text-2xl">{userData.initials}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userData.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={userData.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input id="job-title" defaultValue={userData.jobTitle} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue={userData.phone} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Tell us about yourself" rows={4} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="organization">
        <Card>
          <CardHeader>
            <CardTitle>Organization Settings</CardTitle>
            <CardDescription>Manage your organization's information and branding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-24 w-24 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={userData.organization.logo || "/placeholder.svg"}
                      alt={userData.organization.name}
                      className="max-h-full max-w-full"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input id="org-name" defaultValue={userData.organization.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input id="industry" defaultValue={userData.organization.industry} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Company Size</Label>
                      <select
                        id="size"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={userData.organization.size}
                      >
                        <option value="1-50">1-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000-5000">1000-5000 employees</option>
                        <option value="5000+">5000+ employees</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
                          <Globe className="h-4 w-4 text-gray-500" />
                        </div>
                        <Input id="website" defaultValue={userData.organization.website} className="rounded-l-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" defaultValue={userData.organization.address} rows={2} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-summary">Weekly Summary</Label>
                      <p className="text-sm text-gray-500">Receive a weekly summary of your carbon emissions</p>
                    </div>
                    <Switch id="email-summary" checked={userData.notificationSettings.emailSummary} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-uploads">New Uploads</Label>
                      <p className="text-sm text-gray-500">Get notified when new files are uploaded and processed</p>
                    </div>
                    <Switch id="new-uploads" checked={userData.notificationSettings.newUploads} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="team-changes">Team Changes</Label>
                      <p className="text-sm text-gray-500">Get notified when team members are added or removed</p>
                    </div>
                    <Switch id="team-changes" checked={userData.notificationSettings.teamChanges} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emission-alerts">Emission Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified when emissions exceed predefined thresholds</p>
                    </div>
                    <Switch id="emission-alerts" checked={userData.notificationSettings.emissionAlerts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="product-updates">Product Updates</Label>
                      <p className="text-sm text-gray-500">Receive updates about new features and improvements</p>
                    </div>
                    <Switch id="product-updates" checked={userData.notificationSettings.productUpdates} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">Save Preferences</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Manage your API keys and access to the Carbonly.ai API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">API Key</h3>

                <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-1 font-mono text-sm truncate">
                      {showApiKey ? userData.apiKey : "•".repeat(userData.apiKey.length)}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showApiKey ? "Hide API key" : "Show API key"}</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={copyApiKey}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy API key</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <AlertDialog open={isResetApiKeyDialogOpen} onOpenChange={setIsResetApiKeyDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset API Key
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will invalidate your current API key and generate a new one. Any applications
                          using the current key will stop working.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={resetApiKey} className="bg-red-600 hover:bg-red-700 text-white">
                          Reset Key
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">API Documentation</h3>
                <p className="text-sm text-gray-600">
                  Learn how to use the Carbonly.ai API to integrate carbon emission tracking into your applications.
                </p>
                <div className="flex space-x-4">
                  <Button variant="outline">View Documentation</Button>
                  <Button variant="outline">API Reference</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security and authentication options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Change Password</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <Button className="bg-green-600 hover:bg-green-700">Update Password</Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="two-factor" />
                </div>

                <Button variant="outline" disabled>
                  Set Up Two-Factor Authentication
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Sessions</h3>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    You're currently signed in on this device. You can sign out of all other devices if you suspect
                    unauthorized access.
                  </p>

                  <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    Sign Out of All Other Devices
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will permanently delete your account and all associated data. This action cannot
                          be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

