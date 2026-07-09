# User Management API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real API-backed `/dashboard/users` page that gates user-management actions by backend permissions.

**Architecture:** Keep the dashboard route as a Server Component page that renders a focused Client Component for token-based API calls, browser state, filtering, and modals. Put backend contracts and fetch helpers in typed library files so the UI stays mostly presentation and workflow logic.

**Tech Stack:** Next.js 16 App Router, React 19 Client Components, TypeScript strict mode, Tailwind CSS utility classes, native `fetch`, existing CPS `Panel`, `Pagination`, and dashboard shell components.

## Global Constraints

- Read relevant Next.js docs from `node_modules/next/dist/docs/` before implementation; this plan relies on App Router pages and Client Components.
- Use `NEXT_PUBLIC_API_BASE_URL` for browser-side API calls.
- Read `access_token` from `localStorage` because current login stores the bearer token there.
- Do not refactor login to HttpOnly cookies in this feature.
- Required permissions are `USER_MANAGEMENT_VIEW`, `USER_MANAGEMENT_CREATE`, `USER_MANAGEMENT_UPDATE`, `USER_MANAGEMENT_DELETE`, `USER_MANAGEMENT_ASSIGN_ROLE`, and `USER_MANAGEMENT_ASSIGN_DEPARTMENT`.
- Missing optional backend fields render as `-`.
- Permission-gated controls must not render when the permission is absent.
- Keep the UI inside the existing dashboard shell and reuse existing UI primitives where practical.

---

## File Structure

- Create `app/types/users.ts`: shared user-management API types and permission constants.
- Create `app/lib/users.ts`: browser-safe API helper functions for permissions, users, roles, departments, create, update, delete, and assignments.
- Create `app/dashboard/users/page.tsx`: route entry and metadata.
- Create `app/dashboard/users/_components/users-page-client.tsx`: client data loading, permission gating, filters, table, pagination, and modal orchestration.
- Create `app/dashboard/users/_components/user-form-modal.tsx`: create/edit form modal.
- Create `app/dashboard/users/_components/user-assignment-modal.tsx`: role/department assignment modal.
- Create `app/dashboard/users/_components/delete-user-modal.tsx`: delete confirmation modal.
- Modify `app/config/navigation.ts`: remove the hard-coded `active: true` flag from the `Productions` item.
- Modify `app/dashboard/_components/dashboard-shell.tsx`: use `usePathname()` to highlight the current nav item instead of relying on static `active`.

---

### Task 1: Types And API Helpers

**Files:**
- Create: `app/types/users.ts`
- Create: `app/lib/users.ts`

**Interfaces:**
- Produces: `UserManagementPermission`, `USER_MANAGEMENT_PERMISSIONS`, `AccessControlUser`, `AccessRole`, `AccessDepartment`, `UserFormInput`, `UserAssignmentInput`
- Produces: `getCurrentPermissions(token)`, `getUsers(token)`, `getRoles(token)`, `getDepartments(token)`, `createUser(token, input)`, `updateUser(token, id, input)`, `deleteUser(token, id)`, `assignUserRoles(token, id, roleIds)`, `assignUserDepartments(token, id, departmentIds)`, `hasPermission(permissions, permission)`

- [ ] **Step 1: Add the type contracts**

Create `app/types/users.ts`:

