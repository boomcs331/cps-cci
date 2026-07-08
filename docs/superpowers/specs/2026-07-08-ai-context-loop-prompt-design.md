# AI Context Loop Prompt Design

## Purpose

Create a reusable prompt template that helps AI agents understand the `cps` project before implementing changes.

The template must make agents read the local source of truth, summarize context, plan narrowly, update project knowledge, and verify the result.

## Chosen Approach

Use an Autonomous Context Loop:

1. Read project context.
2. Summarize understanding.
3. Plan the change.
4. Implement the scoped change.
5. Update `PROJECT-WIKI.md`.
6. Verify with lint and build checks.

This is the best fit because the project is still early, and `PROJECT-WIKI.md` is already positioned as the source of truth for future implementation work.

## Files

- `docs/AI-CONTEXT-LOOP-PROMPT.md`: reusable prompt template.
- `PROJECT-WIKI.md`: link to the prompt template from the AI implementation workflow.

## Rules Captured

- Always read `AGENTS.md` and `PROJECT-WIKI.md` before implementation.
- Treat Next.js 16 as version-specific and check `node_modules/next/dist/docs/` when unsure.
- Keep changes small and aligned with the current app structure.
- Update `PROJECT-WIKI.md` when code changes affect architecture, APIs, validation, workflow, or data flow.
- Verify with `pnpm lint` and `pnpm build` when possible.

## Out of Scope

- Adding a new app feature.
- Adding dependencies.
- Changing runtime behavior.
- Defining the business domain, data model, backend, or testing stack.

## Verification

This change is documentation-only. Verification should confirm that:

- The prompt template exists.
- `PROJECT-WIKI.md` links to the template.
- Existing lint and build checks still pass if run.
