# Linear Design System - Quick Reference

## 🎯 Core Values (Memorize These)

```
Heights:     h-7 (28px) NOT h-9 (36px)
Font Size:   11px NOT 14px
Padding:     p-3 (12px) NOT p-6 (24px)
Transitions: 100ms NOT 150ms
Borders:     white/[0.06] NOT white/20
Background:  #0a0a0a NOT #18181b
Shadows:     NONE - borders only
```

## 🎨 Color Palette

```tsx
// Backgrounds
bg-[#0a0a0a]           // Primary background
bg-[#0d0d0d]           // Secondary
bg-[#111111]           // Cards
bg-white/[0.02]        // Subtle card bg

// Borders
border-white/[0.06]    // Default - barely visible
border-white/10        // Hover
border-white/20        // Focus

// Text
text-white/90          // Primary text
text-white/60          // Secondary text
text-white/40          // Tertiary text
text-white/30          // Disabled
```

## 📏 Spacing Scale

```tsx
gap-1      // 4px
gap-1.5    // 6px  ← buttons
gap-2      // 8px  ← cards
gap-3      // 12px

p-2        // 8px  ← compact
p-3        // 12px ← default
p-4        // 16px ← large
```

## 🔤 Typography

```tsx
text-[10px]            // Labels, helper text
text-[11px]            // Base UI (buttons, inputs)
text-[12px]            // Body text
text-[13px]            // Headings

tracking-tight         // -0.02em (always use)
leading-none           // line-height: 1 (buttons/inputs)
leading-tight          // line-height: 1.4 (text)
```

## 🎛️ Component Classes

### Button (h-7, 11px)
```tsx
className="
  h-7 px-3 gap-1.5
  text-[11px] font-medium leading-none tracking-tight
  rounded-md
  transition-all duration-100
  active:scale-[0.97]
"
```

### Input (h-7, 11px)
```tsx
className="
  h-7 px-2
  text-[11px] tracking-tight leading-none
  bg-white/[0.02] border border-white/[0.06]
  rounded-md
  transition-all duration-100
  focus:border-white/20 focus:bg-white/[0.04]
  outline-none
"
```

### Card (p-3, barely visible border)
```tsx
className="
  p-3
  bg-white/[0.02] border border-white/[0.06]
  rounded-md
  transition-all duration-100
  hover:bg-white/[0.04] hover:border-white/10
"
```

## ⚡ Transitions

```tsx
transition-all duration-100    // All UI interactions
transition-colors duration-100 // Color changes only
transition-transform duration-100 // Scale/transform only
```

## 🎭 Micro-Interactions

```tsx
// Button press
active:scale-[0.97]

// Card press
active:scale-[0.99]

// Hover lift (rare)
hover:scale-[1.02]

// Focus ring (minimal)
focus-visible:ring-1 focus-visible:ring-white/20
```

## 🚫 What NOT to Use

```tsx
❌ h-9           → ✅ h-7
❌ text-sm       → ✅ text-[11px]
❌ p-6           → ✅ p-3
❌ duration-150  → ✅ duration-100
❌ shadow-md     → ✅ border only
❌ ring-2        → ✅ border change
❌ bg-zinc-900   → ✅ bg-[#0a0a0a]
```

## 📦 Import Pattern

```tsx
import {
  PremiumButton,
  PremiumInput,
  PremiumCard,
  PremiumCardHeader,
  PremiumCardTitle,
  PremiumCardDescription,
  PremiumCardContent,
  PremiumCardFooter,
} from "@/components/showcase"
```

## 🎯 Common Patterns

### Form Field
```tsx
<div className="space-y-1">
  <label className="text-[10px] text-white/40">Email</label>
  <input className="h-7 px-2 text-[11px] bg-white/[0.02] border border-white/[0.06]" />
  <p className="text-[10px] text-white/40">Helper text</p>
</div>
```

### Button Group
```tsx
<div className="flex gap-2">
  <PremiumButton variant="primary">Save</PremiumButton>
  <PremiumButton variant="ghost">Cancel</PremiumButton>
</div>
```

### Card Grid
```tsx
<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
  <PremiumCard variant="elevated">...</PremiumCard>
  <PremiumCard variant="elevated">...</PremiumCard>
  <PremiumCard variant="elevated">...</PremiumCard>
</div>
```

## 🎨 State Colors

```tsx
// Success
text-green-400
border-green-500/50

// Error
text-red-400
border-red-500/50

// Warning
text-amber-400
border-amber-500/50

// Info
text-blue-400
border-blue-500/50
```

## 📱 Responsive Spacing

```tsx
// Mobile: tight
p-4 space-y-4

// Desktop: still compact
md:p-6 md:space-y-6

// Never use p-8 or larger
```

## 🔍 Debug Checklist

When a component doesn't feel "Linear":

- [ ] Is height h-7 (28px)?
- [ ] Is font size 11px?
- [ ] Is padding p-3 or less?
- [ ] Is transition 100ms?
- [ ] Is border white/[0.06]?
- [ ] Are shadows removed?
- [ ] Is background near-black?
- [ ] Is tracking tight?
- [ ] Is scale-[0.97] on press?
- [ ] Is it monochrome first?

## 💡 Pro Tips

1. **Always use tracking-tight** on UI text
2. **Never use shadows** - borders only
3. **Keep borders barely visible** - white/[0.06]
4. **Use 100ms transitions** everywhere
5. **Scale on press** for instant feedback
6. **Monochrome first** - color for accents only
7. **Pack information** - density over whitespace
8. **Near-black backgrounds** - #0a0a0a not #18181b

## 🎯 The Golden Rule

> "If it looks like generic shadcn/ui, it's wrong. Linear components are SMALLER, TIGHTER, and MORE MINIMAL."
