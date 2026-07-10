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
            type="button"
            disabled={isSaving}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {isSaving ? "Deleting..." : "Delete user"}
          </button>
        </div>
      </div>
    </div>
  );
}