```ts
export const USER_MANAGEMENT_PERMISSIONS = {
  view: "USER_MANAGEMENT_VIEW",
  create: "USER_MANAGEMENT_CREATE",
  update: "USER_MANAGEMENT_UPDATE",
  delete: "USER_MANAGEMENT_DELETE",
  assignRole: "USER_MANAGEMENT_ASSIGN_ROLE",
  assignDepartment: "USER_MANAGEMENT_ASSIGN_DEPARTMENT",
} as const;

export type UserManagementPermission =
  (typeof USER_MANAGEMENT_PERMISSIONS)[keyof typeof USER_MANAGEMENT_PERMISSIONS];

export type AccessUserRole = "SUPER_ADMIN" | "ADMIN" | "USER";
export type AccessUserStatus = "ACTIVE" | "INACTIVE" | "LOCKED";

export type AccessControlUser = {
  id: string;
  username: string;
  email: string;
  role: AccessUserRole;
  status: AccessUserStatus;
  full_name?: string | null;
  phone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  roles?: string[];
  departments?: string[];
};

export type AccessRole = {
  id: string;
  name: string;
  description?: string | null;
  is_system?: boolean;
  is_active?: boolean;
};

export type AccessDepartment = {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type UserFormInput = {
  username: string;
  email: string;
  password?: string;
  full_name?: string;
  phone?: string;
  role: AccessUserRole;
  status: AccessUserStatus;
};

export type UserAssignmentInput = {
  ids: string[];
};
```

- [ ] **Step 2: Add API helpers**

Create `app/lib/users.ts`:

```ts
import type {
  AccessControlUser,
  AccessDepartment,
  AccessRole,
  UserAssignmentInput,
  UserFormInput,
  UserManagementPermission,
} from "../types/users";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export class ApiUnauthorizedError extends Error {
  constructor() {
    super("Session expired");
    this.name = "ApiUnauthorizedError";
  }
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function apiRequest<T>(
  token: string,
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new ApiUnauthorizedError();
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };
    throw new ApiRequestError(
      data.message ?? data.error ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getUserManagementApiBaseUrl() {
  return API_BASE_URL;
}

export function hasPermission(
  permissions: string[],
  permission: UserManagementPermission,
) {
  return permissions.includes(permission);
}

export async function getCurrentPermissions(token: string) {
  return apiRequest<string[]>(token, "/auth/me/permissions");
}

export async function getUsers(token: string) {
  return apiRequest<AccessControlUser[]>(token, "/users");
}

export async function getRoles(token: string) {
  return apiRequest<AccessRole[]>(token, "/roles");
}

export async function getDepartments(token: string) {
  return apiRequest<AccessDepartment[]>(token, "/departments");
}

export async function createUser(token: string, input: UserFormInput) {
  return apiRequest<AccessControlUser>(token, "/users", {
    method: "POST",
    body: input,
  });
}

export async function updateUser(token: string, id: string, input: UserFormInput) {
  const { password, ...rest } = input;
  return apiRequest<AccessControlUser>(token, `/users/${id}`, {
    method: "PATCH",
    body: password ? input : rest,
  });
}

export async function deleteUser(token: string, id: string) {
  return apiRequest<void>(token, `/users/${id}`, {
    method: "DELETE",
  });
}

export async function assignUserRoles(token: string, id: string, roleIds: string[]) {
  return apiRequest<AccessControlUser>(token, `/users/${id}/roles`, {
    method: "PATCH",
    body: { ids: roleIds } satisfies UserAssignmentInput,
  });
}

export async function assignUserDepartments(
  token: string,
  id: string,
  departmentIds: string[],
) {
  return apiRequest<AccessControlUser>(token, `/users/${id}/departments`, {
    method: "PATCH",
    body: { ids: departmentIds } satisfies UserAssignmentInput,
  });
}
```

- [ ] **Step 3: Verify types compile so far**

Run: `pnpm lint`

Expected: no lint errors from `app/types/users.ts` or `app/lib/users.ts`.

---

### Task 2: Route, Active Navigation, And Page State

**Files:**
- Create: `app/dashboard/users/page.tsx`
- Create: `app/dashboard/users/_components/users-page-client.tsx`
- Modify: `app/config/navigation.ts`
- Modify: `app/dashboard/_components/dashboard-shell.tsx`

**Interfaces:**
- Consumes: Task 1 API helpers and permission types.
- Produces: A working route at `/dashboard/users` with loading, session-expired, access-denied, and API-error states.

