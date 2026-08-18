---
type: community
cohesion: 0.50
members: 5
---

# CI Pipeline & E2E Tests

**Cohesion:** 0.50 - moderately connected
**Members:** 5 nodes

## Members
- [[CI Workflow]] - document - .github/workflows/ci.yml
- [[End-to-end Job]] - rationale - .github/workflows/ci.yml
- [[MAIL_DRY_RUN env var]] - concept - .github/workflows/ci.yml
- [[Playwright E2E Tests]] - concept - .github/workflows/ci.yml
- [[Verify Job (Typecheck · Lint · Tests · Build)]] - rationale - .github/workflows/ci.yml

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/CI_Pipeline__E2E_Tests
SORT file.name ASC
```
