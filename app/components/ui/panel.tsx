import { InfoIcon } from "../../dashboard/_components/dashboard-icons";

type PanelProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function Panel({ title, action, children }: PanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.06)] md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4 md:mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#101831]">{title}</h2>
          <InfoIcon className="h-4 w-4 text-slate-400" />
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
