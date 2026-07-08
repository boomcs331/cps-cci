"use client";

import { useEffect, useRef } from "react";

type ModalVariant = "success" | "error" | "warning";
type ModalSize = "m" | "l" | "xl";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: ModalVariant;
  size?: ModalSize;
  title: string;
  description: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const sizeConfig: Record<
  ModalSize,
  {
    dialogWidth: string;
    iconWrapper: string;
    icon: string;
    title: string;
    description: string;
    descriptionMaxWidth: string;
    button: string;
  }
> = {
  m: {
    dialogWidth: "w-[420px]",
    iconWrapper: "size-16",
    icon: "size-8",
    title: "text-xl",
    description: "text-sm",
    descriptionMaxWidth: "max-w-xs",
    button: "h-11 text-sm",
  },
  l: {
    dialogWidth: "w-[520px]",
    iconWrapper: "size-20",
    icon: "size-10",
    title: "text-2xl",
    description: "text-base",
    descriptionMaxWidth: "max-w-sm",
    button: "h-12 text-base",
  },
  xl: {
    dialogWidth: "w-[620px]",
    iconWrapper: "size-24",
    icon: "size-12",
    title: "text-3xl",
    description: "text-lg",
    descriptionMaxWidth: "max-w-md",
    button: "h-14 text-lg",
  },
};

const variantConfig: Record<
  ModalVariant,
  {
    icon: React.ReactNode;
    iconBg: string;
    ringColor: string;
  }
> = {
  success: {
    icon: (
      <svg
        className="size-full text-green-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    iconBg: "bg-green-100",
    ringColor: "ring-green-100",
  },
  error: {
    icon: (
      <svg
        className="size-full text-red-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    iconBg: "bg-red-100",
    ringColor: "ring-red-100",
  },
  warning: {
    icon: (
      <svg
        className="size-full text-amber-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
    iconBg: "bg-amber-100",
    ringColor: "ring-amber-100",
  },
};

export function Modal({
  open,
  onOpenChange,
  variant,
  size = "m",
  title,
  description,
  primaryAction,
  secondaryAction,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const config = variantConfig[variant];
  const sizeStyles = sizeConfig[size];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const handleClose = () => onOpenChange(false);
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onOpenChange]);

  return (
    <dialog
      ref={ref}
      className={`fixed inset-0 z-50 m-auto ${sizeStyles.dialogWidth} min-h-[320px] max-w-none rounded-2xl bg-white p-0 shadow-[0_24px_60px_rgba(0,0,0,0.18)]`}
      onClick={(e) => {
        if (e.target === ref.current) {
          onOpenChange(false);
        }
      }}
    >
      <div className="relative flex min-h-[320px] flex-col items-center justify-between px-8 pb-8 pt-10 text-center">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close"
        >
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center">
          <div
            className={`flex ${sizeStyles.iconWrapper} items-center justify-center rounded-full ring-4 ${config.iconBg} ${config.ringColor}`}
          >
            <div className={sizeStyles.icon}>{config.icon}</div>
          </div>

          <h2 className={`mt-5 font-bold text-slate-900 ${sizeStyles.title}`}>
            {title}
          </h2>
          <p
            className={`mt-2 font-medium leading-relaxed text-slate-500 ${sizeStyles.description} ${sizeStyles.descriptionMaxWidth}`}
          >
            {description}
          </p>
        </div>

        <div className="mt-7 flex w-full gap-3">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className={`flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${sizeStyles.button}`}
            >
              {secondaryAction.label}
            </button>
          )}
          <button
            type="button"
            onClick={primaryAction.onClick}
            className={`flex flex-1 items-center justify-center rounded-lg bg-[#1555e8] px-4 font-bold text-white shadow-[0_8px_20px_rgba(21,85,232,0.22)] transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${sizeStyles.button}`}
          >
            {primaryAction.label}
          </button>
        </div>
      </div>
    </dialog>
  );
}
