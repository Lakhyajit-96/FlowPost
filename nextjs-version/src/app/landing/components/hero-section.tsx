"use client"

import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DotPattern } from '@/components/dot-pattern'
import { GradientOrbs, SpotlightEffect } from '@/components/effects'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent } from 'react'

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

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
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-16 sm:pt-20 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Dot pattern overlay using reusable component */}
        <DotPattern className="opacity-100" size="md" fadeStyle="ellipse" />
        {/* Gradient orbs */}
        <GradientOrbs count={3} />
        {/* Spotlight effect */}
        <SpotlightEffect size={800} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            className="mb-8 flex justify-center"
          >
            <Badge variant="outline" className="px-4 py-2 border-foreground">
              <Star className="w-3 h-3 mr-2 fill-current" />
              New: AI-Powered Content Generation
              <ArrowRight className="w-3 h-3 ml-2" />
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Social Media Management
            <motion.span
              className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {" "}Made Effortless{" "}
            </motion.span>
            with AI
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Create engaging content, schedule posts across all platforms, and grow your audience—all from one beautiful dashboard. 
            Built for small businesses and solopreneurs who want results without the complexity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
            className="flex justify-center"
          >
            {/* Primary CTA - Magnetic + 3D Tilt */}
            <motion.div
              whileHover={{ scale: 1.08, rotateZ: -2 }}
              whileTap={{ scale: 0.92 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Button size="lg" className="text-base cursor-pointer relative overflow-hidden group shadow-lg" asChild>
                <Link href="/sign-up">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/30 to-primary/0"
                    initial={{ x: '-100%', skewX: -15 }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  <motion.span
                    style={{ translateZ: 20 }}
                    className="relative z-10 flex items-center"
                  >
                    Get Started Free
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Image/Visual with 3D Effect */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="mx-auto mt-20 w-full max-w-[90rem] px-4"
        >
          <div className="relative group" style={{ transformStyle: "preserve-3d" }}>
            {/* Top background glow effect - positioned above the image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
              style={{ transform: "translateZ(20px)" }}
              className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"
            ></motion.div>

            <motion.div
              className="relative rounded-xl border bg-card shadow-2xl"
              style={{ transform: "translateZ(50px)" }}
            >
              {/* Light mode dashboard image */}
              <img
                src="/dashboard-light.png"
                alt="Dashboard Preview - Light Mode"
                className="w-full rounded-xl object-cover block dark:hidden"
              />

              {/* Dark mode dashboard image */}
              <img
                src="/dashboard-dark.png"
                alt="Dashboard Preview - Dark Mode"
                className="w-full rounded-xl object-cover hidden dark:block"
              />

              {/* Bottom fade effect - gradient overlay that fades the image to background */}
              <div className="absolute bottom-0 left-0 w-full h-32 md:h-40 lg:h-48 bg-gradient-to-b from-background/0 via-background/70 to-background rounded-b-xl"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
