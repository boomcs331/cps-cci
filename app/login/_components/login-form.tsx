"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { login, type LoginResult } from "../actions";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<LoginResult | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();
    const rememberMe = formData.get("rememberMe") === "true";

    if (!username || !password) {
      setResult({ success: false, error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
      return;
    }

    startTransition(async () => {
      const response = await login({ username, password, rememberMe });
      setResult(response);
    });
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 sm:p-8 lg:max-w-md">
      <div className="mb-8 flex flex-col items-center text-center">
        <Image
          src="/cps-logo.png"
          alt="CPS"
          width={80}
          height={32}
          className="mb-4"
          priority
        />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          ยินดีต้อนรับกลับ
        </h1>
        <p className="mt-2 text-sm text-muted">
          เข้าสู่ระบบเพื่อไปยังแดชบอร์ดของคุณ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username / Email */}
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-foreground"
          >
            ชื่อผู้ใช้หรืออีเมล
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <UserIcon className="h-5 w-5" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              disabled={pending}
              placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
              className="h-12 w-full rounded-lg border border-border bg-input pl-10 pr-4 text-foreground outline-none ring-ring transition-all placeholder:text-muted focus:border-primary focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            รหัสผ่าน
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <LockIcon className="h-5 w-5" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              disabled={pending}
              placeholder="กรอกรหัสผ่าน"
              className="h-12 w-full rounded-lg border border-border bg-input pl-10 pr-11 text-foreground outline-none ring-ring transition-all placeholder:text-muted focus:border-primary focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={pending}
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <label htmlFor="rememberMe" className="flex cursor-pointer items-center gap-2">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              value="true"
              disabled={pending}
              className="h-4 w-4 rounded border-border text-primary ring-ring focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <span className="text-sm text-foreground">จดจำฉัน</span>
          </label>
        </div>

        {/* Error message */}
        {result?.error && (
          <div
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            role="alert"
          >
            {result.error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon className="h-5 w-5 animate-spin" />
              กำลังเข้าสู่ระบบ...
            </span>
          ) : (
            "เข้าสู่ระบบ"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ต้องการความช่วยเหลือ?{" "}
        <a
          href="mailto:support@cps.example.com"
          className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
        >
          ติดต่อฝ่ายสนับสนุน
        </a>
      </p>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
