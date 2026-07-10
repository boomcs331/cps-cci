"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pagination, usePagination } from "../../../components/ui/pagination";
import { Panel } from "../../../components/ui/panel";
import {
  ApiUnauthorizedError,
  assignUserDepartments,
  assignUserRoles,
  createUser,
  deleteUser,
  getCurrentPermissions,
  getDepartments,
  getRoles,
  getUserManagementApiBaseUrl,
  getUsers,
  hasPermission,
  updateUser,
} from "../../../lib/users";
import {
  USER_MANAGEMENT_PERMISSIONS,
  type AccessControlUser,
  type AccessDepartment,
  type AccessRole,
  type UserFormInput,
} from "../../../types/users";
import { DeleteUserModal } from "./delete-user-modal";
import { UserAssignmentModal } from "./user-assignment-modal";
import { UserFormModal } from "./user-form-modal";
import { UserActionsMenu } from "./user-actions-menu";

type PageStatus = "loading" | "ready" | "session-expired" | "access-denied" | "error";

export function UsersPageClient() {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [token, setToken] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [users, setUsers] = useState<AccessControlUser[]>([]);
  const [roles, setRoles] = useState<AccessRole[]>([]);
  const [departments, setDepartments] = useState<AccessDepartment[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeUser, setActiveUser] = useState<AccessControlUser | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [assignmentMode, setAssignmentMode] = useState<"roles" | "departments" | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

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

      const canAssignRoles = hasPermission(
        nextPermissions,
        USER_MANAGEMENT_PERMISSIONS.assignRole,
      );
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

  const canCreate = hasPermission(permissions, USER_MANAGEMENT_PERMISSIONS.create);
  const canUpdate = hasPermission(permissions, USER_MANAGEMENT_PERMISSIONS.update);
  const canDelete = hasPermission(permissions, USER_MANAGEMENT_PERMISSIONS.delete);
  const canAssignRole = hasPermission(
    permissions,
    USER_MANAGEMENT_PERMISSIONS.assignRole,
  );
  const canAssignDepartment = hasPermission(
    permissions,
    USER_MANAGEMENT_PERMISSIONS.assignDepartment,
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const haystack = [
        user.username,
        user.email,
        user.full_name ?? "",
        user.phone ?? "",
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = haystack.includes(normalizedSearch);
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, search, statusFilter, users]);

  const pagination = usePagination(filteredUsers, 10);

  const handleUnauthorizedMutation = () => {
    window.localStorage.removeItem("access_token");
    setFormMode(null);
    setAssignmentMode(null);
    setDeleteOpen(false);
    setStatus("session-expired");
  };

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
      if (caught instanceof ApiUnauthorizedError) {
        handleUnauthorizedMutation();
        return;
      }

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
      if (caught instanceof ApiUnauthorizedError) {
        handleUnauthorizedMutation();
        return;
      }

      setModalError(
        caught instanceof Error ? caught.message : "Unable to save assignment",
      );
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
      if (caught instanceof ApiUnauthorizedError) {
        handleUnauthorizedMutation();
        return;
      }

      setModalError(caught instanceof Error ? caught.message : "Unable to delete user");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <PageFrame title="User Management">
        <StatePanel
          title="Loading users"
          message="Checking your access and loading user records."
        />
      </PageFrame>
    );
  }

  if (status === "session-expired") {
    return (
      <PageFrame title="User Management">
        <StatePanel title="Session expired" message="Sign in again to manage users.">
          <Link className="font-bold text-[#1057e8]" href="/login">
            Go to login
          </Link>
        </StatePanel>
      </PageFrame>
    );
  }

  if (status === "access-denied") {
    return (
      <PageFrame title="User Management">
        <StatePanel
          title="Access denied"
          message="You need USER_MANAGEMENT_VIEW to open this page."
        />
      </PageFrame>
    );
  }

  if (status === "error") {
    const details =
      process.env.NODE_ENV === "development"
        ? `${error} (${getUserManagementApiBaseUrl()})`
        : error;

    return (
      <PageFrame title="User Management">
        <StatePanel title="Unable to load users" message={details}>
          <button
            type="button"
            onClick={() => void loadUsersPage()}
            className="font-bold text-[#1057e8]"
          >
            Retry
          </button>
        </StatePanel>
      </PageFrame>
    );
  }

  return (
    <PageFrame title="User Management">
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <Panel
          title="Users"
          action={
            canCreate ? (
              <button
                type="button"
                onClick={() => {
                  setModalError("");
                  setActiveUser(null);
                  setFormMode("create");
                }}
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
            onEdit={(user) => {
              setModalError("");
              setActiveUser(user);
              setFormMode("edit");
            }}
            onAssignRoles={(user) => {
              setModalError("");
              setActiveUser(user);
              setAssignmentMode("roles");
            }}
            onAssignDepartments={(user) => {
              setModalError("");
              setActiveUser(user);
              setAssignmentMode("departments");
            }}
            onDelete={(user) => {
              setModalError("");
              setActiveUser(user);
              setDeleteOpen(true);
            }}
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
        selectedNames={
          assignmentMode === "roles"
            ? activeUser?.roles ?? []
            : activeUser?.departments ?? []
        }
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
    </PageFrame>
  );
}

function PageFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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

function UsersTable({
  users,
  canUpdate,
  canDelete,
  canAssignRole,
  canAssignDepartment,
  onEdit,
  onAssignRoles,
  onAssignDepartments,
  onDelete,
}: {
  users: AccessControlUser[];
  canUpdate: boolean;
  canDelete: boolean;
  canAssignRole: boolean;
  canAssignDepartment: boolean;
  onEdit: (user: AccessControlUser) => void;
  onAssignRoles: (user: AccessControlUser) => void;
  onAssignDepartments: (user: AccessControlUser) => void;
  onDelete: (user: AccessControlUser) => void;
}) {
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const closeOpenMenu = () => setOpenMenuUserId(null);

    mediaQuery.addEventListener("change", closeOpenMenu);
    return () => mediaQuery.removeEventListener("change", closeOpenMenu);
  }, []);

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-medium text-slate-500">
        No users match the current filters.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition motion-reduce:transition-none hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-md focus-within:border-blue-200 focus-within:bg-blue-50/60 focus-within:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold text-[#111a34]">
                  {user.full_name?.trim() || user.username}
                </p>
                <p className="truncate text-xs font-semibold text-slate-500">
                  @{user.username}
                </p>
              </div>
              <UserActionsMenu
                menuId={`user-actions-${user.id}-mobile`}
                userName={user.username}
                isOpen={openMenuUserId === `mobile:${user.id}`}
                onOpenChange={(open) =>
                  setOpenMenuUserId(open ? `mobile:${user.id}` : null)
                }
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
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="min-w-0">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</dt>
                <dd className="mt-1 break-words font-medium text-slate-700">{user.email}</dd>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Role</dt>
                  <dd className="mt-1"><RoleBadge role={user.role} /></dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Status</dt>
                  <dd className="mt-1"><StatusBadge status={user.status} /></dd>
                </div>
              </div>
              <div className="min-w-0">
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Departments</dt>
                <dd className="mt-1 break-words font-medium text-slate-700">
                  {user.departments?.length ? user.departments.join(", ") : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Last updated</dt>
                <dd className="mt-1 font-medium text-slate-700">{formatDate(user.updated_at)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-visible rounded-lg border border-slate-200 md:block">
        <table className="w-full border-collapse text-left text-sm">
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
              <tr
                key={user.id}
                className="border-b border-slate-100 transition-colors motion-reduce:transition-none last:border-b-0 hover:bg-blue-50/60 focus-within:bg-blue-50/60"
              >
                <td className="px-4 py-4">
                  <p className="font-bold text-[#111a34]">
                    {user.full_name?.trim() || user.username}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">@{user.username}</p>
                </td>
                <td className="px-4 py-4 font-medium text-slate-700">{user.email}</td>
                <td className="px-4 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-4 font-medium text-slate-700">
                  {user.departments?.length ? user.departments.join(", ") : "-"}
                </td>
                <td className="px-4 py-4 font-medium text-slate-700">
                  {formatDate(user.updated_at)}
                </td>
                <td className="px-4 py-4">
                  <UserActionsMenu
                    menuId={`user-actions-${user.id}-desktop`}
                    userName={user.username}
                    isOpen={openMenuUserId === `desktop:${user.id}`}
                    onOpenChange={(open) =>
                      setOpenMenuUserId(open ? `desktop:${user.id}` : null)
                    }
                    canUpdate={canUpdate}
                    canAssignRole={canAssignRole}
                    canAssignDepartment={canAssignDepartment}
                    canDelete={canDelete}
                    onEdit={() => onEdit(user)}
                    onAssignRoles={() => onAssignRoles(user)}
                    onAssignDepartments={() => onAssignDepartments(user)}
                    onDelete={() => onDelete(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AccessLine({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
          enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
        }`}
      >
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

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${classes}`}>
      {role.replace("_", " ")}
    </span>
  );
}

function StatusBadge({ status }: { status: AccessControlUser["status"] }) {
  const classes = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-slate-100 text-slate-600",
    LOCKED: "bg-red-100 text-red-700",
  }[status];

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${classes}`}>
      {status}
    </span>
  );
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
