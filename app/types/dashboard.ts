import type { ComponentType } from "react";

export type Tone = "blue" | "green" | "violet" | "orange" | "amber" | "red";

export type KpiCard = {
  label: string;
  value: string;
  trend: string;
  icon: ComponentType<{ className?: string }>;
  tone: Tone;
  alert?: boolean;
};

export type ProductionStatus = {
  label: string;
  value: string;
  percent: string;
  color: string;
};

export type OrderStatus = "In Progress" | "Completed" | "Planned" | "On Hold" | "Cancelled";

export type Order = {
  no: string;
  product: string;
  status: OrderStatus;
  qty: string;
  start: string;
  due: string;
  progress: number;
};

export type DeliveryStatus = {
  label: string;
  detail: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  tone: Tone;
};

export type LineChartPoint = {
  label: string;
  value: number;
};
