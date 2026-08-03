# Narrative Scroll Architecture — EXTRO

> The page is not a list of sections. It is a single story told through scroll. Each section answers exactly one question. Each question creates the need for the next. Nothing is shown until the user is ready to receive it.

---

## The 20% Rule

80% of users scan. 20% read everything. Design for the scanner. Don't let anyone miss the core.

**The inescapable 20%**:
1. "Tu equipo de ingeniería por suscripción" — what EXTRO is
2. "Avances funcionales cada viernes" — the differentiator
3. "+$450K generados, 18 proyectos, 97% retención" — real results
4. "Desde $500/mes, sin permanencia" — the pricing model
5. CTA — start now

These five messages must appear multiple times, in different formats, without feeling repetitive.

---

## Three User Types

### Scanner (70-80%)
Reads only: H1, subtitle, metrics, prices, CTA. Never reads the full page. Design for this user.

### Evaluator (15-20%)
Reads: capabilities, cases, comparison, FAQ. Wants validation of competence.

### Buyer (<5%)
Reads everything. Searches for inconsistencies. Is the one who converts.

---

## Narrative Architecture

```
SCROLL %     QUESTION                    SECTION              TECHNIQUE
─────────    ────────────────────────    ───────────────────  ──────────────────
0-8%         What is EXTRO?             Hero                 Single protagonist
8-15%        Why should I believe?      Credibility strip    Metrics marquee
15-25%       Why does this exist?       Problem/Philosophy   Progressive reveal
25-40%       How do they build?         Friday Deploy        Pinned storytelling
40-55%       What results do I get?     Cases                Scroll gates
55-70%       What can they build?       Services             Progressive cards
70-80%       How much does it cost?     Pricing              Narrative journey
80-90%       Why trust them?            Trust cluster        Progressive reveal
90-100%      What do I do now?          Contact              Settle + CTA
```

---

## Section-by-Section Behavior

### 1. Hero (0-8%) — Single protagonist

**Question**: What does EXTRO do?

**Behavior**:
- Only the title is the protagonist. Nothing competes.
- Subtitle supports. CTA is available but understated.
- No badges, no marquee, no metrics yet.
- Grid breathes. Light shifts. That's it.

**Exit**: Camera push begins. Grid intensifies slightly.

---

### 2. Credibility Strip (8-15%) — Velocity

**Question**: Why should I believe this?

**Behavior**:
- Horizontal marquee with key metrics (+$450K, 18 proyectos, 97% retención, 48h primer avance)
- Fast scroll. No pin. Just confidence in motion.
- Simple. Just numbers and labels.

**Exit**: Marquee scrolls out. Space clears.

---

### 3. Why This Exists (15-25%) — Progressive Reveal

**Question**: Why does this exist? What problem?

**Behavior**:
- EngineeringPrinciples cards appear ONE BY ONE as user scrolls
- No grid of 6 cards at once. Each earns its space.
- "Construimos antes de reunirnos" → scroll → "Entregamos antes de prometer" → scroll → ...
- Each principle reveals with a subtle build animation

**Exit**: Last principle fades. Question is answered. Next question emerges.

---

### 4. Friday Deploy (25-40%) — Pinned Storytelling

**Question**: How do they build?

**Behavior**:
- Section pins to viewport for ~3 screen-heights
- Scroll advances through the week:
  ```
  LUN  →  Planning (text + dot illuminates)
  MAR  →  Architecture (diagram builds)
  MIÉ  →  Development (code lines appear)
  JUE  →  Interface (UI elements build)
  VIE  →  Deploy (pulse + "En producción")
  ```
- Each day is one scroll-step. User controls pace.
- After Friday, pin releases and section scrolls away.
- The blue dot is the sole protagonist.

**Progressive reveal**: Nothing is visible on Monday except Monday. Scroll earns each day.

**Exit**: Pin releases. Section scrolls out. User moves forward.

---

### 5. Cases (40-55%) — Scroll Gates

**Question**: What results do I get?

