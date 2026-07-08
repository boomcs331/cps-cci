import Image from "next/image";
import { LoginForm } from "./login/_components/login-form";
import { FactoryIllustration } from "./login/_components/factory-illustration";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eaf3ff] p-4 sm:p-6 lg:p-8">
      <div className="absolute -left-24 bottom-24 h-72 w-72 rounded-full bg-blue-300/25 blur-3xl" />
      <div className="absolute -right-20 top-8 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rotate-45 bg-blue-300/25" />

      <div className="relative w-full max-w-7xl overflow-hidden rounded-[28px] border border-white/80 bg-white/72 shadow-[0_24px_70px_rgba(15,76,129,0.22)] backdrop-blur">
        <div className="grid min-h-[760px] grid-cols-1 lg:grid-cols-[1.12fr_0.88fr]">
          <section
            className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-white/78 via-blue-50/70 to-blue-200/48 p-14 lg:flex"
            aria-labelledby="login-hero-heading"
          >
            <FactoryIllustration />

            <div className="relative z-10 max-w-xl">
              <Image
                src="/cps-logo.png"
                alt="CPS"
                width={274}
                height={110}
                priority
                className="h-auto w-56"
              />
              <p className="mt-6 text-3xl font-extrabold leading-none text-primary">
                CPS
              </p>
              <h2
                id="login-hero-heading"
                className="mt-4 text-5xl font-extrabold leading-tight text-[#071642]"
              >
                Welcome to CPS
              </h2>
              <p className="mt-3 text-2xl font-bold text-[#1555e8]">
                Production Management System
              </p>
              <p className="mt-7 max-w-lg text-2xl font-medium leading-relaxed text-[#071642]">
                จัดการกระบวนการผลิต ตั้งแต่ Order,
                <br />
                Kanban, FIFO, Stock จนถึง Delivery
              </p>
            </div>

            <div className="relative z-10 text-sm font-medium text-blue-900/45">
              © 2026 CPS Production Management System
            </div>
          </section>

          <section className="flex w-full flex-col items-center justify-center bg-white/34 px-6 py-10 lg:px-12 lg:py-16">
            <LoginForm />
          </section>
        </div>
      </div>
    </main>
  );
}
