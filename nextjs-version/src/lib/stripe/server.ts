import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 19,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      '3 social media accounts',
      '30 posts per month',
      'Basic analytics',
      'Post scheduling',
      'Email support',
    ],
    limits: {
      accounts: 3,
      posts: 30,
      aiGenerations: 10,
    },
  },
  professional: {
    name: 'Professional',
    price: 49,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
    features: [
      '10 social media accounts',
      '100 posts per month',
      'Advanced analytics',
      'AI content generation',
      'Priority support',
      'Team collaboration',
    ],
    limits: {
      accounts: 10,
      posts: 100,
      aiGenerations: 50,
    },
  },
  agency: {
    name: 'Agency',
    price: 99,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID!,
    features: [
      'Unlimited social accounts',
      'Unlimited posts',
      'Advanced AI features',
      'White-label reports',
      'Dedicated support',
      'API access',
    ],
    limits: {
      accounts: -1, // unlimited
      posts: -1, // unlimited
      aiGenerations: -1, // unlimited
    },
  },
} as const

export type PlanType = keyof typeof PLANS
