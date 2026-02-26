"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface SpotlightEffectProps {
  className?: string
  size?: number
  color?: string
}

export function SpotlightEffect({ 
  className = "", 
  size = 600,
  color = "hsl(305, 70%, 60%)"
}: SpotlightEffectProps) {
  const [isHovering, setIsHovering] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setIsHovering(true)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mouseX, mouseY])

  return (
    <motion.div
      className={`pointer-events-none fixed -z-10 ${className}`}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        x: -size / 2,
        y: -size / 2,
      }}
      animate={{
        opacity: isHovering ? 0.15 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="h-full w-full rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  )
}
