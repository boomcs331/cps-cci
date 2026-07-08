import {
  deliveries,
  kpis,
  materialsStock,
  orders,
  productionStatus,
} from "../dashboard/_data/mock-data";
import type {
  DeliveryStatus,
  KpiCard,
  LineChartPoint,
  Order,
  ProductionStatus,
} from "../types/dashboard";

export type DashboardData = {
  kpis: KpiCard[];
  productionStatus: ProductionStatus[];
  orders: Order[];
  deliveries: DeliveryStatus[];
  materialsStock: LineChartPoint[];
  lastUpdated: string;
};

/**
 * Fetch dashboard overview data.
 *
 * Currently returns static mock data. Replace this implementation with a real
 * API call (e.g., Prisma query, REST API, or tRPC) once the backend contract is
 * ready. The UI components only depend on the returned shape, not the source.
 */
export async function getDashboardData(): Promise<DashboardData> {
  // Simulate a small async delay to mirror real data fetching.
  await new Promise((resolve) => setTimeout(resolve, 0));

  return {
    kpis,
    productionStatus,
    orders,
    deliveries,
    materialsStock,
    lastUpdated: "May 12, 2025 10:30 AM",
  };
}
