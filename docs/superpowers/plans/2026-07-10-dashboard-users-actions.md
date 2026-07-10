# Dashboard User Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate each user's management controls into an accessible Actions menu, add clear hover states, and provide a mobile card layout for `/dashboard/users`.

**Architecture:** Keep data loading, permissions, mutations, and modals in `UsersPageClient`. Extract the interactive menu into a small client component so its open state, outside-click handling, and Escape behavior are isolated. `UsersTable` owns the responsive desktop table/mobile card presentation and renders one `UserActionsMenu` per user.

**Tech Stack:** Next.js 16 App Router, React 19 client components, TypeScript, Tailwind CSS 4, ESLint.

## Global Constraints

- Preserve the existing API requests, permission constants, user types, and modal contracts unchanged.
- Show only actions authorized by the four existing `can*` permission booleans.
- Menu order is Edit, Roles, Departments, then a visually separated destructive Delete item.
- Keep interactive state in client components; this route already renders through `UsersPageClient` marked with `"use client"`.
- Respect the existing global reduced-motion media rule and provide visible keyboard focus.
- Do not add a test framework: the repository has no test script or test dependencies. Verification is ESLint, a production build, and the documented browser checks.

---

## File Structure

- Create: `app/dashboard/users/_components/user-actions-menu.tsx` — controlled accessible Actions trigger/menu and dismissal behavior.
- Modify: `app/dashboard/users/_components/users-page-client.tsx:468-582` — replace inline action buttons with `UserActionsMenu`, add row hover states, and render mobile user cards.

### Task 1: Create the isolated Actions menu

**Files:**

- Create: `app/dashboard/users/_components/user-actions-menu.tsx`
- Modify: `app/dashboard/users/_components/users-page-client.tsx:28-30` to import the component after its existing local component imports.

**Interfaces:**

- Consumes: boolean permission values and the existing parent callbacks.
- Consumes: an `isOpen` value and `onOpenChange` callback supplied by `UsersTable`, so opening a menu closes every other user's menu.
- Produces: `UserActionsMenu`, a controlled component with the exact props below.

- [ ] **Step 1: Confirm that no component test runner exists**

Run: `npm run`

Expected: the script list contains `dev`, `build`, `start`, and `lint`, but no test command. Do not install test dependencies for this focused visual change.

- [ ] **Step 2: Create the menu component**

Create `app/dashboard/users/_components/user-actions-menu.tsx` with this implementation:

