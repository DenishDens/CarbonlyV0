"use client"

import { useEffect, useState } from "react"
import { Check, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/supabase"

type Tables = Database["public"]["Tables"]
type Functions = Database["public"]["Functions"]
type Subscription = Tables["subscriptions"]["Row"]
type SubscriptionPlan = Tables["subscription_plans"]["Row"]
type BillingHistoryResponse = Functions["get_billing_history"]
type BillingHistory = BillingHistoryResponse["Returns"][number]

interface SubscriptionDetailsProps {
  organizationId: string
}

export function SubscriptionDetails({ organizationId }: SubscriptionDetailsProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userCount, setUserCount] = useState<number>(0)

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const supabase = createClient()

        // Fetch subscription with type checking
        const { data: subData, error: subError } = await supabase
          .from("subscriptions")
          .select()
          .eq("organization_id", organizationId)
          .single()

        if (subError) throw subError

        if (!subData) {
          setError("No subscription found for this organization")
          setLoading(false)
          return
        }

        setSubscription(subData as Subscription)

        // Fetch plan details with type checking
        const { data: planData, error: planError } = await supabase
          .from("subscription_plans")
          .select()
          .eq("id", subData.plan_id)
          .single()

        if (planError) throw planError

        if (!planData) {
          setError("Subscription plan details not found")
          setLoading(false)
          return
        }

        setPlan(planData as SubscriptionPlan)

        // Fetch user count
        const { count, error: userError } = await supabase
          .from("user_profiles")
          .select("*", { count: "exact", head: true })
          .eq("organization_id", organizationId)

        if (userError) throw userError

        setUserCount(count || 0)

        // Fetch billing history using the stored procedure
        const { data: billingData, error: billingError } = await supabase
          .rpc("get_billing_history", { org_id: organizationId })

        if (billingError) {
          console.error("Error fetching billing history:", billingError)
        } else if (billingData) {
          setBillingHistory(billingData as BillingHistory[])
        }

        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching subscription details:", err)
        setError("Failed to load subscription details. Please try again later.")
        setLoading(false)
      }
    }

    if (organizationId) {
      fetchSubscriptionDetails()
    }
  }, [organizationId])

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading subscription details...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (error || !subscription || !plan) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error || "Failed to load subscription details"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userPercentage = Math.round((userCount / (plan.max_users || 1)) * 100)
  const nextBillingDate = subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : "N/A"
  const isCanceled = subscription.status === "canceled" || subscription.cancel_at_period_end

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Subscription Management</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Subscription</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your subscription plan and billing</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm ${
                subscription.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : subscription.status === "past_due"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isCanceled ? "Canceled" : subscription.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Plan</div>
              <div className="font-medium">{plan.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Billing Cycle</div>
              <div className="font-medium capitalize">{plan.interval}ly</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Next Billing Date</div>
              <div className="font-medium">{nextBillingDate}</div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>
                Users ({userCount}/{plan.max_users || 1})
              </span>
              <span>{userPercentage}%</span>
            </div>
            <Progress value={userPercentage} />
          </div>

          <div className="flex gap-4">
            {!isCanceled && (
              <>
                <Button variant="outline" onClick={() => alert("Change Plan")}>
                  Change Plan
                </Button>
                <Button variant="outline" onClick={() => alert("Update Billing Info")}>
                  Update Billing Info
                </Button>
                <Button variant="outline" className="text-red-600 hover:text-red-600">
                  Cancel Subscription
                </Button>
              </>
            )}
            {isCanceled && (
              <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                Reactivate Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="plan-details">
        <TabsList>
          <TabsTrigger value="plan-details">Plan Details</TabsTrigger>
          <TabsTrigger value="payment-method">Payment Method</TabsTrigger>
          <TabsTrigger value="billing-history">Billing History</TabsTrigger>
        </TabsList>
        <TabsContent value="plan-details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(plan.features as Record<string, boolean>).map(([feature, included]) => (
                  <div key={feature} className="flex items-center gap-2">
                    {included && <Check className="h-4 w-4 text-emerald-600" />}
                    <span className="capitalize">{feature.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment-method" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              {subscription.stripe_customer_id ? (
                <div className="flex items-center gap-4">
                  <CreditCard className="h-8 w-8" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No payment method on file</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.length > 0 ? (
                  billingHistory.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between border-b py-4 last:border-0">
                      <div>
                        <p className="font-medium">
                          {new Date(bill.billing_date).toLocaleDateString()} - {bill.status}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bill.currency.toUpperCase()} {bill.amount.toFixed(2)}
                        </p>
                      </div>
                      {bill.invoice_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={bill.invoice_url} target="_blank" rel="noopener noreferrer">
                            View Invoice
                          </a>
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No billing history available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
