"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CardDecorator } from '@/components/ui/card-decorator'
import { Github, Linkedin, Globe } from 'lucide-react'
import { GradientOrbs } from '@/components/effects'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'


const team = [
  {
    id: 1,
    name: 'Alexandra Chen',
    role: 'Founder & CEO',
    description: 'Former co-founder of TechFlow. Early staff at Microsoft and Google.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=60&w=150&auto=format&fit=crop',
    fallback: 'AC',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Engineering Manager',
    description: 'Lead engineering teams at Stripe, Discord, and Meta Labs.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=60&w=150&auto=format&fit=crop',
    fallback: 'MR',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  {
    id: 3,
    name: 'Sophie Laurent',
    role: 'Product Manager',
    description: 'Former PM for Linear, Lambda School, and On Deck.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=60&w=150&auto=format&fit=crop',
    fallback: 'SL',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Frontend Developer',
    description: 'Former frontend dev for Linear, Coinbase, and PostScript.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=60&w=150&auto=format&fit=crop',
    fallback: 'DK',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  {
    id: 5,
    name: 'Emma Thompson',
    role: 'Backend Developer',
    description: 'Lead backend dev at Clearbit. Former Clearbit and Loom.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=60&w=150&auto=format&fit=crop',
    fallback: 'ET',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  {
    id: 6,
    name: 'Ryan Mitchell',
    role: 'Product Designer',
    description: 'Founding design team at Figma. Former Pleo, Stripe, and Tile.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=60&w=150&auto=format&fit=crop',
    fallback: 'RM',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  {
    id: 7,
    name: 'James Anderson',
    role: 'UX Researcher',
    description: 'Lead user research for Slack. Contractor for Netflix and Udacity.',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?q=60&w=150&auto=format&fit=crop',
    fallback: 'JA',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  },
  {
    id: 8,
    name: 'Isabella Garcia',
    role: 'Customer Success',
    description: 'Lead CX at Wealthsimple. Former PagerDuty and Squreen.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=60&w=150&auto=format&fit=crop',
    fallback: 'IG',
    social: {
      linkedin: '#',
      github: '#',
      website: '#'
    }
  }
]

export function TeamSection() {
  return (
    <section id="team" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Effects */}
      <GradientOrbs count={2} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Our Team
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Meet our team
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We are a passionate team of innovators, builders, and problem-solvers dedicated to creating exceptional digital experiences that make a difference.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((member, index) => {
            const mouseX = useMotionValue(0)
            const mouseY = useMotionValue(0)
            const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 })
            const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 })

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.1, ease: "easeOut" }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
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
                <Card className="shadow-xs py-2 h-full">
                  <CardContent className="p-4">
                    <div className="text-center">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.6, 
                            delay: (index % 4) * 0.1 + 0.2, 
                            type: "spring", 
                            stiffness: 200 
                          }}
                          style={{ translateZ: 50 }}
                        >
                          <CardDecorator>
                            <Avatar className="h-24 w-24 border shadow-lg">
                              <AvatarImage
                                src={member.image}
                                alt={member.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-lg font-semibold">
                                {member.fallback}
                              </AvatarFallback>
                            </Avatar>
                          </CardDecorator>
                        </motion.div>
                      </div>

                      {/* Name and Role */}
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: (index % 4) * 0.1 + 0.3 }}
                        style={{ translateZ: 30 }}
                        className="text-lg font-semibold text-foreground mb-1"
                      >
                        {member.name}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: (index % 4) * 0.1 + 0.4 }}
                        style={{ translateZ: 25 }}
                        className="text-sm font-medium text-primary mb-3"
                      >
                        {member.role}
                      </motion.p>

                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: (index % 4) * 0.1 + 0.5 }}
                        style={{ translateZ: 20 }}
                        className="text-sm text-muted-foreground mb-4 leading-relaxed"
                      >
                        {member.description}
                      </motion.p>

                      {/* Social Links */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: (index % 4) * 0.1 + 0.6 }}
                        style={{ translateZ: 35 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <motion.div
                          whileHover={{ scale: 1.3, rotate: 10, y: -3 }}
                          whileTap={{ scale: 0.85 }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer hover:text-primary relative group"
                            asChild
                          >
                            <a
                              href={member.social.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} LinkedIn`}
                            >
                              <motion.div
                                className="absolute inset-0 bg-primary/10 rounded-md"
                                initial={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                              <Linkedin className="h-4 w-4 relative z-10" />
                            </a>
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.3, rotate: 10, y: -3 }}
                          whileTap={{ scale: 0.85 }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer hover:text-primary relative group"
                            asChild
                          >
                            <a
                              href={member.social.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} GitHub`}
                            >
                              <motion.div
                                className="absolute inset-0 bg-primary/10 rounded-md"
                                initial={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                              <Github className="h-4 w-4 relative z-10" />
                            </a>
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.3, rotate: 10, y: -3 }}
                          whileTap={{ scale: 0.85 }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer hover:text-primary relative group"
                            asChild
                          >
                            <a
                              href={member.social.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${member.name} Website`}
                            >
                              <motion.div
                                className="absolute inset-0 bg-primary/10 rounded-md"
                                initial={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                              <Globe className="h-4 w-4 relative z-10" />
                            </a>
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
