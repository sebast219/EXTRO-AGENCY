# Graph Report - EXTRON-AGENCY  (2026-08-17)

## Corpus Check
- 86 files · ~118,882 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 546 nodes · 953 edges · 71 communities (32 shown, 39 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `45e172be`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Booking & Availability API Routes
- Blog Page & Metadata
- Landing Page & Ambient Grid
- Booking Widget Calendar
- Booking Config & Graceful Degradation
- Frontend Dependencies
- TypeScript Build Config
- Motion System Pillars
- Booking Schema Validation
- Package Manifest
- Sanity Studio Routes
- OpenCode MCP Config
- Motion Tokens & Budget
- Security Proxy & CSP
- Ecommerce Dashboard Case Study
- Camera Movement Map
- CI Pipeline & E2E Tests
- Medical Dashboard Case Study
- Blog Error Handling
- SAS & Trademark Legal Procedures
- Studio Layout Metadata
- Second Brain Governance
- Design Principles: Depth & Systems
- Performance Core Promise
- Narrative Scroll Rules
- Next.js Config
- CRM Dashboard Case Study
- Design Principles: Hierarchy & Precision
- Motion & Accessibility Rules
- Google Meet Room Creation
- Calendar OAuth Modes
- ESLint Config
- Tailwind Config
- App Icon Design
- Visual Design References
- Principle: Invisible Transitions
- Principle: Motion From Space
- Simplified Preloader
- Stagger Scale Tokens
- Tailwind + Custom CSS
- Production Monitoring
- Principle: Engineering Inevitable
- Principle: Simplicity Engineering
- Principle: Trust From Consistency
- Principle: Attention Is Sacred
- Principle: Code Is Documentation
- Principle: Ship On Fridays
- Apple Touch Icon
- Dash Burger Portfolio Image
- Kinn Collective Portfolio Image
- Lucci Lambrusco Portfolio Image
- HappyRobot Portfolio Image
- Chisel Roofing Portfolio Image
- Flite Cockpit Portfolio Image
- Assemble Portfolio Image
- ReOrc Dashboard Portfolio Image
- Lorenzo Cabra Portfolio Image
- Oakline Studio Portfolio Image
- Fixa Planner Portfolio Image
- Oryzo Coaster Portfolio Image
- Human Social Club Portfolio Image
- Samara Backyard Portfolio Image
- OG Share Image

## God Nodes (most connected - your core abstractions)
1. `useLang()` - 27 edges
2. `getServerEnv()` - 19 edges
3. `POST()` - 18 edges
4. `useReveal()` - 18 edges
5. `isLocale()` - 17 edges
6. `compilerOptions` - 16 edges
7. `localizedPath()` - 15 edges
8. `captureException()` - 14 edges
9. `GET()` - 13 edges
10. `alternatesFor()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `EX·TRON Project` --references--> `lucide-react`  [EXTRACTED]
  README.md → package.json
- `EX·TRON Project` --references--> `tailwindcss`  [EXTRACTED]
  README.md → package.json
- `robots.txt Configuration` --shares_data_with--> `EX·TRON Project`  [INFERRED]
  public/robots.txt → README.md
- `generateStaticParams()` --calls--> `listPosts()`  [EXTRACTED]
  app/(site)/[lang]/blog/[slug]/page.tsx → lib/content/posts.ts
- `BlogPage()` --calls--> `listPosts()`  [EXTRACTED]
  app/(site)/[lang]/blog/page.tsx → lib/content/posts.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Narrative Pricing Journey (arc, scroll architecture, camera zoom, pricing section)** — docs_01_creative_direction_narrative_arc, docs_08_narrative_scroll_narrative_architecture, docs_04_camera_language_pricing_zoom_out, docs_08_narrative_scroll_pricing_section [INFERRED 0.80]
- **EXTRO Motion System Pillars (living system, spatial law, tokens, camera)** — docs_01_creative_direction_living_system, docs_02_spatial_design_language_camera_tells_story, docs_03_motion_system_duration_scale, docs_04_camera_language_movement_verbs [INFERRED 0.85]
- **Performance Budget Consistency (manifesto, architecture, camera fallback)** — docs_06_performance_manifesto_resource_budget, docs_05_technical_architecture_css_design_tokens, docs_06_performance_manifesto_fallback_tiers, docs_04_camera_language_responsive_behavior [INFERRED 0.85]

## Communities (71 total, 39 thin omitted)

### Community 0 - "Booking & Availability API Routes"
Cohesion: 0.09
Nodes (58): dynamic, GET(), runtime, POST(), runtime, POST(), runtime, clientErrorSchema (+50 more)

### Community 1 - "Blog Page & Metadata"
Cohesion: 0.10
Nodes (39): BlogPage(), COPY, generateMetadata(), revalidate, generateMetadata(), PostPage(), revalidate, COPY (+31 more)

### Community 2 - "Landing Page & Ambient Grid"
Cohesion: 0.08
Nodes (39): Home(), AmbientGrid(), CaseItem, Cases(), duplicated, duplicatedReversed, IMAGES, reversed (+31 more)

### Community 3 - "Booking Widget Calendar"
Cohesion: 0.09
Nodes (38): BookingWidget(), Confirmed, Step, monthCells(), MonthGrid(), Props, Group(), Props (+30 more)

### Community 4 - "Booking Config & Graceful Degradation"
Cohesion: 0.05
Nodes (42): autoprefixer, cross-env, app/api/booking/route.ts, Qué pasa cuando algo falla (graceful degradation), freebusy Availability Check, eslint-config-next, @eslint/eslintrc, eslint-plugin-unused-imports (+34 more)

### Community 5 - "Frontend Dependencies"
Cohesion: 0.06
Nodes (35): geist, google-auth-library, @googleapis/calendar, gsap, next-sanity, dependencies, geist, google-auth-library (+27 more)

### Community 6 - "TypeScript Build Config"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 7 - "Motion System Pillars"
Cohesion: 0.09
Nodes (24): The EXTRO Signature, Living System (Core Concept), Movement Language, Narrative Arc (Entrance→Credibility→Capability→Trust→Conversion), 12-Beat Scroll Rhythm, Principle 06 — The Camera Tells the Story, Ambient Grid — Elastic Deformation, Living Typography (+16 more)

### Community 8 - "Booking Schema Validation"
Cohesion: 0.14
Nodes (16): DATE_RE, TIME_RE, availabilityQuerySchema, BookingInput, bookingSchema, ContactInput, contactSchema, email (+8 more)

### Community 9 - "Package Manifest"
Cohesion: 0.12
Nodes (16): engines, node, name, private, scripts, analyze, build, dev (+8 more)

### Community 10 - "Sanity Studio Routes"
Cohesion: 0.10
Nodes (19): generateStaticParams(), revalidate, sitemap(), dynamic, Studio(), BlogPostMeta, FallbackPost, fallbackPosts (+11 more)

### Community 11 - "OpenCode MCP Config"
Cohesion: 0.22
Nodes (8): mcp, runtime_orchestrator, args, command, enabled, type, $schema, D:\\Skills\\runtime_mcp_server.js

### Community 12 - "Motion Tokens & Budget"
Cohesion: 0.29
Nodes (7): Motion Budget (max concurrent animations), Motion Hierarchy (Narrative/Interface/Environmental), Principle 05 — Physics is Consistent, Duration Scale tokens, Easing Curves tokens, CSS Design Tokens, Principle 09 — Constraints Produce Creativity

### Community 13 - "Security Proxy & CSP"
Cohesion: 0.43
Nodes (6): applySecurityHeaders(), buildCsp(), config, PASSTHROUGH, proxy(), resolveLocale()

### Community 14 - "Ecommerce Dashboard Case Study"
Cohesion: 0.29
Nodes (7): AI Insight Panel, Customer Traffic Donut/Bar Chart, Dribbble Shot Page, eCommerce Software Dashboard UI, Excellent Webworld (design studio), KPI Summary Cards (Revenue, Orders, Conversion, Active Customers), Revenue Performance Bar Chart

### Community 15 - "Camera Movement Map"
Cohesion: 0.40
Nodes (5): Hero — Push In, Pricing — Zoom Out, Section Camera Map, Services — Orbit, Pricing (70-80%) — Narrative Journey

### Community 16 - "CI Pipeline & E2E Tests"
Cohesion: 0.50
Nodes (5): End-to-end Job, MAIL_DRY_RUN env var, Playwright E2E Tests, Verify Job (Typecheck · Lint · Tests · Build), CI Workflow

### Community 17 - "Medical Dashboard Case Study"
Cohesion: 0.40
Nodes (5): Activity and Productivity Panel (EEG-style waveform chart), Dribbble Showcase Page (Medical Data Visualization Dashboard), Medical Data Visualization Dashboard UI, TheMotionDot (design studio, credited creator), Time Spend Panel (categorical bar chart)

### Community 19 - "SAS & Trademark Legal Procedures"
Cohesion: 0.67
Nodes (4): Clasificación de Niza — Clase 42, Registro de Marca EXTRO (SIC), Orden Recomendado de Trámites, Constituir la SAS (Cámara de Comercio Medellín)

### Community 21 - "Second Brain Governance"
Cohesion: 0.67
Nodes (3): AI-first note rules, Graphify (code graph), Obsidian Vault (institutional memory)

### Community 22 - "Design Principles: Depth & Systems"
Cohesion: 0.67
Nodes (3): Principle 01 — Depth is Mandatory, Principle 02 — One Space, One Camera, Principle 05 — We Build Systems, Not Screens

### Community 23 - "Performance Core Promise"
Cohesion: 0.67
Nodes (3): The Core Promise (60fps, <2s TTI, 0 CLS), Frame Budget (16.67ms breakdown), Principle 06 — Speed Is Demonstrated, Not Promised

### Community 24 - "Narrative Scroll Rules"
Cohesion: 0.67
Nodes (3): The 20% Rule, The 20% Repetition Strategy, Three User Types (Scanner/Evaluator/Buyer)

### Community 26 - "CRM Dashboard Case Study"
Cohesion: 0.67
Nodes (3): CRM Dashboard Screenshot, Dribbble Shot Page, Velo (CRM Product)

## Knowledge Gaps
- **217 isolated node(s):** `revalidate`, `revalidate`, `COPY`, `inter`, `spaceGrotesk` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **39 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLang()` connect `Landing Page & Ambient Grid` to `Blog Page & Metadata`, `Booking Widget Calendar`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `captureException()` connect `Booking & Availability API Routes` to `Blog Page & Metadata`, `Sanity Studio Routes`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Frontend Dependencies` to `Package Manifest`, `Booking Config & Graceful Degradation`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `revalidate`, `revalidate`, `COPY` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Booking & Availability API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Should `Blog Page & Metadata` be split into smaller, more focused modules?**
  _Cohesion score 0.09647058823529411 - nodes in this community are weakly interconnected._
- **Should `Landing Page & Ambient Grid` be split into smaller, more focused modules?**
  _Cohesion score 0.08123904149620105 - nodes in this community are weakly interconnected._