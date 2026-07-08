import Image from "next/image";
import { LoginForm } from "./login/_components/login-form";
import { FactoryIllustration } from "./login/_components/factory-illustration";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex min-h-[720px] flex-col lg:flex-row">
          {/* Left panel - reference-style hero */}
          <section
            className="relative hidden w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-100/70 via-slate-50/60 to-blue-200/50 p-10 lg:flex lg:w-1/2 lg:p-12"
            aria-labelledby="login-hero-heading"
          >
            <FactoryIllustration />

            <div className="relative z-10">
              <Image
                src="/cps-logo.png"
                alt="CPS"
                width={120}
                height={48}
                priority
              />
              <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-primary">
                CPS
              </p>
              <h2
                id="login-hero-heading"
                className="mt-2 text-3xl font-bold leading-tight text-foreground sm:text-4xl"
              >
                ยินดีต้อนรับสู่ CPS
              </h2>
              <p className="mt-3 text-lg font-medium text-primary">
                Production Management System
              </p>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
                จัดการกระบวนการผลิต ตั้งแต่ Order, Kanban, FIFO, Stock จนถึง Delivery
              </p>
            </div>

            <div className="relative z-10 text-sm text-muted">
              © 2026 CPS Production Management System
            </div>
          </section>

          {/* Right panel - login form */}
          <section className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2 lg:px-12 lg:py-16">
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
}
