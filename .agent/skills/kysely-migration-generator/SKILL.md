---
name: kysely-migration-generator
description: Generate type-safe Kysely database migrations from Mermaid Entity-Relationship Diagrams. Use this skill when the user asks to convert an ERD, Mermaid schema, or database architecture diagram into a Kysely migration.
---

# Kysely Migration Generator

Translate a Mermaid ERD into a type-safe Kysely database migration.

## Workflow

### 1. Read the ERD

Read:

`docs/architecture/schema.mmd`

Use the Mermaid `erDiagram` definition as the source of truth.

Identify:

- Entities
- Attributes
- Data types
- Primary keys (`PK`)
- Foreign keys (`FK`)
- Relationships
- Relationship cardinalities
- Unique constraints implied by one-to-one relationships

Do not invent entities or columns that are not supported by the ERD.

### 2. Inspect the existing migration structure

Before generating the migration, inspect:

`src/db/migrations/001_initial_schema.ts`

Follow the project's existing Kysely imports, formatting, conventions, and migration structure.

Do not replace or modify existing migrations.

### 3. Map entities to tables

Convert Mermaid entity names to snake_case table names.

Examples:

- `USERS` → `users`
- `BOOK_AUTHORS` → `book_authors`
- `LIBRARY_BOOKS` → `library_books`

Use lowercase snake_case for all generated table names and column names.

### 4. Map columns

Convert Mermaid attributes into Kysely column definitions.

Use the Mermaid data type to select an appropriate database type.

Common mappings:

| Mermaid type | PostgreSQL type |
|---|---|
| `int` | `integer` |
| `integer` | `integer` |
| `string` | `text` |
| `text` | `text` |
| `boolean` | `boolean` |
| `date` | `date` |
| `timestamp` | `timestamptz` |
| `float` | `real` |

Preserve explicitly specified types when the existing project supports them.

### 5. Primary keys

Attributes marked `PK` must become primary keys.

For integer IDs, use an auto-generating identity/serial column consistent with the existing project migration.

For UUID identifiers, use the project's existing UUID convention.

Do not create duplicate primary keys.

### 6. Foreign keys

Attributes marked `FK` must reference their corresponding parent table and primary key.

Use:

`.references('parent_table.parent_column').onDelete('cascade')`

Foreign keys must reference tables that actually exist in the ERD or are explicitly stated to already exist.

If a referenced table already exists outside the generated migration, do not recreate it.

### 7. Relationship cardinalities

Interpret Mermaid cardinalities explicitly.

#### One-to-many

For:

`||--o{`

create a foreign key on the "many" side.

Example:

```text
USERS ||--o{ LOANS : has
```

#### One-to-one

For:

`||--o|`

create a foreign key on the dependent entity with a `.unique()` constraint.

Example:

```text
USERS ||--o| BORROWERS : registers
```

In `borrowers`, the `user_id` column references `users.id` and has `.unique()`.

### 8. File Output and Naming

Write the generated TypeScript migration to:

`src/db/migrations/<timestamp>_<migration_name>.ts`

Follow standard timestamp or numeric ordering (e.g., `002_library_management_system.ts` or `<epoch_ms>_library_schema.ts`).

### 9. Migration Structure

Enforce exports for both `up(db: Kysely<any>)` and `down(db: Kysely<any>)` functions.

- The `up` function creates tables in dependency order (referenced tables before dependent tables).
- The `down` function drops tables in reverse dependency order (dependent tables before referenced tables).
- If a table was created in an earlier migration (such as `users`), do not create it in `up` and do not drop it in `down`.

### 10. Verification

After generating the migration:
1. Run `npm run build` to verify type-checking.
2. Run `npm run migrate:up` to verify execution against the database.