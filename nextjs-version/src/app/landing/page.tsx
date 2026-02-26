import type { Metadata } from 'next'
import { LandingPageContent } from './landing-page-content'

// Metadata for the landing page
export const metadata: Metadata = {
  title: 'FlowPost - AI-Powered Social Media Management Made Simple',
  description: 'Create, schedule, and manage your social media content effortlessly with AI. Perfect for small businesses, solopreneurs, and content creators. Start free today.',
  keywords: ['social media management', 'AI content generator', 'social media scheduler', 'Instagram scheduler', 'Facebook scheduler', 'content calendar', 'social media automation'],
  openGraph: {
    title: 'FlowPost - AI-Powered Social Media Management Made Simple',
    description: 'Create, schedule, and manage your social media content effortlessly with AI. Perfect for small businesses and solopreneurs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowPost - AI-Powered Social Media Management Made Simple',
    description: 'Create, schedule, and manage your social media content effortlessly with AI.',
  },
}

export default function LandingPage() {
  return <LandingPageContent />
}
