"use client"

import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

interface ParticlesBackgroundProps {
  className?: string
  variant?: "default" | "minimal" | "dense" | "connected"
}

export function ParticlesBackground({ 
  className = "", 
  variant = "default" 
}: ParticlesBackgroundProps) {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const options = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fullScreen: {
      enable: false,
      zIndex: -1,
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: variant === "connected" ? "grab" : "repulse",
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        grab: {
          distance: 150,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    particles: {
      color: {
        value: "#c084fc",
      },
      links: {
        color: "#c084fc",
        distance: variant === "connected" ? 150 : 0,
        enable: variant === "connected",
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "bounce" as const,
        },
        random: false,
        speed: variant === "minimal" ? 0.5 : 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: variant === "dense" ? 150 : variant === "minimal" ? 30 : 80,
      },
      opacity: {
        value: variant === "minimal" ? 0.3 : 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: variant === "dense" ? 2 : 3 },
      },
    },
    detectRetina: true,
  }

  if (!init) {
    return null
  }

  return (
    <Particles
      id={`tsparticles-${variant}`}
      options={options}
      className={`absolute inset-0 ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  )
}
