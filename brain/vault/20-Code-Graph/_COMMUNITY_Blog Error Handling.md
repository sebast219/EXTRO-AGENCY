---
type: community
cohesion: 0.83
members: 4
---

# Blog Error Handling

**Cohesion:** 0.83 - tightly connected
**Members:** 4 nodes

## Members
- [[BlogError()]] - code - app/(site)/[lang]/blog/error.tsx
- [[error.tsx]] - code - app/(site)/[lang]/blog/error.tsx
- [[report-client-error.ts]] - code - lib/observability/report-client-error.ts
- [[reportClientError()]] - code - lib/observability/report-client-error.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Blog_Error_Handling
SORT file.name ASC
```
