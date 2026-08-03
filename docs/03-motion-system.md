# Motion System — EXTRO

> This document defines every easing curve, duration, and transition pattern. It's the single source of truth for motion behavior across the entire experience.

---

## Design Tokens

### Duration Scale (in seconds)

| Token | Value | Usage |
|---|---|---|
| `--dur-instant` | 0.08 | Color shifts, opacity snap |
| `--dur-micro` | 0.15 | Icon states, dot indicators, sweep effects |
| `--dur-quick` | 0.25 | Button hover, card lift, link underline |
| `--dur-standard` | 0.40 | Text scramble, reveal elements, section transitions |
| `--dur-deliberate` | 0.60 | Camera moves, major transitions, grid deformation |
| `--dur-cinematic` | 0.90 | Volumetric light shifts, atmosphere changes |
| `--dur-breath` | 4.00 | Ambient grid breathing cycle |
| `--dur-light-cycle` | 10.00 | Full volumetric light rotation cycle |

### Easing Curves

| Token | Curve | Character | Usage |
|---|---|---|---|
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy, precise | Buttons, card interactions |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Smooth settle | Default exit, reveal, fade |
| `--ease-in` | `cubic-bezier(0.64, 0, 0.78, 0)` | Sharp entry | Preloader letter build |
| `--ease-in-out` | `cubic-bezier(0.76, 0, 0.24, 1)` | Balanced | Camera transitions |
| `--ease-engineer` | `cubic-bezier(0.16, 1, 0.3, 1)` | Technical, precise | Grid deform, scroll reveals (Apple-style) |
| `--ease-cinematic` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Smooth, filmic | Camera dolly, volumetric light |

### Stagger Scale

| Token | Value | Usage |
|---|---|---|
| `--stagger-micro` | 0.04s | Letters in a word |
| `--stagger-word` | 0.08s | Words in a heading |
| `--stagger-card` | 0.10s | Cards in a grid |
| `--stagger-section` | 0.15s | Elements within a section reveal |

---

## Global Systems

### 1. Ambient Grid — Elastic Deformation

**Technology**: CSS grid + GSAP (future: R3F/Shader)

**Behavior**:
```
Idle  →  Breathing cycle (4s): opacity 0.15 ↔ 0.28
Scroll →  Elastic stretch: scaleY(1 + scroll% * 0.015)
         Shift: translateY(-scrollY * 0.025)
         Wave: individual columns deform at different rates
Mouse →   Subtle parallax drift based on cursor position
```

**Elastic properties**:
- Stiffness: 0.96 (returns to shape slowly)
- Damping: 0.85 (overshoots slightly on scroll stop)
- Mass: light (responds quickly to input)

**Rules**:
- Grid never becomes invisible (min opacity 0.12)
- Grid never dominates (max opacity 0.28)
- Deformation is always smooth — never jittery
- Columns respond at staggered rates (±15% variance)

---

### 2. Volumetric Light System

**Technology**: CSS radial gradients → future: R3F lights + shaders

**State machine**:
```
COOL_BLUE  →  WARM_WHITE  →  NEUTRAL  →  COOL_BLUE
(hero)        (services)     (pricing)    (contact)
```

**Properties per state**:

| State | Color | Intensity | Position | Duration |
|---|---|---|---|---|
| COOL_BLUE | `rgba(0,102,255,0.025)` | High | `50% 0%` | 10s cycle |
| WARM_WHITE | `rgba(240,240,245,0.020)` | Medium | `50% 30%` | 10s cycle |
| NEUTRAL | `rgba(0,0,0,0.010)` | Low | `50% 50%` | 10s cycle |

**Transitions**: All light changes use `--ease-cinematic` over `--dur-cinematic`.

**Future (R3F)**:
- Directional light with soft shadows
- Spot light that tracks scroll progress
- Point lights that illuminate specific sections
- Volumetric god rays via post-processing

---

### 3. Living Typography

**Technology**: GSAP per-word animations

**Properties per word**:
```
mass       →  affects response speed (heavy = slow)
velocity   →  base float speed
elasticity →  overshoot on position changes
breath     →  micro scale oscillation (1.0 ↔ 1.008)
```

**States per context**:

| Context | Mass | Velocity | Elasticity | Breath |
|---|---|---|---|---|
| Hero heading | Heavy | Medium | High (1.15 overshoot) | 1.0 ↔ 1.005 |
| Section title | Medium | Low | Medium | 1.0 ↔ 1.003 |
| Card heading | Light | None | Low | None |
| CTA text | Light | High | High | None |

**Entrance behaviors**:
- **Scramble**: Characters resolve from random symbols → target text
  - Duration: `--dur-standard` per word
  - Stagger: `--stagger-word` between words
  - Easing: `--ease-out`
  - Trigger: When word enters viewport (IntersectionObserver)
- **Build**: Letters emerge from bottom with blur
  - Duration: `--dur-quick` per letter
  - Stagger: `--stagger-micro`
  - Filter: blur(12px) → blur(0)
  - Y offset: 18px → 0

---

## Section-Specific Motion

### Hero

