"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import {
  ArrowUpDown,
  ChevronDown,
  CreditCard,
  Filter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Settings,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const subscriptions = [
  {
    id: "1",
    organization: "Acme Corp",
    plan: "Enterprise",
    status: "active",
    amount: "$499.00",
    billingCycle: "Monthly",
    nextBilling: "Nov 15, 2023",
    startDate: "Jan 15, 2023",
  },
  {
    id: "2",
    organization: "GreenTech",
    plan: "Pro",
    status: "active",
    amount: "$99.00",
    billingCycle: "Monthly",
    nextBilling: "Nov 3, 2023",
    startDate: "Feb 3, 2023",
  },
  {
    id: "3",
    organization: "EcoFriendly",
    plan: "Basic",
    status: "active",
    amount: "$49.00",
    billingCycle: "Monthly",
    nextBilling: "Nov 10, 2023",
    startDate: "Mar 10, 2023",
  },
  {
    id: "4",
    organization: "Sustainable Inc",
    plan: "Enterprise",
    status: "active",
    amount: "$5,388.00",
    billingCycle: "Annually",
    nextBilling: "Nov 22, 2023",
    startDate: "Nov 22, 2022",
  },
  {
    id: "5",
    organization: "Green Future",
    plan: "Basic",
    status: "past_due",
    amount: "$49.00",
    billingCycle: "Monthly",
    nextBilling: "Oct 5, 2023",
    startDate: "Apr 5, 2023",
  },
  {
    id: "6",
    organization: "Carbon Neutral",
    plan: "Pro",
    status: "active",
    amount: "$99.00",
    billingCycle: "Monthly",
    nextBilling: "Nov 12, 2023",
    startDate: "Dec 12, 2022",
  },
  {
    id: "7",
    organization: "Zero Waste",
    plan: "Free",
    status: "active",
    amount: "$0.00",
    billingCycle: "N/A",
    nextBilling: "N/A",
    startDate: "May 18, 2023",
  },
  {
    id: "8",
    organization: "Climate Action",
    plan: "Basic",
    status: "canceled",
    amount: "$49.00",
    billingCycle: "Monthly",
    nextBilling: "N/A",
    startDate: "Feb 28, 2023",
  },
]

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    billingCycle: "N/A",
    features: ["1 project", "Basic emission tracking", "Standard reports", "Email support"],
    status: "active",
  },
  {
    id: "basic",
    name: "Basic",
    price: "$49",
    billingCycle: "Monthly",
    features: ["5 projects", "Advanced emission tracking", "Custom reports", "Priority email support", "API access"],
    status: "active",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99",
    billingCycle: "Monthly",
    features: [
      "15 projects",
      "Advanced emission tracking",
      "Custom reports",
      "Priority email support",
      "API access",
      "Team collaboration",
      "Data export",
    ],
    status: "active",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$499",
    billingCycle: "Monthly",
    features: [
      "Unlimited projects",
      "Advanced emission tracking",
      "Custom reports",
      "Priority email support",
      "API access",
      "Team collaboration",
      "Data export",
      "Dedicated account manager",
      "Custom integrations",
      "SSO",
    ],
    status: "active",
  },
]

export function SubscriptionManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(plans[0])

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Tabs defaultValue="subscriptions" className="space-y-4">
      <TabsList>
        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        <TabsTrigger value="plans">Plans</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
      </TabsList>

      <TabsContent value="subscriptions">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>Manage organization subscriptions and billing.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscriptions..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Past Due</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Canceled</DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Plan</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked>Free</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Basic</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Pro</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Enterprise</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <span>Organization</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 hover:bg-transparent">
                        <span>Plan</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Billing Cycle</TableHead>
                    <TableHead>Next Billing</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.organization}</TableCell>
                      <TableCell>{subscription.plan}</TableCell>
                      <TableCell>{subscription.amount}</TableCell>
                      <TableCell>{subscription.billingCycle}</TableCell>
                      <TableCell>{subscription.nextBilling}</TableCell>
                      <TableCell>{subscription.startDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subscription.status === "active"
                              ? "default"
                              : subscription.status === "past_due"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {subscription.status === "active"
                            ? "Active"
                            : subscription.status === "past_due"
                              ? "Past Due"
                              : "Canceled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Change plan</DropdownMenuItem>
                            <DropdownMenuItem>View invoices</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Cancel subscription</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="plans">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>Manage available subscription plans and pricing.</CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Plan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <Card key={plan.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold">{plan.price}</span>
                      {plan.billingCycle !== "N/A" && (
                        <span className="text-sm">/{plan.billingCycle.toLowerCase()}</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4 text-primary"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                      {plan.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                    <Dialog
                      open={isEditPlanOpen && selectedPlan.id === plan.id}
                      onOpenChange={(open) => {
                        setIsEditPlanOpen(open)
                        if (open) setSelectedPlan(plan)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Plan</DialogTitle>
                          <DialogDescription>Update the plan details and features.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan-name" className="text-right">
                              Name
                            </Label>
                            <Input id="plan-name" defaultValue={selectedPlan.name} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan-price" className="text-right">
                              Price
                            </Label>
                            <Input
                              id="plan-price"
                              defaultValue={selectedPlan.price.replace("$", "")}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="billing-cycle" className="text-right">
                              Billing Cycle
                            </Label>
                            <Select defaultValue={selectedPlan.billingCycle.toLowerCase()}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select billing cycle" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="annually">Annually</SelectItem>
                                <SelectItem value="n/a">N/A</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plan-status" className="text-right">
                              Status
                            </Label>
                            <Select defaultValue={selectedPlan.status}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditPlanOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsEditPlanOpen(false)}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invoices">
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>View and manage all invoices across organizations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search invoices..." className="pl-8" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>INV-001</TableCell>
                    <TableCell>Acme Corp</TableCell>
                    <TableCell>$499.00</TableCell>
                    <TableCell>Oct 15, 2023</TableCell>
                    <TableCell>
                      <Badge variant="default">Paid</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV-002</TableCell>
                    <TableCell>GreenTech</TableCell>
                    <TableCell>$99.00</TableCell>
                    <TableCell>Oct 3, 2023</TableCell>
                    <TableCell>
                      <Badge variant="default">Paid</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV-003</TableCell>
                    <TableCell>EcoFriendly</TableCell>
                    <TableCell>$49.00</TableCell>
                    <TableCell>Oct 10, 2023</TableCell>
                    <TableCell>
                      <Badge variant="default">Paid</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV-004</TableCell>
                    <TableCell>Green Future</TableCell>
                    <TableCell>$49.00</TableCell>
                    <TableCell>Oct 5, 2023</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Unpaid</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Collect
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

