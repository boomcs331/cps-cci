# User Management API Page Design

Date: 2026-07-09

## Goal

Create a real API-backed User Management page at `/dashboard/users` for the CPS dashboard. The page must use the backend access-control contract to decide what the current user can view and which actions are available.

## Current Context

- The dashboard already has a sidebar item for `User Management` pointing to `/dashboard/users`.
- The app currently logs in through `POST /auth/login` and stores `access_token` in `localStorage` from the login form.
- The backend documents these user-management permissions:
  - `USER_MANAGEMENT_VIEW`
  - `USER_MANAGEMENT_CREATE`
  - `USER_MANAGEMENT_UPDATE`
  - `USER_MANAGEMENT_DELETE`
  - `USER_MANAGEMENT_ASSIGN_ROLE`
  - `USER_MANAGEMENT_ASSIGN_DEPARTMENT`
- Relevant backend endpoints:
  - `GET /auth/me/permissions`
  - `GET /users`
  - `POST /users`
  - `PATCH /users/:id`
  - `DELETE /users/:id`
  - `PATCH /users/:id/roles`
  - `PATCH /users/:id/departments`
  - `GET /roles`
  - `GET /departments`

## Recommended Approach

Build the page as a client-side dashboard route that reads the current `access_token` from `localStorage` and calls the backend directly with `Authorization: Bearer <token>`.

This matches the current login implementation and avoids changing the broader authentication flow in this feature. A more secure HttpOnly-cookie server-proxy architecture can be handled later as a separate auth refactor.

## Page Behavior

1. On load, read `access_token`.
2. If no token exists, show a session-expired state with a link back to `/login`.
3. Call `GET /auth/me/permissions`.
4. If the user does not have `USER_MANAGEMENT_VIEW`, show an access-denied state.
5. If view is allowed, load users with `GET /users`.
6. Load roles with the page only when `USER_MANAGEMENT_ASSIGN_ROLE` is present, and load departments with the page only when `USER_MANAGEMENT_ASSIGN_DEPARTMENT` is present.
7. Render controls according to permissions:
   - `USER_MANAGEMENT_CREATE`: show `Create user`.
   - `USER_MANAGEMENT_UPDATE`: show edit actions and enable save.
   - `USER_MANAGEMENT_DELETE`: show delete action with confirmation.
   - `USER_MANAGEMENT_ASSIGN_ROLE`: show role assignment controls.
   - `USER_MANAGEMENT_ASSIGN_DEPARTMENT`: show department assignment controls.
8. For `401` responses, clear the local token and show the session-expired state.
9. For other errors, show a retryable error panel without losing the current page layout.

## UI Design

The page should feel like an operations console inside the existing dashboard, not a marketing page.

- Keep the same shell, spacing, panel, pagination, and blue CPS accent already used by the dashboard.
- Use a compact page header with title, total user count, and the primary action when permitted.
- Provide search and filters for username/email/full name, role, and status.
- Render users in a wide table with stable columns:
  - User
  - Email
  - Role
  - Status
  - Departments
  - Last updated
  - Actions
- Use clear badges for role and status.
- Keep destructive actions visually restrained but unmistakable.
- Use modals for create, edit, role assignment, department assignment, and delete confirmation.
- On smaller screens, keep the table horizontally scrollable rather than compressing columns until they become unreadable.

## Data Shapes

The frontend should accept the documented user fields:

- `id`
- `username`
- `email`
- `role`: `SUPER_ADMIN`, `ADMIN`, or `USER`
- `status`: `ACTIVE`, `INACTIVE`, or `LOCKED`
- `full_name`
- `phone`
- `created_at`
- `updated_at`
- `roles`
- `departments`

The implementation should tolerate missing optional fields from the backend by rendering `-`.

## Components

Keep the first implementation focused and local to the route:

- `app/dashboard/users/page.tsx`: page entry.
- `app/dashboard/users/_components/users-page-client.tsx`: client data loading and state.
- `app/dashboard/users/_components/user-form-modal.tsx`: create and edit user form.
- `app/dashboard/users/_components/user-assignment-modal.tsx`: assign roles or departments.
- `app/dashboard/users/_components/delete-user-modal.tsx`: delete confirmation.
- `app/lib/users.ts`: API helpers and permission helpers.
- `app/types/users.ts`: user, role, department, and permission types.

Shared UI primitives such as `Panel`, `Pagination`, and modal components should be reused when practical.

## Error Handling

- Missing token: show `Session expired` with a login link.
- Permission denied: show `Access denied` and list the required permission as `USER_MANAGEMENT_VIEW`.
- Backend unavailable: show a retry action. In development only, include the configured backend base URL in the message.
- Validation errors from create/update/assignment requests: show the backend message near the form action.
- Delete failure: keep the modal open and show the error message.

## Testing And Verification

Minimum verification:

- TypeScript and lint pass.
- The route `/dashboard/users` compiles.
- The page handles no-token, no-view-permission, loading, error, and happy-path states.
- Permission-gated controls do not render when their permission is absent.
- Create, edit, assign roles, assign departments, and delete call the documented endpoints with the bearer token.

Manual browser verification should cover desktop and mobile widths after implementation.

## Out Of Scope

- Refactoring login to HttpOnly-cookie server auth.
- Full role management, department management, menu management, or permission management pages.
- Server-side pagination unless the backend documents query parameters for it.
- Audit-log display.
