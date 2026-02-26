"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent } from 'react'

type Testimonial = {
  name: string
  role: string
  image: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Boutique Owner',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-1',
    quote:
      'FlowPost saved my business. I was spending 15 hours a week on social media, now it takes me 2 hours. The AI content suggestions are spot-on for my brand.',
  },
  {
    name: 'Marcus Chen',
    role: 'Fitness Coach',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-1',
    quote: 'My engagement tripled in the first month. The analytics showed me exactly what my audience wanted to see. Game changer!',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Restaurant Manager',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-2',
    quote:
      'Scheduling posts for all our locations used to be a nightmare. Now I do it in 30 minutes every Monday. Our social media presence has never been more consistent.',
  },
  {
    name: 'David Park',
    role: 'Marketing Agency Owner',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-2',
    quote:
      'We manage 20+ client accounts with FlowPost. The white-label reports and team collaboration features are exactly what we needed. Our clients love the results.',
  },
  {
    name: 'Lisa Thompson',
    role: 'E-commerce Founder',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-3',
    quote:
      'The AI understands my products and creates captions that actually convert. My social media sales increased by 40% in two months. Worth every penny.',
  },
  {
    name: 'James Wilson',
    role: 'Real Estate Agent',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-3',
    quote: 'I was skeptical about AI-generated content, but FlowPost proved me wrong. It sounds like me, not a robot. My followers have no idea it\'s AI-assisted.',
  },
  {
    name: 'Amanda Foster',
    role: 'Yoga Studio Owner',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-4',
    quote:
      'The content calendar view is beautiful and so easy to use. I can see my entire month at a glance and make adjustments on the fly. It\'s like having a social media manager.',
  },
  {
    name: 'Ryan Martinez',
    role: 'Coffee Shop Owner',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-4',
    quote: 'FlowPost helped us build a loyal community online. The engagement insights showed us when to post and what content resonates. Our foot traffic increased 25%.',
  },
  {
    name: 'Jessica Lee',
    role: 'Freelance Designer',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-5',
    quote:
      'As a solopreneur, I need tools that just work. FlowPost is intuitive, fast, and the AI actually helps me be more creative, not less. I\'m getting more clients from social media than ever.',
  },
  {
    name: 'Michael Brown',
    role: 'Consultant',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-5',
    quote: 'The ROI is incredible. For $49/month, I\'m saving 10+ hours and my engagement is up 200%. Best business investment I\'ve made this year.',
  },
  {
    name: 'Sophia Anderson',
    role: 'Beauty Salon Owner',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-6',
    quote:
      'My team loves how easy it is to collaborate. We can all contribute ideas, approve posts, and track what\'s working. Our Instagram following doubled in 3 months.',
  },
  {
    name: 'Daniel Kim',
    role: 'Tech Startup Founder',
    image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-6',
    quote: 'FlowPost scales with us. Started with the Starter plan, now on Agency managing multiple brands. The platform grows as we grow. Couldn\'t ask for more.',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="container mx-auto px-8 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Success Stories</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Loved by businesses everywhere
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of small businesses, solopreneurs, and agencies who are growing their social media presence with FlowPost.
          </p>
        </motion.div>

        {/* Testimonials Masonry Grid */}
        <div className="columns-1 gap-4 md:columns-2 md:gap-6 lg:columns-3 lg:gap-4" style={{ perspective: "1500px" }}>
          {testimonials.map((testimonial, index) => {
            const TestimonialCard = () => {
              const ref = useRef<HTMLDivElement>(null)
              const x = useMotionValue(0)
              const y = useMotionValue(0)

              const mouseXSpring = useSpring(x)
              const mouseYSpring = useSpring(y)

              const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
              const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

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
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: "easeOut" }}
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="mb-6 break-inside-avoid lg:mb-4"
                >
                  <Card className="shadow-none h-full">
                    <CardContent style={{ transform: "translateZ(30px)" }}>
                      <div className="flex items-start gap-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: (index % 3) * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                          style={{ transform: "translateZ(50px)" }}
                        >
                          <Avatar className="bg-muted size-12 shrink-0">
                            <AvatarImage
                              alt={testimonial.name}
                              src={testimonial.image}
                              loading="lazy"
                              width="120"
                              height="120"
                            />
                            <AvatarFallback>
                              {testimonial.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium">{testimonial.name}</h3>
                          <span className="text-muted-foreground block text-sm tracking-wide">
                            {testimonial.role}
                          </span>
                        </div>
                      </div>

                      <blockquote className="mt-4">
                        <p className="text-sm leading-relaxed text-balance">{testimonial.quote}</p>
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            }

            return <TestimonialCard key={index} />
          })}
        </div>
      </div>
    </section>
  )
}
