"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  date: z.date({
    required_error: "A date is required",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  source: z.string().min(2, {
    message: "Source must be at least 2 characters",
  }),
  description: z.string().optional(),
  quantity: z.coerce.number().positive({
    message: "Quantity must be a positive number",
  }),
  unit: z.string({
    required_error: "Please select a unit",
  }),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function EmissionDataForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default form values
  const defaultValues: Partial<FormValues> = {
    date: new Date(),
    category: "scope2",
    source: "",
    description: "",
    quantity: undefined,
    unit: "kwh",
    notes: "",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // In a real app, this would call an API to save the data
      console.log("Form data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Emission data has been saved successfully",
      })

      // Navigate back to the emission data page
      router.push("/dashboard/emission-data")
    } catch (error) {
      console.error("Error saving emission data:", error)

      toast({
        title: "Error",
        description: "Failed to save emission data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emission Data Entry</CardTitle>
        <CardDescription>Add new emission data to your carbon inventory</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full pl-3 text-left font-normal">
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>The date when this emission occurred</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scope1">Scope 1 - Direct Emissions</SelectItem>
                        <SelectItem value="scope2">Scope 2 - Indirect Energy Emissions</SelectItem>
                        <SelectItem value="scope3">Scope 3 - Value Chain Emissions</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The emission scope category</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Electricity, Natural Gas" {...field} />
                    </FormControl>
                    <FormDescription>The source of the emission</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Office Building, Company Vehicle" {...field} />
                    </FormControl>
                    <FormDescription>Additional details about the emission source</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>The amount consumed</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kwh">kWh (Kilowatt Hours)</SelectItem>
                        <SelectItem value="mwh">MWh (Megawatt Hours)</SelectItem>
                        <SelectItem value="therm">Therms</SelectItem>
                        <SelectItem value="m3">m³ (Cubic Meters)</SelectItem>
                        <SelectItem value="l">L (Liters)</SelectItem>
                        <SelectItem value="gal">gal (Gallons)</SelectItem>
                        <SelectItem value="kg">kg (Kilograms)</SelectItem>
                        <SelectItem value="ton">ton (Metric Tons)</SelectItem>
                        <SelectItem value="km">km (Kilometers)</SelectItem>
                        <SelectItem value="mile">miles</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The unit of measurement</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information about this emission data"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional notes or comments</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/emission-data")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Emission Data"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

