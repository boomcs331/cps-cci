import {
  BoxIcon,
  FactoryIcon,
  GaugeIcon,
  TruckIcon,
  UsersIcon,
  WarningIcon,
  ClockIcon,
} from "../_components/dashboard-icons";
import type {
  DeliveryStatus,
  KpiCard,
  Order,
  ProductionStatus,
} from "../../types/dashboard";

export const kpis: KpiCard[] = [
  {
    label: "Total Users",
    value: "1,248",
    trend: "12.5%",
    icon: UsersIcon,
    tone: "blue",
  },
  {
    label: "Materials in Stock",
    value: "3,568",
    trend: "8.3%",
    icon: BoxIcon,
    tone: "green",
  },
  {
    label: "Active Production Orders",
    value: "128",
    trend: "5.6%",
    icon: FactoryIcon,
    tone: "violet",
  },
  {
    label: "Pending Deliveries",
    value: "42",
    trend: "3.2%",
    icon: TruckIcon,
    tone: "orange",
    alert: true,
  },
  {
    label: "Production Efficiency",
    value: "92.4%",
    trend: "4.7%",
    icon: GaugeIcon,
    tone: "blue",
  },
];

export const productionStatus: ProductionStatus[] = [
  { label: "In Progress", value: "45", percent: "35.2%", color: "#2f6df6" },
  { label: "Completed", value: "38", percent: "29.7%", color: "#39b776" },
  { label: "Planned", value: "25", percent: "19.5%", color: "#f5b12c" },
  { label: "On Hold", value: "12", percent: "9.4%", color: "#ef4444" },
  { label: "Cancelled", value: "8", percent: "6.2%", color: "#c8ced8" },
];

export const orders: Order[] = [
  { no: "PO-250512-001", product: "Gear Assembly", status: "In Progress", qty: "1,200", start: "May 8, 2025", due: "May 15, 2025", progress: 65 },
  { no: "PO-250511-002", product: "Shaft Bearing", status: "In Progress", qty: "800", start: "May 7, 2025", due: "May 14, 2025", progress: 40 },
  { no: "PO-250509-003", product: "Housing Cover", status: "Completed", qty: "1,000", start: "May 1, 2025", due: "May 8, 2025", progress: 100 },
  { no: "PO-250509-004", product: "Pulley Wheel", status: "Planned", qty: "600", start: "May 12, 2025", due: "May 19, 2025", progress: 0 },
  { no: "PO-250508-005", product: "Drive Coupling", status: "On Hold", qty: "500", start: "May 5, 2025", due: "May 16, 2025", progress: 25 },
];

export const deliveries: DeliveryStatus[] = [
  { label: "Delivered", detail: "Orders successfully delivered", value: 86, icon: TruckIcon, tone: "blue" },
  { label: "In Transit", detail: "Orders on the way", value: 24, icon: TruckIcon, tone: "orange" },
  { label: "Pending", detail: "Orders awaiting dispatch", value: 42, icon: ClockIcon, tone: "amber" },
  { label: "Delayed", detail: "Orders delayed", value: 6, icon: WarningIcon, tone: "red" },
];

export const materialsStock = [
  { label: "Mon", value: 3200 },
  { label: "Tue", value: 3450 },
  { label: "Wed", value: 3100 },
  { label: "Thu", value: 3800 },
  { label: "Fri", value: 3568 },
  { label: "Sat", value: 4000 },
  { label: "Sun", value: 4200 },
];
