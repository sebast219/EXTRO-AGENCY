# Spatial Design Language — EXTRO

> This document defines the laws of space. It is the constitution that prevents any future animation, component, or section from breaking the visual language. Every element in the EXTRO experience exists within a single, unified spatial system.

---

## Principle 01 — Depth is mandatory

The space is never flat. Every surface possesses depth.

```
NOT:  Flat cards on a white background
YES:  Cards floating in Z-space with layered shadows
```

**Rules**:
- Every interactive surface has a Z-position
- Depth is expressed through shadow, not outline
- Minimum 2 shadow layers per elevated element
- Background is never at Z=0 — it has its own depth (gradient, grid, light)

---

## Principle 02 — One space, one camera

All elements belong to the same space. Nothing floats disconnected from context.

```
NOT:  Independent animations per component
YES:  Every element responds to the same camera and the same physics
```

**Rules**:
- The camera is the single source of perspective
- Parallax is driven by depth from camera, not arbitrary offset
- Elements at the same Z-depth move at the same rate
- Background, midground, foreground form a continuous depth field
- No element may override or bypass the camera system

---

## Principle 03 — Light defines hierarchy

Content hierarchy is expressed through illumination, never through color.

```
NOT:  "This card is blue so it's important"
YES:  "This card catches more light so it draws the eye"
```

**Rules**:
- Primary focus receives the brightest illumination
- Secondary elements are lit but dimmed
- Tertiary elements exist in ambient light only
- Color is functional (CTA, status), never decorative
- The accent blue (#0066ff) is a light source, not a paint color

**Light hierarchy**:
```
LEVEL 1 (Hero, featured CTA)     → Full volumetric + directional
LEVEL 2 (Active section)         → Directional + ambient
LEVEL 3 (Background sections)    → Ambient only
LEVEL 4 (Inactive, past)         → Ambient at 30%
```

---

## Principle 04 — Motion emerges from space

Movement is never arbitrary. It is always a consequence of spatial relationships.

```
NOT:  "Let's add a bounce here"
YES:  "This card is at Z=40, so it moves at 0.4x parallax rate"
```

**Rules**:
- Every motion parameter derives from a spatial property (depth, mass, position)
- No animation may exist purely for decoration
- If it doesn't have a spatial reason, it doesn't move
- Scroll drives position changes. Mouse drives attention changes. Both are spatial.

---

## Principle 05 — Physics is consistent

The entire experience shares one physics engine. Mass, inertia, and deceleration are uniform.

```
NOT:  One button overshoots by 15%, another by 40%
YES:  All interactive elements share the same spring parameters
```

**Rules**:
- One easing system governs everything (see Motion System)
- All interactive elements have mass = 1.0 (uniform)
- Inertia is proportional to mass, not to visual size
- Deceleration curve never varies between elements of the same type
- Gravity is constant (elements always settle downward)

**Physical properties reference**:

| Property | Value | Applies to |
|---|---|---|
| Mass | 1.0 | All interactive elements |
| Gravity | 9.8 m/s² | Scroll-driven deceleration |
| Friction | 0.92 | Scroll momentum |
| Spring stiffness | 180 N/m | Button/CTA bounce |
| Spring damping | 12 N·s/m | Button/CTA settle |

---

## Principle 06 — The camera tells the story

Components do not tell the story. The camera does.

```
NOT:  "This section has a cool reveal animation"
YES:  "The camera moves from push to orbit, revealing the service cards as it passes"
```

**Rules**:
- Every section transition is a camera decision, not a component decision
- Components never animate their own entrance — the camera reveals them
- The camera script is written before any component is built
- Camera moves are continuous — no jump cuts, no hard resets
- Section boundaries are invisible to the user — they only feel forward motion

---

## Principle 07 — Invisible transitions

The user never perceives a transition. They only perceive progress.

```
NOT:  "Now loading services section..."
YES:  Seamless forward motion that happens to arrive at services
```

**Rules**:
- No loading states between sections (everything is pre-rendered or lazy-loaded ahead)
- Transition blending: minimum 0.2s overlap between camera moves
- The scroll position is the timeline — nothing happens "off-timeline"
- If the user stops scrolling, the experience holds. If they scroll back, it reverses.
- There is no "between sections." There is only the continuous flow.

---

## Motion Budget

The experience has a strict budget for simultaneous motion. Premium is not about more animation — it's about knowing when to be still.

```
MAX CONCURRENT ANIMATIONS: 3

1  DOMINANT     →  Camera move OR major scene transition
2  SECONDARY    →  Ambient (light, grid breathing, subtle parallax)
0  TERTIARY     →  None. If tertiary animation exists, a secondary must stop.
```

**Budget rules**:
- At any given frame, exactly 1 dominant animation may run
- Secondary animations are always ambient (grid, light) — never competing for attention
- If a new dominant animation starts, the previous one must complete or be interrupted
- On `prefers-reduced-motion`, budget drops to 0 (all motion disabled)
- On mobile, budget drops to 1 (dominant only, no secondary)

**Animation conflict resolution**:

| New animation | Current dominant | Result |
|---|---|---|
| Dominant | Dominant | Current gracefully completes (max 0.3s). New queues. |
| Dominant | Idle | New starts immediately |
| Secondary | Dominant | Allowed (ambient, non-competing) |
| Secondary | Secondary | Allowed (ambient, non-competing) |

---

## Motion Hierarchy

Not all animation carries the same weight. The hierarchy ensures the user's attention is guided, not scattered.

### Level 1 — Narrative Motion (guides the user)

| Element | Priority | Budget |
|---|---|---|
| Camera moves (push, orbit, track, zoom) | Critical | Uses dominant slot |
| Section transitions | Critical | Uses dominant slot |
| Scroll-driven reveals | High | Uses dominant slot |

**Rules**: Only one narrative motion at a time. Always scroll-synced. Never autonomous.

---

### Level 2 — Interface Motion (supports interaction)

| Element | Priority | Budget |
|---|---|---|
| Card hover/press | Medium | Uses dominant slot |
| Button hover/press | Medium | Uses dominant slot |
| Form feedback (success, error, focus) | Medium | Uses dominant slot |
| Text scramble entrance | Low | Queues after narrative |

**Rules**: Triggers on user action. Completes before next narrative motion begins. Never autonomous.

---

### Level 3 — Environmental Motion (perceived, not watched)

| Element | Priority | Budget |
|---|---|---|
| Volumetric light cycle | Low | Uses secondary slot |
| Grid breathing | Low | Uses secondary slot |
| Micro-text float | Low | Uses secondary slot |
| Shadow depth response | Low | Uses secondary slot |
| Particle drift | Lowest | Uses secondary slot |

**Rules**: Always running in background. Never demands attention. Stops if dominant animation requires full GPU budget. User should not be able to describe what it's doing — only that the page feels "alive."
