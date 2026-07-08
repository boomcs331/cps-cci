# PROJECT-WIKI.md — CPS (Next.js 16 + React 19 + Tailwind CSS 4)

> **Source of Truth สำหรับทุกการ Implement**
>
> ก่อนเริ่ม implement ใด ๆ ให้ AI อ่านไฟล์นี้ให้เข้าใจก่อนเสมอ หากมีข้อสงสัย ให้ถามผู้ใช้ก่อนแก้ไขโค้ด

---

## 1. Project Overview

- **Name:** `cps`
- **Type:** Next.js App Router (Web Application)
- **Framework:** Next.js `16.2.10`, React `19.2.4`, React DOM `19.2.4`
- **Styling:** Tailwind CSS `v4`, PostCSS
- **Font:** Geist + Geist Mono (via `next/font/google`)
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Status:** มีหน้า Login ที่ `/` และหน้า Dashboard placeholder ที่ `/dashboard` รอเชื่อมต่อ external login API

---

## 2. Architecture & Module Relationships

### 2.1 Directory Structure (Current)

```
d:\Project-2026\Project-CCI\cps/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (font, metadata, html/body)
│   ├── page.tsx                  # Login page ("/")
│   ├── globals.css               # Tailwind v4 + CPS theme tokens
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard placeholder
│   ├── login/
│   │   ├── actions.ts            # Server Action สำหรับ external login API
│   │   └── _components/
│   │       ├── login-form.tsx    # Client Component form
│   │       └── production-line.tsx # Decorative left-panel illustration
│   └── favicon.ico               # Favicon
├── public/                       # Static assets
│   └── cps-logo.png              # Logo หลักของระบบ
├── .env                          # Local environment variables
├── .env.example                  # Environment variable template
├── next.config.ts                # Next.js config (currently empty)
├── package.json                  # Dependencies & scripts
├── pnpm-workspace.yaml           # pnpm workspace + onlyBuiltDependencies
├── postcss.config.mjs            # Tailwind PostCSS plugin
├── tsconfig.json                 # TypeScript config
├── eslint.config.mjs             # ESLint config
├── docs/
│   └── AI-CONTEXT-LOOP-PROMPT.md # Prompt template สำหรับ AI
├── README.md                     # create-next-app default README
├── AGENTS.md                     # Next.js agent rules (READ BEFORE CODE)
└── PROJECT-WIKI.md               # This file
```

### 2.2 Module Mapping

| Module | Path | Responsibility | Depends On |
|--------|------|----------------|------------|
| Root Layout | `app/layout.tsx` | กำหนด font, metadata, html/body structure | `next/font/google`, `globals.css` |
| Login Page | `app/page.tsx` | หน้าเข้าสู่ระบบ `/` | `next/image`, `LoginForm`, `ProductionLine` |
| Login Form | `app/login/_components/login-form.tsx` | Client Component ฟอร์มเข้าสู่ระบบ | `login` Server Action |
| Login Action | `app/login/actions.ts` | Server Action เรียก external login API | `API_LOGIN_ENDPOINT` |
| Production Line | `app/login/_components/production-line.tsx` | ภาพประกอบฝั่งซ้ายของหน้า Login | - |
| Dashboard Page | `app/dashboard/page.tsx` | หน้าหลักหลัง login สำเร็จ | - |
| Global Styles | `app/globals.css` | Tailwind v4 import + CPS theme tokens | `tailwindcss` |
| Next.js Config | `next.config.ts` | ตั้งค่า Next.js | - |
| pnpm Workspace | `pnpm-workspace.yaml` | อนุญาต native builds (sharp, unrs-resolver) | - |

### 2.3 Data Flow (Current)

```
app/layout.tsx
    └── wraps → app/page.tsx
        ├── Left panel
        │   └── uses → FactoryIllustration (decorative SVG)
        │   └── uses → /cps-logo.png
        └── Right panel
            └── uses → LoginForm (Client Component)
                └── on submit → app/login/actions.ts (Server Action)
                    └── POST → API_LOGIN_ENDPOINT (external API)
                        └── on success → redirect("/dashboard")
```

> **Note:** ยังไม่มี database, state management, หรือ internal API routes อื่น ๆ การจัดการ token ยังเป็น placeholder รอ confirm API contract

---

## 3. API Documentation

### 3.1 External APIs

| Service | Endpoint / URL | Usage | Where Used |
|---------|---------------|-------|------------|
| External Login API | `API_LOGIN_ENDPOINT` (env var) | ตรวจสอบชื่อผู้ใช้/รหัสผ่าน และคืน token | `app/login/actions.ts` |

> **Note:** ค่า `API_LOGIN_ENDPOINT` ต้องกำหนดใน `.env` หรือ `.env.local` ก่อนใช้งาน ตัวอย่างอยู่ใน `.env.example`

### 3.2 Internal APIs (Next.js App Router)

| API | Path | Method | Responsibility |
|-----|------|--------|----------------|
| Login Server Action | `app/login/actions.ts` | `POST` (เรียก external) | รับข้อมูลจากฟอร์ม ส่งต่อไปยัง external API และ redirect เมื่อสำเร็จ |

