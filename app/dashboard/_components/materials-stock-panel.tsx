import { ChevronDownIcon } from "./dashboard-icons";
import { LineChart } from "../../components/charts/line-chart";
import { Panel } from "../../components/ui/panel";

type MaterialsStockPanelProps = {
  data: { label: string; value: number }[];
  title?: string;
};

export function MaterialsStockPanel({ data, title = "Quantity (Units)" }: MaterialsStockPanelProps) {
  return (
    <Panel
      title="Materials Stock Overview"
      action={
        <button className="flex h-9 items-center gap-3 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700">
          Last 7 Days <ChevronDownIcon className="h-4 w-4" />
        </button>
      }
    >
      <LineChart data={data} title={title} />
    </Panel>
  );
}
