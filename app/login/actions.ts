"use server";

import { authenticate } from "../lib/auth";
import type { LoginCredentials, LoginResult } from "../types/auth";

/**
 * Server Action for login.
 *
 * Thin adapter that delegates authentication logic to the auth data-access layer
 * in `app/lib/auth.ts`. This keeps the server-action surface small and makes the
 * authentication rules testable outside of React components.
 *
 * Note: Do not re-export types from this file. Next.js server actions can fail
 * at runtime when types are re-exported from the action module. Import types
 * directly from `app/types/auth.ts` instead.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  return authenticate(credentials);
}