- [ ] **Step 1: Remove hard-coded active navigation**

Modify `app/config/navigation.ts` so no item has `active: true` by default:

```ts
export type IconName = "users" | "box" | "factory" | "truck" | "clipboard";

export type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  active?: boolean;
  expandable?: boolean;
};

export const dashboardNavigation: NavItem[] = [
  { label: "User Management", href: "/dashboard/users", icon: "users" },
  { label: "Materials", href: "/dashboard/materials", icon: "box" },
  { label: "Productions", href: "/dashboard", icon: "factory" },
  { label: "Delivery", href: "/dashboard/delivery", icon: "truck" },
  { label: "Master Data", href: "/dashboard/master-data", icon: "clipboard", expandable: true },
];
```

- [ ] **Step 2: Make sidebar active state route-aware**

In `app/dashboard/_components/dashboard-shell.tsx`, import `usePathname` and compute active state in `SidebarContent`:

```tsx
import { usePathname } from "next/navigation";
```

Inside `SidebarContent`:

```tsx
const pathname = usePathname();
```

Replace the `item.active` condition with:

```tsx
const isActive =
  item.href === "/dashboard"
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
```

Use `isActive` in the class condition.

- [ ] **Step 3: Add route entry**

Create `app/dashboard/users/page.tsx`:

```tsx
import type { Metadata } from "next";
import { UsersPageClient } from "./_components/users-page-client";

export const metadata: Metadata = {
  title: "CPS - User Management",
  description: "Manage CPS access-control users",
};

export default function UsersPage() {
  return <UsersPageClient />;
}
```

- [ ] **Step 4: Add first client page shell with state loading**

Create `app/dashboard/users/_components/users-page-client.tsx` with the initial loading and permission gate:

```tsx
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Panel } from "../../../components/ui/panel";
import {
  ApiUnauthorizedError,
  getCurrentPermissions,
  getDepartments,
  getRoles,
  getUserManagementApiBaseUrl,
  getUsers,
  hasPermission,
} from "../../../lib/users";
import {
  USER_MANAGEMENT_PERMISSIONS,
  type AccessControlUser,
  type AccessDepartment,
  type AccessRole,
} from "../../../types/users";

type PageStatus = "loading" | "ready" | "session-expired" | "access-denied" | "error";

export function UsersPageClient() {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [token, setToken] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [users, setUsers] = useState<AccessControlUser[]>([]);
  const [roles, setRoles] = useState<AccessRole[]>([]);
  const [departments, setDepartments] = useState<AccessDepartment[]>([]);
  const [error, setError] = useState("");

  const loadUsersPage = useCallback(async () => {
    const currentToken = window.localStorage.getItem("access_token");
    if (!currentToken) {
      setStatus("session-expired");
      return;
    }

    setStatus("loading");
    setError("");
    setToken(currentToken);

    try {
      const nextPermissions = await getCurrentPermissions(currentToken);
      setPermissions(nextPermissions);

      if (!hasPermission(nextPermissions, USER_MANAGEMENT_PERMISSIONS.view)) {
        setStatus("access-denied");
        return;
      }

      const canAssignRoles = hasPermission(nextPermissions, USER_MANAGEMENT_PERMISSIONS.assignRole);
      const canAssignDepartments = hasPermission(
        nextPermissions,
        USER_MANAGEMENT_PERMISSIONS.assignDepartment,
      );

      const [nextUsers, nextRoles, nextDepartments] = await Promise.all([
        getUsers(currentToken),
        canAssignRoles ? getRoles(currentToken) : Promise.resolve([]),
        canAssignDepartments ? getDepartments(currentToken) : Promise.resolve([]),
      ]);

      setUsers(nextUsers);
      setRoles(nextRoles);
      setDepartments(nextDepartments);
      setStatus("ready");
    } catch (caught) {
      if (caught instanceof ApiUnauthorizedError) {
        window.localStorage.removeItem("access_token");
        setStatus("session-expired");
        return;
      }

      setError(caught instanceof Error ? caught.message : "Unable to load users");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadUsersPage();
  }, [loadUsersPage]);

  if (status === "loading") {
    return <PageFrame title="User Management"><StatePanel title="Loading users" message="Checking your access and loading user records." /></PageFrame>;
  }

  if (status === "session-expired") {
    return (
      <PageFrame title="User Management">
        <StatePanel title="Session expired" message="Sign in again to manage users.">
          <Link className="font-bold text-[#1057e8]" href="/login">Go to login</Link>
        </StatePanel>
      </PageFrame>
    );
  }

  if (status === "access-denied") {
    return (
      <PageFrame title="User Management">
        <StatePanel title="Access denied" message="You need USER_MANAGEMENT_VIEW to open this page." />
      </PageFrame>
    );
  }

  if (status === "error") {
    const details = process.env.NODE_ENV === "development"
      ? `${error} (${getUserManagementApiBaseUrl()})`
      : error;
    return (
      <PageFrame title="User Management">
        <StatePanel title="Unable to load users" message={details}>
          <button type="button" onClick={() => void loadUsersPage()} className="font-bold text-[#1057e8]">
            Retry
          </button>
        </StatePanel>
      </PageFrame>
    );
  }

  return (
    <PageFrame title="User Management">
      <Panel title="Users">
        <p className="text-sm font-medium text-slate-500">
          Loaded {users.length} users with {permissions.length} permissions.
          Roles: {roles.length}. Departments: {departments.length}.
        </p>
      </Panel>
    </PageFrame>
  );
}

function PageFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold uppercase text-[#1057e8]">Access control</p>
        <h2 className="text-2xl font-bold text-[#111a34] md:text-3xl">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function StatePanel({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <Panel title={title}>
      <div className="flex flex-col gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-medium text-slate-600">
        <p>{message}</p>
        {children}
      </div>
    </Panel>
  );
}
```

