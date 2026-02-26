"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Logo } from '@/components/logo'
import { ModeToggle } from '@/components/mode-toggle'
import { useTheme } from '@/hooks/use-theme'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const navigationItems = [
  { name: 'Home', href: '#hero' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
]

// Smooth scroll function
const smoothScrollTo = (targetId: string) => {
  if (targetId.startsWith('#')) {
    const element = document.querySelector(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }
}

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { setTheme, theme } = useTheme()

  // 3D tilt effect for logo
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 })

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 supports-[backdrop-filter]:bg-background/95"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo with 3D effect */}
        <motion.div
          className="flex items-center space-x-2"
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
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <motion.div style={{ translateZ: 20 }}>
              <Logo size={32} />
            </motion.div>
            <motion.span
              style={{ translateZ: 10 }}
              className="font-bold text-xl"
            >
              FlowPost
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop Navigation with animated underline */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.name}
              className="relative"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <a
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary cursor-pointer relative z-10"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault()
                  if (item.href.startsWith('#')) {
                    smoothScrollTo(item.href)
                  } else {
                    window.location.href = item.href
                  }
                }}
              >
                {item.name}
              </a>
              {hoveredIndex === index && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-primary/10 rounded-md -z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: '8px 12px', margin: '-8px -12px' }}
                />
              )}
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA with 3D effects */}
        <div className="hidden md:flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ModeToggle variant="ghost" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotateZ: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" asChild className="cursor-pointer">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild className="cursor-pointer relative overflow-hidden group">
              <Link href="/sign-up">
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Start Free Trial</span>
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu with animation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[400px] p-0 gap-0 [&>button]:hidden overflow-hidden flex flex-col">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <SheetHeader className="space-y-0 p-4 pb-2 border-b">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="p-2 bg-primary/10 rounded-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Logo size={16} />
                  </motion.div>
                  <SheetTitle className="text-lg font-semibold">FlowPost</SheetTitle>
                  <div className="ml-auto flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="cursor-pointer h-8 w-8"
                      >
                        <Moon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Sun className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="cursor-pointer h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </SheetHeader>

              {/* Navigation Links with stagger animation */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-6 space-y-1">
                  {navigationItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ x: 10, backgroundColor: 'hsl(var(--accent))' }}
                      className="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors cursor-pointer"
                      onClick={(e) => {
                        setIsOpen(false)
                        if (item.href.startsWith('#')) {
                          e.preventDefault()
                          setTimeout(() => smoothScrollTo(item.href), 100)
                        }
                      }}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Footer Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="border-t p-6 space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="lg" asChild className="cursor-pointer w-full">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" className="cursor-pointer w-full">
                      <Link href="/sign-up">Start Free Trial</Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  )
}
