"use client"

import {
  Clock,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DotPattern } from '@/components/dot-pattern'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent } from 'react'


const stats = [
  {
    icon: Clock,
    value: '10+',
    label: 'Hours Saved',
    description: 'Per week on average'
  },
  {
    icon: TrendingUp,
    value: '3x',
    label: 'More Engagement',
    description: 'With AI-optimized content'
  },
  {
    icon: Users,
    value: '5+',
    label: 'Platforms',
    description: 'Managed from one place'
  },
  {
    icon: Zap,
    value: '99.9%',
    label: 'Uptime',
    description: 'Reliable & fast'
  }
]

function StatCard({ stat, index }: { stat: typeof stats[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

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
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="text-center bg-background/90 border-border/50 py-0 h-full">
        <CardContent className="p-6" style={{ transform: "translateZ(50px)" }}>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            style={{ transform: "translateZ(75px)" }}
            className="flex justify-center mb-4"
          >
            <div className="p-3 bg-primary/10 rounded-xl">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
          </motion.div>
          <div className="space-y-1">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
              style={{ transform: "translateZ(25px)" }}
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              {stat.value}
            </motion.h3>
            <p className="font-semibold text-foreground">{stat.label}</p>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <section className="py-12 sm:py-16 relative">
      {/* Background with transparency */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent to-secondary/20" />
      <DotPattern className="opacity-75" size="md" fadeStyle="circle" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" style={{ perspective: "1000px" }}>
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
