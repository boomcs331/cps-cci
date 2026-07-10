import type {
  AccessControlUser,
  AccessDepartment,
  AccessRole,
  UserAssignmentInput,
  UserFormInput,
  UserManagementPermission,
} from "../types/users";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

export class ApiUnauthorizedError extends Error {
  constructor() {
    super("Session expired");
    this.name = "ApiUnauthorizedError";
  }
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function apiRequest<T>(
  token: string,
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new ApiUnauthorizedError();
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };
    throw new ApiRequestError(
      data.message ?? data.error ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export function getUserManagementApiBaseUrl() {
  return API_BASE_URL;
}

export function hasPermission(
  permissions: string[],
  permission: UserManagementPermission,
) {
  return permissions.includes(permission);
}

export async function getCurrentPermissions(token: string) {
  return apiRequest<string[]>(token, "/auth/me/permissions");
}

export async function getUsers(token: string) {
  return apiRequest<AccessControlUser[]>(token, "/users");
}

export async function getRoles(token: string) {
  return apiRequest<AccessRole[]>(token, "/roles");
}

export async function getDepartments(token: string) {
  return apiRequest<AccessDepartment[]>(token, "/departments");
}

export async function createUser(token: string, input: UserFormInput) {
  return apiRequest<AccessControlUser>(token, "/users", {
    method: "POST",
    body: input,
  });
}

export async function updateUser(token: string, id: string, input: UserFormInput) {
  const { password, ...rest } = input;
  return apiRequest<AccessControlUser>(token, `/users/${id}`, {
    method: "PATCH",
    body: password ? input : rest,
  });
}

export async function deleteUser(token: string, id: string) {
  return apiRequest<void>(token, `/users/${id}`, {
    method: "DELETE",
  });
}

export async function assignUserRoles(token: string, id: string, roleIds: string[]) {
  return apiRequest<AccessControlUser>(token, `/users/${id}/roles`, {
    method: "PATCH",
    body: { ids: roleIds } satisfies UserAssignmentInput,
  });
}

export async function assignUserDepartments(
  token: string,
  id: string,
  departmentIds: string[],
) {
  return apiRequest<AccessControlUser>(token, `/users/${id}/departments`, {
    method: "PATCH",
    body: { ids: departmentIds } satisfies UserAssignmentInput,
  });
}