- [ ] **Step 5: Verify route shell**

Run: `pnpm lint`

Expected: PASS.

Run: `pnpm build`

Expected: `/dashboard/users` compiles.

---

### Task 3: User Table, Filters, Pagination, And Permission-Gated Actions

**Files:**
- Modify: `app/dashboard/users/_components/users-page-client.tsx`

**Interfaces:**
- Consumes: `users`, `permissions`, `roles`, `departments`, `token`, `loadUsersPage()`.
- Produces: Search, role/status filters, paginated table, and action buttons that render only when permitted.

- [ ] **Step 1: Add table state and permission booleans**

Add imports:

```tsx
import { Pagination, usePagination } from "../../../components/ui/pagination";
```

Add state near the existing `useState` calls:

```tsx
const [search, setSearch] = useState("");
const [roleFilter, setRoleFilter] = useState("ALL");
const [statusFilter, setStatusFilter] = useState("ALL");
```

Add derived values immediately after `useEffect` and before every status-based early `return`:

```tsx
const canCreate = hasPermission(permissions, USER_MANAGEMENT_PERMISSIONS.create);
const canUpdate = hasPermission(permissions, USER_MANAGEMENT_PERMISSIONS.update);
const canDelete = hasPermission(permissions, USER_MANAGEMENT_PERMISSIONS.delete);
const canAssignRole = hasPermission(permissions, USER_MANAGEMENT_PERMISSIONS.assignRole);
const canAssignDepartment = hasPermission(
  permissions,
  USER_MANAGEMENT_PERMISSIONS.assignDepartment,
);

const filteredUsers = useMemo(() => users.filter((user) => {
  const haystack = [
    user.username,
    user.email,
    user.full_name ?? "",
    user.phone ?? "",
  ].join(" ").toLowerCase();
  const matchesSearch = haystack.includes(search.trim().toLowerCase());
  const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
  const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
  return matchesSearch && matchesRole && matchesStatus;
}), [roleFilter, search, statusFilter, users]);

const pagination = usePagination(filteredUsers, 10);
```

