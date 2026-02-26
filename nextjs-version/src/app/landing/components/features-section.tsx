"use client"

import {
  Sparkles,
  Calendar,
  BarChart3,
  Users,
  ArrowRight,
  Clock,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image3D } from '@/components/image-3d'
import { AnimatedGrid, FloatingElements } from '@/components/effects'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'

const mainFeatures = [
  {
    icon: Sparkles,
    title: 'AI Content Generation',
    description: 'Create engaging posts, captions, and hashtags with AI in seconds.'
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Schedule posts across all platforms with optimal timing suggestions.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance, engagement, and growth with beautiful insights.'
  },
  {
    icon: Clock,
    title: 'Save 10+ Hours Weekly',
    description: 'Automate your social media workflow and focus on your business.'
  }
]

const secondaryFeatures = [
  {
    icon: Target,
    title: 'Multi-Platform Support',
    description: 'Manage Instagram, Facebook, Twitter, LinkedIn from one dashboard.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together with your team, assign tasks, and approve content.'
  },
  {
    icon: TrendingUp,
    title: 'Growth Insights',
    description: 'Understand what works and optimize your content strategy.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Beautiful, responsive interface that works seamlessly on any device.'
  }
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const ref2 = useRef(null)
  const isInView2 = useInView(ref2, { once: true, margin: "-100px" })

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-muted/30 overflow-hidden">
      {/* Background Effects */}
      <AnimatedGrid variant="dots" />
      <FloatingElements count={12} variant="shapes" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Powerful Features</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to master social media
          </h2>
          <p className="text-lg text-muted-foreground">
            FlowPost combines AI-powered content creation, smart scheduling, and analytics in one beautiful dashboard. 
            Built for small businesses who want results without complexity.
          </p>
        </motion.div>

        {/* First Feature Section */}
        <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16 mb-24">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Image3D
              lightSrc="/feature-1-light.png"
              darkSrc="/feature-1-dark.png"
              alt="AI Content Generation Dashboard"
              direction="left"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Create content that engages in seconds
              </h3>
              <p className="text-muted-foreground text-base text-pretty">
                Our AI understands your brand voice and generates compelling social media content instantly. 
                From catchy captions to trending hashtags, FlowPost helps you stay consistent and creative.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {mainFeatures.map((feature, index) => {
                const mouseX = useMotionValue(0)
                const mouseY = useMotionValue(0)
                const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
                const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                    style={{
                      rotateX,
                      rotateY,
                      transformStyle: "preserve-3d",
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const centerX = rect.left + rect.width / 2
                      const centerY = rect.top + rect.height / 2
                      mouseX.set((e.clientX - centerX) / rect.width)
                      mouseY.set((e.clientY - centerY) / rect.height)
                    }}
                    onMouseLeave={() => {
                      mouseX.set(0)
                      mouseY.set(0)
                    }}
                    className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors"
                  >
                    <motion.div
                      style={{ translateZ: 20 }}
                      className="mt-0.5 flex shrink-0 items-center justify-center"
                    >
                      <feature.icon className="size-5 text-primary" aria-hidden="true" />
                    </motion.div>
                    <motion.div style={{ translateZ: 10 }}>
                      <h3 className="text-foreground font-medium">{feature.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                    </motion.div>
                  </motion.li>
                )
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 pe-4 pt-2"
            >
              {/* Bouncing Primary Button */}
              <motion.div
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.94 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Button size="lg" className="cursor-pointer relative overflow-hidden group">
                  <a href="/sign-up" className='flex items-center'>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative z-10">Start Free Trial</span>
                    <motion.div
                      className="relative z-10"
                      animate={{ rotate: [0, 15, 0] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                    </motion.div>
                  </a>
                </Button>
              </motion.div>

              {/* Glowing Outline Button */}
              <motion.div
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.94 }}
              >
                <Button size="lg" variant="outline" className="cursor-pointer relative group">
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <a href="#pricing" className="relative z-10">
                    View Pricing
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Second Feature Section - Flipped Layout */}
        <div ref={ref2} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6 order-2 lg:order-1"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Grow your audience with data-driven insights
              </h3>
              <p className="text-muted-foreground text-base text-pretty">
                Track what matters with beautiful analytics. See which posts perform best, when your audience is most active, 
                and how your social presence is growing over time.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {secondaryFeatures.map((feature, index) => {
                const mouseX = useMotionValue(0)
                const mouseY = useMotionValue(0)
                const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
                const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView2 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                    style={{
                      rotateX,
                      rotateY,
                      transformStyle: "preserve-3d",
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const centerX = rect.left + rect.width / 2
                      const centerY = rect.top + rect.height / 2
                      mouseX.set((e.clientX - centerX) / rect.width)
                      mouseY.set((e.clientY - centerY) / rect.height)
                    }}
                    onMouseLeave={() => {
                      mouseX.set(0)
                      mouseY.set(0)
                    }}
                    className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors"
                  >
                    <motion.div
                      style={{ translateZ: 20 }}
                      className="mt-0.5 flex shrink-0 items-center justify-center"
                    >
                      <feature.icon className="size-5 text-primary" aria-hidden="true" />
                    </motion.div>
                    <motion.div style={{ translateZ: 10 }}>
                      <h3 className="text-foreground font-medium">{feature.title}</h3>
                      <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                    </motion.div>
                  </motion.li>
                )
              })}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 pe-4 pt-2"
            >
              {/* Ripple Effect Button */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Button size="lg" className="cursor-pointer relative overflow-hidden">
                  <a href="/dashboard" className='flex items-center'>
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full"
                      initial={{ scale: 0, opacity: 0.5 }}
                      whileHover={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">View Demo Dashboard</span>
                    <motion.div
                      className="relative z-10"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                    </motion.div>
                  </a>
                </Button>
              </motion.div>

              {/* Border Glow Button */}
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
              >
                <Button size="lg" variant="outline" className="cursor-pointer relative group">
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-primary/50"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <a href="#faq" className="relative z-10">
                    Learn More
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <Image3D
              lightSrc="/feature-2-light.png"
              darkSrc="/feature-2-dark.png"
              alt="Analytics and Performance Dashboard"
              direction="right"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
