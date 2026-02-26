"use client"

import { motion } from "framer-motion"

interface AnimatedGridProps {
  className?: string
  variant?: "default" | "dots" | "lines"
}

export function AnimatedGrid({ className = "", variant = "default" }: AnimatedGridProps) {
  if (variant === "dots") {
    return (
      <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(305, 70%, 60%, 0.15) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "50px 50px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    )
  }

  if (variant === "lines") {
    return (
      <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(305, 70%, 60%, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(305, 70%, 60%, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(305, 70%, 60%, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(305, 70%, 60%, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  )
}
