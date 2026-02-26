# FlowPost - AI-Powered Social Media Management SaaS

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

![FlowPost Dashboard](nextjs-version/public/dashboard-light.png)

<div align="center">

**🚀 Production-Ready SaaS | 💰 Revenue-Ready | 🎨 Beautiful Design**

[Live Demo](#) | [Documentation](#documentation) | [Get Started](#quick-start)

</div>

---

## 🎯 What is FlowPost?

**FlowPost** is a production-ready AI-powered social media management SaaS platform that helps businesses, content creators, and agencies manage their social media presence effortlessly.

### **The Vision**

Build a profitable SaaS business that generates **$10K+ MRR** within 6 months by solving a real problem: social media management is time-consuming and complex. FlowPost makes it simple, automated, and AI-powered.

### **The Problem We Solve**

- ❌ Managing multiple social media accounts is overwhelming
- ❌ Creating engaging content takes hours
- ❌ Scheduling posts across platforms is tedious
- ❌ Tracking analytics is scattered and confusing
- ❌ Existing tools are expensive and complicated

### **Our Solution**

- ✅ Unified dashboard for all social media accounts
- ✅ AI-powered content generation (captions, hashtags, ideas)
- ✅ Smart post scheduling and automation
- ✅ Real-time analytics and insights
- ✅ Affordable pricing starting at $19/month
- ✅ Beautiful, intuitive interface

---

## 💰 Business Model

### **Pricing Plans**

| Plan | Price | Target Customers | Features |
|------|-------|------------------|----------|
| **Starter** | $19/mo | Individuals, Small Businesses | 3 accounts, 30 posts/month, Basic analytics |
| **Professional** | $49/mo | Content Creators, Growing Businesses | 10 accounts, 100 posts/month, AI generation, Advanced analytics |
| **Agency** | $99/mo | Agencies, Large Teams | Unlimited accounts & posts, Team collaboration, White-label reports |

### **Revenue Projections**

| Timeline | Sign-ups | Paying Customers | MRR | ARR |
|----------|----------|------------------|-----|-----|
| **Month 1** | 50 | 20 | $500 | $6,000 |
| **Month 3** | 300 | 100 | $3,000 | $36,000 |
| **Month 6** | 1,000 | 300 | $10,000 | $120,000 |
| **Year 1** | 3,000 | 800 | $25,000 | $300,000 |

### **Cost Structure**

**Fixed Costs (Monthly)**:
- Vercel Pro: $20
- Supabase Pro: $25
- OpenAI API: ~$100
- Cloudinary: $89
- Email Service: $10
- **Total**: ~$245/month

**Variable Costs**: ~$0.60/user

**Break-Even**: 13 customers @ $19/month = $247

**Profit Margin**: 95%+ after break-even

---

## ✨ Features

### **🎨 Beautiful Landing Page**
- Modern, responsive design
- Smooth animations with Framer Motion
- 3D tilt effects and interactive elements
- Clear value proposition and CTAs
- Pricing section with 3 plans
- Testimonials, FAQ, and contact sections
- Dark/light mode support

### **� Complete Dashboard**
- Real-time social media analytics
- Engagement metrics and trends
- Platform distribution (Instagram, Facebook, Twitter, LinkedIn)
- Recent posts with performance data
- Top performing content
- Audience insights (growth, demographics, regions)
- Quick actions (AI Generate, New Post)

### **� Authentication & Security**
- Clerk integration for secure auth
- Email/password and OAuth (Google, GitHub)
- Email verification required
- Session management
- Route protection
- User profile management

### **� Payment Processing**
- Stripe integration for subscriptions
- 14-day free trial
- Secure checkout flow
- Webhook handling for subscription events
- Customer portal for subscription management
- Multiple pricing tiers

### **�️ Database & Storage**
- Supabase for data persistence
- User management
- Subscription tracking
- Post history
- Analytics data
- Connected accounts

### **🤖 AI Features (Coming Soon)**
- OpenAI GPT-4 integration
- Caption generation
- Hashtag suggestions
- Content ideas
- Image descriptions
- Tone/voice customization

### **� Social Media Integration (Coming Soon)**
- Instagram Graph API
- Facebook Graph API
- Twitter API v2
- LinkedIn API
- Post scheduling
- Auto-posting
- Comment management

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+
- npm or pnpm
- Git

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/flowpost.git
cd flowpost/nextjs-version
```

### **2. Install Dependencies**

```bash
npm install
# or
pnpm install
```

### **3. Set Up Environment Variables**

Create a `.env.local` file:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/pricing

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_STARTER_PRICE_ID=your_starter_price_id
STRIPE_PROFESSIONAL_PRICE_ID=your_professional_price_id
STRIPE_AGENCY_PRICE_ID=your_agency_price_id

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

### **4. Run Development Server**

```bash
npm run dev
# or
pnpm dev
```

Visit **http://localhost:3000**

---

## 📖 Documentation

### **Project Structure**

```
flowpost/
├── nextjs-version/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/              # Authentication pages
│   │   │   │   ├── sign-in/         # Sign in with Clerk
│   │   │   │   ├── sign-up/         # Sign up with Clerk
│   │   │   │   └── forgot-password/ # Password reset
│   │   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   │   ├── dashboard/       # Main analytics dashboard
│   │   │   │   ├── pricing/         # Pricing page
│   │   │   │   ├── calendar/        # Content calendar
│   │   │   │   ├── posts/           # Post management
│   │   │   │   ├── analytics/       # Advanced analytics
│   │   │   │   ├── ai-generator/    # AI content generator
│   │   │   │   ├── accounts/        # Connected accounts
│   │   │   │   ├── team/            # Team management
│   │   │   │   └── settings/        # User settings
│   │   │   ├── landing/             # Public landing page
│   │   │   ├── api/                 # API routes
│   │   │   │   └── stripe/          # Stripe webhooks & checkout
│   │   │   ├── layout.tsx           # Root layout with Clerk
│   │   │   └── page.tsx             # Home (redirects to landing)
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── layouts/             # Layout components
│   │   │   ├── effects/             # Visual effects
│   │   │   ├── app-sidebar.tsx      # Dashboard sidebar
│   │   │   ├── site-header.tsx      # Dashboard header with user profile
│   │   │   └── checkout-button.tsx  # Stripe checkout button
│   │   ├── lib/
│   │   │   ├── stripe/              # Stripe client & server
│   │   │   └── supabase/            # Supabase client & server
│   │   └── hooks/                   # Custom React hooks
│   ├── middleware.ts                # Clerk route protection
│   ├── .env.local                   # Environment variables
│   └── package.json
├── docs/                            # Documentation
├── FLOWPOST_BUSINESS_ROADMAP.md     # Complete business plan
├── PHASE_3_SETUP_GUIDE.md           # Setup instructions
└── README.md                        # This file
```

### **Key Files**

- **`middleware.ts`** - Protects dashboard routes, allows public routes
- **`app/layout.tsx`** - Root layout with ClerkProvider
- **`app/(dashboard)/layout.tsx`** - Dashboard layout with sidebar
- **`components/site-header.tsx`** - Header with user profile
- **`lib/stripe/server.ts`** - Stripe configuration and plans
- **`api/stripe/checkout/route.ts`** - Create checkout sessions
- **`api/stripe/webhook/route.ts`** - Handle Stripe events

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type safety throughout
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui v3** - Beautiful component library
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible primitives

### **Backend & Services**
- **Clerk** - Authentication and user management
- **Stripe** - Payment processing and subscriptions
- **Supabase** - PostgreSQL database and storage
- **OpenAI** - AI content generation (coming soon)
- **Vercel** - Hosting and deployment

### **Development**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Zod** - Schema validation

---

## 🔧 Configuration

### **1. Clerk Setup (15 minutes)**

1. Go to [clerk.com](https://clerk.com)
2. Create account and application "FlowPost"
3. Copy API keys to `.env.local`
4. Enable email/password authentication
5. Optional: Enable OAuth (Google, GitHub)

### **2. Stripe Setup (20 minutes)**

1. Go to [stripe.com](https://stripe.com)
2. Create account (use test mode)
3. Create 3 products:
   - **Starter**: $19/month
   - **Professional**: $49/month
   - **Agency**: $99/month
4. Copy price IDs to `.env.local`
5. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
6. Copy webhook secret to `.env.local`

### **3. Supabase Setup (15 minutes)**

1. Go to [supabase.com](https://supabase.com)
2. Create project "flowpost"
3. Copy API keys to `.env.local`
4. Run SQL schema (see `PHASE_3_SETUP_GUIDE.md`)
5. Create tables: users, subscriptions, posts, analytics

### **4. Deploy to Vercel (30 minutes)**

1. Push code to GitHub
2. Connect repository to Vercel
3. Add all environment variables
4. Deploy
5. Update Clerk and Stripe URLs to production

**Total Setup Time: ~90 minutes**

---

## 📊 Current Status

### **✅ Phase 1: Landing Page (Complete)**
- Modern, responsive design
- All sections implemented
- Smooth animations
- Dark/light mode
- Mobile responsive
- FlowPost branding

### **✅ Phase 2: Dashboard (Complete)**
- Analytics overview
- Engagement charts
- Platform distribution
- Recent posts
- Top performing content
- Audience insights
- User profile in header

### **✅ Phase 3: Auth & Payments (Complete)**
- Clerk authentication
- Stripe checkout
- Supabase database
- Route protection
- User management
- Subscription handling

### **⏳ Phase 4: AI Features (Next)**
- OpenAI integration
- Content generation
- Caption writing
- Hashtag suggestions
- Image descriptions

### **⏳ Phase 5: Social Media APIs (Future)**
- Instagram integration
- Facebook integration
- Twitter integration
- LinkedIn integration
- Post scheduling
- Auto-posting

---

## 🎯 Roadmap

### **Week 1-2: MVP Launch**
- ✅ Landing page
- ✅ Dashboard
- ✅ Authentication
- ✅ Payments
- ⏳ AI content generator
- ⏳ Deploy to production

### **Week 3-4: Social Media Integration**
- ⏳ Instagram API
- ⏳ Facebook API
- ⏳ Twitter API
- ⏳ LinkedIn API
- ⏳ Post scheduling

### **Month 2: Growth Features**
- ⏳ Team collaboration
- ⏳ Advanced analytics
- ⏳ Content calendar
- ⏳ Media library
- ⏳ Reporting

### **Month 3-6: Scale & Optimize**
- ⏳ Mobile app
- ⏳ Browser extension
- ⏳ API for developers
- ⏳ White-label solution
- ⏳ Enterprise features

---

## 💡 Business Strategy

### **Target Market**
1. **Small Businesses** (50-100 employees)
   - Need: Affordable social media management
   - Pain: No dedicated marketing team
   - Budget: $19-49/month

2. **Content Creators** (Influencers, Bloggers)
   - Need: Consistent posting, analytics
   - Pain: Time-consuming content creation
   - Budget: $19-49/month

3. **Agencies** (Marketing, Social Media)
   - Need: Multi-client management
   - Pain: Expensive tools, no white-label
   - Budget: $99+/month

### **Go-to-Market Strategy**

**Month 1: Launch**
- Product Hunt launch
- Social media announcement
- Content marketing (blog posts)
- SEO optimization
- Email marketing

**Month 2-3: Growth**
- Paid ads (Google, Facebook)
- Influencer partnerships
- Affiliate program
- Case studies
- Testimonials

**Month 4-6: Scale**
- Partnerships with agencies
- Referral program
- YouTube tutorials
- Webinars
- Community building

### **Success Metrics**

**Key Performance Indicators (KPIs)**:
- Sign-up conversion rate: 10%+
- Free trial to paid: 20%+
- Monthly churn rate: <5%
- Customer lifetime value (LTV): $500+
- Customer acquisition cost (CAC): <$50
- LTV:CAC ratio: 10:1

**Growth Targets**:
- Month 1: 50 sign-ups, 20 paying ($500 MRR)
- Month 3: 300 sign-ups, 100 paying ($3,000 MRR)
- Month 6: 1,000 sign-ups, 300 paying ($10,000 MRR)
- Year 1: 3,000 sign-ups, 800 paying ($25,000 MRR)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **Ways to Contribute**
- 🐛 Report bugs and issues
- 💡 Suggest new features
- � Submit pull requests
- 📖 Improve documentation
- ⭐ Star the repository

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add amazing feature"`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Code Standards**
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write clear commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](License.md) file for details.

