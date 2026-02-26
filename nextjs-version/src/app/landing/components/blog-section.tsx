"use client"

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FloatingElements, AnimatedGrid } from '@/components/effects'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const blogs = [
    {
      id: 1,
      image: 'https://ui.shadcn.com/placeholder.svg',
      category: 'Technology',
      title: 'AI Development Catalysts',
      description:
        'Exploring how AI-driven tools are transforming software development workflows and accelerating innovation.',
    },
    {
      id: 2,
      image: 'https://ui.shadcn.com/placeholder.svg',
      category: 'Lifestyle',
      title: 'Minimalist Living Guide',
      description:
        'Minimalist living approaches that can help reduce stress and create more meaningful daily experiences.',
    },
    {
      id: 3,
      image: 'https://ui.shadcn.com/placeholder.svg',
      category: 'Design',
      title: 'Accessible UI Trends',
      description:
        'How modern UI trends are embracing accessibility while maintaining sleek, intuitive user experiences.',
    },
  ]

export function BlogSection() {
  return (
    <section id="blog" className="relative py-24 sm:py-32 bg-muted/50 overflow-hidden">
      {/* Background Effects */}
      <FloatingElements count={10} variant="icons" />
      <AnimatedGrid variant="dots" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Latest Insights</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            From our blog
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with the latest trends, best practices, and insights from our team of experts.
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {blogs.map((blog, index) => {
            const mouseX = useMotionValue(0)
            const mouseY = useMotionValue(0)
            const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 })
            const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 })

            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
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
                <Card className="overflow-hidden py-0 h-full">
                  <CardContent className="px-0">
                    <motion.div
                      className="aspect-video overflow-hidden"
                      style={{ translateZ: 40 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={400}
                        height={225}
                        className="size-full object-cover dark:invert dark:brightness-[0.95]"
                        loading="lazy"
                      />
                    </motion.div>
                    <motion.div style={{ translateZ: 20 }} className="space-y-3 p-6">
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                        className="text-muted-foreground text-xs tracking-widest uppercase"
                      >
                        {blog.category}
                      </motion.p>
                      <a
                        href="#"
                        onClick={e => e.preventDefault()}
                        className="cursor-pointer"
                      >
                        <motion.h3
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                          className="text-xl font-bold hover:text-primary transition-colors"
                        >
                          {blog.title}
                        </motion.h3>
                      </a>
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                        className="text-muted-foreground"
                      >
                        {blog.description}
                      </motion.p>
                      <motion.a
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                        whileHover={{ x: 5 }}
                        href="#"
                        onClick={e => e.preventDefault()}
                        className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer"
                      >
                        Learn More
                        <ArrowRight className="size-4" />
                      </motion.a>
                    </motion.div>
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
