# Dashboard User Actions Design

## Goal

Improve the `/dashboard/users` user-management interface by consolidating the
per-user actions into one clear control, adding meaningful interaction states,
and making the user list easy to use on small screens.

## Scope

- Replace the inline **Edit**, **Roles**, **Departments**, and **Delete**
  buttons in each desktop table row with one **Actions** menu.
- Keep the existing permission checks and modal/API flows unchanged.
- Add visible hover and keyboard-focus treatment to action controls, menu
  items, and user rows.
- Render a compact user-card layout on small screens instead of relying on a
  horizontally scrolling table.

## Interaction design

### Actions menu

- The trigger is labelled **Actions** and indicates whether its menu is open.
- Its menu contains only actions granted by the current user's permissions.
- The items appear in this order: **Edit**, **Roles**, **Departments**.
- **Delete** is separated by a divider and uses destructive styling.
- Opening an action preserves the existing modal behavior. Selecting an action
  closes the menu before opening the selected flow.
- The menu closes when the user presses Escape, clicks outside it, or opens a
  different user's menu.

### Feedback and accessibility

- Buttons and menu items use a short, restrained color and shadow transition
  on hover and visible focus rings for keyboard users.
- Desktop rows gain a subtle blue-tinted hover background, without competing
  with the selected action control.
- Menu controls use semantic button/menu roles and accessible names; the
  trigger exposes its expanded state.
- Global reduced-motion preferences continue to suppress animation.

### Responsive layout

- At the small-screen breakpoint, the table is replaced by a vertical list of
  user cards.
- Each card keeps the user's identity, email, role, status, departments, and
  last-updated time legible, with the **Actions** control aligned beside the
  identity block.
- Search and filters already stack responsively and will retain that behavior.
- Pagination remains below the list and uses its existing responsive behavior.

## Technical boundary

The change remains within `app/dashboard/users/_components/users-page-client.tsx`
unless a small shared presentation helper is clearly necessary. It must not
change backend requests, permission names, user types, or modal contracts.

## Verification

- Add focused tests when an existing test setup supports them; otherwise verify
  the component through the project lint and production build commands.
- Check desktop and mobile layouts, including keyboard opening/closing of the
  Actions menu and permission-hidden action items.
