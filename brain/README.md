# EXTRON-AGENCY Second Brain

This folder is the version-controlled bridge between Claude Code and Obsidian.

Open `brain/vault` as its own vault in Obsidian (not the `C:\Dev` root).

## Structure

```text
00-Inbox        capture without classification
01-Identity     organizational identity, constitution
02-Strategy     business/market strategy
03-Clients      client-specific knowledge (never promoted globally)
04-Projects     project facts and context
05-Architecture architectural decisions (ADR)
06-Engineering  engineering patterns and practices
07-UX-UI        UX/UI knowledge
08-Security     security knowledge and findings
09-DevOps-SRE   operations, reliability, incidents
10-Products     product knowledge
11-Lessons      validated lessons
12-Standards    adopted organizational standards
13-Research     evidence and primary references
14-Templates    note templates
99-Archive      retired notes
```

Keep durable notes in Markdown. Use atomic notes with links and frontmatter.

## Code graph snapshot (`20-Code-Graph/`)

`20-Code-Graph/` is a generated Obsidian snapshot of the Graphify code graph
(one note per node, plus `graph.canvas`). Never edit it by hand — regenerate
it after code changes:

```bash
graphify update .
/graphify . --obsidian --obsidian-dir brain/vault/20-Code-Graph
```

Graphify indexes project code, not the human-curated notes in this vault.
Obsidian is the read/search interface for both: notes live here by hand,
and the code graph lives here so a note and its implementation are
navigable from one place.