**Behavior**:
- Each case appears as user scrolls. Not a grid of 3 at once.
- Per case: Problem → scroll-gate → Solution → scroll-gate → Result → scroll-gate → Tech tags.
- Scroll gate: brief pause (600-800ms) where content builds procedurally.
  - Marketplace: Excel grid → transforms → API lines draw → dashboard assembles → "67%" resolves
  - Ecommerce: Empty storefront → products populate → checkout flow appears → metric resolves
  - Analytics: Excel cells → CSV particles flow → dashboard builds → "6h → 0h" resolves

**Scroll gate rules**:
- Never blocks scroll. Slows it (scrub: 0.4).
- User can speed through if they want.
- But natural scroll speed reveals the full build.

---

### 6. Services (55-70%) — Progressive Cards

**Question**: What can they build?

**Behavior**:
- Not a horizontal carousel anymore.
- Cards appear vertically, one by one, as user scrolls.
- Card 1 (Apps & SaaS) → scroll → Card 2 (IA & Automation) → scroll → etc.
- Each card gets full attention. Adjacent cards are dimmed (opacity 0.25).
- Active card is the sole protagonist.

**Alternative (desktop)**: Keep horizontal scroll but make it faster, cleaner. Cards appear in rapid succession as track slides.

**Exit**: Last card scrolls out.

---

### 7. Pricing (70-80%) — Narrative Journey

**Question**: How much does it cost?

**Behavior**:
- No three cards side by side.
- One narrative that unfolds with scroll:
  ```
  "Una empresa empieza."
  ↓
  "Necesita presencia digital."
  ↓
  "Contrata Foundation."
  ↓ ($500/mes resolves via scramble)
  ↓
  "Crece. Necesita automatización e IA."
  ↓
  "Sube a Growth."
  ↓ ($1,250/mes resolves)
  ↓
  "Escala. Necesita arquitectura empresarial."
  ↓
  "Llega a Scale."
  ↓ ($2,500/mes resolves)
  ↓
  "Sin permanencia. Cancela cuando quieras."
  ```

**Protagonist**: The journey itself. The prices are consequences, not the headline.

---

### 8. Trust Cluster (80-90%) — Progressive Reveal

**Question**: Why should I trust them?

**Behavior**:
- Compact cluster of trust signals:
  - Team (compact cards, 1-2)
  - Comparison table (EXTRO vs Agencia vs Freelancer)
  - FAQ (most common 3-4 questions)
- Elements appear progressively as user scrolls
- Single protagonist per viewport
- FAQ toggles are the only interactive element

**Exit**: All trust signals seen. Only one question remains.

---

### 9. Contact (90-100%) — Settle + CTA

**Question**: What do I do now?

**Behavior**:
- Camera settles. Light goes neutral. Grid breathing at minimum.
- Form is the sole protagonist.
- Clean. Calm. Inevitable.
- "Recibe una propuesta de ingeniería en menos de 24 horas."

---

## The 20% Repetition Strategy

The core messages appear across the narrative, not just once:

| Message | Hero | Credibility | Deploy | Cases | Pricing | Trust | Contact |
|---|---|---|---|---|---|---|---|
| Team by subscription | x | | | | x | | |
| Every Friday | | | x | x | | | |
| Real results | | x | | x | | | |
| From $500/mo | | | | | x | | x |
| Start now | x | | | | | | x |

---

## Content That Gets Removed or Moved

| Section | Decision | Reason |
|---|---|---|
| WeeklyBuild | Merge into Friday Deploy | Redundant. Same concept. |
| PricingExplanation | Merge into Pricing narrative | Explain pricing inline, not as separate section. |
| ScopeSection | Merge into FAQ or footer | What's NOT included belongs near contract terms. |
| ToolsStack | Merge into Friday Deploy | Tools are HOW we build. Show during the pipeline. |
| WhyExtron | Redistribute | Individual points belong near relevant sections. |
| Plans (3 cards) | Replace with narrative | Cards prevent narrative discovery. |
| QuoteCalculator | Remove or move to /quote | Interactive tool breaks narrative flow. Link to it. |

---

## Performance Impact

This architecture is naturally performant:
- Progressive reveal = less DOM at any given time
- Scroll gates = controlled frame budget
- Single protagonist = max 1 dominant animation
- Pinned sections = controlled scroll-linked animation

No new performance burden. Just smarter distribution of existing work.
