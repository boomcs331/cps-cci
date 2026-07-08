# CPS AI Context Loop Prompt

Use this prompt when asking an AI agent to analyze, update, or implement anything in the `cps` project.

The goal is to make the agent understand the project before it changes code, keep `PROJECT-WIKI.md` accurate, and verify the result after implementation.

---

## Master Prompt

```md
You are the AI developer for the `cps` project.

Before doing any implementation work, run this Context Loop.

## Loop 1: Read

Read these files first:

- `AGENTS.md`
- `PROJECT-WIKI.md`
- `package.json`
- Any files directly related to the requested task

Important:

- This project uses Next.js 16, React 19, and Tailwind CSS 4.
- Do not assume Next.js APIs from older training data.
- If a Next.js API, convention, or file structure is unclear, read the relevant guide in `node_modules/next/dist/docs/` before writing code.

## Loop 2: Understand

Before editing files, summarize your understanding in these sections:

1. User request
2. Related modules and files
3. Project conventions that apply
4. Unknowns or risks
5. Whether `PROJECT-WIKI.md` must be updated

If the requirement is unclear, ask the user before implementing.

## Loop 3: Plan

Before editing files, provide a short plan:

- Files to change
- Reason for each change
- Validation or tests to run
- `PROJECT-WIKI.md` sections that may need updates

Keep the plan scoped to the user's request.

## Loop 4: Implement

Implement only the requested behavior.

Rules:

- Use TypeScript for `.ts` and `.tsx` files.
- Use Tailwind CSS classes for styling unless there is a clear reason not to.
- Use `next/image` for images.
- Use `next/font` for font optimization.
- Add `"use client"` only when client-side interactivity is required.
- Avoid `any` unless there is a concrete reason.
- Do not add dependencies unless the requirement clearly needs them.
- Prefer small, focused changes over broad refactors.

## Loop 5: Update Knowledge

After implementation, update `PROJECT-WIKI.md` if the work changes any of these:

- Project overview or status
- Directory structure
- Module responsibilities
- Data flow
- API routes or Server Actions
- External services
- Validation rules
- Development workflow
- Testing strategy
- Changelog

The wiki must describe the code that now exists, not the code that used to exist.

## Loop 6: Verify

Run these checks when possible:

- `pnpm lint`
- `pnpm build`

If a check cannot run or fails for an unrelated reason, explain exactly what happened.

## Final Response Format

Reply to the user with:

1. Summary of what you understood
2. What changed
3. Files changed
4. Verification result
5. Remaining risks or open questions
```

---

## Short Prompt Variant

Use this when the task is small but still needs project awareness.

```md
Before implementing, read `AGENTS.md`, `PROJECT-WIKI.md`, `package.json`, and the files related to this task.

Summarize what you understand, identify whether `PROJECT-WIKI.md` needs an update, then implement the smallest correct change.

Because this project uses Next.js 16, do not rely on older Next.js assumptions. If unsure, check `node_modules/next/dist/docs/`.

After implementation, update `PROJECT-WIKI.md` if architecture, modules, APIs, validation, workflow, or data flow changed. Then run `pnpm lint` and `pnpm build` when possible.
```
