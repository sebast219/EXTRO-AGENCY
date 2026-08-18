---
type: community
cohesion: 0.14
members: 18
---

# Booking Schema Validation

**Cohesion:** 0.14 - loosely connected
**Members:** 18 nodes

## Members
- [[BookingInput]] - code - lib/contracts.ts
- [[ContactInput]] - code - lib/contracts.ts
- [[DATE_RE]] - code - features/booking/time.ts
- [[MAX_BODY_BYTES]] - code - lib/contracts.ts
- [[PROJECT_KINDS]] - code - lib/contracts.ts
- [[PROJECT_LABELS]] - code - lib/contracts.ts
- [[ProjectKind]] - code - lib/contracts.ts
- [[TIME_RE]] - code - features/booking/time.ts
- [[availabilityQuerySchema]] - code - lib/contracts.ts
- [[bookingSchema]] - code - lib/contracts.ts
- [[contactSchema]] - code - lib/contracts.ts
- [[contracts.test.ts]] - code - lib/contracts.test.ts
- [[contracts.ts]] - code - lib/contracts.ts
- [[email]] - code - lib/contracts.ts
- [[localeSchema]] - code - lib/contracts.ts
- [[name]] - code - lib/contracts.ts
- [[validBooking]] - code - lib/contracts.test.ts
- [[validContact]] - code - lib/contracts.test.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Booking_Schema_Validation
SORT file.name ASC
```

## Connections to other communities
- 10 edges to [[_COMMUNITY_Booking & Availability API Routes]]
- 5 edges to [[_COMMUNITY_Booking Widget Calendar]]

## Top bridge nodes
- [[contracts.ts]] - degree 23, connects to 2 communities
- [[bookingSchema]] - degree 3, connects to 1 community
- [[contactSchema]] - degree 3, connects to 1 community
- [[MAX_BODY_BYTES]] - degree 3, connects to 1 community
- [[PROJECT_LABELS]] - degree 3, connects to 1 community