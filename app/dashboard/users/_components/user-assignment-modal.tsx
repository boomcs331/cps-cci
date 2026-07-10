"use client";

import { useEffect, useState } from "react";
import type {
  AccessControlUser,
  AccessDepartment,
  AccessRole,
} from "../../../types/users";

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

    setSelectedIds(
      options
        .filter((option) => selectedNames.includes(option.name))
        .map((option) => option.id),
    );
  }, [open, options, selectedNames]);

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-[#111a34]">{title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">@{user.username}</p>
        </div>

        <div className="max-h-[320px] space-y-2 overflow-y-auto">
          {options.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-medium text-slate-500">
              No options available.
            </p>
          ) : (
            options.map((option) => {
              const checked = selectedIds.includes(option.id);

              return (
                <label
                  key={option.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setSelectedIds((current) =>
                        checked
                          ? current.filter((id) => id !== option.id)
                          : [...current, option.id],
                      );
                    }}
                  />
                  <span>{option.name}</span>
                </label>
              );
            })
          )}
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
            type="button"
            disabled={isSaving}
            onClick={() => onSubmit(selectedIds)}
            className="rounded-lg bg-[#1057e8] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
