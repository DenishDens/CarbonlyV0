"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Calendar, CheckCircle } from "lucide-react"

export default function SubscriptionManager() {
  const [activeTab, setActiveTab] = useState("plan")

  // Mock data - in a real app, this would come from your API
  const subscriptionData = {
    plan: "Professional",
    status: "active",
    billingCycle: "monthly",
    nextBillingDate: "2023-05-15",
    price: 40,
    userLimit: 100,
    currentUsers: 42,
    features: ["Up to 100 users", "Advanced AI analytics", "Custom emission factors", "API access", "Priority support"],
    paymentMethod: {
      type: "credit_card",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      brand: "Visa",
    },
    invoices: [
      { id: "INV-001", date: "2023-04-15", amount: 40.0, status: "paid" },
      { id: "INV-002", date: "2023-03-15", amount: 40.0, status: "paid" },
      { id: "INV-003", date: "2023-02-15", amount: 40.0, status: "paid" },
    ],
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Manage your subscription plan and billing</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Plan</p>
              <p className="text-lg font-semibold">{subscriptionData.plan}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Billing Cycle</p>
              <p className="text-lg font-semibold capitalize">{subscriptionData.billingCycle}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Next Billing Date</p>
              <p className="text-lg font-semibold">{new Date(subscriptionData.nextBillingDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-500">
                Users ({subscriptionData.currentUsers}/{subscriptionData.userLimit})
              </p>
              <p className="text-sm text-gray-500">
                {Math.round((subscriptionData.currentUsers / subscriptionData.userLimit) * 100)}%
              </p>
            </div>
            <Progress value={(subscriptionData.currentUsers / subscriptionData.userLimit) * 100} className="h-2" />
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button variant="outline">Change Plan</Button>
            <Button variant="outline">Update Billing Info</Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="plan" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="plan">Plan Details</TabsTrigger>
          <TabsTrigger value="payment">Payment Method</TabsTrigger>
          <TabsTrigger value="invoices">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>Your current plan features and limitations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{subscriptionData.plan} Plan</h3>
                  <p className="text-2xl font-bold mb-6">
                    ${subscriptionData.price}
                    <span className="text-sm font-normal text-gray-500">/user/month</span>
                  </p>
                  <ul className="space-y-3">
                    {subscriptionData.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Need More?</h3>
                  <p className="text-gray-600 mb-6">
                    Contact our sales team to discuss custom enterprise plans with unlimited users and advanced
                    features.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">Contact Sales</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment methods and billing information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <div className="mr-4">
                      <CreditCard className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {subscriptionData.paymentMethod.brand} ending in {subscriptionData.paymentMethod.last4}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {subscriptionData.paymentMethod.expiryMonth}/{subscriptionData.paymentMethod.expiryYear}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Default payment method</p>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button>Add Payment Method</Button>
                  <Button variant="outline">Update Billing Address</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionData.invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-medium mr-4">${invoice.amount.toFixed(2)}</p>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mr-4">{invoice.status}</Badge>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

