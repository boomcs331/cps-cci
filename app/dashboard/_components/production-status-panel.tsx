import { ChevronRightIcon } from "./dashboard-icons";
import { DonutChart } from "../../components/charts/donut-chart";
import { Panel } from "../../components/ui/panel";
import type { ProductionStatus } from "../../types/dashboard";

type ProductionStatusPanelProps = {
  data: ProductionStatus[];
  centerValue: string;
  centerLabel: string;
};

export function ProductionStatusPanel({
  data,
  centerValue,
  centerLabel,
}: ProductionStatusPanelProps) {
  const chartData = data.map((row) => ({
    value: Number(row.value),
    color: row.color,
    label: row.label,
  }));

  return (
    <Panel
      title="Production Status Overview"
      action={
        <span className="flex items-center gap-2 text-sm font-bold text-[#1057e8]">
          View Details <ChevronRightIcon className="h-5 w-5" />
        </span>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <DonutChart data={chartData} centerValue={centerValue} centerLabel={centerLabel} />
        <div className="flex flex-col justify-center gap-5">
          {data.map((row) => (
            <div key={row.label} className="grid grid-cols-[16px_1fr_auto_auto] items-center gap-4 text-sm">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: row.color }} />
              <span className="font-medium text-[#101831]">{row.label}</span>
              <span className="font-bold text-[#101831]">{row.value}</span>
              <span className="text-slate-500">({row.percent})</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
