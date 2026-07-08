import type { OrderStatus, Tone } from "../../types/dashboard";

export const toneClasses: Record<Tone, string> = {
  blue: "bg-blue-100 text-[#1057e8]",
  green: "bg-emerald-100 text-emerald-600",
  violet: "bg-violet-100 text-violet-700",
  orange: "bg-orange-100 text-orange-600",
  amber: "bg-amber-100 text-amber-600",
  red: "bg-red-100 text-red-500",
};

export function progressColor(status: OrderStatus): string {
  switch (status) {
    case "In Progress":
      return "bg-[#1057e8]";
    case "Completed":
      return "bg-emerald-500";
    case "Planned":
      return "bg-amber-400";
    case "On Hold":
      return "bg-red-500";
    case "Cancelled":
      return "bg-slate-400";
    default:
      return "bg-slate-400";
  }
}

export function statusBadgeClasses(status: OrderStatus): string {
  switch (status) {
    case "In Progress":
      return "bg-blue-100 text-[#1057e8]";
    case "Completed":
      return "bg-emerald-100 text-emerald-600";
    case "Planned":
      return "bg-amber-100 text-amber-600";
    case "On Hold":
      return "bg-red-100 text-red-500";
    case "Cancelled":
      return "bg-slate-100 text-slate-500";
    default:
      return "bg-slate-100 text-slate-500";
  }
}
