"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardIcon,
  CloseIcon,
  FactoryIcon,
  MenuIcon,
  SearchIcon,
  TruckIcon,
  UsersIcon,
} from "./dashboard-icons";
import type { IconName, NavItem } from "../../config/navigation";

export function DashboardShell({
  children,
  navItems,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#0b1739]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[236px] border-r border-slate-200/80 bg-white lg:flex lg:flex-col">
        <div className="px-7 pb-7 pt-10">
          <Image
            src="/cps-logo.png"
            alt="CPS"
            width={152}
            height={61}
            priority
            className="h-auto w-[152px]"
          />
          <p className="mt-4 text-xs font-semibold text-slate-500">
            Production Management System
          </p>
        </div>
        <SidebarContent navItems={navItems} onNavigate={() => setMenuOpen(false)} />
      </aside>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] transform border-r border-slate-200/80 bg-white transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pb-5 pt-6">
          <Image
            src="/cps-logo.png"
            alt="CPS"
            width={128}
            height={52}
            priority
            className="h-auto w-[128px]"
          />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <SidebarContent navItems={navItems} onNavigate={() => setMenuOpen(false)} />
      </aside>

      <div className="lg:pl-[236px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur md:h-[92px] md:px-8">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon className="h-7 w-7" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-[#111a34] md:text-3xl">Dashboard</h1>
          </div>

          <div className="hidden flex-1 justify-center px-8 md:flex">
            <label className="relative w-full max-w-[450px]">
              <span className="sr-only">Search</span>
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                placeholder="Search anything..."
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-[#1057e8] focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100" aria-label="Notifications">
              <BellIcon className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                5
              </span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-slate-200 text-sm font-bold text-[#1057e8] ring-2 ring-white">
                AD
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-bold text-[#111a34]">Admin</p>
                <p className="text-xs font-medium text-slate-500">Administrator</p>
              </div>
              <ChevronDownIcon className="hidden h-5 w-5 text-slate-600 sm:block" />
            </div>
          </div>
        </header>

        <main className="p-5 md:p-6">{children}</main>
      </div>
    </div>
  );
}

const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
  users: UsersIcon,
  box: BoxIcon,
  factory: FactoryIcon,
  truck: TruckIcon,
  clipboard: ClipboardIcon,
};

function SidebarContent({
  navItems,
  onNavigate,
}: {
  navItems: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex-1 space-y-2 px-4 pt-5">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={`flex h-[52px] items-center gap-4 rounded-lg px-4 text-sm font-semibold transition ${
                isActive
                  ? "bg-[#1057e8] text-white shadow-[0_12px_26px_rgba(16,87,232,0.22)]"
                  : "text-slate-600 hover:bg-blue-50 hover:text-[#1057e8]"
              }`}
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.expandable ? <ChevronRightIcon className="h-5 w-5" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="m-4 rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 px-5 py-6 text-center">
        <FactoryMiniIllustration />
        <p className="mt-4 text-sm leading-6 text-slate-600">
          CPS helps you streamline production, manage resources, and deliver excellence.
        </p>
        <button className="mt-5 h-10 w-full rounded-md border border-[#1057e8]/45 bg-white text-sm font-semibold text-[#1057e8]">
          Learn More
        </button>
      </div>

      <button className="mx-8 mb-8 flex items-center gap-5 text-sm font-medium text-slate-500">
        <ChevronRightIcon className="h-5 w-5 rotate-180" />
        Collapse
      </button>
    </>
  );
}

function FactoryMiniIllustration() {
  return (
    <svg viewBox="0 0 132 104" className="mx-auto h-24 w-28" aria-hidden="true">
      <circle cx="66" cy="54" r="44" fill="#dbeafe" />
      <path d="M24 84H108" stroke="#bfdbfe" strokeWidth="7" strokeLinecap="round" />
      <path d="M36 76V42L54 54V42L72 54V30H86V76H36Z" fill="#4f8df8" opacity="0.88" />
      <path d="M44 64H50M58 64H64M72 64H78" stroke="#eff6ff" strokeWidth="4" strokeLinecap="round" />
      <path d="M88 26L96 18M98 32H110M88 38L98 48" stroke="#93c5fd" strokeWidth="5" strokeLinecap="round" />
      <circle cx="98" cy="18" r="7" fill="none" stroke="#93c5fd" strokeWidth="5" />
      <circle cx="112" cy="32" r="7" fill="none" stroke="#93c5fd" strokeWidth="5" />
    </svg>
  );
}
