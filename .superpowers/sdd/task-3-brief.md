### Task 3: Final diff and quality gate

**Files to verify:**

- `app/dashboard/users/_components/user-actions-menu.tsx`
- `app/dashboard/users/_components/users-page-client.tsx`

**Requirements:**

- Inspect that the change is limited to the Actions menu, its responsive integration, hover/focus/reduced-motion behavior, and no API/permissions/types/modal changes.
- Run `git diff --check`. The user-management page is a pre-existing untracked feature, so inspect those two files directly rather than expecting a normal tracked diff.
- Run `npm.cmd run lint` and `npm.cmd run build`.
- Report the known pre-existing hook lint failure at `users-page-client.tsx` line ~105 distinctly, and report whether any other lint/build errors occur.
- Do not edit, stage, or commit anything.
- Write a detailed result to `.superpowers/sdd/task-3-report.md` and return a concise status.
