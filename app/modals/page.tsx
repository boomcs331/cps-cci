"use client";

import { useState } from "react";
import { Modal } from "../components/ui/modal";

type ModalState = {
  success: boolean;
  error: boolean;
  warning: boolean;
};

type ModalSize = "m" | "l" | "xl";

export default function ModalsPage() {
  const [open, setOpen] = useState<ModalState>({
    success: false,
    error: false,
    warning: false,
  });
  const [size, setSize] = useState<ModalSize>("m");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 p-8">
      <h1 className="text-2xl font-bold text-slate-900">Modal Previews</h1>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-600">Size:</span>
        {(["m", "l", "xl"] as ModalSize[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={`rounded-md px-3 py-1.5 text-sm font-bold transition-colors ${
              size === s
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setOpen((prev) => ({ ...prev, success: true }))}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700"
        >
          Open Success
        </button>
        <button
          type="button"
          onClick={() => setOpen((prev) => ({ ...prev, error: true }))}
          className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
        >
          Open Error
        </button>
        <button
          type="button"
          onClick={() => setOpen((prev) => ({ ...prev, warning: true }))}
          className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
        >
          Open Warning
        </button>
      </div>

      <Modal
        open={open.success}
        onOpenChange={(value) =>
          setOpen((prev) => ({ ...prev, success: value }))
        }
        variant="success"
        size={size}
        title="Success"
        description="Operation completed successfully! Your changes have been saved and applied successfully."
        primaryAction={{
          label: "Continue",
          onClick: () => setOpen((prev) => ({ ...prev, success: false })),
        }}
      />

      <Modal
        open={open.error}
        onOpenChange={(value) =>
          setOpen((prev) => ({ ...prev, error: value }))
        }
        variant="error"
        size={size}
        title="Error"
        description="Something went wrong. We couldn't complete your request. Please try again in a moment."
        primaryAction={{
          label: "Try Again",
          onClick: () => setOpen((prev) => ({ ...prev, error: false })),
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setOpen((prev) => ({ ...prev, error: false })),
        }}
      />

      <Modal
        open={open.warning}
        onOpenChange={(value) =>
          setOpen((prev) => ({ ...prev, warning: value }))
        }
        variant="warning"
        size={size}
        title="Warning"
        description="Are you sure you want to continue? This action may affect related data and cannot be easily reversed."
        primaryAction={{
          label: "Yes, Continue",
          onClick: () => setOpen((prev) => ({ ...prev, warning: false })),
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setOpen((prev) => ({ ...prev, warning: false })),
        }}
      />
    </main>
  );
}
