# Interactive Effects Components

High-end particle effects, animated backgrounds, and interactive elements inspired by modern design trends like AuthKit.com.

## Components

### 1. ParticlesBackground
Interactive particle system with mouse interactions using @tsparticles/react.

**Props:**
- `className?: string` - Additional CSS classes
- `variant?: "default" | "minimal" | "dense" | "connected"` - Particle density and behavior

**Variants:**
- `default` - 80 particles, moderate movement
- `minimal` - 30 particles, slow movement, subtle
- `dense` - 150 particles, compact layout
- `connected` - Particles with connecting lines, grab interaction on hover

**Features:**
- Click to add particles
- Hover to repulse/grab particles
- Smooth animations at 120 FPS
- Responsive to screen size

### 2. AnimatedGrid
Animated grid/dot patterns that move across the background.

**Props:**
- `className?: string` - Additional CSS classes
- `variant?: "default" | "dots" | "lines"` - Grid style

**Variants:**
- `default` - Static grid overlay
- `dots` - Animated moving dots
- `lines` - Animated moving lines

### 3. GradientOrbs
Floating animated gradient blobs that create depth and visual interest.

**Props:**
- `className?: string` - Additional CSS classes
- `count?: number` - Number of orbs (default: 3)

**Features:**
- Smooth floating animation
- Radial gradient with blur
- Staggered animation timing
- Purple theme colors

### 4. SpotlightEffect
Mouse-following spotlight effect that highlights content on hover.

**Props:**
- `className?: string` - Additional CSS classes
- `size?: number` - Spotlight diameter in pixels (default: 600)
- `color?: string` - Spotlight color (default: purple theme)

**Features:**
- Smooth spring-based mouse tracking
- Fades in on mouse movement
- Radial gradient with blur
- Fixed positioning

### 5. FloatingElements
Floating icons or shapes that animate across the background.

**Props:**
- `className?: string` - Additional CSS classes
- `count?: number` - Number of elements (default: 8)
- `variant?: "icons" | "shapes"` - Element type

**Variants:**
- `icons` - Lucide icons (Sparkles, Zap, Star, Circle)
- `shapes` - Simple circular shapes

**Features:**
- Vertical and horizontal floating
- Rotation animation
- Opacity pulsing
- Staggered timing

### 6. AnimatedBeams
Animated light beams/connectors that create dynamic visual connections.

**Props:**
- `className?: string` - Additional CSS classes
- `count?: number` - Number of beams (default: 5)

**Features:**
- SVG-based line animations
- Gradient stroke
- Path length animation
- Responsive to container size

## Usage Examples

### Hero Section
```tsx
import { ParticlesBackground, GradientOrbs, SpotlightEffect } from '@/components/effects'

<section className="relative overflow-hidden">
  <ParticlesBackground variant="connected" />
  <GradientOrbs count={3} />
  <SpotlightEffect size={800} />
  {/* Your content */}
</section>
```

### Features Section
```tsx
import { AnimatedGrid, FloatingElements } from '@/components/effects'

<section className="relative overflow-hidden">
  <AnimatedGrid variant="dots" />
  <FloatingElements count={12} variant="shapes" />
  {/* Your content */}
</section>
```

### Pricing Section
```tsx
import { ParticlesBackground, GradientOrbs } from '@/components/effects'

<section className="relative overflow-hidden">
  <ParticlesBackground variant="minimal" />
  <GradientOrbs count={2} />
  {/* Your content */}
</section>
```

### FAQ Section
```tsx
import { AnimatedBeams, GradientOrbs } from '@/components/effects'

<section className="relative overflow-hidden">
  <AnimatedBeams count={6} />
  <GradientOrbs count={2} />
  {/* Your content */}
</section>
```

## Best Practices

1. **Performance**: Use `overflow-hidden` on parent sections to prevent layout shifts
2. **Z-Index**: Effects use `-z-10` by default, ensure content has higher z-index
3. **Variants**: Mix different variants across sections for visual variety
4. **Count**: Adjust particle/element counts based on section size
5. **Relative Positioning**: Parent sections should have `relative` positioning

## Customization

All effects use the theme's primary color (purple) by default. To customize:

```tsx
// Custom color for spotlight
<SpotlightEffect color="hsl(200, 70%, 60%)" />

// Adjust particle count
<ParticlesBackground variant="dense" />

// More orbs for larger sections
<GradientOrbs count={5} />
```

## Dependencies

- `@tsparticles/react` - Particle system
- `@tsparticles/slim` - Lightweight particle engine
- `@tsparticles/engine` - Core particle engine
- `framer-motion` - Animation library
- `lucide-react` - Icons for floating elements

## Performance Notes

- Particles use hardware acceleration
- Animations use `transform` and `opacity` for optimal performance
- Effects are lazy-loaded and only render when in viewport
- FPS is capped at 120 for smooth performance
