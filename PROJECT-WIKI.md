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
- **Status:** มีหน้า Login ที่ `/`, Dashboard UI ที่ `/dashboard` พร้อม nested layout/sidebar, และรอเชื่อมต่อ external login API / production data จริง

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
│   │   ├── layout.tsx            # Dashboard shell layout (sidebar + topbar)
│   │   ├── page.tsx              # Dashboard overview content
│   │   └── _components/
│   │       ├── dashboard-shell.tsx # Shared dashboard sidebar/topbar
│   │       └── dashboard-icons.tsx # Inline SVG icon set for dashboard UI
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
| Login Page | `app/page.tsx` | หน้าเข้าสู่ระบบ `/` | `next/image`, `LoginForm`, `FactoryIllustration` |
| Login Form | `app/login/_components/login-form.tsx` | Client Component ฟอร์มเข้าสู่ระบบ | `login` Server Action |
| Login Action | `app/login/actions.ts` | Server Action thin adapter สำหรับ login | `app/lib/auth.ts` |
| Auth Data Access | `app/lib/auth.ts` | ตรวจสอบ demo credentials หรือส่งต่อ external login API | `API_LOGIN_ENDPOINT`, `app/types/auth.ts` |
| Auth Types | `app/types/auth.ts` | Type definitions สำหรับ login credentials/result | - |
| Factory Illustration | `app/login/_components/factory-illustration.tsx` | ภาพประกอบฝั่งซ้ายของหน้า Login | - |
| Dashboard Layout | `app/dashboard/layout.tsx` | Shared layout สำหรับทุกหน้าใต้ `/dashboard` แยก sidebar/topbar ออกจาก page content | `DashboardShell` |
| Dashboard Shell | `app/dashboard/_components/dashboard-shell.tsx` | Sidebar menu, topbar, search, notification, admin profile | `next/image`, `next/link`, dashboard icons, `app/config/navigation` |
| Dashboard Icons | `app/dashboard/_components/dashboard-icons.tsx` | Inline SVG icons สำหรับ dashboard โดยไม่เพิ่ม dependency | - |
| Navigation Config | `app/config/navigation.ts` | กำหนดรายการเมนู sidebar สำหรับ dashboard | dashboard icons |
| Dashboard Page | `app/dashboard/page.tsx` | Async server component ที่ compose dashboard panels | `app/lib/dashboard.ts`, dashboard panel components |
| Dashboard Data Access | `app/lib/dashboard.ts` | คืนข้อมูล dashboard overview (mock ก่อนเชื่อม API) | `app/dashboard/_data/mock-data.ts`, `app/types/dashboard.ts` |
| Dashboard Types | `app/types/dashboard.ts` | Type definitions สำหรับ dashboard domain | - |
| Dashboard Mock Data | `app/dashboard/_data/mock-data.ts` | Static mock data สำหรับ dashboard | `app/types/dashboard.ts`, dashboard icons |
| Modal | `app/components/ui/modal.tsx` | Reusable dialog component สำหรับ Success / Error / Warning | - |
| Modals Preview | `app/modals/page.tsx` | หน้าทดสอบโชว์ modal ทั้ง 3 แบบ | `Modal` |
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
                    └── delegates to → app/lib/auth.ts (data-access layer)
                        └── POST → API_LOGIN_ENDPOINT (external API)
                            └── on success → redirect("/dashboard")