- [ ] **Step 2: Replace ready-state placeholder with header, filters, and table**

Replace the final ready `return` body inside `PageFrame` with:

```tsx
<div className="grid gap-4 xl:grid-cols-[1fr_280px]">
  <Panel
    title="Users"
    action={
      canCreate ? (
        <button
          type="button"
          className="rounded-lg bg-[#1057e8] px-4 py-2 text-sm font-bold text-white shadow-[0_8px_18px_rgba(16,87,232,0.22)]"
        >
          Create user
        </button>
      ) : null
    }
  >
    <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
      <label className="flex flex-col gap-1 text-sm font-bold text-slate-700">
        Search
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Username, email, name, or phone"
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1057e8] focus:ring-4 focus:ring-blue-100"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold text-slate-700">
        Role
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1057e8] focus:ring-4 focus:ring-blue-100"
        >
          <option value="ALL">All roles</option>
          <option value="SUPER_ADMIN">Super admin</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold text-slate-700">
        Status
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1057e8] focus:ring-4 focus:ring-blue-100"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="LOCKED">Locked</option>
        </select>
      </label>
    </div>

    <UsersTable
      users={pagination.paginatedItems}
      canUpdate={canUpdate}
      canDelete={canDelete}
      canAssignRole={canAssignRole}
      canAssignDepartment={canAssignDepartment}
    />

    <div className="mt-6">
      <Pagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={filteredUsers.length}
        onPageChange={pagination.setPage}
        onPageSizeChange={pagination.setPageSize}
        pageSizeOptions={[10, 20, 50]}
        showJumpToPage
      />
    </div>
  </Panel>

  <Panel title="Access">
    <div className="space-y-3 text-sm font-medium text-slate-600">
      <AccessLine label="Create" enabled={canCreate} />
      <AccessLine label="Update" enabled={canUpdate} />
      <AccessLine label="Delete" enabled={canDelete} />
      <AccessLine label="Assign roles" enabled={canAssignRole} />
      <AccessLine label="Assign departments" enabled={canAssignDepartment} />
    </div>
  </Panel>
</div>
```

- [ ] **Step 3: Add rendering helpers at the bottom of the file**

Add:

```tsx
function UsersTable({
  users,
  canUpdate,
  canDelete,
  canAssignRole,
  canAssignDepartment,
}: {
  users: AccessControlUser[];
  canUpdate: boolean;
  canDelete: boolean;
  canAssignRole: boolean;
  canAssignDepartment: boolean;
}) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-medium text-slate-500">
        No users match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[980px] border-collapse text-left text-sm">
        <thead className="bg-white text-xs font-bold text-slate-600">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-4">User</th>
            <th className="px-4 py-4">Email</th>
            <th className="px-4 py-4">Role</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-4 py-4">Departments</th>
            <th className="px-4 py-4">Last updated</th>
            <th className="px-4 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 last:border-b-0">
              <td className="px-4 py-4">
                <p className="font-bold text-[#111a34]">{user.full_name?.trim() || user.username}</p>
                <p className="text-xs font-semibold text-slate-500">@{user.username}</p>
              </td>
              <td className="px-4 py-4 font-medium text-slate-700">{user.email}</td>
              <td className="px-4 py-4"><RoleBadge role={user.role} /></td>
              <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
              <td className="px-4 py-4 font-medium text-slate-700">
                {user.departments?.length ? user.departments.join(", ") : "-"}
              </td>
              <td className="px-4 py-4 font-medium text-slate-700">{formatDate(user.updated_at)}</td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {canUpdate ? <ActionButton label="Edit" /> : null}
                  {canAssignRole ? <ActionButton label="Roles" /> : null}
                  {canAssignDepartment ? <ActionButton label="Departments" /> : null}
                  {canDelete ? <ActionButton label="Delete" danger /> : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionButton({ label, danger = false }: { label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      className={`rounded-md border px-3 py-1.5 text-xs font-bold ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

