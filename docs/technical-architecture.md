# Technical Architecture — EXTRO Motion System

> This document defines the technology stack, the responsibility of each tool, and how they interoperate to deliver the EXTRO motion experience.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    REACT / NEXT.JS 14                    │
│                      (Application Shell)                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   GSAP   │  │ R3F/THREE│  │  Canvas  │  │   CSS   │ │
│  │ Scroll   │  │   WebGL  │  │   2D     │  │  Layout │ │
│  │Trigger   │  │  Shaders │  │ Proced. │  │  Theme  │ │
│  │ Reveal   │  │  Camera  │  │ Drawing  │  │  Trans. │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       │              │              │              │      │
│       └──────────────┴──────────────┴──────────────┘      │
│                          │                                │
│              ┌───────────┴───────────┐                    │
│              │   IntersectionObserver │                    │
│              │   Scroll Orchestrator  │                    │
│              └───────────────────────┘                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Responsibilities

### GSAP + ScrollTrigger

**Role**: Scroll-driven animation engine. The conductor of the motion orchestra.

**Owns**:
- All scroll-linked animations (scrub, pin, parallax)
- Timeline sequencing (preloader, section transitions)
- Text scramble animations
- Card hover/click micro-interactions
- Scroll progress tracking
- Reveal-on-scroll coordination
- Mouse parallax effects

**Does NOT own**:
- WebGL rendering
- Shader programs
- 3D scene management
- Canvas drawing
- CSS layout

**Key configuration**:
```
ScrollTrigger.defaults({
  scroller: window,       // Use window, not body
})
gsap.config({
  nullTargetWarn: false,
  force3D: true,          // GPU acceleration
})
```

**Dependencies**: none (standalone)

**Performance note**: GSAP animations on transform/opacity only. Never animate layout-affecting properties (width, height, top, left, margin, padding).

---

### React Three Fiber (R3F) + Three.js

**Role**: 3D scene rendering. Procedural visuals. Camera system.

**Owns**:
- Hero scene (grid, particles, volumetric light)
- Case study WebGL scenes (procedural builds)
- Camera system (position, orbit, tracking, zoom)
- Shader materials (grid deformation, light rays)
- Post-processing effects (bloom, depth of field)
- Procedural geometry generation

**Does NOT own**:
- Text rendering (use HTML overlay or Drei `Text`)
- Scroll animation (delegates to GSAP via refs)
- CSS transitions
- 2D layout

**Scene composition**:
```tsx
<Canvas>
  <CameraController />     {/* Scroll-reactive camera */}
  <VolumetricLight />      {/* Procedural light rays */}
  <AmbientGrid3D />        {/* Elastic deformable grid */}
  <ParticleField />        {/* Context-aware particles */}
  <PostProcessing />       {/* Bloom, DoF */}
  <Html>                   {/* Text overlays via HTML */}
    <h1>EXTRO</h1>
  </Html>
</Canvas>
```

**New dependencies needed**:
```
@react-three/fiber  →  React renderer for Three.js
@react-three/drei   →  Helpers (Text, OrbitControls, Html)
@react-three/postprocessing → Bloom, DoF, effects
three               →  Core 3D library
```

**Performance rules**:
- Canvas only renders when section is visible (IntersectionObserver toggle)
- Pixel ratio capped at 2 (no retina x3)
- Mesh count per scene: max 500
- Draw calls per frame: max 50
- Frameloop: demand (only renders on state change, not 60fps idle)

---

### Canvas 2D

**Role**: Procedural 2D drawing for lightweight visual effects.

**Owns**:
- Noise/grain textures (pre-generated, cached)
- Procedural patterns (grid lines, dots)
- Data visualization flourishes (case study metrics)
- Particle effects that don't need 3D

**Does NOT own**:
- 3D rendering (use R3F)
- DOM animation (use GSAP + CSS)
- Complex shaders (use WebGL)

**Usage**: Limited. Most visuals handled by R3F or CSS. Canvas used for effects where 60fps on a 2D context is sufficient and simpler than a full WebGL setup.

---

### CSS (Tailwind + Custom)

**Role**: Layout, theming, static styling, GPU-composited transitions.

**Owns**:
- Page layout (flexbox, grid)
- Typography styling
- Color theming (design tokens via CSS variables)
- Simple transitions (opacity, transform on hover)
- Card styles (shadows, borders, glass effects)
- Responsive breakpoints
- `prefers-reduced-motion` compliance
- Scrollbar styling
- Selection styling
- Focus visible outlines

**Does NOT own**:
- Scroll-driven animation (use GSAP)
- Complex sequenced animation (use GSAP)
- 3D rendering (use R3F)
- Dynamic geometry (use Canvas/WebGL)

**Design tokens** (CSS custom properties):
```css
--accent: #0066ff
--ink: #000000
--surface: #f5f5f7
--line: rgba(0,0,0,0.06)
--radius: 12px
--ease-out: cubic-bezier(0.22, 1, 0.36, 1)
--dur-quick: 0.25s
--dur-standard: 0.40s
```

---

### WebGL Shaders (GLSL)

**Role**: GPU-accelerated visual effects at 60fps.

**Owns**:
- Grid deformation (vertex shader: scroll-based wave displacement)
- Volumetric light rays (fragment shader: volumetric scattering)
- Organic noise (fragment shader: Perlin/Simplex noise)
- Color grading (fragment shader: LUT, tone mapping)
- Particle systems (vertex + fragment: position, color, life)

