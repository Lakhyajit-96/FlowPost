"use client"

import { motion } from "framer-motion"
import { Sparkles, Zap, Star, Circle } from "lucide-react"

interface FloatingElementsProps {
  className?: string
  count?: number
  variant?: "icons" | "shapes"
}

export function FloatingElements({ 
  className = "", 
  count = 8,
  variant = "shapes"
}: FloatingElementsProps) {
  const elements = Array.from({ length: count }, (_, i) => i)
  const icons = [Sparkles, Zap, Star, Circle]

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {elements.map((i) => {
        const Icon = icons[i % icons.length]
        const size = 20 + (i % 3) * 10
        const duration = 15 + (i % 5) * 5
        const delay = i * 2

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 12) % 100}%`,
              top: `${(i * 15) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {variant === "icons" ? (
              <Icon 
                className="text-primary/20" 
                size={size}
                strokeWidth={1.5}
              />
            ) : (
              <div
                className="rounded-full bg-primary/20"
                style={{
                  width: size,
                  height: size,
                }}
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
