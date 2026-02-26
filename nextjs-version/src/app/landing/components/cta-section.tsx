"use client"

import { ArrowRight, Sparkles, Calendar, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AnimatedGrid, GradientOrbs, SpotlightEffect } from '@/components/effects'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function CTASection() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })

  return (
    <section className='relative py-16 lg:py-24 bg-muted/80 overflow-hidden'>
      {/* Background Effects */}
      <AnimatedGrid variant="lines" />
      <GradientOrbs count={3} />
      <SpotlightEffect size={700} />
      
      <div className='container mx-auto px-4 lg:px-8 relative z-10'>
        <motion.div
          className='mx-auto max-w-4xl'
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            perspective: 1000,
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
        >
          <div className='text-center'>
            <div className='space-y-8'>
              {/* Badge and Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ translateZ: 40 }}
                className='flex flex-col items-center gap-4'
              >
                <Badge variant='outline' className='flex items-center gap-2'>
                  <Sparkles className='size-3' />
                  AI-Powered Platform
                </Badge>

                <div className='text-muted-foreground flex items-center gap-4 text-sm'>
                  <span className='flex items-center gap-1'>
                    <div className='size-2 rounded-full bg-green-500' />
                    14-Day Free Trial
                  </span>
                  <Separator orientation='vertical' className='!h-4' />
                  <span>No Credit Card</span>
                  <Separator orientation='vertical' className='!h-4' />
                  <span>Cancel Anytime</span>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                style={{ translateZ: 30 }}
                className='space-y-6'
              >
                <h1 className='text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl'>
                  Ready to transform your
                  <span className='flex sm:inline-flex justify-center'>
                    <span className='relative mx-2'>
                      <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                        social media
                      </span>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        className='absolute start-0 -bottom-2 h-1 w-full bg-gradient-to-r from-primary/30 to-secondary/30 origin-left'
                      />
                    </span>
                    game?
                  </span>
                </h1>

                <p className='text-muted-foreground mx-auto max-w-2xl text-balance lg:text-xl'>
                  Join thousands of businesses using FlowPost to save time, create better content, 
                  and grow their social media presence. Start your free trial today—no credit card required.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                style={{ translateZ: 50 }}
                className='flex flex-col justify-center gap-4 sm:flex-row sm:gap-6'
              >
                {/* Sparkle Primary Button */}
                <motion.div
                  whileHover={{ scale: 1.1, rotateZ: -3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Button size='lg' className='cursor-pointer px-8 py-6 text-lg font-medium relative overflow-hidden group shadow-2xl' asChild>
                    <a href='/sign-up'>
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          background: [
                            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.span style={{ translateZ: 30 }} className="relative z-10 flex items-center">
                        <Sparkles className='me-2 size-5' />
                        Start Free Trial
                      </motion.span>
                    </a>
                  </Button>
                </motion.div>

                {/* Morphing Outline Button */}
                <motion.div
                  whileHover={{ scale: 1.1, rotateZ: 3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Button variant='outline' size='lg' className='cursor-pointer px-8 py-6 text-lg font-medium group relative shadow-lg' asChild>
                    <a href='/dashboard'>
                      <motion.div
                        className="absolute inset-0 border-2 border-primary rounded-lg"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.span style={{ translateZ: 25 }} className="relative z-10 flex items-center">
                        <BarChart3 className='me-2 size-5' />
                        View Demo
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight className='ms-2 size-4 transition-transform group-hover:translate-x-1' />
                        </motion.div>
                      </motion.span>
                    </a>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                style={{ translateZ: 20 }}
                className='text-muted-foreground flex flex-wrap items-center justify-center gap-6 text-sm'
              >
                {[
                  { color: 'bg-green-600 dark:bg-green-400', text: '14-day free trial' },
                  { color: 'bg-blue-600 dark:bg-blue-400', text: 'No credit card required' },
                  { color: 'bg-gray-600 dark:bg-gray-400', text: 'Cancel anytime' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className='flex items-center gap-2'
                  >
                    <div className={`size-2 rounded-full ${item.color} me-1`} />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
