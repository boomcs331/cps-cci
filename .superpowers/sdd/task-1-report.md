# Task 1 Report: Isolated Actions Menu

## Status

DONE_WITH_CONCERNS

## Files changed

- `app/dashboard/users/_components/user-actions-menu.tsx` (created)
- `app/dashboard/users/_components/users-page-client.tsx` (added the required `UserActionsMenu` import only)

## Verification

Confirmed `npm.cmd run` exposes only `dev`, `build`, `start`, and `lint`; no test runner is available, and the task explicitly prohibits adding test dependencies.

### Required command

```text
npm.cmd run lint -- app/dashboard/users/_components/user-actions-menu.tsx app/dashboard/users/_components/users-page-client.tsx
```

Exit code: `1`.

Output:

```text
users-page-client.tsx:31:10 warning @typescript-eslint/no-unused-vars
'UserActionsMenu' is defined but never used.

users-page-client.tsx:105:10 error react-hooks/set-state-in-effect
void loadUsersPage();
Avoid calling setState() directly within an effect.
```

The warning is expected in this isolated task because Task 2 will consume the required import. The effect error is in pre-existing page-client code outside this task's allowed modification scope.

### Scoped component command

```text
npm.cmd run lint -- app/dashboard/users/_components/user-actions-menu.tsx
```

Exit code: `0`; no output beyond the ESLint command banner.

## Self-review

- The component is client-only and imports `useEffect` and `useRef` from React.
- Its props exactly match the requested controlled API; it keeps no local open state.
- Menu IDs use the required sanitized `userName` template.
- Enabled actions appear in the prescribed order. Delete is separated and styled destructively.
- The trigger and menu use the required ARIA semantics and menu items use `role="menuitem"`.
- Item selection closes the controlled menu before the matching callback runs.
- The open menu dismisses on outside `pointerdown` via a root containment check and on Escape; listeners are cleaned up.
- Standard and destructive interactions include hover/focus transitions and visible focus rings.
- No-permission users receive the non-interactive `No actions` label.
- No API, permission, type, or modal contracts were changed.

## Concerns

The exact two-file lint command cannot pass until Task 2 consumes `UserActionsMenu` and the pre-existing `react-hooks/set-state-in-effect` violation in `UsersPageClient` is addressed or excluded. No test framework exists and none was added per task requirements.

## Reviewer follow-up (2026-07-11)

### Status

DONE

### Changes

- Added controlled keyboard focus management for the menu pattern:
  - `ArrowDown` and `ArrowUp` on the trigger open the menu and focus the first and last enabled item, respectively.
  - `ArrowDown` and `ArrowUp` cycle through enabled menu items; `Home` and `End` focus the first and last items.
  - `Escape` closes the menu and restores focus to the Actions trigger.
- Added `aria-haspopup="menu"` and roving `tabIndex` values to match the interactive menu semantics.
- Added `motion-reduce:transition-none` to the trigger, chevron, and menu-item transitions.
- The Delete separator now renders only when an enabled non-destructive action precedes it.

### Verification

```text
npm.cmd run lint -- app/dashboard/users/_components/user-actions-menu.tsx
```

Exit code: `0`.

### Self-review

- The component remains controlled: it does not own `isOpen` state and continues to call `onOpenChange` for every open/close transition.
- Keyboard focus is moved only among the filtered, permission-enabled actions, preserving the existing action order.
- Escape handling in both the document listener and focused menu items restores focus to the trigger without duplicate bubbling from menu items.
- The existing outside-pointer containment check, action callback ordering, destructive styling, and no-actions fallback remain intact.
- The reviewer-requested changes are confined to `user-actions-menu.tsx`; no API, permission, modal, or page-client behavior was changed.

## Reviewer follow-up 2 (2026-07-11)

### Status

DONE

### Changes

- Preserved native Actions-button activation for `Enter` and `Space`, while setting a pending first-item focus target before the native click opens a closed menu.
- Updated trigger-arrow handling so it focuses the first or last menu item immediately when the menu is already open; when closed, it opens the controlled menu and focuses the requested item after render.
- Replaced the corrupted text chevron with an `aria-hidden` inline SVG using ASCII-only path data, preserving the rotation and reduced-motion behavior.

### Verification

```text
npm.cmd run lint -- app/dashboard/users/_components/user-actions-menu.tsx
```

Exit code: `0`.

### Self-review

- `ArrowDown`/`ArrowUp` continue to open a closed menu and focus its first/last enabled item, and now work immediately from an already-open trigger.
- A closed menu opened by native `Enter` or `Space` receives focus on its first enabled item after the controlled state update; an already-open menu retains native toggle behavior.
- The SVG chevron is decorative, non-focusable, and cannot be corrupted by text-source encoding.
- All changes remain limited to `user-actions-menu.tsx`; the controlled API, action ordering, permissions, dismissal behavior, and motion-reduction classes are unchanged.

## Reviewer follow-up 3 (2026-07-11)

### Status

DONE

### Change

- Added `className="size-full"` to the decorative chevron SVG so it fills the existing `size-4` wrapper consistently.

### Verification

```text
npm.cmd run lint -- app/dashboard/users/_components/user-actions-menu.tsx
```

Exit code: `0`.
