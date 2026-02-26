"use client"

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { GradientOrbs } from '@/components/effects'
import { useState, useRef, MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small businesses',
    monthlyPrice: 19,
    yearlyPrice: 15,
    features: [
      '3 social media accounts',
      '30 posts per month',
      '10 AI generations per month',
      'Basic analytics',
      'Post scheduling',
      'Email support'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Professional',
    description: 'Ideal for growing businesses',
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      '10 social media accounts',
      '100 posts per month',
      '50 AI generations per month',
      'Advanced analytics',
      'AI content generation',
      'Priority support',
      'Team collaboration'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Agency',
    description: 'For agencies and large teams',
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      'Unlimited social accounts',
      'Unlimited posts',
      'Unlimited AI generations',
      'Advanced AI features',
      'White-label reports',
      'Dedicated support',
      'API access'
    ],
    cta: 'Start Free Trial',
    popular: false
  }
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-muted/40 overflow-hidden">
      {/* Background Effects */}
      <GradientOrbs count={2} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">Pricing Plans</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-2">
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
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">Save 20%</span> with annual billing
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mx-auto max-w-6xl"
          style={{ perspective: "1500px" }}
        >
          <div className="rounded-xl border">
            <div className="grid lg:grid-cols-3">
              {plans.map((plan, index) => {
                const PricingCard = () => {
                  const ref = useRef<HTMLDivElement>(null)
                  const x = useMotionValue(0)
                  const y = useMotionValue(0)

                  const mouseXSpring = useSpring(x)
                  const mouseYSpring = useSpring(y)

                  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
                  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

                  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
                    if (!ref.current) return
                    const rect = ref.current.getBoundingClientRect()
                    const width = rect.width
                    const height = rect.height
                    const mouseX = e.clientX - rect.left
                    const mouseY = e.clientY - rect.top
                    const xPct = mouseX / width - 0.5
                    const yPct = mouseY / height - 0.5
                    x.set(xPct)
                    y.set(yPct)
                  }

                  const handleMouseLeave = () => {
                    x.set(0)
                    y.set(0)
                  }

                  return (
                    <motion.div
                      ref={ref}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                      style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                      }}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      className={`p-8 grid grid-rows-subgrid row-span-4 gap-6 ${
                        plan.popular
                          ? 'my-2 mx-4 rounded-xl bg-card border-transparent shadow-xl ring-1 ring-foreground/10'
                          : ''
                      }`}
                    >
                      {/* Plan Header */}
                      <div style={{ transform: "translateZ(30px)" }}>
                        <div className="text-lg font-medium tracking-tight mb-2">{plan.name}</div>
                        <div className="text-muted-foreground text-balance text-sm">{plan.description}</div>
                      </div>

                      {/* Pricing */}
                      <div style={{ transform: "translateZ(50px)" }}>
                        <motion.div
                          key={isYearly ? 'yearly' : 'monthly'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-4xl font-bold mb-1"
                        >
                          ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </motion.div>
                        <div className="text-muted-foreground text-sm">
                          Per month{isYearly ? ', billed annually' : ''}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div style={{ transform: "translateZ(40px)" }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            className={`w-full cursor-pointer my-2 ${
                              plan.popular
                                ? 'shadow-md border-[0.5px] border-white/25 shadow-black/20 bg-primary ring-1 ring-primary/15 text-primary-foreground hover:bg-primary/90'
                                : 'shadow-sm shadow-black/15 border border-transparent bg-background ring-1 ring-foreground/10 hover:bg-muted/50'
                            }`}
                            variant={plan.popular ? 'default' : 'secondary'}
                            asChild
                          >
                            <a href="/sign-up">{plan.cta}</a>
                          </Button>
                        </motion.div>
                      </div>

                      {/* Features */}
                      <div style={{ transform: "translateZ(20px)" }}>
                        <ul role="list" className="space-y-3 text-sm">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-3">
                              <Check className="text-muted-foreground size-4 flex-shrink-0" strokeWidth={2.5} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )
                }

                return <PricingCard key={index} />
              })}
            </div>
          </div>
        </motion.div>

        {/* Enterprise Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="text-muted-foreground">
            Need a custom plan for your enterprise? {' '}
            {/* Underline Link Button with 3D effect */}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Button variant="link" className="p-0 h-auto cursor-pointer relative group" asChild>
                <a href="#contact">
                  <span className="relative inline-block" style={{ transform: 'translateZ(10px)' }}>
                    Contact sales
                    <motion.span
                      className="absolute bottom-0 left-0 h-[2px] bg-primary block"
                      initial={{ width: '0%' }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                </a>
              </Button>
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
