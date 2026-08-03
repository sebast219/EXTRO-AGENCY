# Performance Manifesto — EXTRO

> Engineering is not just what we build. It's how the experience runs. A premium experience that drops frames betrays its promise. Performance is a design constraint, not an optimization task.

---

## The Core Promise

```
60 FPS  →  Always. No exceptions on desktop.
< 2s    →  Time to interactive on 4G mobile.
0       →  Layout shifts. Zero tolerance.
0       →  Main-thread animations. Everything offloaded to GPU.
```

---

## Perception Metrics

| Metric | Target | Why it matters |
|---|---|---|
| **FCP** (First Contentful Paint) | < 0.8s | User sees something immediately |
| **LCP** (Largest Contentful Paint) | < 1.5s | Hero text is readable fast |
| **TBT** (Total Blocking Time) | < 100ms | Scroll responds instantly |
| **CLS** (Cumulative Layout Shift) | < 0.03 | Nothing jumps. Ever. |
| **INP** (Interaction to Next Paint) | < 80ms | Buttons feel instant |
| **TTI** (Time to Interactive) | < 2.0s | Full interactivity on 4G |

---

## Frame Budget

Every frame has 16.67ms. Here's how it's spent:

```
GPU COMPOSITE  →  6ms  (grid, light, shaders, CSS transforms)
CAMERA CALC   →  2ms  (position, target, easing)
DOM UPDATES   →  3ms  (text scramble, reveal classes, aria)
LOGIC         →  2ms  (scroll position, intersection observers)
HEADROOM      →  3.67ms (buffer for GC, unexpected spikes)
─────────────────────────────────────────────
TOTAL         →  16.67ms
```

**Rules**:
- If any frame exceeds 16.67ms, the dominant animation is downgraded before secondary is touched
- GPU composite budget is sacred — WebGL shaders must complete in < 6ms
- DOM updates are batched via `requestAnimationFrame` — never synchronous
- Scroll handlers use `passive: true` — never block the main thread
- `requestIdleCallback` for non-critical work (analytics, prefetching)

---

## Resource Budget

### JavaScript

| Component | Size (gzipped) | Load strategy |
|---|---|---|
| Next.js shell | < 60KB | Critical, inline |
| GSAP core + ScrollTrigger | < 25KB | Lazy, on first scroll |
| React Three Fiber + Three.js | < 150KB | Lazy, on hero visible |
| Shader programs | < 5KB each | Lazy, per scene |
| Page components | < 40KB | Route-based splitting |
| **Total JS** | **< 300KB** | Progressive |

### CSS

| Component | Size (gzipped) | Strategy |
|---|---|---|
| Tailwind utilities | < 10KB | Purged, only used classes |
| Custom CSS | < 5KB | Inlined in <head> |
| **Total CSS** | **< 15KB** | Critical inline |

### Assets

| Type | Limit | Strategy |
|---|---|---|
| Images | 0 (none) | All visuals are procedural |
| Fonts | < 40KB | Subset, `font-display: swap`, preload |
| Videos | 0 (none) | All motion is procedural |
| Third-party JS | < 5KB | Only essential (analytics) |

---

## GPU Rules

```
WebGL context:       Single shared context (no multiple canvases)
Draw calls/frame:    Max 30
Triangles/scene:     Max 50,000
Texture size:        Max 1024x1024 (all procedural, no textures)
Shader complexity:   Max 16 loop iterations per fragment
Pixel ratio:         Capped at 2 (no 3x retina rendering)
```

---

## Scroll Performance

```
Scroll handlers:     All passive. Zero preventDefault.
Throttling:          requestAnimationFrame only. No setTimeout.
Debouncing:          None needed — scrub handles interpolation.
Scroll-linked FX:    GPU-composited transforms + opacity only.
                     Never: width, height, top, left, margin, padding.
will-change:         Only during active animation. Removed after.
                     Max 3 elements with will-change simultaneously.
```

---

## Memory Budget

| Resource | Limit | Strategy |
|---|---|---|
| JS heap (idle) | < 25MB | No memory leaks, cleanup on unmount |
| JS heap (peak) | < 50MB | During WebGL scenes |
| GPU memory | < 200MB | Dispose geometries, materials on scene exit |
| DOM nodes | < 1,500 | Virtualize long lists, no orphaned nodes |
| Event listeners | < 50 | Cleanup on unmount, delegated where possible |

---

## Loading Strategy

```
FRAME 0 (instant)
  → Critical CSS (inline in <head>)
  → Preloader shell (HTML, no JS needed to render)
  → Font preload (<link rel="preload">)

FRAME 1-30 (0-0.5s)
  → Hero text renders (HTML, no JS needed)
  → GSAP core loads (async, low priority)
  → IntersectionObserver starts watching

FRAME 30-60 (0.5-1.0s)
  → Preloader completes (< 1.05s total)
  → ScrollTrigger lazy-loads
  → Reveal-on-scroll activates

FIRST INTERACTION
  → Button sounds unlock (AudioContext, user gesture required)
  → R3F lazy-loads (if not already visible)

IDLE (after 2s)
  → Prefetch next likely navigation (blog)
  → Pre-warm WebGL context if cases section is close
```

---

## Monitoring

### What we measure in production

```
Core Web Vitals  →  Real-user monitoring (Vercel Analytics)
Custom metrics   →  Time-to-first-camera-move, time-to-grid-breathe
Frame rate       →  requestAnimationFrame delta tracking
JS errors        →  Global error boundary + reporting
WebGL crashes    →  Context loss detection + fallback to CSS
```

### Alerts

```
LCP > 2.5s on p75   →  Investigate within 24h
CLS > 0.1 on p75    →  Immediate rollback candidate
FCP > 1.5s on p75   →  Bundle analysis required
JS error rate > 1%  →  Hotfix within 4h
```

---

## Fallback Tiers

### Tier 1 — Desktop (full capability)
- R3F + WebGL shaders + GSAP + all camera moves
- 60fps target, 30 draw calls, all effects active

### Tier 2 — Laptop / mid GPU
- R3F + WebGL (reduced: no bloom, no DoF)
- 60fps target, 20 draw calls
- Automatic: detected via `navigator.hardwareConcurrency < 4` OR consistent frame drops

### Tier 3 — Tablet
- R3F disabled. CSS transforms + GSAP.
- 60fps target, no WebGL
- Parallax: 50% intensity

### Tier 4 — Mobile
- R3F disabled. CSS only. Simple GSAP reveals.
- No parallax. No camera moves.
- Grid: static or hidden

### Tier 5 — Reduced motion
- All animation disabled. Static content. Instant transitions.
- Triggered by `prefers-reduced-motion: reduce`

---

## The Performance Culture

```
Performance is not a feature. It is a constraint that shapes every decision.

Before adding any animation, ask:
  → Does it run at 60fps on a 2019 MacBook Air?
  → Does it add more than 5KB of JS?
  → Does it touch layout-affecting properties?
  → Can it be GPU-composited?

If any answer is "no" or "I don't know," the animation is not ready.

The best animation is the one the user never notices is an animation.
They just feel the experience is fast, smooth, and alive.
```
