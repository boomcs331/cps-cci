### Task 2: Replace inline action buttons and add the responsive user list

**Files:**

- Modify only: `app/dashboard/users/_components/users-page-client.tsx`

**Required implementation:**

1. In `UsersTable`, add one state value after props destructuring:

```tsx
const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
```

2. Replace every desktop inline `ActionButton` group with exactly one `UserActionsMenu`:

```tsx
<UserActionsMenu
  userName={user.username}
  isOpen={openMenuUserId === user.id}
  onOpenChange={(open) => setOpenMenuUserId(open ? user.id : null)}
  canUpdate={canUpdate}
  canAssignRole={canAssignRole}
  canAssignDepartment={canAssignDepartment}
  canDelete={canDelete}
  onEdit={() => onEdit(user)}
  onAssignRoles={() => onAssignRoles(user)}
  onAssignDepartments={() => onAssignDepartments(user)}
  onDelete={() => onDelete(user)}
/>
```

3. The desktop table wrapper is hidden below `md`, has overflow visible for the menu, and the table no longer uses `min-w-[980px]`. Each desktop row must have subtle blue hover and focus-within state:

```tsx
"border-b border-slate-100 transition-colors last:border-b-0 hover:bg-blue-50/60 focus-within:bg-blue-50/60"
```

4. Add a `md:hidden` card list before the desktop table. Each card renders identity (full name/username), email, role, status, departments, last-updated time, and the same controlled `UserActionsMenu` at the right of the identity row. Preserve current `RoleBadge`, `StatusBadge`, and `formatDate` helpers. Use responsive wrapping/truncation so it has no horizontal scrolling below 768px.

5. Delete the no-longer-used `ActionButton` function. Do not change API requests, permissions, type contracts, filtering, pagination, modal flows, or any other files.

**Interaction and accessibility:**

- The same `openMenuUserId` must control menu instances in both desktop and mobile layouts, so opening one user’s menu closes another.
- Retain keyboard focus/hover states from `UserActionsMenu`; use subtle card hover effects with `motion-reduce:transition-none` on new card transitions.
- Do not add any test framework.

**Verification:**

- Run `npm.cmd run lint -- app/dashboard/users/_components/users-page-client.tsx app/dashboard/users/_components/user-actions-menu.tsx`. The repository currently has a pre-existing `react-hooks/set-state-in-effect` error at line ~105 in `users-page-client.tsx`; report it separately if unchanged.
- Run `npm.cmd run build` when practical; report any pre-existing failures distinctly.
- Do not stage or commit: this workspace contains the user’s pre-existing untracked page, so a commit would include unrelated baseline work.
- Write a complete report to `.superpowers/sdd/task-2-report.md` and return only status, test summary, concerns, report path.