```tsx
"use client";

import { useEffect, useRef } from "react";

type UserActionsMenuProps = {
  userName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  canUpdate: boolean;
  canAssignRole: boolean;
  canAssignDepartment: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onAssignRoles: () => void;
  onAssignDepartments: () => void;
  onDelete: () => void;
};

type MenuAction = {
  label: "Edit" | "Roles" | "Departments" | "Delete";
  enabled: boolean;
  danger?: boolean;
  onSelect: () => void;
};

export function UserActionsMenu({
  userName,
  isOpen,
  onOpenChange,
  canUpdate,
  canAssignRole,
  canAssignDepartment,
  canDelete,
  onEdit,
  onAssignRoles,
  onAssignDepartments,
  onDelete,
}: UserActionsMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = `user-actions-${userName.replace(/[^a-z0-9]+/gi, "-")}`;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onOpenChange(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onOpenChange]);

  const actions: MenuAction[] = [
    { label: "Edit", enabled: canUpdate, onSelect: onEdit },
    { label: "Roles", enabled: canAssignRole, onSelect: onAssignRoles },
    { label: "Departments", enabled: canAssignDepartment, onSelect: onAssignDepartments },
    { label: "Delete", enabled: canDelete, danger: true, onSelect: onDelete },
  ];
  const visibleActions = actions.filter((action) => action.enabled);

  if (visibleActions.length === 0) return <span className="text-xs font-semibold text-slate-400">No actions</span>;

  const selectAction = (action: MenuAction) => {
    onOpenChange(false);
    action.onSelect();
  };

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => onOpenChange(!isOpen)}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#1057e8] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        Actions
        <span aria-hidden="true" className={`text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {isOpen ? (
        <div id={menuId} role="menu" aria-label={`Actions for ${userName}`} className="absolute right-0 z-10 mt-11 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_16px_35px_rgba(15,23,42,0.16)]">
          {visibleActions.map((action) => (
            <div key={action.label} className={action.danger ? "mt-1 border-t border-slate-100 pt-1" : ""}>
              <button type="button" role="menuitem" onClick={() => selectAction(action)} className={`flex w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-200 ${action.danger ? "text-red-600 hover:bg-red-50 focus-visible:ring-red-200" : "text-slate-700 hover:bg-blue-50 hover:text-[#1057e8]"}`}>
                {action.label}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 3: Import the menu into the page client**

Add this exact import with the other local component imports in `users-page-client.tsx`:

```tsx
import { UserActionsMenu } from "./user-actions-menu";
```

- [ ] **Step 4: Run the linter for the new client component boundary**

Run: `npm run lint -- app/dashboard/users/_components/user-actions-menu.tsx app/dashboard/users/_components/users-page-client.tsx`

Expected: exit code 0 with no errors.

- [ ] **Step 5: Commit the isolated menu**

```bash
git add app/dashboard/users/_components/user-actions-menu.tsx app/dashboard/users/_components/users-page-client.tsx
git commit -m "feat: add user actions menu"
```

### Task 2: Replace inline action buttons and add the responsive user list

**Files:**

- Modify: `app/dashboard/users/_components/users-page-client.tsx:468-582`

**Interfaces:**

- Consumes: `UserActionsMenu` from Task 1 and the current `UsersTable` props.
- Produces: a responsive `UsersTable` that owns `openMenuUserId`, renders a table at `md` and above, and renders user cards below `md`.

- [ ] **Step 1: Add one open-menu state to `UsersTable` and replace each inline action group**

Immediately after the `UsersTable` props destructuring, add:

```tsx
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
```

The existing React import already includes `useState`. This single state value ensures only one user's Actions menu can be open at a time.

In the table action cell, replace the `ActionButton` group with:

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

Change the desktop table wrapper to `hidden overflow-visible rounded-lg border border-slate-200 md:block`; remove the `min-w-[980px]` class from the table; and change each row class to:

```tsx
"border-b border-slate-100 transition-colors last:border-b-0 hover:bg-blue-50/60 focus-within:bg-blue-50/60"
```

Delete the now-unused `ActionButton` function.

- [ ] **Step 2: Add the small-screen user cards before the desktop table**

Add this JSX immediately before the desktop table wrapper. It intentionally uses the same callbacks and badges as the table so all actions retain their current flows:

```tsx
<div className="space-y-3 md:hidden">
  {users.map((user) => (
    <article key={user.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold text-[#111a34]">{user.full_name?.trim() || user.username}</p>
          <p className="truncate text-xs font-semibold text-slate-500">@{user.username}</p>
        </div>
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
      </div>
      <p className="mt-3 break-all text-sm font-medium text-slate-700">{user.email}</p>
      <div className="mt-3 flex flex-wrap gap-2"><RoleBadge role={user.role} /><StatusBadge status={user.status} /></div>
      <dl className="mt-4 grid gap-3 border-t border-slate-100 pt-3 text-sm">
        <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Departments</dt><dd className="mt-1 font-medium text-slate-700">{user.departments?.length ? user.departments.join(", ") : "-"}</dd></div>
        <div><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">Last updated</dt><dd className="mt-1 font-medium text-slate-700">{formatDate(user.updated_at)}</dd></div>
      </dl>
    </article>
  ))}
</div>
```

- [ ] **Step 3: Run lint after removing the old button helper**

Run: `npm run lint -- app/dashboard/users/_components/users-page-client.tsx app/dashboard/users/_components/user-actions-menu.tsx`

Expected: exit code 0 with no unused imports or unused local declarations.

- [ ] **Step 4: Check the production build**

Run: `npm run build`

Expected: exit code 0 and a generated route entry for `/dashboard/users`.

- [ ] **Step 5: Perform browser acceptance checks**

Run: `npm run dev`

Verify each behavior in the browser at `/dashboard/users`:

1. At desktop width, each user row has one Actions button and no inline Edit/Roles/Departments/Delete buttons.
2. Actions opens the permission-appropriate list in the required order, with Delete below a separator in red.
3. Clicking outside, pressing Escape, and selecting an item close the menu; selecting an item opens the existing matching modal.
4. Hovering a row, Actions button, and menu item visibly changes its visual state; Tab shows a visible focus ring.
5. At a width below 768px, user records appear as cards, Actions remains beside the identity block, and the table does not cause horizontal scrolling.
6. Accounts without a permission do not see the corresponding menu item.

- [ ] **Step 6: Commit the responsive presentation**

```bash
git add app/dashboard/users/_components/users-page-client.tsx app/dashboard/users/_components/user-actions-menu.tsx
git commit -m "feat: make user actions responsive"
```

### Task 3: Final diff and quality gate

**Files:**

- Verify: `app/dashboard/users/_components/user-actions-menu.tsx`
- Verify: `app/dashboard/users/_components/users-page-client.tsx`

**Interfaces:**

- Consumes: the completed Tasks 1–2 implementation.
- Produces: verified UI changes with no API, permission, or type changes.

- [ ] **Step 1: Inspect scope and whitespace**

Run: `git diff --check; git diff -- app/dashboard/users/_components/user-actions-menu.tsx app/dashboard/users/_components/users-page-client.tsx`

Expected: no whitespace errors; the diff is limited to UI structure, interaction state, and styles.

- [ ] **Step 2: Run final repository checks**

Run: `npm run lint; npm run build`

Expected: both commands exit 0.