### 3.3 Login API Contract (Placeholder)

**Request:**
```json
POST {API_LOGIN_ENDPOINT}
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "rememberMe": true
}
```

**Expected Success Response:**
```json
{
  "accessToken": "string",
  "refreshToken": "string?",
  "expiresIn": 10800,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

**Expected Error Response:**
```json
{
  "message": "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
  "error": "string?"
}
```

> **TODO:** ปรับ contract นี้ให้ตรงกับ external API จริงเมื่อทราบรายละเอียด

### 3.4 API Naming & Validation Rules

- Internal API Route ใหม่ต้องสร้างใน `app/api/...`
- Server Action สำหรับ auth ควรอยู่ใน `app/login/actions.ts`
- ใช้ HTTP method ตาม REST convention (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- ต้อง validate input ทุก request ด้วย Zod หรือ library ที่เหมาะสม
- ต้อง handle error อย่างน้อย `400`, `401`, `500`
- ห้าม expose ค่า `API_LOGIN_ENDPOINT` ไปยัง client-side code (ใช้ Server Action)

---

## 4. Requirements & Validation Rules

### 4.1 Tech Stack Requirements

| Layer | Requirement | Status |
|-------|-------------|--------|
| Framework | Next.js 16 App Router | ✅ |
| React | React 19 (RSC/Client Components) | ✅ |
| Styling | Tailwind CSS v4 | ✅ |
| Type Safety | TypeScript strict mode | ✅ |
| Lint | ESLint 9 + `eslint-config-next` | ✅ |
| Package Manager | pnpm | ✅ |

### 4.2 Code Conventions

- ใช้ TypeScript ทุกไฟล์ (`.ts`, `.tsx`)
- ใช้ Tailwind CSS class สำหรับ styling แทน CSS module ยกเว้นมีเหตุผล
- ใช้ `next/image` สำหรับรูปภาพเสมอ
- ใช้ `next/font` สำหรับ font optimization
- ไม่ใช้ `any` โดยไม่จำเป็น
- แบ่ง Client Component ด้วย `"use client"` เฉพาะเมื่อจำเป็นต้องใช้ client-side interactivity

### 4.3 Validation Rules (Business / Data)

#### Login Form Validation

- ชื่อผู้ใช้/อีเมล และรหัสผ่าน ห้ามเป็นค่าว่าง (client-side + server-side)
- ชื่อผู้ใช้/อีเมล จะ trim whitespace ก่อนส่ง
- `rememberMe` เป็นค่า boolean (ส่งผลต่อ session duration 3 ชั่วโมง ฝั่ง backend)
- รหัสผ่าร ยังไม่มี constraint เพิ่มเติม รอ confirm จาก external API

#### API Validation

- Server Action ต้องตรวจสอบว่า `API_LOGIN_ENDPOINT` ถูกตั้งค่าก่อนเรียก
- Response ที่ไม่ใช่ 2xx ต้อง parse error message อย่างปลอดภัย
- ต้อง handle network error ด้วยข้อความที่เข้าใจง่าย

---

## 5. Workflow Guide

### 5.1 Development Workflow

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env
# แล้วแก้ไข API_LOGIN_ENDPOINT ให้ตรงกับ external API

# 3. Run development server
pnpm dev

# 4. Open http://localhost:3000
```

### 5.1.1 Login Page Design Notes

- **Layout:** การ์ด login แบบ split-screen บน desktop (`lg:` breakpoint), แสดงแค่ฝั่งขวาบน mobile/tablet
- **Color palette:** โทนฟ้าอ่อน (light blue gradient) + ขาว + น้ำเงิน `#0F4C81` สำหรับ accent
- **Typography:** Geist Sans สำหรับ body/heading
- **Signature element:** ภาพโรงงานฟ้าอ่อนแบบ reference พร้อมแขนโรบอท กล่องสินค้า รถบรรทุก ตึกโรงงาน ปล่องควัน และคลื่น foreground ที่ซ้อนกันแบบโปร่งแสง
- **Card style:** การ์ดสีขาว มุมมน มีเงา โลโก้อยู่กึ่งกลางด้านบน
- **Accessibility:** visible labels, focus rings, password visibility toggle, error alerts with `role="alert"`

### 5.1.2 Current Login Animation Design

- **Component:** `app/login/_components/factory-illustration.tsx`
- **Intent:** The left-panel animation should closely follow the provided reference image: soft, low-contrast, industrial, and secondary to the hero copy.
- **Scene:** A pale blue factory silhouette sits along the lower part of the hero with smokestacks, a robotic arm, moving boxes, a small service robot, a truck, translucent smoke, dot-grid detail, and layered wave foreground.
- **Motion loop:** The robot breathes subtly, packages drift along the production line, the truck slides slightly, the small robot moves in place, the factory skyline gently lifts, and smoke rises from the stacks.
- **CSS hooks:** Motion tokens live in `app/globals.css` under Tailwind v4 `@theme inline`: `animate-reference-robot`, `animate-package-flow`, `animate-truck-drift`, `animate-stack-smoke`, `animate-factory-breathe`, and `animate-mini-robot`.
- **Accessibility:** The illustration remains `aria-hidden="true"` and global `prefers-reduced-motion: reduce` disables long-running animation for users who request reduced motion.

