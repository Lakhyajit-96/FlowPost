"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/hooks/use-theme"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontFamily: z.string(),
  fontSize: z.string(),
  sidebarWidth: z.string(),
  contentWidth: z.string(),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export default function AppearanceSettings() {
  const { setTheme, theme: currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "dark",
      fontFamily: "inter",
      fontSize: "medium",
      sidebarWidth: "comfortable",
      contentWidth: "fluid",
    },
  })

  // Apply font size using CSS variables
  const applyFontSize = (size: string) => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    const body = document.body
    
    switch (size) {
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
      default:
        root.style.fontSize = '16px'
        body.style.fontSize = '16px'
    }
  }

  // Apply font family
  const applyFontFamily = (family: string) => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    const body = document.body
    
    let fontStack = ''
    switch (family) {
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

  // Apply sidebar width - needs to update the SidebarProvider's inline style
  const applySidebarWidth = (width: string) => {
    if (typeof window === 'undefined') return
    
    let widthValue = ''
    switch (width) {
      case "compact":
        widthValue = '15rem' // 240px
        break
      case "comfortable":
        widthValue = '16rem' // 256px (default)
        break
      case "spacious":
        widthValue = '20rem' // 320px
        break
      default:
        widthValue = '16rem'
    }
    
    // Find the SidebarProvider element and update its style
    const sidebarProvider = document.querySelector('[data-sidebar="sidebar"]')?.closest('[style*="--sidebar-width"]') as HTMLElement
    if (sidebarProvider) {
      sidebarProvider.style.setProperty('--sidebar-width', widthValue)
    }
    
    // Also set on root as fallback
    document.documentElement.style.setProperty('--sidebar-width', widthValue)
  }

  // Apply content width
  const applyContentWidth = (width: string) => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    
    switch (width) {
      case "fixed":
        root.style.setProperty('--content-max-width', '1280px')
        break
      case "fluid":
        root.style.setProperty('--content-max-width', '100%')
        break
      case "container":
        root.style.setProperty('--content-max-width', '1440px')
        break
      default:
        root.style.setProperty('--content-max-width', '100%')
    }
    
    // Apply to main content containers
    const mainContainers = document.querySelectorAll('[data-slot="sidebar-inset"]')
    mainContainers.forEach((container) => {
      (container as HTMLElement).style.maxWidth = width === 'fluid' ? '100%' : width === 'fixed' ? '1280px' : '1440px'
    })
  }

  useEffect(() => {
    setMounted(true)
    
    // Set theme from context
    if (currentTheme) {
      form.setValue("theme", currentTheme as "light" | "dark" | "system")
    }
    
    // Load saved preferences from localStorage
    const savedPrefs = localStorage.getItem("flowpost-appearance")
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs)
        form.reset(prefs)
        
        // Apply saved settings immediately
        if (prefs.fontSize) {
          applyFontSize(prefs.fontSize)
        }
        if (prefs.fontFamily) {
          applyFontFamily(prefs.fontFamily)
        }
        if (prefs.sidebarWidth) {
          // Delay sidebar width application to ensure DOM is ready
          setTimeout(() => applySidebarWidth(prefs.sidebarWidth), 100)
        }
        if (prefs.contentWidth) {
          applyContentWidth(prefs.contentWidth)
        }
      } catch (error) {
        console.error("Error loading preferences:", error)
      }
    }
  }, [currentTheme, form])

  function onSubmit(data: AppearanceFormValues) {
    setLoading(true)
    try {
      // Apply all settings
      setTheme(data.theme)
      applyFontSize(data.fontSize)
      applyFontFamily(data.fontFamily)
      applySidebarWidth(data.sidebarWidth)
      applyContentWidth(data.contentWidth)
      
      // Save to localStorage
      localStorage.setItem("flowpost-appearance", JSON.stringify(data))
      
      toast.success("Appearance settings saved successfully!")
    } catch (error) {
      console.error("Error saving appearance:", error)
      toast.error("Failed to save appearance settings")
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    // Reload saved preferences
    const savedPrefs = localStorage.getItem("flowpost-appearance")
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs)
        form.reset(prefs)
        
        // Reapply saved settings
        if (prefs.theme) {
          setTheme(prefs.theme)
        }
        if (prefs.fontSize) {
          applyFontSize(prefs.fontSize)
        }
        if (prefs.fontFamily) {
          applyFontFamily(prefs.fontFamily)
        }
        if (prefs.sidebarWidth) {
          applySidebarWidth(prefs.sidebarWidth)
        }
        if (prefs.contentWidth) {
          applyContentWidth(prefs.contentWidth)
        }
        
        toast.info("Changes discarded")
      } catch (error) {
        console.error("Error resetting preferences:", error)
      }
    } else {
      // Reset to defaults
      const defaults = {
        theme: "dark" as const,
        fontFamily: "inter",
        fontSize: "medium",
        sidebarWidth: "comfortable",
        contentWidth: "fluid",
      }
      form.reset(defaults)
      setTheme(defaults.theme)
      applyFontSize(defaults.fontSize)
      applyFontFamily(defaults.fontFamily)
      applySidebarWidth(defaults.sidebarWidth)
      applyContentWidth(defaults.contentWidth)
      toast.info("Reset to defaults")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Appearance</h1>
          <p className="text-muted-foreground">
            Customize the appearance of the application.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-lg font-medium mb-2">Theme</h3>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value)
                        setTheme(value as "light" | "dark" | "system")
                        toast.success(`Theme changed to ${value}`)
                      }}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="light" className="sr-only" />
                          </FormControl>
                          <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                            <div className="space-y-2">
                              <div className="w-20 h-20 bg-white border rounded-md p-3">
                                <div className="space-y-2">
                                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm font-medium">Light</span>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="dark" className="sr-only" />
                          </FormControl>
                          <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                            <div className="space-y-2">
                              <div className="w-20 h-20 bg-gray-900 border border-gray-700 rounded-md p-3">
                                <div className="space-y-2">
                                  <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                                  <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                                    <div className="h-2 bg-gray-600 rounded flex-1"></div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                                    <div className="h-2 bg-gray-600 rounded flex-1"></div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm font-medium">Dark</span>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="system" className="sr-only" />
                          </FormControl>
                          <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                            <div className="space-y-2">
                              <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-900 border rounded-md p-3">
                                <div className="space-y-2">
                                  <div className="h-2 bg-gray-400 rounded w-3/4"></div>
                                  <div className="h-2 bg-gray-400 rounded w-1/2"></div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                    <div className="h-2 bg-gray-400 rounded flex-1"></div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                    <div className="h-2 bg-gray-400 rounded flex-1"></div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm font-medium">System</span>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fontFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font Family</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      applyFontFamily(value)
                      toast.success("Font family updated")
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the font family for the entire application.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font Size</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      applyFontSize(value)
                      toast.success("Font size updated")
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Adjust the base font size for better readability.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sidebarWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sidebar Width</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      applySidebarWidth(value)
                      toast.success("Sidebar width updated")
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select sidebar width" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="compact">Compact (240px)</SelectItem>
                      <SelectItem value="comfortable">Comfortable (256px)</SelectItem>
                      <SelectItem value="spacious">Spacious (320px)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Adjust the width of the sidebar navigation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Width</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      applyContentWidth(value)
                      toast.success("Content width updated")
                    }} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select content width" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed (1280px)</SelectItem>
                      <SelectItem value="fluid">Fluid (100%)</SelectItem>
                      <SelectItem value="container">Container (1440px)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Control the maximum width of the main content area.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2 mt-12">
              <Button type="submit" className="cursor-pointer" disabled={loading}>
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                className="cursor-pointer" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
  )
}
