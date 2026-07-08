export type IconName = "users" | "box" | "factory" | "truck" | "clipboard";

export type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  active?: boolean;
  expandable?: boolean;
};

export const dashboardNavigation: NavItem[] = [
  { label: "User Management", href: "/dashboard/users", icon: "users" },
  { label: "Materials", href: "/dashboard/materials", icon: "box" },
  { label: "Productions", href: "/dashboard", icon: "factory", active: true },
  { label: "Delivery", href: "/dashboard/delivery", icon: "truck" },
  { label: "Master Data", href: "/dashboard/master-data", icon: "clipboard", expandable: true },
];
