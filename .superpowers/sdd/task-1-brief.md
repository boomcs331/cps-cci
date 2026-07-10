### Task 1: Create the isolated Actions menu

**Files:**

- Create: `app/dashboard/users/_components/user-actions-menu.tsx`
- Modify: `app/dashboard/users/_components/users-page-client.tsx:28-30` to import the component after its existing local component imports.

**Interfaces:**

- `UserActionsMenu` is controlled by `UsersTable` and receives the exact props:

```tsx
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
```

- It must contain only permission-enabled actions in this order: Edit, Roles, Departments, Delete.
- Delete is visually separated and destructive.
- It must use a labelled Actions button with `aria-expanded`, `aria-controls`, and a labelled `role="menu"` containing `role="menuitem"` controls.
- Selecting an action calls `onOpenChange(false)` before invoking the matching callback.
- While open, it closes via outside `pointerdown` and Escape. Its root reference must contain the target check. It must never manage open state itself.
- The button and menu items require short Tailwind hover/focus transitions, visible focus rings, blue styling for standard actions, and red destructive hover/focus styling for Delete.
- Return a non-interactive `No actions` label if no permission allows an action.

**Exact implementation constraints:**

- The file must begin with `"use client"` and import `useEffect` and `useRef` from React.
- Use `menuId = \`user-actions-${userName.replace(/[^a-z0-9]+/gi, "-")}\``.
- Do not alter API requests, permission constants, user types, modal contracts, or unrelated files.
- Import `UserActionsMenu` in `users-page-client.tsx` with:

```tsx
import { UserActionsMenu } from "./user-actions-menu";
```

**Verification:**

- This repository has no test script or UI test dependencies. Do not add a test framework.
- Run `npm.cmd run lint -- app/dashboard/users/_components/user-actions-menu.tsx app/dashboard/users/_components/users-page-client.tsx`.
- Commit only this task's menu component and import using message `feat: add user actions menu`.
