import { DeliveryPanel } from "./_components/delivery-panel";
import { KpiGrid } from "./_components/kpi-grid";
import { MaterialsStockPanel } from "./_components/materials-stock-panel";
import { OrdersPanel } from "./_components/orders-panel";
import { ProductionStatusPanel } from "./_components/production-status-panel";
import { getDashboardData } from "../lib/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
      <KpiGrid items={data.kpis} />

      <section className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <ProductionStatusPanel
          data={data.productionStatus}
          centerValue="128"
          centerLabel="Total Orders"
        />
        <MaterialsStockPanel data={data.materialsStock} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.62fr]">
        <OrdersPanel orders={data.orders} defaultPageSize={5} />
        <DeliveryPanel items={data.deliveries} lastUpdated={data.lastUpdated} />
      </section>
    </div>
  );
}
