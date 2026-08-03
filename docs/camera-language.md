# Camera Language — EXTRO

> The camera is the narrator. Every section has a distinct camera behavior that reflects its narrative role. This document defines the camera grammar for the entire experience.

---

## Camera Grammar

### Movement Verbs

| Verb | Description | Feeling | When |
|---|---|---|---|
| **Push** | Forward movement along Z-axis | "Entering, committing" | Hero → Services |
| **Orbit** | Circular rotation around subject | "Exploring, examining" | Services carousel |
| **Pan** | Horizontal sweep across scene | "Surveying, breadth" | Delivery system |
| **Dolly** | Lateral tracking alongside subject | "Following, accompanying" | Weekly build |
| **Tracking** | Following subject's path | "Witnessing progress" | Cases build |
| **Zoom Out** | Pulling back, revealing context | "Seeing the big picture" | Pricing narrative |
| **Settle** | Camera comes to rest, stable | "Arrival, resolution" | Contact |
| **Float** | Gentle hovering, micro-movement | "Alive, breathing" | Idle states |

### Intensity Scale
```
1 (subtle)  →  5 (dramatic)
```

---

## Section Camera Map

```
HERO            →  Push In
SERVICES        →  Orbit
WEEKLY BUILD    →  Dolly
DELIVERY        →  Pan
CASES           →  Tracking
PRICING         →  Zoom Out
COMPARISON      →  Snap to grid
PRINCIPLES      →  Float
CONTACT         →  Settle
```

---

## Detailed Camera Behaviors

### Hero — Push In

```
TYPE:        Smooth Z-axis push
INTENSITY:   3/5
DURATION:    Scroll-driven (scrub: 1)
RANGE:       Start: z = 0 → End: z = -200 (camera moves closer to content)
EASING:      --ease-engineer

BEHAVIOR:
  - Camera starts slightly pulled back
  - As user scrolls, camera pushes forward
  - Hero content scales up subtly (creating depth illusion)
  - Background grid compresses (z-compression)
  - Volumetric light intensifies as camera moves "into" the light source

PARALLAX LAYERS:
  - Layer 1 (grid):     speed 0.15x
  - Layer 2 (columns):  speed 0.30x
  - Layer 3 (text):     speed 0.60x
  - Layer 4 (CTAs):     speed 0.85x

EXIT:
  - Camera reaches max push as services section enters viewport
  - Smooth transition to orbit position
```

### Services — Orbit

```
TYPE:        Circular orbit around services carousel
INTENSITY:   4/5
DURATION:    Scroll-driven (scrub: 1.5)
ANGLE RANGE: 0° → 45° (horizontal orbit)

BEHAVIOR:
  - As services track scrolls horizontally, camera orbits
  - Orbit center: active service card
  - Camera maintains constant distance (radius: 800px)
  - Background columns parallax at 0.35x rate
  - Adjacent cards blur slightly (depth of field effect)

ORBIT PARAMETERS:
  - Radius: 800px
  - Height: fixed (no vertical tilt)
  - FOV: narrow (45°) for cinematic feel
  - Focus: active card always sharp

EXIT:
  - Camera completes orbit arc
  - Transitions to dolly position for next section
```

### Weekly Build — Dolly

```
TYPE:        Lateral tracking alongside timeline
INTENSITY:   2/5
DURATION:    Scroll-driven (scrub: 0.8)

BEHAVIOR:
  - Camera tracks horizontally alongside the weekly pipeline
  - Moves at same speed as content (1:1 tracking)
  - Subtle vertical float (±5px)
  - Pipeline dots illuminate as camera passes

DOLLY PARAMETERS:
  - Speed: matches scroll (scrub 0.8)
  - Vertical float: sine wave, amplitude 5px, period 3s
  - Slight tilt toward active element (1-2°)
```

### Delivery — Pan

```
TYPE:        Horizontal pan across delivery phases
INTENSITY:   2/5
DURATION:    Scroll-driven (scrub: 0.7)

BEHAVIOR:
  - Camera pans across the 5 delivery phases (LUN → VIE)
  - Smooth stop at each phase
  - Active phase glows slightly
  - Non-active phases dim (opacity 0.3)

PAN PARAMETERS:
  - Pan angle: 0° → 30°
  - Snap points at each phase
  - Easing between snaps: --ease-out
```

