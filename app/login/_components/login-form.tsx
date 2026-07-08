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
      setResult({
        success: false,
        error: "Please enter your email or username and password.",
      });
      return;
    }

    startTransition(async () => {
      const response = await login({ username, password, rememberMe });
      setResult(response);
    });
  }

  return (
    <div className="w-full max-w-[400px] rounded-2xl bg-white px-7 py-8 shadow-[0_18px_48px_rgba(15,76,129,0.16)] sm:px-9 sm:py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <Image
          src="/cps-logo.png"
          alt="CPS"
          width={140}
          height={56}
          className="mb-5 h-auto w-28"
          priority
        />
        <h1 className="text-3xl font-extrabold tracking-tight text-[#071642]">
          Welcome back
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Sign in to continue to your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-bold text-[#071642]"
          >
            Email or Username
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <UserIcon className="h-[18px] w-[18px]" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              disabled={pending}
              placeholder="Enter your email or username"
              className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-4 text-sm font-medium text-[#071642] outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-bold text-[#071642]"
          >
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <LockIcon className="h-[18px] w-[18px]" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              disabled={pending}
              placeholder="Enter your password"
              className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-11 pr-12 text-sm font-medium text-[#071642] outline-none ring-primary/20 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={pending}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 transition-colors hover:text-[#071642] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {showPassword ? (
                <EyeOffIcon className="h-[18px] w-[18px]" />
              ) : (
                <EyeIcon className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="rememberMe"
            className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#071642]"
          >
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              value="true"
              disabled={pending}
              className="h-4 w-4 rounded border-slate-300 text-primary ring-primary/20 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-60"
            />
            Remember me
          </label>
          <a
            href="mailto:support@cps.example.com?subject=Password%20reset"
            className="text-xs font-semibold text-[#1555e8] transition-colors hover:text-primary-hover hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {result?.error && (
          <div
            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
            role="alert"
          >
            {result.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-[#1555e8] px-5 text-base font-bold text-white shadow-[0_10px_22px_rgba(21,85,232,0.2)] transition-all hover:bg-primary-hover hover:shadow-[0_14px_30px_rgba(21,85,232,0.26)] focus-visible:ring-[3px] focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon className="h-4 w-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-500">
          or continue with
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-5 text-sm font-bold text-[#071642] transition-all hover:border-primary/40 hover:shadow-sm focus-visible:ring-[3px] focus-visible:ring-primary/20"
      >
        <GoogleIcon className="h-5 w-5" />
        Sign in with Google
      </button>

      <p className="mt-7 text-center text-xs font-medium text-slate-500">
        Need help?{" "}
        <a
          href="mailto:support@cps.example.com"
          className="font-semibold text-[#1555e8] transition-colors hover:text-primary-hover hover:underline"
        >
          Contact support
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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
