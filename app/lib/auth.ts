import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginCredentials, LoginError, LoginResult, LoginSuccessResponse } from "../types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

/**
 * Authenticate a user against the cps-api backend.
 *
 * Calls POST /auth/login endpoint from cps-api and stores the JWT token
 * in an HttpOnly cookie for secure authentication.
 */
export async function authenticate(credentials: LoginCredentials): Promise<LoginResult | LoginError> {
  console.log("[auth] Attempting login to:", `${API_BASE_URL}/auth/login`);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
      cache: "no-store",
    });

    console.log("[auth] Response status:", response.status);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        statusCode?: number;
        message?: string;
        error?: string;
      };
      console.log("[auth] Error response:", data);
      const error: LoginError = {
        success: false,
        message: data.message ?? data.error ?? "Invalid username or password",
      };
      return error;
    }

    const data = (await response.json()) as LoginSuccessResponse;
    console.log("[auth] Login successful, user:", data.user.username);

    // Store JWT in HttpOnly cookie for security
    const cookieStore = await cookies();
    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes (expires_in is "15m")
      path: "/",
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("[auth] Network error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    const errorResponse: LoginError = {
      success: false,
      message: `Unable to connect to the server (${API_BASE_URL}). Please check if the backend is running.`,
    };
    return errorResponse;
  }
}