### Cases — Tracking

```
TYPE:        Tracking shot following case build animation
INTENSITY:   4/5
DURATION:    Per case: 1.5-2.5s (autonomous, not scroll-driven)

BEHAVIOR:
  - Camera tracks the procedural build of each case study
  - Starts wide → tracks in as elements construct
  - Each case has unique tracking path:

  Marketplace:
    Camera starts overhead (top-down view of grid)
    → Descends to 45° as nodes populate
    → Tracks right as API lines draw
    → Settles on dashboard with metric

  Ecommerce:
    Camera starts at storefront (front view)
    → Pushes through store (depth)
    → Pans to checkout flow
    → Tracks to inventory dashboard

  Analytics:
    Camera starts in darkness
    → Pulls back to reveal Excel grid
    → CSV data particles flow in
    → Camera orbits as dashboard assembles
    → Zooms to metric

EXIT:
  - Camera pulls back to wide
  - Case scene fades
  - Next case begins entering
```

### Pricing — Zoom Out

```
TYPE:        Progressive zoom out revealing full narrative
INTENSITY:   3/5
DURATION:    Scroll-driven (scrub: 0.6)

BEHAVIOR:
  - Camera starts close on single company
  - As scroll progresses, camera zooms out:
    1. Company (close)
    2. Company + needs (mid)
    3. Company + needs + EXTRO solution (wide)
    4. Full narrative arc visible (ultra-wide)
  - Each milestone glows as camera passes
  - Final price resolves at widest point

ZOOM PARAMETERS:
  - Start FOV: 40° (telephoto)
  - End FOV: 70° (wide)
  - Milestone markers at 25%, 50%, 75% scroll
  - Narrative text fades in/out at each stage
```

### Principles — Float

```
TYPE:        Gentle hovering with micro-movements
INTENSITY:   1/5
DURATION:    Perpetual (while section is visible)

BEHAVIOR:
  - Camera floats gently — never fully still
  - Micro X/Y drift (±3px, sine wave)
  - Micro Z drift (±1px, slower sine wave)
  - Principles cards respond individually:
    - Active card (hovered): rises slightly
    - Adjacent cards: subtle parallax

FLOAT PARAMETERS:
  - X drift: amplitude 3px, period 6s, phase offset per visit
  - Y drift: amplitude 2px, period 8s, phase offset
  - Z drift: amplitude 1px, period 12s
```

### Contact — Settle

```
TYPE:        Camera comes to complete rest
INTENSITY:   1/5
DURATION:    Deceleration over 1.5s

BEHAVIOR:
  - All camera movement decelerates to zero
  - Grid breathing reduces to minimum (opacity 0.12)
  - Volumetric light settles to NEUTRAL state
  - Form becomes active focus
  - White space dominates — the experience breathes out

SETTLE PARAMETERS:
  - Deceleration curve: --ease-cinematic
  - Final position: centered, z=0
  - All parallax layers return to origin
  - Breathing continues at minimum amplitude
```

---

## Camera Transitions

### Between sections

```
HERO → SERVICES     Push completes, camera holds, orbit begins
                     Duration: 0.8s
                     Blend: 0.3s overlap

SERVICES → WEEKLY   Orbit decelerates, camera resets to center
                     Duration: 0.5s
                     Blend: 0.2s overlap

WEEKLY → DELIVERY   Dolly slides into pan start position
                     Duration: 0.6s
                     Blend: 0.2s overlap

DELIVERY → CASES    Pan stops, camera resets for tracking
                     Duration: 0.7s
                     Blend: 0.3s overlap

CASES → PRICING     Tracking completes, camera pulls back
                     Duration: 0.6s
                     Blend: 0.3s overlap

PRICING → CONTACT   Zoom completes, camera settles
                     Duration: 1.2s
                     Blend: 0.4s overlap
```

---

## Responsive Behavior

### Desktop (>1024px)
- Full camera system active
- All parallax layers
- Depth of field effects

### Tablet (768-1024px)
- Reduced parallax (50% intensity)
- No depth of field
- Simpler transitions (fade + slide replaces complex camera moves)

### Mobile (<768px)
- Camera simulation via CSS transforms only
- No R3F camera
- Parallax: disabled
- Transitions: simple fade
- Grid: static or disabled
