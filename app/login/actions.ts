"use server";

import { redirect } from "next/navigation";

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginSuccessResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

const DEMO_USERNAME = "admin.global";
const DEMO_PASSWORD = "Passw0rd!";

/**
 * Server Action for login.
 *
 * For demo purposes, hardcoded credentials (admin.global / Passw0rd!) bypass the
 * external API and return success immediately. In production this bypass must be
 * removed and the real `API_LOGIN_ENDPOINT` must be configured.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  if (
    credentials.username === DEMO_USERNAME &&
    credentials.password === DEMO_PASSWORD
  ) {
    return { success: true };
  }

  const endpoint = process.env.API_LOGIN_ENDPOINT;

  if (!endpoint) {
    return {
      success: false,
      error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };
      return {
        success: false,
        error:
          data.message ??
          data.error ??
          "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      };
    }

    const data = (await response.json()) as LoginSuccessResponse;

    // TODO: Implement secure token storage after API contract is confirmed.
    // Options:
    // 1. Set HttpOnly cookie via Set-Cookie header from external API
    // 2. Use Next.js API route as proxy to set cookie
    // 3. Store in sessionStorage/localStorage only if the token is short-lived
    //    and the app is deployed over HTTPS
    void data;

    redirect("/dashboard");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    return {
      success: false,
      error: "ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาลองใหม่อีกครั้ง",
    };
  }
}
