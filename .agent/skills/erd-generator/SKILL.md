---
name: erd-generator
description: Generate verified Mermaid Entity-Relationship Diagrams from unstructured domain requirements. Use this skill when the user asks to design an ERD, data model, database architecture diagram, or entity relationship diagram.
---

# ERD Generator

Generate a validated Mermaid Entity-Relationship Diagram from natural-language domain requirements.

## Workflow

### 1. Parse the domain

Analyze the user's requirements and identify:

- Entities
- Attributes
- Primary keys (`PK`)
- Foreign keys (`FK`)
- Relationships
- Relationship cardinalities

Determine the appropriate database structure before writing the Mermaid diagram.

### 2. Create the Mermaid ERD

Create the directory if necessary:

```bash
mkdir -p docs/architecture
```

Draft the Mermaid `erDiagram` syntax and write it directly to:

`docs/architecture/schema.mmd`

Guidelines:
- Use uppercase for entity names (e.g., `USERS`, `BOOKS`).
- Explicitly mark primary keys with `PK` and foreign keys with `FK`.
- Make relationship cardinalities explicit (`||--o{`, `||--o|`, etc.).
- Use descriptive relationship labels.

### 3. Execute the validation and rendering script

Run the CLI validation and rendering script:

```bash
node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd
```

The script compiles `docs/architecture/schema.mmd` to `docs/architecture/erd.svg` using Mermaid CLI (`mmdc`).

- On success: prints `SUCCESS` and exits with code `0`.
- On error: prints `SYNTAX_ERROR:` followed by the stderr trace and exits with code `1`.

### 4. Self-Correction Loop

If the execution fails with `SYNTAX_ERROR`:

1. Parse the error trace and pinpoint the syntax violation in the Mermaid diagram.
2. Adjust the Mermaid syntax in `docs/architecture/schema.mmd`.
3. Re-run the rendering script.
4. Retry up to 3 times until compilation succeeds.

### 5. Final Output

Once rendering succeeds:
1. Present the raw Mermaid diagram block to the user.
2. Reference the generated SVG asset path (`docs/architecture/erd.svg`).