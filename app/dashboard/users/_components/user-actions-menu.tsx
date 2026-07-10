"use client";

import { useEffect, useRef } from "react";

type UserActionsMenuProps = {
  menuId: string;
  userName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  canUpdate: boolean;
  canAssignRole: boolean;
  canAssignDepartment: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onAssignRoles: () => void;
  onAssignDepartments: () => void;
  onDelete: () => void;
};

type MenuAction = {
  label: "Edit" | "Roles" | "Departments" | "Delete";
  enabled: boolean;
  danger?: boolean;
  onSelect: () => void;
};

export function UserActionsMenu({
  menuId,
  userName,
  isOpen,
  onOpenChange,
  canUpdate,
  canAssignRole,
  canAssignDepartment,
  canDelete,
  onEdit,
  onAssignRoles,
  onAssignDepartments,
  onDelete,
}: UserActionsMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pendingFocusIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const pendingFocusIndex = pendingFocusIndexRef.current;
    if (pendingFocusIndex !== null) {
      menuItemRefs.current[pendingFocusIndex]?.focus();
      pendingFocusIndexRef.current = null;
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onOpenChange(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onOpenChange]);

  const actions: MenuAction[] = [
    { label: "Edit", enabled: canUpdate, onSelect: onEdit },
    { label: "Roles", enabled: canAssignRole, onSelect: onAssignRoles },
    {
      label: "Departments",
      enabled: canAssignDepartment,
      onSelect: onAssignDepartments,
    },
    { label: "Delete", enabled: canDelete, danger: true, onSelect: onDelete },
  ];
  const visibleActions = actions.filter((action) => action.enabled);
  const hasStandardActions = visibleActions.some((action) => !action.danger);

  if (visibleActions.length === 0) {
    return <span className="text-xs font-semibold text-slate-400">No actions</span>;
  }

  const selectAction = (action: MenuAction) => {
    onOpenChange(false);
    action.onSelect();
  };

  const focusMenuItem = (index: number) => {
    menuItemRefs.current[index]?.focus();
  };

  const openMenuAndFocus = (index: number) => {
    if (isOpen) {
      focusMenuItem(index);
      return;
    }

    pendingFocusIndexRef.current = index;
    onOpenChange(true);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenuAndFocus(event.key === "ArrowDown" ? 0 : visibleActions.length - 1);
      return;
    }

    if (!isOpen && (event.key === "Enter" || event.key === " ")) {
      pendingFocusIndexRef.current = 0;
    }
  };

  const handleMenuItemKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusMenuItem((index + 1) % visibleActions.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusMenuItem((index - 1 + visibleActions.length) % visibleActions.length);
        break;
      case "Home":
        event.preventDefault();
        focusMenuItem(0);
        break;
      case "End":
        event.preventDefault();
        focusMenuItem(visibleActions.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        onOpenChange(false);
        triggerRef.current?.focus();
        break;
    }
  };

  const handleRootBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget as Node | null;
    if (isOpen && !event.currentTarget.contains(nextFocusedElement)) {
      onOpenChange(false);
    }
  };

  return (
    <div ref={rootRef} onBlur={handleRootBlur} className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => onOpenChange(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm transition motion-reduce:transition-none hover:border-blue-200 hover:bg-blue-50 hover:text-[#1057e8] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        Actions
        <span
          aria-hidden="true"
          className={`size-4 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            className="size-full"
            viewBox="0 0 16 16"
            fill="none"
            focusable="false"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </span>
      </button>
      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label={`Actions for ${userName}`}
          className="absolute right-0 z-10 mt-11 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_16px_35px_rgba(15,23,42,0.16)]"
        >
          {visibleActions.map((action, index) => (
            <div
              key={action.label}
              className={
                action.danger && hasStandardActions
                  ? "mt-1 border-t border-slate-100 pt-1"
                  : ""
              }
            >
              <button
                ref={(element) => {
                  menuItemRefs.current[index] = element;
                }}
                type="button"
                role="menuitem"
                tabIndex={index === 0 ? 0 : -1}
                onClick={() => selectAction(action)}
                onKeyDown={(event) => handleMenuItemKeyDown(event, index)}
                className={`flex w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-200 ${
                  action.danger
                    ? "text-red-600 hover:bg-red-50 focus-visible:ring-red-200"
                    : "text-slate-700 hover:bg-blue-50 hover:text-[#1057e8]"
                }`}
              >
                {action.label}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
