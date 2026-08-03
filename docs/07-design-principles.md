# Design Principles — EXTRO

> These are not technical rules. They are philosophical commitments. Every decision — visual, technical, strategic — must pass through these principles. If something contradicts a principle, the principle wins.

---

## 01 — Engineering must feel inevitable

Every choice should feel like the only possible choice. Nothing arbitrary. Nothing decorative. Everything exists because engineering demanded it.

**Test**: If you can remove it and nothing breaks, it shouldn't be there.

---

## 02 — Precision over spectacle

A single perfectly-timed 200ms transition beats three simultaneous "wow" animations. Precision communicates competence. Spectacle communicates insecurity.

**Test**: Does this animation make the user trust us more, or just impress them temporarily?

---

## 03 — Every motion communicates intent

Motion is language. A camera push says "enter." An orbit says "explore." A settle says "arrive." If a motion doesn't have a verb, it has no reason to exist.

**Test**: Can you name the verb this motion is expressing?

---

## 04 — Simplicity requires more engineering

The simpler something looks, the more engineering it took to get there. EXTRO doesn't hide complexity — it resolves it so the user never sees it.

**Test**: Does this feel effortless? If not, we haven't engineered it enough.

---

## 05 — We build systems, not screens

Every component is part of a living system. It shares physics, camera, light, and rhythm with everything around it. No component is an island.

**Test**: If you move this component to a different section, does it still belong?

---

## 06 — Speed is demonstrated, not promised

We don't say "fast delivery." We deliver fast. We don't say "60fps." The experience runs at 60fps. Claims need evidence. Evidence needs no claims.

**Test**: Are we telling the user something, or showing them?

---

## 07 — Trust is born from consistency

The same easing. The same physics. The same light. Week after week. Project after project. Consistency is the foundation of trust. Surprises are the enemy of confidence.

**Test**: Does this behave exactly like the rest of the experience?

---

## 08 — The user's attention is sacred

Every animation that doesn't serve the narrative steals attention from the narrative. We respect the user's focus. We never demand it without reason.

**Test**: Does this help the user understand, or does it just distract them?

---

## 09 — Constraints produce creativity

Limited color. Limited motion budget. Limited animation slots. Constraints force us to make better decisions. Unlimited freedom produces noise.

**Test**: What would this look like with half the motion? With one color instead of three?

---

## 10 — The code is the documentation

Clean architecture. Consistent patterns. No comments needed because the code explains itself. The system is its own manual.

**Test**: Can a new engineer understand this component in under 5 minutes?

---

## 11 — Accessibility is not optional

Every experience must work for everyone. Keyboard navigation. Screen readers. Reduced motion. High contrast. Not as an afterthought — as a first-class design constraint.

**Test**: Does this work with `prefers-reduced-motion: reduce`? With a keyboard only? With VoiceOver?

---

## 12 — We ship on Fridays

Perfection doesn't ship. Progress ships every week. A working feature on Friday beats a perfect feature next month. We iterate in production.

**Test**: Is this ready to show a user on Friday? If not, what's the smallest version that is?

---

## Using These Principles

### As a filter for decisions

When evaluating any change, ask:

```
1. Does it make engineering feel inevitable?       [01]
2. Is it precise, not flashy?                       [02]
3. Does every motion have a verb?                   [03]
4. Does complexity resolve into simplicity?         [04]
5. Does it belong to the system, not stand alone?   [05]
6. Is it demonstrated, not claimed?                 [06]
7. Is it consistent with everything else?           [07]
8. Does it respect the user's attention?            [08]
9. Is it a product of constraints, not excess?      [09]
10. Is it self-documenting?                          [10]
11. Is it accessible to everyone?                    [11]
12. Can it ship on Friday?                           [12]
```

### As a culture document

These principles define what it means to work at EXTRO. They apply to:

- Visual design decisions
- Animation choices
- Architecture decisions
- Code quality standards
- Client communication
- Project scoping
- Performance optimization
- Accessibility compliance

---

## What these principles are NOT

- They are not rules to hide behind ("Principle 02 says no spectacle!")
- They are not excuses to avoid ambition
- They are not frozen — they evolve as EXTRO evolves
- They are not optional — they are commitments to our users and to ourselves

---

## The ultimate test

```
If EXTRO disappeared tomorrow,
would our users miss:
  → Our animations?
  → Our colors?
  → Our typography?

No.

They would miss:
  → Engineering that just works.
  → Software they can trust.
  → A partner that delivers every week.

That's what these principles protect.
```
