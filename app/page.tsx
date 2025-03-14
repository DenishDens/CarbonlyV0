'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, FileText, Users, Database, Brain, Menu } from "lucide-react"
import { useState } from "react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  highlighted?: boolean
}

interface ContactFormData {
  name: string
  email: string
  message: string
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="relative z-30 w-full">
        <div className="container flex items-center justify-between py-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-leaf h-6 w-6 text-white"
              aria-hidden="true"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
            </svg>
            <h1 className="text-2xl font-bold text-white">Carbonly.ai</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-200 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-200 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#contact" className="text-gray-200 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-white/10 text-gray-900 border-white hover:bg-white/20" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 hidden md:inline-flex" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/90 z-10" />
          <Image
            src="/hero-bg.jpg"
            alt="Sustainability background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="container relative z-20 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">CARBONLY</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-3xl">
              Reduce your carbon impact today!
            </h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
              AI-powered carbon emission tracking and analysis for organizations committed to sustainability
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <Link href="/signup">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-gray-800 border-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Comprehensive Carbon Management</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform helps you track, analyze, and reduce your organization's carbon footprint
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-green-600" />}
              title="AI Document Scanning"
              description="Upload any file type and our AI engine will automatically extract and analyze carbon emission data"
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-green-600" />}
              title="Emission Analytics"
              description="Track emissions across Scope 1, 2, and 3 categories with detailed reporting and insights"
            />
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-green-600" />}
              title="Predictive AI"
              description="Leverage AI predictions to forecast future emissions and identify reduction opportunities"
            />
            <FeatureCard
              icon={<Database className="h-10 w-10 text-green-600" />}
              title="Material Library"
              description="Configure and customize emission factors for accurate carbon calculations"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-green-600" />}
              title="Team Collaboration"
              description="Invite team members and external stakeholders to collaborate on sustainability projects"
            />
            <FeatureCard
              icon={<ArrowRight className="h-10 w-10 text-green-600" />}
              title="REST API"
              description="Integrate carbon data with your existing systems using our comprehensive API"
            />
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="bg-gray-50 py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Pay only for what you need with our user-based subscription model
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Starter"
              price="$20"
              description="Perfect for small teams just getting started with carbon tracking"
              features={["Up to 50 users", "AI document scanning", "Basic emission analytics", "Email support"]}
              buttonText="Start Free Trial"
            />
            <PricingCard
              title="Professional"
              price="$40"
              description="For growing organizations with advanced sustainability needs"
              features={[
                "51-100 users",
                "Advanced AI analytics",
                "Custom emission factors",
                "API access",
                "Priority support",
              ]}
              buttonText="Start Free Trial"
              highlighted={true}
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              description="For large organizations with complex sustainability requirements"
              features={[
                "Unlimited users",
                "Advanced AI predictions",
                "Custom integrations",
                "Dedicated account manager",
                "SLA guarantees",
              ]}
              buttonText="Contact Sales"
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-slate-900 py-20 text-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Contact Us</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Get in touch with our team to learn more about how we can help your organization reduce its carbon footprint.
            </p>
          </div>
          <div className="text-center">
            <Button className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 text-gray-400">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white">CARBONLY</h3>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="#contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Carbonly.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="mb-4" aria-hidden="true">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingCard({ title, price, description, features, buttonText, highlighted = false }: PricingCardProps) {
  return (
    <div className={`bg-white p-8 rounded-lg shadow-md border ${highlighted ? 'border-green-500' : 'border-gray-100'} hover:shadow-lg transition-shadow`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <div className="text-4xl font-bold text-gray-900 mb-4">{price}</div>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <svg
              className="h-5 w-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button className={`w-full ${highlighted ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-900 hover:bg-gray-800'}`}>
        {buttonText}
      </Button>
    </div>
  )
}

