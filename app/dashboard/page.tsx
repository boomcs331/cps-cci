"use client";

import {
  Pagination,
  usePagination,
} from "../components/ui/pagination";
import {
  ArrowUpIcon,
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  FactoryIcon,
  GaugeIcon,
  InfoIcon,
  TruckIcon,
  UsersIcon,
  WarningIcon,
} from "./_components/dashboard-icons";

const kpis = [
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

const statusRows = [
  { label: "In Progress", value: "45", percent: "35.2%", color: "#2f6df6" },
  { label: "Completed", value: "38", percent: "29.7%", color: "#39b776" },
  { label: "Planned", value: "25", percent: "19.5%", color: "#f5b12c" },
  { label: "On Hold", value: "12", percent: "9.4%", color: "#ef4444" },
  { label: "Cancelled", value: "8", percent: "6.2%", color: "#c8ced8" },
];

const orders = [
  { no: "PO-250512-001", product: "Gear Assembly", status: "In Progress", qty: "1,200", start: "May 8, 2025", due: "May 15, 2025", progress: 65 },
  { no: "PO-250511-002", product: "Shaft Bearing", status: "In Progress", qty: "800", start: "May 7, 2025", due: "May 14, 2025", progress: 40 },
  { no: "PO-250509-003", product: "Housing Cover", status: "Completed", qty: "1,000", start: "May 1, 2025", due: "May 8, 2025", progress: 100 },
  { no: "PO-250509-004", product: "Pulley Wheel", status: "Planned", qty: "600", start: "May 12, 2025", due: "May 19, 2025", progress: 0 },
  { no: "PO-250508-005", product: "Drive Coupling", status: "On Hold", qty: "500", start: "May 5, 2025", due: "May 16, 2025", progress: 25 },
];

const deliveries = [
  { label: "Delivered", detail: "Orders successfully delivered", value: 86, icon: TruckIcon, tone: "blue" },
  { label: "In Transit", detail: "Orders on the way", value: 24, icon: TruckIcon, tone: "orange" },
  { label: "Pending", detail: "Orders awaiting dispatch", value: 42, icon: ClockIcon, tone: "amber" },
  { label: "Delayed", detail: "Orders delayed", value: 6, icon: WarningIcon, tone: "red" },
];

const toneClasses = {
  blue: "bg-blue-100 text-[#1057e8]",
  green: "bg-emerald-100 text-emerald-600",
  violet: "bg-violet-100 text-violet-700",
  orange: "bg-orange-100 text-orange-600",
  amber: "bg-amber-100 text-amber-600",
  red: "bg-red-100 text-red-500",
};

export default function DashboardPage() {
  const {
    page: ordersPage,
    setPage: setOrdersPage,
    pageSize: ordersPageSize,
    setPageSize: setOrdersPageSize,
    paginatedItems: paginatedOrders,
  } = usePagination(orders, 5);

  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)]">
              <div className="flex items-start gap-4">
                <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${toneClasses[item.tone as keyof typeof toneClasses]}`}>
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

      <section className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <Panel
          title="Production Status Overview"
          action={<span className="flex items-center gap-2 text-sm font-bold text-[#1057e8]">View Details <ChevronRightIcon className="h-5 w-5" /></span>}
        >
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <DonutChart />
            <div className="flex flex-col justify-center gap-5">
              {statusRows.map((row) => (
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

        <Panel
          title="Materials Stock Overview"
          action={<button className="flex h-9 items-center gap-3 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700">Last 7 Days <ChevronDownIcon className="h-4 w-4" /></button>}
        >
          <LineChart />
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.62fr]">
        <Panel title="Recent Production Orders" action={<span className="text-sm font-bold text-[#1057e8]">View All</span>}>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-white text-xs font-bold text-slate-600">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-4">Order No.</th>
                  <th className="px-4 py-4">Product</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Qty</th>
                  <th className="px-4 py-4">Start Date</th>
                  <th className="px-4 py-4">Due Date</th>
                  <th className="px-4 py-4">Progress</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.no} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-4 font-bold text-[#1057e8]">{order.no}</td>
                    <td className="px-4 py-4 font-medium text-slate-700">{order.product}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700">{order.qty}</td>
                    <td className="px-4 py-4 font-medium text-slate-700">{order.start}</td>
                    <td className="px-4 py-4 font-medium text-slate-700">{order.due}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full rounded-full ${progressColor(order.status)}`} style={{ width: `${order.progress}%` }} />
                        </div>
                        <span className="w-9 text-xs font-semibold text-slate-700">{order.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-400">⋮</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Pagination
              page={ordersPage}
              pageSize={ordersPageSize}
              total={orders.length}
              onPageChange={setOrdersPage}
              onPageSizeChange={setOrdersPageSize}
              pageSizeOptions={[5, 10, 20]}
              showJumpToPage
            />
          </div>
        </Panel>

        <Panel title="Delivery Status" action={<span className="text-sm font-bold text-[#1057e8]">View All</span>}>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            {deliveries.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${toneClasses[item.tone as keyof typeof toneClasses]}`}>
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
            <span>Last updated: May 12, 2025 10:30 AM</span>
            <button className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500" aria-label="Refresh delivery status">
              ↻
            </button>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
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

function DonutChart() {
  return (
    <div className="relative mx-auto h-[250px] w-[250px]">
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
        <circle cx="110" cy="110" r="74" fill="none" stroke="#e5e7eb" strokeWidth="48" />
        <circle cx="110" cy="110" r="74" fill="none" stroke="#2f6df6" strokeWidth="48" strokeDasharray="164 465" strokeDashoffset="0" />
        <circle cx="110" cy="110" r="74" fill="none" stroke="#39b776" strokeWidth="48" strokeDasharray="139 465" strokeDashoffset="-170" />
        <circle cx="110" cy="110" r="74" fill="none" stroke="#f5b12c" strokeWidth="48" strokeDasharray="91 465" strokeDashoffset="-314" />
        <circle cx="110" cy="110" r="74" fill="none" stroke="#ef4444" strokeWidth="48" strokeDasharray="44 465" strokeDashoffset="-410" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-3xl font-bold text-[#101831]">128</p>
        <p className="mt-1 text-sm font-medium text-slate-500">Total Orders</p>
      </div>
    </div>
  );
}

function LineChart() {
  return (
    <div className="h-[210px] sm:h-[250px] lg:h-[270px]">
      <svg viewBox="0 0 720 270" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2f6df6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2f6df6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[32, 78, 124, 170, 216].map((y) => (
          <line key={y} x1="54" x2="700" y1={y} y2={y} stroke="#e8edf5" />
        ))}
        <text x="0" y="26" fill="#64748b" fontSize="12" fontWeight="600">Quantity (Units)</text>
        <text x="26" y="36" fill="#64748b" fontSize="12">5K</text>
        <text x="26" y="82" fill="#64748b" fontSize="12">4K</text>
        <text x="26" y="128" fill="#64748b" fontSize="12">3K</text>
        <text x="26" y="174" fill="#64748b" fontSize="12">2K</text>
        <text x="26" y="220" fill="#64748b" fontSize="12">1K</text>
        <text x="38" y="262" fill="#64748b" fontSize="12">0</text>
        <path d="M72 146 L176 119 L280 146 L384 96 L488 68 L592 116 L696 78 L696 236 L72 236 Z" fill="url(#lineFill)" />
        <path d="M72 146 L176 119 L280 146 L384 96 L488 68 L592 116 L696 78" fill="none" stroke="#2f6df6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {[
          [72, 146],
          [176, 119],
          [280, 146],
          [384, 96],
          [488, 68],
          [592, 116],
          [696, 78],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#fff" stroke="#2f6df6" strokeWidth="3" />
        ))}
        {["May 6", "May 7", "May 8", "May 9", "May 10", "May 11", "May 12"].map((label, index) => (
          <text key={label} x={72 + index * 104} y="260" fill="#475569" fontSize="13" textAnchor="middle">{label}</text>
        ))}
        <line x1="54" x2="700" y1="236" y2="236" stroke="#e2e8f0" />
        <line x1="54" x2="54" y1="32" y2="236" stroke="#e2e8f0" />
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === "Completed"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Planned"
        ? "bg-orange-100 text-orange-700"
        : status === "On Hold"
          ? "bg-red-100 text-red-600"
          : "bg-blue-100 text-[#1057e8]";

  return (
    <span className={`rounded-md px-3 py-1 text-xs font-bold ${classes}`}>
      {status}
    </span>
  );
}

function progressColor(status: string) {
  if (status === "Completed") return "bg-emerald-500";
  if (status === "On Hold") return "bg-red-500";
  if (status === "Planned") return "bg-slate-300";
  return "bg-[#1057e8]";
}
