"use client";

import { useEffect, useState } from "react";
import type {
  AccessControlUser,
  AccessUserRole,
  AccessUserStatus,
  UserFormInput,
} from "../../../types/users";

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

export function UserFormModal({
  open,
  mode,
  user,
  error,
  isSaving,
  onClose,
  onSubmit,
}: UserFormModalProps) {
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
        className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#111a34]">
              {mode === "create" ? "Create user" : "Edit user"}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Manage account details and access status.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Username"
            value={form.username}
            onChange={(value) => setForm({ ...form, username: value })}
            required
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm({ ...form, email: value })}
            required
          />
          <Field
            label={mode === "create" ? "Password" : "New password"}
            type="password"
            value={form.password ?? ""}
            onChange={(value) => setForm({ ...form, password: value })}
            required={mode === "create"}
          />
          <Field
            label="Full name"
            value={form.full_name ?? ""}
            onChange={(value) => setForm({ ...form, full_name: value })}
          />
          <Field
            label="Phone"
            value={form.phone ?? ""}
            onChange={(value) => setForm({ ...form, phone: value })}
          />
          <label className="flex flex-col gap-1 text-sm font-bold text-slate-700">
            Role
            <select
              value={form.role}
              onChange={(event) =>
                setForm({ ...form, role: event.target.value as AccessUserRole })
              }
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1057e8] focus:ring-4 focus:ring-blue-100"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-slate-700">
            Status
            <select
              value={form.status}
              onChange={(event) =>
                setForm({ ...form, status: event.target.value as AccessUserStatus })
              }
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1057e8] focus:ring-4 focus:ring-blue-100"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-[#1057e8] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
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