function AccessLine({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
        {enabled ? "Allowed" : "Hidden"}
      </span>
    </div>
  );
}

function RoleBadge({ role }: { role: AccessControlUser["role"] }) {
  const classes = {
    SUPER_ADMIN: "bg-indigo-100 text-indigo-700",
    ADMIN: "bg-blue-100 text-blue-700",
    USER: "bg-slate-100 text-slate-700",
  }[role];
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${classes}`}>{role.replace("_", " ")}</span>;
}

function StatusBadge({ status }: { status: AccessControlUser["status"] }) {
  const classes = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-slate-100 text-slate-600",
    LOCKED: "bg-red-100 text-red-700",
  }[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${classes}`}>{status}</span>;
}

function display(value?: string | null) {
  return value?.trim() || "-";
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}
```

- [ ] **Step 4: Verify table behavior**

Run: `pnpm lint`

Expected: PASS.

---

### Task 4: Create, Edit, Assign, And Delete Modals

**Files:**
- Create: `app/dashboard/users/_components/user-form-modal.tsx`
- Create: `app/dashboard/users/_components/user-assignment-modal.tsx`
- Create: `app/dashboard/users/_components/delete-user-modal.tsx`
- Modify: `app/dashboard/users/_components/users-page-client.tsx`

**Interfaces:**
- Consumes: Task 1 mutation helpers.
- Produces: Working API calls for create, update, role assignment, department assignment, and delete.

- [ ] **Step 1: Add form modal**

Create `app/dashboard/users/_components/user-form-modal.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import type { AccessControlUser, AccessUserRole, AccessUserStatus, UserFormInput } from "../../../types/users";

type UserFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  user?: AccessControlUser | null;
  error?: string;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (input: UserFormInput) => void;
};

const roles: AccessUserRole[] = ["SUPER_ADMIN", "ADMIN", "USER"];
const statuses: AccessUserStatus[] = ["ACTIVE", "INACTIVE", "LOCKED"];