### 5.2 Build Workflow

```bash
pnpm build
```

### 5.3 Lint Workflow

```bash
pnpm lint
```

### 5.4 Adding a New Feature

1. อ่าน `PROJECT-WIKI.md` (ไฟล์นี้) และ `AGENTS.md` ก่อน
2. ออกแบบ module / API / validation ที่จะเพิ่ม
3. อัปเดต `PROJECT-WIKI.md` ให้สะท้อนการเปลี่ยนแปลง
4. Implement feature
5. รัน `pnpm lint` และ `pnpm build` ให้ผ่าน
6. ทดสอบด้วย browser หรือ automated test

### 5.5 AI Implementation Workflow

1. อ่าน `AGENTS.md` ก่อน (มี Next.js breaking changes warning)
2. อ่าน `PROJECT-WIKI.md` นี้
3. ใช้ Context Loop Prompt ใน `docs/AI-CONTEXT-LOOP-PROMPT.md` สำหรับงาน implement หรือวิเคราะห์โปรเจกต์
4. สรุปสิ่งที่เข้าใจก่อน implement
5. ถามผู้ใช้หาก requirement ไม่ชัดเจน
6. Implement ตาม conventions ใน section 4
7. อัปเดต `PROJECT-WIKI.md` หากมี module / API / validation / data flow / workflow ใหม่

---

## 6. Implementation Notes for AI

- **ALWAYS** read `AGENTS.md` and `PROJECT-WIKI.md` before writing code
- **NEVER** assume Next.js APIs from training data; check `node_modules/next/dist/docs/` if unsure
- **ALWAYS** prefer minimal changes; avoid over-engineering
- **ALWAYS** update this WIKI when adding new modules, APIs, or validation rules
- **NEVER** delete or weaken tests without explicit direction
- **ALWAYS** verify with `pnpm lint` and `pnpm build` when possible

---

## 7. Changelog

| Date | Change | By |
|------|--------|-----|
| 2026-07-08 | Reworked login hero animation to match the provided reference image with soft factory silhouette, robotic arm, truck, packages, smokestacks, and layered blue foreground waves | AI Assistant |
| 2026-07-08 | Redesigned login hero animation as a robotic welding production cell with conveyor ticks, traveling weld head, seam draw, spark shower, and reduced-motion support | AI Assistant |
| 2026-07-08 | Added subtle SVG animations to login page illustration (smoke, dots, robotic arm, conveyor) | AI Assistant |
| 2026-07-08 | Redesigned illustration to central connecting robot with animated arms and glowing data beams to surrounding machine nodes | AI Assistant |
| 2026-07-08 | Enhanced login page with animated machinery (rotating gears, conveyor, robotic arm) and glowing connection lights between machines | AI Assistant |
| 2026-07-08 | Improved login page background illustration to better match reference image with soft waves and dot grid | AI Assistant |
| 2026-07-08 | Redesigned login page to match reference image: light theme, centered card, factory illustration, and reference-style form | AI Assistant |
| 2026-07-08 | Updated all login page logo references to use `/cps-logo.png` | AI Assistant |
| 2026-07-08 | Implemented Login Page (`/`) with split-screen layout, animated production line illustration, and responsive design | AI Assistant |
| 2026-07-08 | Added Server Action `app/login/actions.ts` with placeholder external login API integration | AI Assistant |
| 2026-07-08 | Created dashboard placeholder at `/dashboard` | AI Assistant |
| 2026-07-08 | Added `.env` and `.env.example` for `API_LOGIN_ENDPOINT` configuration | AI Assistant |
| 2026-07-08 | Updated CPS theme tokens in `app/globals.css` | AI Assistant |
| 2026-07-08 | Removed ignored `pnpm.onlyBuiltDependencies` from `package.json`; build allowlist remains in `pnpm-workspace.yaml`, and local `.pnpm-store/` is ignored | AI Assistant |
| 2026-07-08 | Added AI Context Loop Prompt template for project-aware AI implementation | AI Assistant |
| 2026-07-08 | Created PROJECT-WIKI.md | AI Assistant |
| 2026-07-08 | Fixed `pnpm-workspace.yaml` to allow builds for sharp & unrs-resolver | AI Assistant |

---

## 8. Open Questions / TODO

- [x] กำหนด business domain ของโปรเจกต์ให้ชัดเจน (Production Management System)
- [ ] ยืนยัน external login API endpoint และปรับ contract ใน `app/login/actions.ts`
- [ ] ตัดสินใจวิธีจัดเก็บ token (HttpOnly cookie / sessionStorage / localStorage)
- [ ] เพิ่ม route protection สำหรับ `/dashboard`
- [ ] ออกแบบ data model / API contract สำหรับส่วนอื่น ๆ ของระบบ
- [ ] เลือก state management หากจำเป็น (React Context, Zustand, Jotai, etc.)
- [ ] เลือก database / backend service หากจำเป็น
- [ ] กำหนด testing strategy (unit, integration, e2e)
