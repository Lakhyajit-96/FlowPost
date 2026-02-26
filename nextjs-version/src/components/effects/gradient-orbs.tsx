"use client"

import { motion } from "framer-motion"

interface GradientOrbsProps {
  className?: string
  count?: number
}

export function GradientOrbs({ className = "", count = 3 }: GradientOrbsProps) {
  const orbs = Array.from({ length: count }, (_, i) => i)

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {orbs.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: `${300 + i * 100}px`,
            height: `${300 + i * 100}px`,
            background: `radial-gradient(circle, hsl(${305 + i * 20}, 70%, 60%) 0%, transparent 70%)`,
          }}
          animate={{
            x: [
              `${i * 20}%`,
              `${(i + 1) * 15}%`,
              `${i * 20}%`,
            ],
            y: [
              `${i * 15}%`,
              `${(i + 1) * 20}%`,
              `${i * 15}%`,
            ],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