```
LOAD → Grid appears (fade in, 0.5s delay after preloader)
     → Hero columns establish (staggered, 0.05s each)
     → Heading scrambles in (0.4s per word, 0.08s stagger)
     → Subtitle fades up
     → CTAs spring in
     → Badges stagger in
     → Scroll hint breathes (perpetual)

IDLE → Grid breathes (4s cycle)
     → Columns parallax with mouse (x * 8px, y * 4px, depth varies)
     → Volumetric light shifts (10s cycle)

EXIT → Grid compresses slightly
     → Camera pushes in (see Camera Language)
```

### Services (Horizontal Scroll)

```
PIN → Section pins to viewport
   → Track slides left (scrub: 1)
   → Background columns parallax at 35% rate

SLIDE FOCUS → Active slide elevates (translateY(-4px), deeper shadow)
           → Adjacent slides dim slightly (opacity 0.7)

EXIT → Track slides out
     → Pin releases
     → Camera transitions to orbit
```

### Cases (WebGL Scenes)

```
ENTER → Case scene builds procedurally
      ┌─────────────────────────────────────┐
      │ Marketplace case:                    │
      │                                      │
      │ 1. Grid appears (wireframe)          │
      │ 2. Data nodes populate               │
      │ 3. Connections draw (API lines)      │
      │ 4. Dashboard assembles               │
      │ 5. Metric "67%" resolves (scramble)  │
      └─────────────────────────────────────┘

EACH CASE → Build animation triggers on scroll into view
         → Duration: 1.5-2.5s depending on complexity
         → Previous case fades to background (opacity 0.3)

EXIT → Active scene dims
     → Camera pulls back
```

### Pricing (Narrative Journey)

```
SCROLL → Company grows → needs automation → needs AI → needs architecture → Scale
      → Each phase reveals progressively
      → Price resolves via scramble at end of narrative
      → Cards NEVER appear. Story unfolds linearly.

VISUAL → Progress bar tracks narrative
      → Milestone markers with tooltip previews
      → Final CTA emerges from the completed narrative
```

### Contact

```
ENTER → Form elements build from bottom
     → Contact cards stagger in
     → Light settles to NEUTRAL state

SUBMIT → Button compresses (scale 0.97) → springs back (1.03) → settles (1.0)
      → Success: subtle green pulse + checkmark animation
      → Error: subtle shake + red flash

HOVER → Contact cards elevate (translateY(-2px))
      → Shadow deepens
```

---

## Preloader (Simplified)

```
PHASE 0 → Black frame (0.10s)

PHASE 1 → EXTRO builds
        → Letters appear from bottom (clip-path reveal)
        → Stagger: --stagger-micro between letters
        → Duration: 0.12s per letter
        → Total build: ~0.60s

PHASE 2 → Brief hold (0.15s)
        → Grid lines fade in behind text

PHASE 3 → Clean dissolve to hero
        → Duration: 0.20s
        → Grid transitions to full-page ambient grid
        → Hero content becomes visible

TOTAL: ~1.05s

REMOVED FROM ORIGINAL:
- Sound effects (tick, whoosh)
- Particle explosion
- Circle mask reveal
- FLIP text transition
- Lens blur on hero
- Sweep reflection
- Organic edge filter
- Noise grain overlay
```

---

## Interaction Patterns

### Buttons

```
DEFAULT    → Rest position

HOVER      → translateY(-4px) scale(1.03)
           → Shadow expands (4-layer)
           → Glow intensifies (primary only)
           → Arrow shifts right (+3px)
           → Duration: --dur-quick
           → Easing: --ease-spring

PRESS      → translateY(-1px) scale(0.99)
           → Shadow compresses

RELEASE    → Springs back to hover or default
```

### Cards

```
DEFAULT    → Rest with subtle shadow (2-layer)

HOVER      → translateY(-2px), no scale
           → Shadow deepens (3-layer)
           → Border opacity increases (0.06 → 0.12)
           → Duration: --dur-quick
           → Easing: --ease-out

FEATURED   → Pre-elevated (translateY(0), deeper shadow)
           → On hover: translateY(-3px)
           → Extra glow ring
```

### Reveal on Scroll

```
BEFORE     → opacity: 0, translateY(28px), filter: blur(2px)

ENTER      → opacity: 1, translateY(0), filter: blur(0)
           → Duration: --dur-standard
           → Easing: --ease-engineer
           → Stagger controlled by --reveal-delay CSS var
```

### Scroll Progress Bar

```
BEHAVIOR   → scaleX tracks scroll percentage
           → Color shifts at section boundaries
           → Smooth: no CSS transition, uses requestAnimationFrame
```

---

## Performance Rules

1. **All animations respect `prefers-reduced-motion`** — disable all motion, show static content.
2. **GSAP ScrollTriggers use `scrub` for scroll-driven animation** — no jank on fast scroll.
3. **Heavy animations (WebGL, R3F) use `will-change` sparingly** — only during active animation.
4. **IntersectionObserver disconnects after reveal** — no memory leaks.
5. **RAF-based animations (scroll, mouse) throttled to 60fps** — no unnecessary frames.
6. **CSS animations preferred over JS for simple transitions** — GPU-composited.
