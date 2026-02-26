"use client"

import { useState } from 'react'
import { Check, X, Zap, Shield, Users, BarChart3, Sparkles, HeadphonesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckoutButton } from '@/components/checkout-button'
import { useUser } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const plans = [
  {
    name: 'Starter',
    price: 19,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
    description: 'Perfect for individuals and small businesses',
    features: [
      '3 social media accounts',
      '30 posts per month',
      '10 AI generations per month',
      'Basic analytics',
      'Post scheduling',
      'Email support',
    ],
    notIncluded: [
      'AI content generation (advanced)',
      'Team collaboration',
      'Advanced analytics',
      'Priority support',
    ],
  },
  {
    name: 'Professional',
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID!,
    description: 'Ideal for growing businesses',
    features: [
      '10 social media accounts',
      '100 posts per month',
      '50 AI generations per month',
      'Advanced analytics',
      'AI content generation',
      'Priority support',
      'Team collaboration',
    ],
    notIncluded: [
      'White-label reports',
      'API access',
      'Unlimited AI generations',
    ],
    popular: true,
  },
  {
    name: 'Agency',
    price: 99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID!,
    description: 'For agencies and large teams',
    features: [
      'Unlimited social accounts',
      'Unlimited posts',
      'Unlimited AI generations',
      'Advanced AI features',
      'White-label reports',
      'Dedicated support',
      'API access',
    ],
    notIncluded: [],
  },
]

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Schedule posts in seconds with our intuitive interface',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security for your social accounts',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with your team',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track performance with detailed insights',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Generate engaging content with AI assistance',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Get help whenever you need it',
  },
]

export default function PricingPage() {
  const { isSignedIn } = useUser()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="flex-1 space-y-8 px-4 lg:px-6 pt-0">
      {/* Header */}
      <div className="flex flex-col gap-3 text-center max-w-3xl mx-auto">
        <Badge variant="secondary" className="w-fit mx-auto text-xs px-3 py-1">
          Pricing Plans
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Choose Your Perfect Plan</h1>
        <p className="text-sm text-muted-foreground">
          Start your 14-day free trial. No credit card required. Cancel anytime.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors hover:bg-muted/80"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${
              billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}`}>
          Yearly
        </span>
        {billingCycle === 'yearly' && (
          <Badge variant="default" className="text-xs px-2 py-0.5">Save 20%</Badge>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-4 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="text-xs px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-xs">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  ${billingCycle === 'yearly' ? Math.round(plan.price * 0.8) : plan.price}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Billed ${Math.round(plan.price * 0.8 * 12)} yearly
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <Separator />
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 opacity-50">
                    <X className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              {isSignedIn ? (
                <CheckoutButton
                  priceId={plan.priceId}
                  planName={plan.name.toLowerCase()}
                  className="w-full h-9 text-sm"
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Start Free Trial
                </CheckoutButton>
              ) : (
                <Button asChild className="w-full h-9 text-sm" variant={plan.popular ? 'default' : 'outline'}>
                  <a href="/sign-up">Get Started</a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Everything You Need to Succeed</h2>
          <p className="text-sm text-muted-foreground">
            Powerful features to help you manage your social media presence
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Can I change plans later?</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">
                We accept all major credit cards, debit cards, and PayPal through our secure payment processor Stripe.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Is there a free trial?</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">
                Yes! All plans come with a 14-day free trial. No credit card required to start.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Join thousands of businesses already using FlowPost to manage their social media.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="sm">
            <a href="/sign-up">Start Free Trial</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="/landing#contact">Contact Sales</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
