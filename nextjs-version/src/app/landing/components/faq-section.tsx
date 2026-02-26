"use client"

import { CircleHelp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { AnimatedBeams, GradientOrbs } from '@/components/effects'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

type FaqItem = {
  value: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    value: 'item-1',
    question: 'How does the 14-day free trial work?',
    answer:
      'Start using FlowPost immediately with full access to all features. No credit card required to begin. After 14 days, choose a plan that fits your needs or continue with our free tier. Cancel anytime with no questions asked.',
  },
  {
    value: 'item-2',
    question: 'Which social media platforms does FlowPost support?',
    answer:
      'FlowPost currently supports Instagram, Facebook, Twitter (X), LinkedIn, YouTube, and Pinterest. We\'re constantly adding new platforms based on user demand. All plans include access to these major platforms.',
  },
  {
    value: 'item-3',
    question: 'How does the AI content generation work?',
    answer:
      'Our AI analyzes your brand voice, industry, and past successful posts to generate relevant content suggestions. Simply provide a topic or keyword, and FlowPost creates engaging captions, hashtags, and post ideas tailored to your audience. You maintain full control to edit and customize everything.',
  },
  {
    value: 'item-4',
    question: 'Can I manage multiple brands or clients?',
    answer:
      'Yes! The Professional plan supports up to 3 brands, while the Agency plan allows 10+ brands with unlimited team members. Perfect for agencies, consultants, or entrepreneurs managing multiple businesses. Each brand has its own content calendar, analytics, and settings.',
  },
  {
    value: 'item-5',
    question: 'What happens to my scheduled posts if I cancel?',
    answer:
      'All posts scheduled before cancellation will still be published as planned. You can export your content calendar and analytics data anytime. We believe your data is yours, and we make it easy to take it with you if you decide to leave.',
  },
  {
    value: 'item-6',
    question: 'Do you offer refunds?',
    answer:
      'Yes! We offer a 30-day money-back guarantee on all paid plans. If FlowPost isn\'t the right fit for your business, simply contact our support team within 30 days of purchase for a full refund. No hassle, no questions asked.',
  },
  {
    value: 'item-7',
    question: 'How secure is my social media data?',
    answer:
      'Security is our top priority. We use bank-level encryption for all data transmission and storage. We never store your social media passwords - we use secure OAuth authentication. Your content and analytics data are backed up daily and stored in secure, compliant data centers.',
  },
  {
    value: 'item-8',
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer:
      'Absolutely! Upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the end of your current billing cycle, so you never lose access to features you\'ve paid for.',
  },
]

const FaqSection = () => {
  return (
    <section id="faq" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Effects */}
      <AnimatedBeams count={6} />
      <GradientOrbs count={2} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about FlowPost. Can&apos;t find what you&apos;re looking for? Chat with our friendly team.
          </p>
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className='bg-transparent'>
            <div className='p-0'>
              <Accordion type='single' collapsible className='space-y-5'>
                {faqItems.map((item, index) => {
                  const mouseX = useMotionValue(0)
                  const mouseY = useMotionValue(0)
                  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 })
                  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 })

                  return (
                    <motion.div
                      key={item.value}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
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
                      <AccordionItem value={item.value} className='rounded-md !border bg-transparent'>
                        <AccordionTrigger className='cursor-pointer items-center gap-4 rounded-none bg-transparent py-2 ps-3 pe-4 hover:no-underline data-[state=open]:border-b'>
                          <div className='flex items-center gap-4'>
                            <motion.div
                              style={{ translateZ: 30 }}
                              className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full'
                            >
                              <CircleHelp className='size-5' />
                            </motion.div>
                            <motion.span style={{ translateZ: 15 }} className='text-start font-semibold'>
                              {item.question}
                            </motion.span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className='p-4 bg-transparent'>
                          <motion.div style={{ translateZ: 10 }}>
                            {item.answer}
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  )
                })}
              </Accordion>
            </div>
          </div>

          {/* Contact Support CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              Still have questions? We&apos;re here to help.
            </p>
            {/* Glowing Button with 3D effect */}
            <motion.div
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.92 }}
              style={{ transformStyle: "preserve-3d" }}
              className="inline-block"
            >
              <Button className='cursor-pointer relative overflow-hidden group shadow-lg' asChild>
                <a href="#contact">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: '200% 100%' }}
                  />
                  <motion.span
                    style={{ translateZ: 20 }}
                    className="relative z-10"
                  >
                    Contact Support
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(192, 132, 252, 0.7)', 
                        '0 0 0 8px rgba(192, 132, 252, 0)'
                      ] 
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export { FaqSection }
