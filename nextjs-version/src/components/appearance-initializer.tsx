"use client"

import { useEffect, useState } from "react"

export function AppearanceInitializer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Apply saved appearance settings on mount
    const applyAppearanceSettings = () => {
      try {
        const savedPrefs = localStorage.getItem("flowpost-appearance")
        if (!savedPrefs) return

        const prefs = JSON.parse(savedPrefs)

        // Apply font size
        if (prefs.fontSize) {
          const root = document.documentElement
          const body = document.body
          
          switch (prefs.fontSize) {
            case "small":
              root.style.fontSize = '14px'
              body.style.fontSize = '14px'
              break
            case "medium":
              root.style.fontSize = '16px'
              body.style.fontSize = '16px'
              break
            case "large":
              root.style.fontSize = '18px'
              body.style.fontSize = '18px'
              break
          }
        }

        // Apply font family
        if (prefs.fontFamily) {
          const root = document.documentElement
          const body = document.body
          
          let fontStack = ''
          switch (prefs.fontFamily) {
            case "inter":
              fontStack = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              break
            case "roboto":
              fontStack = 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              break
            case "system":
              fontStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
              break
            default:
              fontStack = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
          
          root.style.fontFamily = fontStack
          body.style.fontFamily = fontStack
        }

        // Apply sidebar width
        if (prefs.sidebarWidth) {
          let widthValue = ''
          switch (prefs.sidebarWidth) {
            case "compact":
              widthValue = '15rem'
              break
            case "comfortable":
              widthValue = '16rem'
              break
            case "spacious":
              widthValue = '20rem'
              break
            default:
              widthValue = '16rem'
          }
          
          document.documentElement.style.setProperty('--sidebar-width', widthValue)
          
          // Apply to SidebarProvider after a short delay to ensure DOM is ready
          setTimeout(() => {
            const sidebarProvider = document.querySelector('[data-sidebar="sidebar"]')?.closest('[style*="--sidebar-width"]') as HTMLElement
            if (sidebarProvider) {
              sidebarProvider.style.setProperty('--sidebar-width', widthValue)
            }
          }, 100)
        }

        // Apply content width
        if (prefs.contentWidth) {
          const root = document.documentElement
          
          switch (prefs.contentWidth) {
            case "fixed":
              root.style.setProperty('--content-max-width', '1280px')
              break
            case "fluid":
              root.style.setProperty('--content-max-width', '100%')
              break
            case "container":
              root.style.setProperty('--content-max-width', '1440px')
              break
          }
          
          // Apply to main content containers
          const mainContainers = document.querySelectorAll('[data-slot="sidebar-inset"]')
          mainContainers.forEach((container) => {
            const maxWidth = prefs.contentWidth === 'fluid' ? '100%' : prefs.contentWidth === 'fixed' ? '1280px' : '1440px';
            (container as HTMLElement).style.maxWidth = maxWidth
          })
        }
      } catch (error) {
        console.error("Error applying appearance settings:", error)
      }
    }

    // Apply settings immediately after mount
    applyAppearanceSettings()

    // Also apply when navigating between pages
    const handleRouteChange = () => {
      setTimeout(applyAppearanceSettings, 50)
    }

    // Listen for route changes (Next.js App Router)
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [mounted])

  return null
}
