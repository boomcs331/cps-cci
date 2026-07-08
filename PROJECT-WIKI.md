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
- **Status:** ยังเป็น project template เริ่มต้น มีเพียงหน้า `/` (Home)

---

## 2. Architecture & Module Relationships

### 2.1 Directory Structure (Current)

```
d:\Project-2026\Project-CCI\cps/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (font, metadata, html/body)
│   ├── page.tsx                  # Home page ("/")
│   ├── globals.css               # Tailwind v4 + CSS variables
│   └── favicon.ico               # Favicon
├── public/                       # Static assets
├── next.config.ts                # Next.js config (currently empty)
├── package.json                  # Dependencies & scripts
├── pnpm-workspace.yaml           # pnpm workspace + onlyBuiltDependencies
├── postcss.config.mjs            # Tailwind PostCSS plugin
├── tsconfig.json                 # TypeScript config
├── eslint.config.mjs             # ESLint config
├── README.md                     # create-next-app default README
├── AGENTS.md                     # Next.js agent rules (READ BEFORE CODE)
└── PROJECT-WIKI.md               # This file
```

### 2.2 Module Mapping

| Module | Path | Responsibility | Depends On |
|--------|------|----------------|------------|
| Root Layout | `app/layout.tsx` | กำหนด font, metadata, html/body structure | `next/font/google`, `globals.css` |
| Home Page | `app/page.tsx` | แสดงหน้า landing page `/` | `next/image` |
| Global Styles | `app/globals.css` | Tailwind v4 import, theme variables, dark mode | `tailwindcss` |
| Next.js Config | `next.config.ts` | ตั้งค่า Next.js | - |
| pnpm Workspace | `pnpm-workspace.yaml` | อนุญาต native builds (sharp, unrs-resolver) | - |

### 2.3 Data Flow (Current)

```
app/layout.tsx
    └── wraps → app/page.tsx
        └── uses → next/image
        └── uses → /next.svg, /vercel.svg
        └── styled by → globals.css (Tailwind v4)
```

> **Note:** ปัจจุบันยังไม่มี API routes, Server Actions, database, state management, หรือ module ภายนอก

---

## 3. API Documentation

### 3.1 External APIs

| Service | Endpoint / URL | Usage | Where Used |
|---------|---------------|-------|------------|
| Next.js Templates | `https://vercel.com/templates?framework=next.js` | Link in Home page | `app/page.tsx` |
| Next.js Learn | `https://nextjs.org/learn` | Link in Home page | `app/page.tsx` |
| Vercel Deploy | `https://vercel.com/new` | Link in Home page | `app/page.tsx` |
| Next.js Docs | `https://nextjs.org/docs` | Link in Home page | `app/page.tsx` |

### 3.2 Internal APIs (Next.js App Router)

ยังไม่มี API Routes หรือ Server Actions ใด ๆ

### 3.3 API Naming & Validation Rules

- API Route ใหม่ต้องสร้างใน `app/api/...`
- ใช้ HTTP method ตาม REST convention (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- ต้อง validate input ทุก request ด้วย Zod หรือ library ที่เหมาะสม
- ต้อง handle error อย่างน้อย `400`, `401`, `500`

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

- ยังไม่มี business rules ที่ต้อง validate
- หากมี form ให้เพิ่ม validation schema ในไฟล์นี้

---

## 5. Workflow Guide

### 5.1 Development Workflow

```bash
# 1. Install dependencies
pnpm install

# 2. Run development server
pnpm dev

# 3. Open http://localhost:3000
```

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
| 2026-07-08 | Removed ignored `pnpm.onlyBuiltDependencies` from `package.json`; build allowlist remains in `pnpm-workspace.yaml`, and local `.pnpm-store/` is ignored | AI Assistant |
| 2026-07-08 | Added AI Context Loop Prompt template for project-aware AI implementation | AI Assistant |
| 2026-07-08 | Created PROJECT-WIKI.md | AI Assistant |
| 2026-07-08 | Fixed `pnpm-workspace.yaml` to allow builds for sharp & unrs-resolver | AI Assistant |

---

## 8. Open Questions / TODO

- [ ] กำหนด business domain ของโปรเจกต์ให้ชัดเจน
- [ ] ออกแบบ data model / API contract
- [ ] เลือก state management หากจำเป็น (React Context, Zustand, Jotai, etc.)
- [ ] เลือก database / backend service หากจำเป็น
- [ ] กำหนด testing strategy (unit, integration, e2e)
