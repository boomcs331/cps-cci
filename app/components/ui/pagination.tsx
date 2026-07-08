"use client";

import { useEffect, useMemo, useState } from "react";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showJumpToPage?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
};

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showJumpToPage = false,
  disabled = false,
  isLoading = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const pages = useMemo(() => {
    const items: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
      return items;
    }

    items.push(1);

    let left = Math.max(2, page - 1);
    let right = Math.min(totalPages - 1, page + 1);

    if (page <= 3) {
      left = 2;
      right = Math.min(totalPages - 1, 4);
    } else if (page >= totalPages - 2) {
      left = Math.max(2, totalPages - 3);
      right = totalPages - 1;
    }

    if (left > 2) {
      items.push("...");
    }

    for (let i = left; i <= right; i++) {
      items.push(i);
    }

    if (right < totalPages - 1) {
      items.push("...");
    }

    items.push(totalPages);
    return items;
  }, [page, totalPages]);

  const handlePageClick = (nextPage: number) => {
    if (disabled || isLoading) return;
    onPageChange(nextPage);
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <span className="text-sm font-medium text-slate-500">
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#1057e8]" />
            Loading…
          </span>
        ) : (
          `Showing ${startItem} to ${endItem} of ${total} results`
        )}
      </span>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onPageSizeChange && (
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            Show
            <select
              value={pageSize}
              disabled={disabled || isLoading}
              onChange={(e) => {
                const next = Number(e.target.value);
                onPageSizeChange(next);
              }}
              className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#1057e8] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            rows
          </label>
        )}

        {showJumpToPage && (
          <JumpToPage
            page={page}
            totalPages={totalPages}
            disabled={disabled || isLoading}
            onPageChange={onPageChange}
          />
        )}

        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1 || disabled || isLoading}
            onClick={() => handlePageClick(page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous page"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18L9 12L15 6" />
            </svg>
          </button>

          {pages.map((item, index) =>
            typeof item === "string" ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-sm font-medium text-slate-500"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                disabled={disabled || isLoading}
                onClick={() => handlePageClick(item)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  item === page
                    ? "bg-[#1057e8] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                aria-label={`Page ${item}`}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            disabled={page >= totalPages || disabled || isLoading}
            onClick={() => handlePageClick(page + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next page"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18L15 12L9 6" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}

function JumpToPage({
  page,
  totalPages,
  disabled,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}) {
  const [value, setValue] = useState(String(page));

  useEffect(() => {
    setValue(String(page));
  }, [page]);

  const handleSubmit = () => {
    if (disabled) return;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    const next = Math.max(1, Math.min(totalPages, parsed));
    if (next !== page) {
      onPageChange(next);
    }
    setValue(String(next));
  };

  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
      Go to
      <input
        type="number"
        min={1}
        max={totalPages}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        onBlur={handleSubmit}
        className="h-8 w-14 rounded-md border border-slate-300 px-2 text-center text-sm font-semibold text-slate-700 outline-none transition [appearance:textfield] focus:border-[#1057e8] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </label>
  );
}

export function usePagination<T>(items: T[], defaultPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return {
    page: safePage,
    setPage: handlePageChange,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalPages,
    paginatedItems,
  };
}
