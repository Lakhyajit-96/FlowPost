"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface AnimatedBeamsProps {
  className?: string
  count?: number
}

export function AnimatedBeams({ className = "", count = 5 }: AnimatedBeamsProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const beams = Array.from({ length: count }, (_, i) => i)

  return (
    <div ref={containerRef} className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(305, 70%, 60%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(305, 70%, 60%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(305, 70%, 60%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {beams.map((i) => {
          const startX = (i * dimensions.width) / count
          const startY = Math.random() * dimensions.height
          const endX = ((i + 1) * dimensions.width) / count
          const endY = Math.random() * dimensions.height
          const duration = 3 + Math.random() * 2
          const delay = i * 0.5

          return (
            <motion.line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="url(#beam-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}
