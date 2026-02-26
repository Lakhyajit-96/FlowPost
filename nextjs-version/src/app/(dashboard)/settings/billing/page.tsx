"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutButton } from "@/components/checkout-button"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CreditCard, Calendar, DollarSign, TrendingUp, AlertCircle, Check } from "lucide-react"
import { toast } from "sonner"

interface PlanDetails {
  name: string
  price: string
  billingCycle: string
  nextBillingDate: string
  status: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

export default function BillingSettings() {
  const { user } = useUser()
  const [currentPlan, setCurrentPlan] = useState<PlanDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [managingBilling, setManagingBilling] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return

      const supabase = createClient()
      
      try {
        // First check subscriptions table
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        console.log('Subscription data:', subscription, 'Error:', subError)

        if (subscription) {
          // Capitalize plan name
          const planName = subscription.plan_name.charAt(0).toUpperCase() + 
                          subscription.plan_name.slice(1).toLowerCase()
          
          setCurrentPlan({
            name: planName,
            price: `$${planName === 'Starter' ? '19' : planName === 'Professional' ? '49' : planName === 'Agency' ? '99' : '0'}`,
            billingCycle: 'Monthly',
            nextBillingDate: subscription.current_period_end 
              ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              : '-',
            status: subscription.status,
            stripeSubscriptionId: subscription.stripe_subscription_id,
            stripeCustomerId: subscription.stripe_customer_id,
          })
        } else {
          // Check users table as fallback
          const { data: userData } = await supabase
            .from('users')
            .select('subscription_tier, subscription_status, stripe_customer_id')
            .eq('clerk_user_id', user.id)
            .single()

          console.log('User data:', userData)

          if (userData && userData.subscription_tier && userData.subscription_tier !== 'free') {
            const planName = userData.subscription_tier.charAt(0).toUpperCase() + 
                           userData.subscription_tier.slice(1).toLowerCase()
            
            setCurrentPlan({
              name: planName,
              price: `$${planName === 'Starter' ? '19' : planName === 'Professional' ? '49' : planName === 'Agency' ? '99' : '0'}`,
              billingCycle: 'Monthly',
              nextBillingDate: '-',
              status: userData.subscription_status || 'active',
              stripeCustomerId: userData.stripe_customer_id,
            })
          } else {
            // No subscription found
            setCurrentPlan({
              name: 'Free',
              price: '$0',
              billingCycle: 'Monthly',
              nextBillingDate: '-',
              status: 'active',
            })
          }
        }
      } catch (error) {
        console.error('Error fetching subscription:', error)
        setCurrentPlan({
          name: 'Free',
          price: '$0',
          billingCycle: 'Monthly',
          nextBillingDate: '-',
          status: 'active',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleManageBilling = async () => {
    if (!currentPlan?.stripeCustomerId) {
      toast.error('No active subscription found')
      return
    }

    setManagingBilling(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Failed to open billing portal')
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
      toast.error('Failed to open billing portal')
    } finally {
      setManagingBilling(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Plans & Billing</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const getPlanFeatures = (planName: string) => {
    switch (planName) {
      case 'Starter':
        return ['3 social media accounts', '30 posts per month', 'Basic analytics', 'Post scheduling', 'Email support']
      case 'Professional':
        return ['10 social media accounts', '100 posts per month', 'Advanced analytics', 'AI content generation', 'Priority support', 'Team collaboration']
      case 'Agency':
        return ['Unlimited social accounts', 'Unlimited posts', 'Advanced AI features', 'White-label reports', 'Dedicated support', 'API access']
      default:
        return ['1 social media account', '5 posts per month', 'Basic features']
    }
  }

  const getPlanPrice = (planName: string, yearly: boolean) => {
    const prices: { [key: string]: { monthly: number; yearly: number } } = {
      'Starter': { monthly: 19, yearly: 15 },
      'Professional': { monthly: 49, yearly: 39 },
      'Agency': { monthly: 99, yearly: 79 }
    }
    return yearly ? prices[planName]?.yearly || 0 : prices[planName]?.monthly || 0
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Plans & Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing information.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Plan</CardTitle>
                <Badge variant={currentPlan?.status === 'active' ? 'default' : currentPlan?.status === 'trialing' ? 'secondary' : 'outline'}>
                  {currentPlan?.status === 'trialing' ? 'Trial' : currentPlan?.status}
                </Badge>
              </div>
              <CardDescription>
                Your current subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{currentPlan?.name}</p>
                  <p className="text-sm text-muted-foreground">{currentPlan?.billingCycle}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{currentPlan?.price}</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Next billing date:</span>
                  <span className="text-sm font-medium">{currentPlan?.nextBillingDate}</span>
                </div>
                {currentPlan?.status === 'trialing' && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">You're currently on a trial period</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Plan Features:</p>
                {getPlanFeatures(currentPlan?.name || 'Free').map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Billing Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Management</CardTitle>
              <CardDescription>
                Manage your billing information and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  onClick={handleManageBilling}
                  variant="default"
                  className="w-full cursor-pointer"
                  disabled={managingBilling || currentPlan?.name === 'Free'}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {managingBilling ? 'Opening...' : 'Manage Billing'}
                </Button>
                {currentPlan?.name === 'Free' && (
                  <p className="text-xs text-muted-foreground text-center">
                    Subscribe to a plan to access billing management
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Payment Method</span>
                  </div>
                  <span className="text-sm font-medium">
                    {currentPlan?.name === 'Free' ? 'None' : 'Card ending in ••••'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Billing Status</span>
                  </div>
                  <Badge variant={currentPlan?.status === 'active' || currentPlan?.status === 'trialing' ? 'default' : 'destructive'}>
                    {currentPlan?.status === 'active' ? 'Active' : currentPlan?.status === 'trialing' ? 'Trial' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Quick Actions:</p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full cursor-pointer justify-start"
                    onClick={handleManageBilling}
                    disabled={currentPlan?.name === 'Free'}
                  >
                    Update Payment Method
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full cursor-pointer justify-start"
                    onClick={handleManageBilling}
                    disabled={currentPlan?.name === 'Free'}
                  >
                    View Billing History
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full cursor-pointer justify-start"
                    onClick={handleManageBilling}
                    disabled={currentPlan?.name === 'Free'}
                  >
                    Download Invoices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Choose a plan that works best for you. Start with a 14-day free trial.
              </CardDescription>
              
              {/* Billing Toggle */}
              <div className="flex flex-col items-center gap-3 pt-4">
                <ToggleGroup
                  type="single"
                  value={isYearly ? "yearly" : "monthly"}
                  onValueChange={(value: string) => setIsYearly(value === "yearly")}
                  className="bg-secondary text-secondary-foreground border-none rounded-full p-1 cursor-pointer shadow-none"
                >
                  <ToggleGroupItem
                    value="monthly"
                    className="data-[state=on]:bg-background data-[state=on]:border-border border-transparent border px-6 !rounded-full data-[state=on]:text-foreground hover:bg-transparent cursor-pointer transition-colors"
                  >
                    Monthly
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="yearly"
                    className="data-[state=on]:bg-background data-[state=on]:border-border border-transparent border px-6 !rounded-full data-[state=on]:text-foreground hover:bg-transparent cursor-pointer transition-colors"
                  >
                    Annually
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">Save 20%</span> with annual billing
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid gap-8 lg:grid-cols-3'>
                {/* Starter Plan */}
                <Card className={`flex flex-col pt-0 ${currentPlan?.name === 'Starter' ? 'border-primary' : ''}`}>
                  <CardHeader className='space-y-2 pt-8 text-center'>
                    <CardTitle className='text-2xl'>Starter</CardTitle>
                    <p className='text-muted-foreground text-sm text-balance'>Perfect for individuals and small businesses</p>
                  </CardHeader>
                  <CardContent className='flex flex-1 flex-col space-y-6'>
                    <div className='flex items-baseline justify-center'>
                      <span className='text-4xl font-bold'>${getPlanPrice('Starter', isYearly)}</span>
                      <span className='text-muted-foreground text-sm'>/month</span>
                    </div>
                    {isYearly && (
                      <p className="text-xs text-center text-muted-foreground">
                        Billed annually
                      </p>
                    )}
                    <div className='space-y-2'>
                      {['3 social media accounts', '30 posts per month', 'Basic analytics', 'Post scheduling', 'Email support'].map((feature, i) => (
                        <div key={i} className='flex items-center gap-2'>
                          <div className='bg-muted rounded-full p-1'>
                            <Check className="size-3.5" />
                          </div>
                          <span className='text-sm'>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    {currentPlan?.name === 'Starter' ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <CheckoutButton 
                        priceId={process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!}
                        planName="Starter"
                      >
                        {currentPlan?.name === 'Free' ? 'Start Free Trial' : 'Switch to Starter'}
                      </CheckoutButton>
                    )}
                  </div>
                </Card>

                {/* Professional Plan */}
                <Card className={`flex flex-col pt-0 border-primary relative shadow-lg ${currentPlan?.name === 'Professional' ? 'ring-2 ring-primary' : ''}`}>
                  <div className='absolute start-0 -top-3 w-full'>
                    <div className='mx-auto flex w-fit gap-1.5 rounded-full font-medium bg-primary text-primary-foreground px-3 py-1 text-xs'>
                      ✨ Most Popular
                    </div>
                  </div>
                  <CardHeader className='space-y-2 pt-8 text-center'>
                    <CardTitle className='text-2xl'>Professional</CardTitle>
                    <p className='text-muted-foreground text-sm text-balance'>Ideal for growing businesses</p>
                  </CardHeader>
                  <CardContent className='flex flex-1 flex-col space-y-6'>
                    <div className='flex items-baseline justify-center'>
                      <span className='text-4xl font-bold'>${getPlanPrice('Professional', isYearly)}</span>
                      <span className='text-muted-foreground text-sm'>/month</span>
                    </div>
                    {isYearly && (
                      <p className="text-xs text-center text-muted-foreground">
                        Billed annually
                      </p>
                    )}
                    <div className='space-y-2'>
                      {['10 social media accounts', '100 posts per month', 'Advanced analytics', 'AI content generation', 'Priority support', 'Team collaboration'].map((feature, i) => (
                        <div key={i} className='flex items-center gap-2'>
                          <div className='bg-muted rounded-full p-1'>
                            <Check className="size-3.5" />
                          </div>
                          <span className='text-sm'>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    {currentPlan?.name === 'Professional' ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <CheckoutButton 
                        priceId={process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID!}
                        planName="Professional"
                      >
                        {currentPlan?.name === 'Free' ? 'Start Free Trial' : 'Upgrade to Professional'}
                      </CheckoutButton>
                    )}
                  </div>
                </Card>

                {/* Agency Plan */}
                <Card className={`flex flex-col pt-0 ${currentPlan?.name === 'Agency' ? 'border-primary' : ''}`}>
                  <CardHeader className='space-y-2 pt-8 text-center'>
                    <CardTitle className='text-2xl'>Agency</CardTitle>
                    <p className='text-muted-foreground text-sm text-balance'>For agencies and large teams</p>
                  </CardHeader>
                  <CardContent className='flex flex-1 flex-col space-y-6'>
                    <div className='flex items-baseline justify-center'>
                      <span className='text-4xl font-bold'>${getPlanPrice('Agency', isYearly)}</span>
                      <span className='text-muted-foreground text-sm'>/month</span>
                    </div>
                    {isYearly && (
                      <p className="text-xs text-center text-muted-foreground">
                        Billed annually
                      </p>
                    )}
                    <div className='space-y-2'>
                      {['Unlimited social accounts', 'Unlimited posts', 'Advanced AI features', 'White-label reports', 'Dedicated support', 'API access'].map((feature, i) => (
                        <div key={i} className='flex items-center gap-2'>
                          <div className='bg-muted rounded-full p-1'>
                            <Check className="size-3.5" />
                          </div>
                          <span className='text-sm'>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    {currentPlan?.name === 'Agency' ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <CheckoutButton 
                        priceId={process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID!}
                        planName="Agency"
                      >
                        {currentPlan?.name === 'Free' ? 'Start Free Trial' : 'Upgrade to Agency'}
                      </CheckoutButton>
                    )}
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