**Shader architecture**:
```
Vertex Shader   →  Position manipulation (grid waves, particle paths)
Fragment Shader →  Color computation (light scattering, noise, grading)

Passed via uniforms:
  - uTime        (seconds since load)
  - uScroll      (normalized scroll position 0-1)
  - uMouse       (normalized mouse position xy)
  - uResolution  (viewport width, height)
  - uIntensity   (section-specific intensity multiplier)
```

**Performance rules**:
- Shaders compile on first use, cached thereafter
- Uniform updates via requestAnimationFrame (not every render)
- Shader complexity capped: no nested loops > 16 iterations
- Texture lookups: max 4 per fragment

---

### HTML Overlay (via R3F `<Html>` or portal)

**Role**: Accessible text on top of WebGL scenes.

**Owns**:
- Headings in hero scene
- Case study labels and metrics
- CTA buttons over 3D backgrounds

**Rules**:
- All text must be real DOM, not texture-rendered
- Accessible: screen readers read HTML content
- SEO: search engines index the text
- CRISP: no rasterization artifacts at any zoom level

---

## Component Ownership Map

| Component | Primary Tech | Secondary |
|---|---|---|
| Preloader | GSAP (timeline) | CSS (styling) |
| AmbientGrid (current) | CSS (grid) + JS (scroll) | → Future: R3F (deform) |
| AmbientGrid (future) | R3F + Shader (elastic) | GSAP (intensity) |
| Hero | R3F (scene) + GSAP (text) | CSS (layout) |
| Navbar | CSS (glass, transitions) | GSAP (scroll state) |
| Services | GSAP (horizontal scroll) | CSS (cards) |
| Cases (current) | React (cards) | CSS (hover) |
| Cases (future) | R3F (scene build) | GSAP (trigger) + HTML (text) |
| Pricing (current) | React (3 cards) | CSS |
| Pricing (future) | GSAP (narrative scroll) | CSS (layout) |
| Contact | React (form) + CSS | GSAP (reveal) |
| All sections | GSAP (reveal on scroll) | CSS (initial state) |
| ScrollProgress | JS (RAF) + CSS | — |
| Camera system | R3F (camera) | GSAP (scroll linkage) |
| Volumetric light | R3F + Shader | CSS (fallback) |

---

## Dependency Graph

```
next.js (14.x)
├── react (18.x)
├── react-dom (18.x)
├── gsap (3.12.x)
│   └── ScrollTrigger plugin
├── three (latest)
├── @react-three/fiber (latest)     ← NEW
├── @react-three/drei (latest)      ← NEW
├── @react-three/postprocessing     ← NEW (optional, bloom/DoF)
├── tailwindcss (3.4.x)
├── lucide-react (icons)
└── [existing deps: sanity, next-auth, resend, bcryptjs]
```

---

## Build & Bundle Strategy

### Code splitting
```
/page (initial load)
  → Preloader       (critical, inline)
  → Hero shell      (critical, inline)
  → GSAP core       (critical, inline)

/lazy (loaded on interaction)
  → ScrollTrigger   (lazy, loads on first scroll)
  → R3F + Three     (lazy, loads when hero enters viewport)
  → Shader programs (lazy, loaded per scene)
  → Post-processing (lazy, loaded with R3F)
```

### Bundle targets
- Initial JS: < 80KB (gzipped)
- Total JS: < 300KB (gzipped)
- R3F + Three: < 150KB (gzipped, lazy loaded)
- CSS: < 15KB (gzipped)

---

## Performance Budget

| Metric | Target |
|---|---|
| FCP (First Contentful Paint) | < 1.2s |
| LCP (Largest Contentful Paint) | < 1.8s |
| TBT (Total Blocking Time) | < 150ms |
| CLS (Cumulative Layout Shift) | < 0.05 |
| Scroll jank (frame drops) | < 1% of frames below 60fps |
| GPU memory (WebGL) | < 256MB |
| JS heap | < 30MB idle |

---

## Fallback Strategy

```
Desktop (full motion)
  → R3F + Shaders + GSAP + all camera moves

Tablet (reduced motion)
  → R3F disabled
  → CSS + GSAP (reduced parallax)
  → Camera simulation via CSS transforms

Mobile (minimal motion)
  → R3F disabled
  → Simple GSAP reveals
  → No parallax
  → CSS transitions only

prefers-reduced-motion
  → All motion disabled
  → Static content
  → Instant transitions
  → No canvas, no WebGL, no GSAP animations
```

---

## Migration Path (Current → Target)

### Phase 1: Foundation
- [ ] Add R3F/Three.js dependencies
- [ ] Create ElasticGrid3D component (R3F + vertex shader)
- [ ] Create VolumetricLight component (R3F + fragment shader)
- [ ] Replace CSS AmbientGrid with R3F grid
- [ ] Simplify Preloader (remove sound, particles, FLIP, mask)
- [ ] Add GSAP-to-R3F bridge (scroll → uniform updates)

### Phase 2: Hero & Camera
- [ ] Replace hero columns with R3F scene
- [ ] Implement procedural grid + particles in hero
- [ ] Implement camera Push In behavior
- [ ] Wire volumetric light to scroll position

### Phase 3: Cases & Pricing
- [ ] Build CaseStudyScene component (procedural WebGL builds)
- [ ] Implement camera Tracking for each case
- [ ] Convert Pricing to narrative scroll (replace 3 cards)
- [ ] Implement camera Zoom Out

### Phase 4: Polish
- [ ] Post-processing (bloom, subtle DoF)
- [ ] Performance optimization (draw calls, memory)
- [ ] Responsive testing (tablet, mobile fallbacks)
- [ ] `prefers-reduced-motion` comprehensive testing
- [ ] Bundle analysis and optimization
