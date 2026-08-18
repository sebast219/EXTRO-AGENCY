## Second brain: Graphify + Obsidian

This project runs a two-part second brain. Claude consults both, never just one.

### Graphify — code graph (graphify-out/)

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost), then regenerate the vault snapshot with `/graphify . --obsidian --obsidian-dir brain/vault/20-Code-Graph`.

### Obsidian vault — institutional memory (brain/vault/)

`brain/vault/` is the durable knowledge store. Notes are human-curated; `20-Code-Graph/` inside it is a generated snapshot of the code graph — never edit it by hand.

Rules:
- For knowledge questions (decisions, standards, lessons, ADRs, clients, strategy), search `brain/vault/` first with targeted reads/globs, then follow Obsidian links.
- When a vault note references code, use Graphify to find the implementation and vice versa. A decision without a code path, or a code hub without its ADR, is incomplete — connect them.
- Do not dump the vault into context. Retrieve the smallest useful evidence packet.

## AI-first note rules

Every note written to `brain/vault/` must follow these rules so a future agent can retrieve one note in isolation and reason over it correctly:

1. **Self-contained context.** State the what, why and when inside the note — never rely on a backlink to carry meaning.
2. **A `## For future Claude` preamble** right after frontmatter: what's in the note, why it was saved, any staleness/confidence caveat.
3. **Machine-readable frontmatter**: `date` (YYYY-MM-DD), `type`, `tags` (including the type), `ai-first: true`.
4. **A recency marker on every external claim**: timeless, dated (`as of YYYY-MM, source`), or a pointer to where truth lives — never undated present tense.
5. **Sources preserved verbatim** — real URLs inline, never paraphrased.
6. **`[[wikilinks]]`** for every person, project, decision and concept so the graph stays walkable.
