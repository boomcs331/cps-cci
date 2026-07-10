export const USER_MANAGEMENT_PERMISSIONS = {
  view: "USER_MANAGEMENT_VIEW",
  create: "USER_MANAGEMENT_CREATE",
  update: "USER_MANAGEMENT_UPDATE",
  delete: "USER_MANAGEMENT_DELETE",
  assignRole: "USER_MANAGEMENT_ASSIGN_ROLE",
  assignDepartment: "USER_MANAGEMENT_ASSIGN_DEPARTMENT",
} as const;

export type UserManagementPermission =
  (typeof USER_MANAGEMENT_PERMISSIONS)[keyof typeof USER_MANAGEMENT_PERMISSIONS];

export type AccessUserRole = "SUPER_ADMIN" | "ADMIN" | "USER";
export type AccessUserStatus = "ACTIVE" | "INACTIVE" | "LOCKED";

export type AccessControlUser = {
  id: string;
  username: string;
  email: string;
  role: AccessUserRole;
  status: AccessUserStatus;
  full_name?: string | null;
  phone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  roles?: string[];
  departments?: string[];
};

export type AccessRole = {
  id: string;
  name: string;
  description?: string | null;
  is_system?: boolean;
  is_active?: boolean;
};

export type AccessDepartment = {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type UserFormInput = {
  username: string;
  email: string;
  password?: string;
  full_name?: string;
  phone?: string;
  role: AccessUserRole;
  status: AccessUserStatus;
};

export type UserAssignmentInput = {
  ids: string[];
};
