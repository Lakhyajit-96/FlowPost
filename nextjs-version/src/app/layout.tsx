import type { Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { AppearanceInitializer } from "@/components/appearance-initializer";
import { inter } from "@/lib/fonts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FlowPost - AI-Powered Social Media Management",
  description: "Effortlessly create, schedule, and manage your social media content with AI. Built for small businesses and solopreneurs.",
  keywords: ["social media management", "AI content generator", "social media scheduler", "content calendar", "Instagram scheduler", "Facebook scheduler"],
  authors: [{ name: "FlowPost" }],
  creator: "FlowPost",
  publisher: "FlowPost",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flowpost.app",
    title: "FlowPost - AI-Powered Social Media Management",
    description: "Effortlessly create, schedule, and manage your social media content with AI.",
    siteName: "FlowPost",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowPost - AI-Powered Social Media Management",
    description: "Effortlessly create, schedule, and manage your social media content with AI.",
    creator: "@flowpost",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider defaultTheme="system" storageKey="flowpost-theme">
            <SidebarConfigProvider>
              <AppearanceInitializer />
              {children}
              <Toaster position="top-right" />
            </SidebarConfigProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