**You are free to:**
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Include in private projects
- ✅ Sell products built with this

**Attribution appreciated but not required.**

---

## 🙏 Acknowledgments

Built with amazing open-source projects:

- **[shadcn/ui](https://ui.shadcn.com)** - Component library
- **[Clerk](https://clerk.com)** - Authentication
- **[Stripe](https://stripe.com)** - Payments
- **[Supabase](https://supabase.com)** - Database
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Radix UI](https://www.radix-ui.com)** - Primitives
- **[Lucide Icons](https://lucide.dev)** - Icons

Special thanks to the original template by [ShadcnStore](https://shadcnstore.com).

---

## � Support & Contact

### **Get Help**
- � **Documentation** - See `docs/` folder
- � **Issues** - [GitHub Issues](https://agithub.com/yourusername/flowpost/issues)
- 💬 **Discussions** - [GitHub Discussions](https://github.com/yourusername/flowpost/discussions)

### **Connect**
- 🌐 **Website** - [flowpost.app](#)
- 🐦 **Twitter** - [@flowpost](#)
- 📧 **Email** - [hello@flowpost.app](mailto:hello@flowpost.app)

---

## 📈 Stats

![GitHub Stars](https://img.shields.io/github/stars/yourusername/flowpost?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/flowpost?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/flowpost)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/yourusername/flowpost)

---

<div align="center">

**⭐ Star this repo if you're building with FlowPost!**

**Built by a real founder, for real founders.**

_From idea to $10K MRR in 6 months. Let's build together! 🚀_

---

**[Get Started](#quick-start)** | **[View Demo](#)** | **[Read Docs](#documentation)**

</div>

---

## 🎓 Learning Resources

### **For Founders**
- [FLOWPOST_BUSINESS_ROADMAP.md](FLOWPOST_BUSINESS_ROADMAP.md) - Complete business plan
- [FOUNDER_ACTION_PLAN.md](FOUNDER_ACTION_PLAN.md) - Step-by-step execution plan
- [PHASE_3_SETUP_GUIDE.md](PHASE_3_SETUP_GUIDE.md) - Technical setup guide

### **For Developers**
- [ROUTING_AUTHENTICATION_AUDIT.md](ROUTING_AUTHENTICATION_AUDIT.md) - Auth implementation
- [CLERK_INTEGRATION_COMPLETE.md](CLERK_INTEGRATION_COMPLETE.md) - Clerk setup
- [COMPLETE_AUDIT_PHASE_1_2_3.md](COMPLETE_AUDIT_PHASE_1_2_3.md) - Full audit

### **For Designers**
- Landing page components in `src/app/landing/components/`
- Dashboard components in `src/app/(dashboard)/dashboard/components/`
- UI components in `src/components/ui/`

---

## 🔥 Why FlowPost?

### **For Customers**
- 💰 **Affordable** - Starting at $19/month
- 🤖 **AI-Powered** - Generate content in seconds
- 📊 **Insightful** - Real-time analytics
- 🎨 **Beautiful** - Modern, intuitive interface
- 🚀 **Fast** - Built with latest tech

### **For Founders**
- 💵 **Revenue-Ready** - Accept payments day 1
- 🏗️ **Production-Ready** - Clean, scalable code
- 📈 **Proven Model** - SaaS with recurring revenue
- 🎯 **Clear Roadmap** - From MVP to $10K MRR
- 🤝 **Community** - Learn and grow together

### **For Developers**
- ⚡ **Modern Stack** - Next.js 15, React 19, TypeScript
- 🎨 **Beautiful UI** - shadcn/ui, Tailwind CSS
- 🔐 **Secure** - Clerk, Stripe, Supabase
- 📚 **Well Documented** - Clear code and guides
- 🧪 **Type Safe** - Full TypeScript coverage

---

<div align="center">

**Ready to build your SaaS empire?**

**[Start Building Now →](#quick-start)**

_FlowPost: From zero to revenue in record time._ 🚀

</div>
