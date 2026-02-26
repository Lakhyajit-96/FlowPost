"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CardDecorator } from '@/components/ui/card-decorator'
import { Sparkles, Clock, TrendingUp, Shield } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent } from 'react'

const values = [
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description: 'Advanced AI creates engaging content tailored to your brand voice and audience preferences.'
  },
  {
    icon: Clock,
    title: 'Time-Saving',
    description: 'Automate your social media workflow and reclaim 10+ hours every week for what matters most.'
  },
  {
    icon: TrendingUp,
    title: 'Growth-Focused',
    description: 'Data-driven insights help you understand what works and optimize your content strategy for maximum engagement.'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Bank-level encryption and 99.9% uptime ensure your content and data are always safe and accessible.'
  }
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Why FlowPost
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Social media management that actually works
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We built FlowPost because we know how overwhelming social media can be for small businesses. 
            Our mission is simple: make social media management effortless, effective, and affordable for everyone.
          </p>
        </motion.div>

        {/* Modern Values Grid with Enhanced Design */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 mb-12" style={{ perspective: "1500px" }}>
          {values.map((value, index) => {
            const ValueCard = () => {
              const ref = useRef<HTMLDivElement>(null)
              const x = useMotionValue(0)
              const y = useMotionValue(0)

              const mouseXSpring = useSpring(x)
              const mouseYSpring = useSpring(y)

              const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"])
              const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"])

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
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
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
                  <Card className='group shadow-xs py-2 h-full'>
                    <CardContent className='p-8' style={{ transform: "translateZ(40px)" }}>
                      <div className='flex flex-col items-center text-center'>
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                          style={{ transform: "translateZ(60px)" }}
                        >
                          <CardDecorator>
                            <value.icon className='h-6 w-6' aria-hidden />
                          </CardDecorator>
                        </motion.div>
                        <h3 className='mt-6 font-medium text-balance'>{value.title}</h3>
                        <p className='text-muted-foreground mt-3 text-sm'>{value.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            }

            return <ValueCard key={index} />
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-muted-foreground">🚀 Join thousands of businesses growing their social presence</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Pulsing Primary Button */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Button size="lg" className="cursor-pointer relative overflow-hidden group shadow-lg" asChild>
                <a href="/sign-up">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: '200% 100%' }}
                  />
                  <motion.span
                    style={{ translateZ: 20 }}
                    className="relative z-10"
                  >
                    Start Free Trial
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{ boxShadow: ['0 0 0 0 rgba(192, 132, 252, 0.7)', '0 0 0 10px rgba(192, 132, 252, 0)'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </a>
              </Button>
            </motion.div>

            {/* Floating Outline Button */}
            <motion.div
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.92 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button size="lg" variant="outline" className="cursor-pointer relative group shadow-md" asChild>
                <a href="#pricing">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative z-10">View Pricing</span>
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
