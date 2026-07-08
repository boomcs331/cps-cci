import { ArrowUpIcon } from "./dashboard-icons";
import { toneClasses } from "./dashboard-utils";
import type { KpiCard } from "../../types/dashboard";

type KpiGridProps = {
  items: KpiCard[];
};

export function KpiGrid({ items }: KpiGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)]">
            <div className="flex items-start gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${toneClasses[item.tone]}`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <p className="min-h-10 text-sm font-semibold leading-5 text-slate-600">{item.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[#101831]">{item.value}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm">
              <span className={`flex items-center gap-1 font-bold ${item.alert ? "text-red-500" : "text-emerald-600"}`}>
                <ArrowUpIcon className="h-4 w-4" />
                {item.trend}
              </span>
              <span className="font-medium text-slate-500">vs last month</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
