"use client";

import { Pagination, usePagination } from "../../components/ui/pagination";
import { Panel } from "../../components/ui/panel";
import { progressColor, statusBadgeClasses } from "./dashboard-utils";
import type { Order } from "../../types/dashboard";

type OrdersPanelProps = {
  orders: Order[];
  defaultPageSize?: number;
};

function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClasses(status)}`}>
      {status}
    </span>
  );
}

export function OrdersPanel({ orders, defaultPageSize = 5 }: OrdersPanelProps) {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    paginatedItems,
  } = usePagination(orders, defaultPageSize);

  return (
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
            {paginatedItems.map((order) => (
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
          page={page}
          pageSize={pageSize}
          total={orders.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20]}
          showJumpToPage
        />
      </div>
    </Panel>
  );
}