```

> **Note:** ยังไม่มี database, state management, หรือ internal API routes อื่น ๆ การจัดการ token ยังเป็น placeholder รอ confirm API contract

---

## 3. API Documentation

### 3.1 External APIs

| Service | Endpoint / URL | Usage | Where Used |
|---------|---------------|-------|------------|
| External Login API | `API_LOGIN_ENDPOINT` (env var) | ตรวจสอบชื่อผู้ใช้/รหัสผ่าน และคืน token | `app/lib/auth.ts` |

> **Note:** ค่า `API_LOGIN_ENDPOINT` ต้องกำหนดใน `.env` หรือ `.env.local` ก่อนใช้งาน ตัวอย่างอยู่ใน `.env.example`

### 3.2 Internal APIs (Next.js App Router)

| API | Path | Method | Responsibility |
|-----|------|--------|----------------|
| Login Server Action | `app/login/actions.ts` | `POST` (เรียก external) | Thin adapter: รับข้อมูลจากฟอร์ม แล้ว delegate ไปยัง `app/lib/auth.ts` |
| Auth Data Access | `app/lib/auth.ts` | `POST` (เรียก external) | ตรวจสอบ demo credentials หรือส่งต่อ external API จัดการ redirect และคืนผลลัพธ์ |
| Dashboard Data Access | `app/lib/dashboard.ts` | อ่านข้อมูล (async) | คืนข้อมูล dashboard overview; ปัจจุบันใช้ mock data จาก `app/dashboard/_data/mock-data.ts` |

> **Demo Credentials:** สำหรับทดสอบ ใช้ `admin.global` / `Passw0rd!` เพื่อ bypass external API และ return success ทันที

### 3.3 Client Feedback

- `LoginForm` แสดงผลลัพธ์ผ่าน `Modal` component (`app/components/ui/modal.tsx`)
- Login สำเร็จ: แสดง Success modal กด Continue เพื่อไป `/dashboard`
- Login ไม่สำเร็จ: แสดง Error modal พร้อมปุ่ม Try Again / Cancel

### 3.4 Login API Contract (Placeholder)

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

### 3.5 API Naming & Validation Rules

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

### 5.1.3 Modal Component Design

- **Component:** `app/components/ui/modal.tsx`
- **Variants:** `success`, `error`, `warning`
- **Sizes:** `m` (420px), `l` (520px), `xl` (620px) — ความกว้าง fixed ทุกครั้ง
- **Visual style:** การ์ดกลางจอสีขาว มุมมน `rounded-2xl` มีไอคอนวงกลมสีเขียว/แดง/ส้ม ตาม variant, ปุ่มปิดมุมขวาบน, ปุ่ม action ด้านล่าง
- **Success:** ปุ่มเดียวสีน้ำเงิน (`Continue`)
- **Error / Warning:** สองปุ่ม (`Cancel` outline + ปุ่ม primary สีน้ำเงิน)
- **Implementation:** ใช้ native HTML `<dialog>` element + React `useRef` ควบคุม `showModal()` / `close()` แทน shadcn/ui เพราะโปรเจกต์ยังไม่ได้ติดตั้ง shadcn
- **Backdrop:** สไตล์ผ่าน `dialog::backdrop` ใน `app/globals.css`
- **Preview:** `app/modals/page.tsx`

### 5.1.3 Pagination Component

- **File:** `app/components/ui/pagination.tsx`
- **Description:** Reusable pagination controls and state hook สำหรับ table หรือ list ใดก็ได้; รองรับทั้ง client-side และ server-side pagination
- **Exports:**
  - `Pagination` — UI controls รองรับ prev/next, page numbers, ellipsis, page-size dropdown, jump-to-page, status text, loading/disabled state
  - `usePagination<T>(items, defaultPageSize)` — hook จัดการ state `page`, `pageSize`, คำนวณ `paginatedItems` (client-side mode)
- **Props:**
  - `page`, `pageSize`, `total`
  - `onPageChange(page: number)`
  - `onPageSizeChange?(pageSize: number)`
  - `pageSizeOptions?: number[]` (default `[5, 10, 20, 50]`)
  - `showJumpToPage?: boolean` — แสดง input กระโดดไปหน้าที่ต้องการ
  - `disabled?: boolean` — ปิดการใช้งาน controls ทั้งหมด
  - `isLoading?: boolean` — แสดง spinner แทน status text และ disabled ปุ่ม
- **Client-side usage:**
  ```tsx
  const { page, setPage, pageSize, setPageSize, paginatedItems } = usePagination(items, 10);
  // ...
  <Pagination
    page={page}
    pageSize={pageSize}
    total={items.length}
    onPageChange={setPage}
    onPageSizeChange={setPageSize}
    showJumpToPage
  />
  ```
- **Server-side usage:**
  - ใช้ `Pagination` โดยตรง โดยให้ parent จัดการ state และ fetch ข้อมูลจาก server
  - ตัวอย่าง server action:
    ```tsx
    async function fetchOrders(page: number, pageSize: number) {
      "use server";
      const skip = (page - 1) * pageSize;
      const [items, total] = await Promise.all([
        db.order.findMany({ skip, take: pageSize }),
        db.order.count(),
      ]);
      return { items, total };
    }
    ```
  - ตัวอย่าง client:
    ```tsx
    "use client";
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<{ items: Order[]; total: number }>({ items: [], total: 0 });

    useEffect(() => {
      setIsLoading(true);
      fetchOrders(page, pageSize).then((res) => {
        setData(res);
        setIsLoading(false);
      });
    }, [page, pageSize]);

    <Pagination
      page={page}
      pageSize={pageSize}
      total={data.total}
      onPageChange={setPage}
      onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
      isLoading={isLoading}
      showJumpToPage
    />
    ```
- **Responsive:** layout เปลี่ยนเป็น column บน mobile, row บน desktop; page-size selector และ jump-to-page ย่อได้

### 5.1.4 Dashboard Design Notes

- **Route:** `/dashboard`
- **Layout split:** Menu/topbar อยู่ใน `app/dashboard/layout.tsx` ผ่าน `DashboardShell`; `app/dashboard/page.tsx` เป็นแค่ composition layer ที่เรียง panel components
- **Architecture:**
  - `app/dashboard/page.tsx` — thin composition layer (server component)
  - `app/dashboard/_components/*` — panel components: `KpiGrid`, `ProductionStatusPanel`, `MaterialsStockPanel`, `OrdersPanel`, `DeliveryPanel`
  - `app/dashboard/_data/mock-data.ts` — static mock data สำหรับ dashboard
  - `app/dashboard/_components/dashboard-utils.ts` — shared helpers (tone classes, status/progress color mapping)
  - `app/config/navigation.ts` — navigation config แยกจาก shell สำหรับ sidebar menu
  - `app/types/dashboard.ts` — domain types: `KpiCard`, `Order`, `DeliveryStatus`, `ProductionStatus`, `LineChartPoint`
  - `app/components/ui/panel.tsx` — reusable card panel wrapper
  - `app/components/charts/donut-chart.tsx` — parameterized donut chart
  - `app/components/charts/line-chart.tsx` — parameterized line chart
- **Reference style:** Light operations dashboard ตามภาพตัวอย่าง, sidebar fixed กว้าง 236px บน desktop, topbar สูง 92px, background `#f6f8fc`, white cards, thin borders, subtle shadows, blue active menu
- **Content blocks:** KPI cards 5 ใบ, production status donut chart, materials stock line chart, recent production orders table, delivery status list
- **Data state:** ตอนนี้ใช้ static mock data ใน `app/dashboard/_data/mock-data.ts`; ต้องเปลี่ยนเป็น data fetching/API เมื่อ backend contract พร้อม โดยสามารถแทนที่ mock-data ด้วย server actions หรือ data layer โดยไม่กระทบ UI
- **Icons:** ใช้ inline SVG ใน `app/dashboard/_components/dashboard-icons.tsx` เพื่อเลี่ยงการเพิ่ม dependency ใหม่โดยไม่จำเป็น
- **Responsive behavior:**
  - Desktop: แสดง sidebar fixed กว้าง 236px
  - Mobile/tablet: ซ่อน sidebar, เปิด/ปิด sidebar ผ่าน slide-out drawer ที่กดจาก hamburger menu บน topbar
  - KPI cards: 1 column บน mobile, 2 columns บน tablet, 5 columns บน desktop
  - Production status + materials stock, orders + delivery: 1 column บน mobile/tablet, 2 columns บน desktop (`xl`)
  - Orders table: ใช้ `overflow-x-auto` เพื่อเลื่อนดูตารางบนหน้าจอเล็ก
  - Line chart: ปรับความสูงตาม breakpoint (`210px` → `250px` → `270px`)

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

### 5.6 External Sharing with ngrok

ใช้ ngrok เพื่อแชร์ local dev server ให้ผู้อื่นเข้าถึงชั่วคราว

1. สมัคร/ลงชื่อเข้าใช้ที่ https://dashboard.ngrok.com/signup
2. ดาวน์โหลด ngrok สำหรับ Windows และเพิ่ม `ngrok.exe` ลงใน PATH
3. ตั้งค่า authtoken ครั้งเดียว:

```bash
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

4. เปิด Next.js dev server:

```bash
pnpm dev
```

5. เปิด tunnel อีก terminal หนึ่ง:

```bash
ngrok http 3000
```

6. คัดลอก URL `https://*.ngrok-free.app` ที่ขึ้นมาแชร์ได้เลย

**หมายเหตุ:**
- URL จะเปลี่ยนทุกครั้งที่รีสตาร์ท ngrok เว้นแต่จะจอง static domain
- ระวังเรื่องความปลอดภัย อย่าแชร์ URL กับคนที่ไม่เกี่ยวข้อง และอย่าเปิดข้อมูลจริง
- หาก Next.js แสดงข้อผิดพลาด **"Invalid Host header"** ให้เพิ่ม allowed host ใน `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  allowedDevHosts: [".ngrok-free.app"],
};
```

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
| 2026-07-08 | Decoupled dashboard navigation config from `DashboardShell` into `app/config/navigation.ts` | AI Assistant |
| 2026-07-08 | Introduced data-access seams: `app/lib/auth.ts` and `app/lib/dashboard.ts`; moved types to `app/types/` | AI Assistant |
| 2026-07-08 | Refactored dashboard into modular feature components with extracted Panel, charts, domain types, and mock data layer | AI Assistant |
| 2026-07-08 | Enhanced Pagination component with jump-to-page input, loading state, disabled state, and server-side pagination support | AI Assistant |
| 2026-07-08 | Made dashboard responsive with mobile slide-out menu, horizontal table scroll, and breakpoint-aware layout | AI Assistant |
| 2026-07-08 | Implemented dashboard reference UI with separated dashboard layout/sidebar, topbar, KPI cards, charts, orders table, and delivery status panels | AI Assistant |
| 2026-07-08 | Updated Modal component with fixed sizes m/l/xl and scalable icon/text/button styles | AI Assistant |
| 2026-07-08 | Added demo login bypass (admin.global / Passw0rd!) with Success/Error modal alerts and redirect to dashboard | AI Assistant |
| 2026-07-08 | Created reusable Modal component with Success, Error, and Warning variants plus preview page | AI Assistant |
| 2026-07-08 | Removed Google Sign In button and divider from login form | AI Assistant |
| 2026-07-08 | Documented external sharing workflow using ngrok in PROJECT-WIKI.md | AI Assistant |
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