export function UserFormModal({ open, mode, user, error, isSaving, onClose, onSubmit }: UserFormModalProps) {
  const [form, setForm] = useState<UserFormInput>({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "USER",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      username: user?.username ?? "",
      email: user?.email ?? "",
      password: "",
      full_name: user?.full_name ?? "",
      phone: user?.phone ?? "",
      role: user?.role ?? "USER",
      status: user?.status ?? "ACTIVE",
    });
  }, [open, user]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
        className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#111a34]">{mode === "create" ? "Create user" : "Edit user"}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">Manage account details and access status.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100">
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Username" value={form.username} onChange={(value) => setForm({ ...form, username: value })} required />
          <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
          <Field label={mode === "create" ? "Password" : "New password"} type="password" value={form.password ?? ""} onChange={(value) => setForm({ ...form, password: value })} required={mode === "create"} />
          <Field label="Full name" value={form.full_name ?? ""} onChange={(value) => setForm({ ...form, full_name: value })} />
          <Field label="Phone" value={form.phone ?? ""} onChange={(value) => setForm({ ...form, phone: value })} />
          <label className="flex flex-col gap-1 text-sm font-bold text-slate-700">
            Role
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AccessUserRole })} className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1057e8] focus:ring-4 focus:ring-blue-100">
              {roles.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-slate-700">
            Status
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AccessUserStatus })} className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1057e8] focus:ring-4 focus:ring-blue-100">
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
        </div>

        {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button>
          <button type="submit" disabled={isSaving} className="rounded-lg bg-[#1057e8] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-bold text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1057e8] focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
```

- [ ] **Step 2: Add assignment modal**

Create `app/dashboard/users/_components/user-assignment-modal.tsx` with checkbox selection:

```tsx
"use client";

import { useEffect, useState } from "react";
import type { AccessControlUser, AccessDepartment, AccessRole } from "../../../types/users";

type AssignmentOption = AccessRole | AccessDepartment;

type UserAssignmentModalProps = {
  open: boolean;
  title: string;
  user: AccessControlUser | null;
  options: AssignmentOption[];
  selectedNames: string[];
  error?: string;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (ids: string[]) => void;
};

export function UserAssignmentModal({
  open,
  title,
  user,
  options,
  selectedNames,
  error,
  isSaving,
  onClose,
  onSubmit,
}: UserAssignmentModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setSelectedIds(options.filter((option) => selectedNames.includes(option.name)).map((option) => option.id));
  }, [open, options, selectedNames]);

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-[#111a34]">{title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">@{user.username}</p>
        </div>
        <div className="max-h-[320px] space-y-2 overflow-y-auto">
          {options.map((option) => {
            const checked = selectedIds.includes(option.id);
            return (
              <label key={option.id} className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    setSelectedIds((current) =>
                      checked ? current.filter((id) => id !== option.id) : [...current, option.id],
                    );
                  }}
                />
                <span>{option.name}</span>
              </label>
            );
          })}
        </div>
        {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button>
          <button type="button" disabled={isSaving} onClick={() => onSubmit(selectedIds)} className="rounded-lg bg-[#1057e8] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add delete modal**

Create `app/dashboard/users/_components/delete-user-modal.tsx`:

```tsx
"use client";

import type { AccessControlUser } from "../../../types/users";

export function DeleteUserModal({
  open,
  user,
  error,
  isSaving,
  onClose,
  onConfirm,
}: {
  open: boolean;
  user: AccessControlUser | null;
  error?: string;
  isSaving?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <h3 className="text-xl font-bold text-[#111a34]">Delete user</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
          Delete @{user.username}. This action cannot be undone.
        </p>
        {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Cancel</button>
          <button type="button" disabled={isSaving} onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {isSaving ? "Deleting..." : "Delete user"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire modal state and mutations in the client page**

In `users-page-client.tsx`, import modals and mutation helpers:

```tsx
import { DeleteUserModal } from "./delete-user-modal";
import { UserAssignmentModal } from "./user-assignment-modal";
import { UserFormModal } from "./user-form-modal";
import {
  assignUserDepartments,
  assignUserRoles,
  createUser,
  deleteUser,
  updateUser,
} from "../../../lib/users";
import type { UserFormInput } from "../../../types/users";
```

Add modal state:

```tsx
const [activeUser, setActiveUser] = useState<AccessControlUser | null>(null);
const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
const [assignmentMode, setAssignmentMode] = useState<"roles" | "departments" | null>(null);
const [deleteOpen, setDeleteOpen] = useState(false);
const [saving, setSaving] = useState(false);
const [modalError, setModalError] = useState("");
```

Add mutation handlers:

```tsx
async function saveUser(input: UserFormInput) {
  setSaving(true);
  setModalError("");
  try {
    if (formMode === "create") {
      await createUser(token, input);
    } else if (activeUser) {
      await updateUser(token, activeUser.id, input);
    }
    setFormMode(null);
    setActiveUser(null);
    await loadUsersPage();
  } catch (caught) {
    setModalError(caught instanceof Error ? caught.message : "Unable to save user");
  } finally {
    setSaving(false);
  }
}

async function saveAssignment(ids: string[]) {
  if (!activeUser || !assignmentMode) return;
  setSaving(true);
  setModalError("");
  try {
    if (assignmentMode === "roles") {
      await assignUserRoles(token, activeUser.id, ids);
    } else {
      await assignUserDepartments(token, activeUser.id, ids);
    }
    setAssignmentMode(null);
    setActiveUser(null);
    await loadUsersPage();
  } catch (caught) {
    setModalError(caught instanceof Error ? caught.message : "Unable to save assignment");
  } finally {
    setSaving(false);
  }
}

async function confirmDelete() {
  if (!activeUser) return;
  setSaving(true);
  setModalError("");
  try {
    await deleteUser(token, activeUser.id);
    setDeleteOpen(false);
    setActiveUser(null);
    await loadUsersPage();
  } catch (caught) {
    setModalError(caught instanceof Error ? caught.message : "Unable to delete user");
  } finally {
    setSaving(false);
  }
}
```

Pass handlers into `UsersTable` and create button:

```tsx
onCreate={() => { setModalError(""); setActiveUser(null); setFormMode("create"); }}
onEdit={(user) => { setModalError(""); setActiveUser(user); setFormMode("edit"); }}
onAssignRoles={(user) => { setModalError(""); setActiveUser(user); setAssignmentMode("roles"); }}
onAssignDepartments={(user) => { setModalError(""); setActiveUser(user); setAssignmentMode("departments"); }}
onDelete={(user) => { setModalError(""); setActiveUser(user); setDeleteOpen(true); }}
```

Render modal components after the panels:

```tsx
<UserFormModal
  open={formMode !== null}
  mode={formMode ?? "create"}
  user={activeUser}
  error={modalError}
  isSaving={saving}
  onClose={() => setFormMode(null)}
  onSubmit={(input) => void saveUser(input)}
/>
<UserAssignmentModal
  open={assignmentMode !== null}
  title={assignmentMode === "roles" ? "Assign roles" : "Assign departments"}
  user={activeUser}
  options={assignmentMode === "roles" ? roles : departments}
  selectedNames={assignmentMode === "roles" ? activeUser?.roles ?? [] : activeUser?.departments ?? []}
  error={modalError}
  isSaving={saving}
  onClose={() => setAssignmentMode(null)}
  onSubmit={(ids) => void saveAssignment(ids)}
/>
<DeleteUserModal
  open={deleteOpen}
  user={activeUser}
  error={modalError}
  isSaving={saving}
  onClose={() => setDeleteOpen(false)}
  onConfirm={() => void confirmDelete()}
/>
```

- [ ] **Step 5: Verify mutations compile**

Run: `pnpm lint`

Expected: PASS.

Run: `pnpm build`

Expected: PASS.

---

### Task 5: Browser Verification And Polish

**Files:**
- Modify: `app/dashboard/users/_components/users-page-client.tsx`
- Modify: `app/dashboard/users/_components/user-form-modal.tsx`
- Modify: `app/dashboard/users/_components/user-assignment-modal.tsx`
- Modify: `app/dashboard/users/_components/delete-user-modal.tsx`

**Interfaces:**
- Consumes: completed page.
- Produces: verified desktop/mobile UI and documented outcome.

- [ ] **Step 1: Start dev server**

Run: `pnpm dev`

Expected: local Next dev server starts and reports a localhost URL.

- [ ] **Step 2: Verify no-token state**

Open `/dashboard/users` with no `access_token` in localStorage.

Expected: page shows `Session expired` and a login link.

- [ ] **Step 3: Verify happy path with real backend**

Sign in through `/login`, then open `/dashboard/users`.

Expected: users load from `GET /users`, and role/department options load only when corresponding assignment permissions are present.

- [ ] **Step 4: Verify permission gates**

Use a user account without each action permission, or temporarily inspect by altering the returned permissions in dev tools.

Expected: missing permissions hide their corresponding controls; no disabled misleading controls remain visible.

- [ ] **Step 5: Verify responsive layout**

Check widths around `390px`, `768px`, and desktop.

Expected: table scrolls horizontally on small screens, filters stack without text overlap, modals fit within viewport.

- [ ] **Step 6: Final verification**

Run: `pnpm lint`

Expected: PASS.

Run: `pnpm build`

Expected: PASS.
