import { ChevronRightIcon } from "./dashboard-icons";
import { toneClasses } from "./dashboard-utils";
import { Panel } from "../../components/ui/panel";
import type { DeliveryStatus } from "../../types/dashboard";

type DeliveryPanelProps = {
  items: DeliveryStatus[];
  lastUpdated: string;
};

export function DeliveryPanel({ items, lastUpdated }: DeliveryPanelProps) {
  return (
    <Panel title="Delivery Status" action={<span className="text-sm font-bold text-[#1057e8]">View All</span>}>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${toneClasses[item.tone]}`}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#101831]">{item.label}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{item.detail}</p>
              </div>
              <p className={`text-2xl font-bold ${item.tone === "red" ? "text-red-500" : item.tone === "orange" ? "text-orange-600" : "text-[#1057e8]"}`}>
                {item.value}
              </p>
              <ChevronRightIcon className="h-5 w-5 text-slate-500" />
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Last updated: {lastUpdated}</span>
        <button className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500" aria-label="Refresh delivery status">
          ↻
        </button>
      </div>
    </Panel>
  );
}
