# CPS-API Project Wiki

เอกสารนี้เป็นเอกสารครอบคลุมสำหรับโครงการ **cps-api** รวมถึงสถาปัตยกรรม โครงสร้างโปรเจกต์ ฟีเจอร์ API endpoints และคู่มือการติดตั้ง/ใช้งาน

---

## 1. ภาพรวมโปรเจกต์ (Project Overview)

| รายการ | รายละเอียด |
|--------|-----------|
| ชื่อ | cps-api |
| ประเภท | NestJS Backend API |
| ภาษา | TypeScript |
| เวอร์ชัน | 0.0.1 |
| Package Manager | pnpm |
| ฐานข้อมูล | PostgreSQL |
| ORM | TypeORM |
| Schema หลัก | access_control |
| Port เริ่มต้น | 3001 |

โปรเจกต์นี้เป็นระบบ **Access Control API** สำหรับจัดการผู้ใช้งาน สิทธิ์ และการเข้าถึง โดยใช้ NestJS framework เป็นหลัก

---

## 2. สถาปัตยกรรม (Architecture)

### 2.1 Architecture Pattern
โปรเจกต์ใช้ **NestJS Modular Architecture** แบ่งโค้ดออกเป็นส่วนย่อย (Modules) ตาม Feature:

- **Module** - แต่ละ Feature มี Module เป็นของตัวเอง
- **Controller** - รับ HTTP Requests และส่ง Response กลับไป
- **Service** - บรรจุ Business Logic และติดต่อกับ Database
- **Repository** - ใช้ TypeORM Repository ผ่าน Dependency Injection
- **DTO** - Data Transfer Object สำหรับ Validate Input
- **Entity** - โมเดลฐานข้อมูล (TypeORM Entities)
- **Migration** - จัดการ Schema ด้วย TypeORM Migrations

### 2.2 Dependency Flow
```
HTTP Request
    ↓
Controller
    ↓ (เรียกใช้)
Service
    ↓ (เรียกใช้)
TypeORM Repository
    ↓
PostgreSQL Database
```

### 2.3 Config Flow
```
.env
  ↓
ConfigModule (Joi validation)
  ↓
databaseConfig() / useFactory()
  ↓
TypeOrmModule / JwtModule
```

---

## 3. Technology Stack

### 3.1 Core Framework
- **NestJS** (v11.0.1)
- **Express** (v11.0.1) - Platform
- **TypeScript** (v5.7.3)
- **Node.js**

### 3.2 Database & ORM
- **TypeORM** (v0.3.20)
- **pg** (v8.13.1) - PostgreSQL Driver
- **PostgreSQL** Database

### 3.3 Authentication & Security
- **@nestjs/jwt** (v11.0.0) - JWT Token
- **bcryptjs** (v3.0.3) - Hash รหัสผ่าน
- **class-validator** (v0.14.1) - Validate DTO
- **class-transformer** (v0.5.1) - Transform ข้อมูล
- **Joi** (v17.13.3) - Validate Environment Variables

### 3.4 Configuration & Utilities
- **@nestjs/config** (v4.0.0)
- **dotenv** (v16.4.7) - โหลด .env สำหรับ CLI scripts
- **reflect-metadata** (v0.2.2)
- **rxjs** (v7.8.1)

### 3.5 Development Tools
- **@nestjs/cli** (v11.0.0)
- **@nestjs/testing** (v11.0.1)
- **jest** (v30.0.0)
- **ts-jest** (v29.2.5)
- **ts-node** (v10.9.2)
- **eslint** (v9.18.0)
- **prettier** (v3.4.2)

---

## 4. โครงสร้างโปรเจกต์ (Project Structure)

```
cps-api/
├── .agents/                    # AI agent configuration
├── .git/                       # Git repository
├── .gitignore                  # Git ignore rules
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment variables template
├── .prettierrc                 # Prettier configuration
├── WIKI.md                     # Project wiki (legacy)
├── WIKI-PROJECT.md             # This file
├── dist/                       # Compiled JavaScript output
├── eslint.config.mjs           # ESLint configuration
├── nest-cli.json              # NestJS CLI configuration
├── node_modules/              # Dependencies
├── package.json               # Project dependencies and scripts
├── pnpm-lock.yaml             # pnpm lock file
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── scripts/                   # Utility scripts
│   └── create-super-admin.ts  # สร้าง super admin ผ่าน CLI
├── skills-lock.json           # Skills lock configuration
├── src/                       # Source code directory
│   ├── app.controller.spec.ts # Controller unit tests
│   ├── app.controller.ts      # Application root controller
│   ├── app.module.ts          # Root application module
│   ├── app.service.ts         # Application root service
│   ├── activity-logs/         # ActivityLog module
│   │   ├── activity-logs.module.ts
│   │   ├── activity-logs.service.ts
│   │   └── entities/
│   │       └── activity-log.entity.ts
│   ├── access-control/        # RBAC module
│   │   └── access-control.module.ts
│   ├── auth/                  # Authentication module
│   │   ├── auth.controller.ts # Auth API endpoints
│   │   ├── auth.module.ts     # Auth module setup
│   │   ├── auth.service.ts    # Login business logic
│   │   └── dto/
│   │       └── login.dto.ts   # Login request DTO
│   ├── common/                # Shared utilities
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── permissions.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── permissions.guard.ts
│   │   └── interceptors/
│   │       └── logging.interceptor.ts
│   ├── departments/           # Departments module
│   │   ├── departments.controller.ts
│   │   ├── departments.module.ts
│   │   ├── departments.service.ts
│   │   ├── dto/
│   │   │   ├── create-department.dto.ts
│   │   │   └── update-department.dto.ts
│   │   └── entities/
│   │       └── department.entity.ts
│   ├── menus/                 # Menus module
│   │   ├── menus.controller.ts
│   │   ├── menus.module.ts
│   │   ├── menus.service.ts
│   │   ├── dto/
│   │   │   ├── create-menu.dto.ts
│   │   │   └── update-menu.dto.ts
│   │   └── entities/
│   │       └── menu.entity.ts
│   ├── permissions/           # Permissions module
│   │   ├── permissions.controller.ts
│   │   ├── permissions.module.ts
│   │   ├── permissions.service.ts
│   │   ├── dto/
│   │   │   ├── create-permission.dto.ts
│   │   │   └── update-permission.dto.ts
│   │   └── entities/
│   │       └── permission.entity.ts
│   ├── roles/                 # Roles module
│   │   ├── roles.controller.ts
│   │   ├── roles.module.ts
│   │   ├── roles.service.ts
│   │   ├── dto/
│   │   │   ├── assign-role-permissions.dto.ts
│   │   │   ├── create-role.dto.ts
│   │   │   └── update-role.dto.ts
│   │   └── entities/
│   │       ├── role.entity.ts
│   │       └── role-permission.entity.ts
│   ├── config/                # Configuration files
│   │   ├── database.config.ts # Database configuration
│   │   └── env.validation.ts  # Environment variable validation
│   ├── database/              # Database related files
│   │   ├── data-source.ts     # TypeORM CLI data source
│   │   ├── database.module.ts # Database module wrapper
│   │   └── migrations/        # Database migration files
│   │       ├── AddPasswordColumnToUsers1704710600000.ts
│   │       ├── CreateAccessControlSchema.ts
│   │       ├── CreateActivityLogsTable1704710700000.ts
│   │       ├── CreateDepartmentsTable1704710800000.ts
│   │       ├── CreateMenusTable1704711000000.ts
│   │       ├── CreatePermissionsTable1704711100000.ts
│   │       ├── CreateRolePermissionsTable1704711400000.ts
│   │       ├── CreateRolesTable1704710900000.ts
│   │       ├── CreateUserDepartmentsTable1704711300000.ts
│   │       ├── CreateUserRolesTable1704711200000.ts
│   │       ├── CreateUsersTable1704710500000.ts
│   │       └── SeedRbacData1704711500000.ts
│   ├── health/                # Health check endpoints
│   │   └── health.controller.ts
│   ├── main.ts                # Application entry point (CORS, ValidationPipe, port config)
│   └── users/                 # Users module
│       ├── entities/
│       │   ├── user.entity.ts
│       │   ├── user-department.entity.ts
│       │   └── user-role.entity.ts
│       ├── dto/
│       │   ├── assign-user-departments.dto.ts
│       │   ├── assign-user-roles.dto.ts
│       │   ├── create-user.dto.ts
│       │   └── update-user.dto.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       └── users.service.ts
├── test/                      # End-to-end tests
├── tsconfig.build.json        # TypeScript build config
└── tsconfig.json              # TypeScript config
```

---

## 5. Modules และ Features

### 5.1 Root Module: AppModule (`src/app.module.ts`)
เป็นส่วนหลักที่ประกอบไปด้วย:
- `ConfigModule.forRoot()` - โหลด environment variables ทั่วแอปพลิเคชัน
- `TypeOrmModule.forRootAsync()` - เชื่อมต่อฐานข้อมูล PostgreSQL
- `UsersModule`
- `AuthModule`
- `ActivityLogsModule`
- `DepartmentsModule`
- `RolesModule`
- `MenusModule`
- `PermissionsModule`
- `AccessControlModule` (Global Guards: JwtAuthGuard, PermissionsGuard)
- `APP_INTERCEPTOR` provider สำหรับ `LoggingInterceptor` (บันทึกทุก HTTP request)

### 5.2 Users Module (`src/users/`)
**ไฟล์:**
- `entities/user.entity.ts` - User entity with role/status
- `entities/user-role.entity.ts` - Junction table for user-roles
- `entities/user-department.entity.ts` - Junction table for user-departments
- `users.service.ts` - Business logic (CRUD, role/department assignment, permission checking)
- `users.controller.ts` - HTTP endpoints (CRUD, assign roles/departments)
- `users.module.ts` - Module configuration
- `dto/` - DTOs for validation

**Features:**
- สร้าง Super Admin (CLI + API)
- ค้นหาผู้ใช้ตาม username, email, id
- Validate รหัสผ่านด้วย bcryptjs
- User CRUD with role/department assignment
- Permission checking (hasPermissions, getUserPermissions, getUserMenus)
- Role and department management per user

### 5.3 Auth Module (`src/auth/`)
**ไฟล์:**
- `auth.module.ts`
- `auth.service.ts`
- `auth.controller.ts`
- `dto/login.dto.ts`

**Features:**
- Login ด้วย username + password
- สร้าง JWT access token
- ตรวจสอบสถานะผู้ใช้ (ACTIVE เท่านั้น)
- Current user info (`GET /auth/me`)
- Current user menus (`GET /auth/me/menus`)
- Current user permissions (`GET /auth/me/permissions`)

### 5.4 Health Module (`src/health/`)
**ไฟล์:**
- `health.controller.ts`

**Features:**
- Health check การเชื่อมต่อฐานข้อมูล (public endpoint)

### 5.5 ActivityLogs Module (`src/activity-logs/`)
**ไฟล์:**
- `activity-logs.module.ts`
- `activity-logs.service.ts`
- `entities/activity-log.entity.ts`

**Features:**
- บันทึกประวัติการเรียก API (method, path, user, ip, status code, duration)
- จัดการเก็บ log ลงฐานข้อมูล

### 5.6 Common Utilities (`src/common/`)
**Guards:**
- `guards/jwt-auth.guard.ts` - JWT authentication guard (global)
- `guards/permissions.guard.ts` - Permission-based authorization guard (global)

**Decorators:**
- `decorators/public.decorator.ts` - Mark endpoint as public (bypass JWT)
- `decorators/permissions.decorator.ts` - Define required permissions for endpoint
- `decorators/current-user.decorator.ts` - Inject current authenticated user

**Interceptors:**
- `interceptors/logging.interceptor.ts` - Global interceptor สำหรับ log ทุก HTTP request

### 5.7 Departments Module (`src/departments/`)
**ไฟล์:**
- `departments.module.ts`
- `departments.service.ts`
- `departments.controller.ts`
- `entities/department.entity.ts`
- `dto/` - Create/Update DTOs

**Features:**
- Department CRUD operations
- Active/inactive status management

### 5.8 Roles Module (`src/roles/`)
**ไฟล์:**
- `roles.module.ts`
- `roles.service.ts`
- `roles.controller.ts`
- `entities/role.entity.ts`
- `entities/role-permission.entity.ts`
- `dto/` - Create/Update/Assign DTOs

**Features:**
- Role CRUD operations (system roles protected)
- Assign permissions to roles
- View role permissions

### 5.9 Menus Module (`src/menus/`)
**ไฟล์:**
- `menus.module.ts`
- `menus.service.ts`
- `menus.controller.ts`
- `entities/menu.entity.ts`
- `dto/` - Create/Update DTOs

**Features:**
- Menu CRUD operations
- Hierarchical menu structure (parent-child)
- Sort order for menu display

### 5.10 Permissions Module (`src/permissions/`)
**ไฟล์:**
- `permissions.module.ts`
- `permissions.service.ts`
- `permissions.controller.ts`
- `entities/permission.entity.ts`
- `dto/` - Create/Update DTOs

**Features:**
- Permission CRUD operations
- Link permissions to menus
- View permissions with menu info

### 5.11 AccessControl Module (`src/access-control/`)
**ไฟล์:**
- `access-control.module.ts`

**Features:**
- Aggregates all RBAC modules
- Provides global JwtAuthGuard and PermissionsGuard as APP_GUARD
- Exports guards for use in other modules

### 5.12 Database Module (`src/database/`)
**ไฟล์:**
- `database.module.ts` - Global module สำหรับ TypeOrmModule
- `data-source.ts` - Data source สำหรับ TypeORM CLI
- `migrations/` - ไฟล์ migrations

---

## 6. รายละเอียด API Endpoints

### 6.1 รายการ Endpoint ทั้งหมด

| Method | Path | คำอธิบาย | Module | Permission |
|--------|------|----------|--------|------------|
| GET | `/` | Hello World | App | - |
| GET | `/health/database` | ตรวจสอบการเชื่อมต่อฐานข้อมูล | Health | Public |
| POST | `/auth/login` | Login รับ JWT Token | Auth | Public |
| GET | `/auth/me` | ข้อมูลผู้ใช้ปัจจุบัน | Auth | - (JWT) |
| GET | `/auth/me/menus` | เมนูของผู้ใช้ปัจจุบัน | Auth | - (JWT) |
| GET | `/auth/me/permissions` | สิทธิ์ของผู้ใช้ปัจจุบัน | Auth | - (JWT) |
| POST | `/users/create-super-admin` | สร้าง Super Admin | Users | Public |
| GET | `/users` | รายการผู้ใช้ทั้งหมด | Users | USER_MANAGEMENT_VIEW |
| GET | `/users/:id` | ข้อมูลผู้ใช้ตาม ID | Users | USER_MANAGEMENT_VIEW |
| POST | `/users` | สร้างผู้ใช้ใหม่ | Users | USER_MANAGEMENT_CREATE |
| PATCH | `/users/:id` | อัปเดตข้อมูลผู้ใช้ | Users | USER_MANAGEMENT_UPDATE |
| DELETE | `/users/:id` | ลบผู้ใช้ | Users | USER_MANAGEMENT_DELETE |
| PATCH | `/users/:id/roles` | กำหนดบทบาทให้ผู้ใช้ | Users | USER_MANAGEMENT_ASSIGN_ROLE |
| PATCH | `/users/:id/departments` | กำหนดแผนกให้ผู้ใช้ | Users | USER_MANAGEMENT_ASSIGN_DEPARTMENT |
| GET | `/departments` | รายการแผนกทั้งหมด | Departments | DEPARTMENT_VIEW |
| GET | `/departments/:id` | ข้อมูลแผนกตาม ID | Departments | DEPARTMENT_VIEW |
| POST | `/departments` | สร้างแผนกใหม่ | Departments | DEPARTMENT_CREATE |
| PATCH | `/departments/:id` | อัปเดตแผนก | Departments | DEPARTMENT_UPDATE |
| DELETE | `/departments/:id` | ลบแผนก | Departments | DEPARTMENT_DELETE |
| GET | `/roles` | รายการบทบาททั้งหมด | Roles | ROLE_VIEW |
| GET | `/roles/:id` | ข้อมูลบทบาทตาม ID | Roles | ROLE_VIEW |
| POST | `/roles` | สร้างบทบาทใหม่ | Roles | ROLE_CREATE |
| PATCH | `/roles/:id` | อัปเดตบทบาท | Roles | ROLE_UPDATE |
| DELETE | `/roles/:id` | ลบบทบาท | Roles | ROLE_DELETE |
| PATCH | `/roles/:id/permissions` | กำหนดสิทธิ์ให้บทบาท | Roles | ROLE_ASSIGN_PERMISSION |
| GET | `/menus` | รายการเมนูทั้งหมด | Menus | MENU_VIEW |
| GET | `/menus/:id` | ข้อมูลเมนูตาม ID | Menus | MENU_VIEW |
| POST | `/menus` | สร้างเมนูใหม่ | Menus | MENU_CREATE |
| PATCH | `/menus/:id` | อัปเดตเมนู | Menus | MENU_UPDATE |
| DELETE | `/menus/:id` | ลบเมนู | Menus | MENU_DELETE |
| GET | `/permissions` | รายการสิทธิ์ทั้งหมด | Permissions | PERMISSION_VIEW |
| GET | `/permissions/:id` | ข้อมูลสิทธิ์ตาม ID | Permissions | PERMISSION_VIEW |
| POST | `/permissions` | สร้างสิทธิ์ใหม่ | Permissions | PERMISSION_CREATE |
| PATCH | `/permissions/:id` | อัปเดตสิทธิ์ | Permissions | PERMISSION_UPDATE |
| DELETE | `/permissions/:id` | ลบสิทธิ์ | Permissions | PERMISSION_DELETE |

### 6.2 `GET /`
- **คำอธิบาย:** ทดสอบว่า server ทำงานปกติ
- **Response:**
  ```json
  "Hello World!"
  ```

### 6.3 `GET /health/database`
- **คำอธิบาย:** ตรวจสอบว่าเชื่อมต่อฐานข้อมูลได้หรือไม่
- **Response Success (200):**
  ```json
  {
    "status": "ok",
    "database": "connected",
    "schema": "access_control"
  }
  ```
- **Response Error (500):** ข้อความ error

### 6.4 `POST /users/create-super-admin`
- **คำอธิบาย:** สร้าง Super Admin คนแรกผ่าน API (ไม่ควร expose ใน production โดยไม่มี permission check)
- **Request Body:**
  ```json
  {
    "username": "admin.global",
    "email": "admin.global@example.com",
    "password": "Passw0rd!",
    "full_name": "Super Admin",
    "phone": "1234567890"
  }
  ```
- **Required:** username, email, password
- **Optional:** full_name, phone
- **Response Success (201):**
  ```json
  {
    "success": true,
    "message": "Super admin created successfully",
    "data": {
      "id": "...",
      "username": "admin.global",
      "email": "admin.global@example.com",
      "role": "SUPER_ADMIN",
      "status": "ACTIVE"
    }
  }
  ```
- **Response Error (400):**
  ```json
  {
    "success": false,
    "message": "Super admin already exists"
  }
  ```

### 6.5 `POST /auth/login`
- **คำอธิบาย:** Login เพื่อขอ JWT access token
- **Request Body (LoginDto):**
  ```json
  {
    "username": "admin.global",
    "password": "Passw0rd!"
  }
  ```
- **Validation (class-validator):**
  - username: string, ห้ามว่าง
  - password: string, ห้ามว่าง
- **Response Success (200):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": "15m",
    "user": {
      "id": "...",
      "username": "admin.global",
      "email": "admin.global@example.com",
      "role": "SUPER_ADMIN",
      "status": "ACTIVE"
    }
  }
  ```
- **Response Error (401):**
  ```json
  {
    "statusCode": 401,
    "message": "Invalid username or password",
    "error": "Unauthorized"
  }
  ```

### 6.6 `GET /auth/me`
- **คำอธิบาย:** ข้อมูลผู้ใช้ปัจจุบัน (ต้องมี JWT token)
- **Headers:** `Authorization: Bearer <token>`
- **Response Success (200):**
  ```json
  {
    "id": "...",
    "username": "admin.global",
    "email": "admin.global@example.com",
    "role": "SUPER_ADMIN",
    "status": "ACTIVE",
    "full_name": "Super Admin",
    "phone": "1234567890",
    "created_at": "...",
    "updated_at": "...",
    "roles": ["SUPER_ADMIN"],
    "departments": ["ADMIN"]
  }
  ```

### 6.7 `GET /auth/me/menus`
- **คำอธิบาย:** เมนูที่ผู้ใช้ปัจจุบันมีสิทธิ์เข้าถึง
- **Headers:** `Authorization: Bearer <token>`
- **Response Success (200):**
  ```json
  [
    {
      "id": "...",
      "name": "USER_MANAGEMENT",
      "label": "User Management",
      "icon": null,
      "path": null,
      "parent_id": null,
      "sort_order": 0
    }
  ]
  ```

### 6.8 `GET /auth/me/permissions`
- **คำอธิบาย:** สิทธิ์ทั้งหมดของผู้ใช้ปัจจุบัน
- **Headers:** `Authorization: Bearer <token>`
- **Response Success (200):**
  ```json
  [
    "USER_MANAGEMENT_VIEW",
    "USER_MANAGEMENT_CREATE",
    "DEPARTMENT_VIEW",
    ...
  ]
  ```

### 6.9 `GET /users`
- **คำอธิบาย:** รายการผู้ใช้ทั้งหมด
- **Permission:** USER_MANAGEMENT_VIEW
- **Response Success (200):** รายการ users

### 6.10 `POST /users`
- **คำอธิบาย:** สร้างผู้ใช้ใหม่
- **Permission:** USER_MANAGEMENT_CREATE
- **Request Body:** CreateUserDto

### 6.11 `PATCH /users/:id`
- **คำอธิบาย:** อัปเดตข้อมูลผู้ใช้
- **Permission:** USER_MANAGEMENT_UPDATE

### 6.12 `DELETE /users/:id`
- **คำอธิบาย:** ลบผู้ใช้
- **Permission:** USER_MANAGEMENT_DELETE

### 6.13 `PATCH /users/:id/roles`
- **คำอธิบาย:** กำหนดบทบาทให้ผู้ใช้
- **Permission:** USER_MANAGEMENT_ASSIGN_ROLE

### 6.14 `PATCH /users/:id/departments`
- **คำอธิบาย:** กำหนดแผนกให้ผู้ใช้
- **Permission:** USER_MANAGEMENT_ASSIGN_DEPARTMENT

### 6.15 การจัดการ Departments / Roles / Menus / Permissions
- **Departments:** CRUD endpoints ที่ `/departments` (ต้องมี permission DEPARTMENT_*)
- **Roles:** CRUD endpoints ที่ `/roles` (ต้องมี permission ROLE_*)
- **Menus:** CRUD endpoints ที่ `/menus` (ต้องมี permission MENU_*)
- **Permissions:** CRUD endpoints ที่ `/permissions` (ต้องมี permission PERMISSION_*)

---

## 7. ฐานข้อมูล (Database)

### 7.1 ข้อมูลทั่วไป
- **ประเภท:** PostgreSQL
- **Database Name:** `cps_db` (default)
- **Schema:** `access_control`
- **Extension:** `pgcrypto` (สำหรับสร้าง UUID)

### 7.2 ตารางหลัก: `access_control.users`

| คอลัมน์ | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|---------|--------|-------------|----------|
| id | UUID | `gen_random_uuid()` | Primary Key |
| username | VARCHAR(255) | - | ไม่ซ้ำ บังคับ |
| email | VARCHAR(255) | - | ไม่ซ้ำ บังคับ |
| password | VARCHAR(255) | - | บังคับ hash |
| role | enum | `'USER'` | SUPER_ADMIN, ADMIN, USER |
| status | enum | `'ACTIVE'` | ACTIVE, INACTIVE, LOCKED |
| full_name | VARCHAR(255) | null | ไม่บังคับ |
| phone | VARCHAR(20) | null | ไม่บังคับ |
| created_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่สร้าง |
| updated_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่อัปเดต |

### 7.3 Enums

| Enum | ค่าที่รองรับ |
|------|-------------|
| `access_control.user_role` | SUPER_ADMIN, ADMIN, USER |
| `access_control.user_status` | ACTIVE, INACTIVE, LOCKED |

### 7.4 Indexes (users)
- `idx_users_email` บน `email`
- `idx_users_username` บน `username`
- `idx_users_role` บน `role`
- `idx_users_status` บน `status`

### 7.5 ตาราง `access_control.departments`

| คอลัมน์ | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|---------|--------|-------------|----------|
| id | UUID | `gen_random_uuid()` | Primary Key |
| name | VARCHAR(100) | - | ชื่อแผนก |
| description | TEXT | null | คำอธิบาย |
| is_active | BOOLEAN | `true` | สถานะใช้งาน |
| created_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่สร้าง |
| updated_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่อัปเดต |

**Indexes:**
- `idx_departments_name` บน `name`
- `idx_departments_is_active` บน `is_active`

### 7.6 ตาราง `access_control.roles`

| คอลัมน์ | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|---------|--------|-------------|----------|
| id | UUID | `gen_random_uuid()` | Primary Key |
| name | VARCHAR(100) | - | ชื่อบทบาท (SUPER_ADMIN, ADMIN, USER) |
| description | TEXT | null | คำอธิบาย |
| is_system | BOOLEAN | `false` | บทบาทระบบ (ห้ามแก้/ลบ) |
| is_active | BOOLEAN | `true` | สถานะใช้งาน |
| created_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่สร้าง |
| updated_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่อัปเดต |

**Indexes:**
- `idx_roles_name` บน `name`
- `idx_roles_is_active` บน `is_active`

### 7.7 ตาราง `access_control.menus`

| คอลัมน์ | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|---------|--------|-------------|----------|
| id | UUID | `gen_random_uuid()` | Primary Key |
| name | VARCHAR(100) | - | ชื่อเมนู (เช่น 'dashboard') |
| label | VARCHAR(255) | - | ป้ายกำกับ (เช่น 'Dashboard') |
| icon | VARCHAR(100) | null | ไอคอน |
| path | VARCHAR(255) | null | URL path |
| parent_id | UUID | null | เมนูหลัก (self-referencing) |
| sort_order | INTEGER | `0` | ลำดับการแสดง |
| is_active | BOOLEAN | `true` | สถานะใช้งาน |
| created_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่สร้าง |
| updated_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่อัปเดต |

**Indexes:**
- `idx_menus_name` บน `name`
- `idx_menus_parent_id` บน `parent_id`
- `idx_menus_is_active` บน `is_active`

**Foreign Key:**
- `fk_menus_parent` ไปยัง `menus.id`

### 7.8 ตาราง `access_control.permissions`

| คอลัมน์ | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|---------|--------|-------------|----------|
| id | UUID | `gen_random_uuid()` | Primary Key |
| name | VARCHAR(100) | - | ชื่อสิทธิ์ (เช่น 'USER_MANAGEMENT_VIEW') |
| menu_id | UUID | null | เมนูที่เกี่ยวข้อง |
| action | VARCHAR(50) | - | การกระทำ (เช่น 'VIEW', 'CREATE') |
| description | TEXT | null | คำอธิบาย |
| is_active | BOOLEAN | `true` | สถานะใช้งาน |
| created_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่สร้าง |
| updated_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่อัปเดต |

**Indexes:**
- `idx_permissions_name` บน `name`
- `idx_permissions_menu_id` บน `menu_id`
- `idx_permissions_action` บน `action`
- `idx_permissions_is_active` บน `is_active`

**Foreign Key:**
- `fk_permissions_menu` ไปยัง `menus.id`

### 7.9 ตาราง Junction: `access_control.user_roles`

| คอลัมน์ | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|---------|--------|-------------|----------|
| id | UUID | `gen_random_uuid()` | Primary Key |
| user_id | UUID | - | รหัสผู้ใช้ |
| role_id | UUID | - | รหัสบทบาท |
| created_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่สร้าง |

**Indexes:**
- `idx_user_roles_user_id` บน `user_id`
- `idx_user_roles_role_id` บน `role_id`
- Unique constraint บน `(user_id, role_id)`

**Foreign Keys:**
- `fk_user_roles_user` ไปยัง `users.id`
- `fk_user_roles_role` ไปยัง `roles.id`

### 7.10 ตาราง Junction: `access_control.user_departments`

| คอลัมน์ | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|---------|--------|-------------|----------|
| id | UUID | `gen_random_uuid()` | Primary Key |
| user_id | UUID | - | รหัสผู้ใช้ |
| department_id | UUID | - | รหัสแผนก |
| created_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่สร้าง |

**Indexes:**
- `idx_user_departments_user_id` บน `user_id`
- `idx_user_departments_department_id` บน `department_id`
- Unique constraint บน `(user_id, department_id)`

**Foreign Keys:**
- `fk_user_departments_user` ไปยัง `users.id`
- `fk_user_departments_department` ไปยัง `departments.id`

### 7.11 ตาราง Junction: `access_control.role_permissions`

| คอลัมน์ | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|---------|--------|-------------|----------|
| id | UUID | `gen_random_uuid()` | Primary Key |
| role_id | UUID | - | รหัสบทบาท |
| permission_id | UUID | - | รหัสสิทธิ์ |
| created_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่สร้าง |

**Indexes:**
- `idx_role_permissions_role_id` บน `role_id`
- `idx_role_permissions_permission_id` บน `permission_id`
- Unique constraint บน `(role_id, permission_id)`

**Foreign Keys:**
- `fk_role_permissions_role` ไปยัง `roles.id`
- `fk_role_permissions_permission` ไปยัง `permissions.id`

### 7.12 ตาราง `access_control.activity_logs`

| คอลัมน์ | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|---------|--------|-------------|----------|
| id | UUID | `gen_random_uuid()` | Primary Key |
| user_id | UUID | null | รหัสผู้ใช้ (ถ้ามี) |
| username | VARCHAR(255) | `'anonymous'` | ชื่อผู้ใช้ |
| method | VARCHAR(10) | - | HTTP method |
| path | VARCHAR(255) | - | URL path |
| ip_address | VARCHAR(45) | null | IP ของ client |
| user_agent | TEXT | null | User-Agent header |
| status_code | INTEGER | null | HTTP status code |
| request_body | TEXT | null | Request body (mask sensitive fields) |
| status | enum | `'SUCCESS'` | SUCCESS หรือ ERROR |
| duration_ms | DOUBLE PRECISION | null | ระยะเวลาดำเนินการ (ms) |
| error_message | TEXT | null | ข้อความ error (กรณี ERROR) |
| created_at | TIMESTAMP WITH TIME ZONE | `CURRENT_TIMESTAMP` | วันที่บันทึก |

### 7.13 Migrations

| ไฟล์ | คำอธิบาย | เวลา |
|------|----------|-------|
| `CreateAccessControlSchema.ts` | สร้าง schema, pgcrypto extension, user_status, permission_effect enums | 1704710400000 |
| `CreateUsersTable1704710500000.ts` | สร้าง users table, user_role enum, indexes (idempotent) | 1704710500000 |
| `AddPasswordColumnToUsers1704710600000.ts` | เพิ่ม password column หากยังไม่มี | 1704710600000 |
| `CreateActivityLogsTable1704710700000.ts` | สร้าง activity_logs table สำหรับเก็บประวัติ API | 1704710700000 |
| `CreateDepartmentsTable1704710800000.ts` | สร้าง departments table | 1704710800000 |
| `CreateRolesTable1704710900000.ts` | สร้าง roles table | 1704710900000 |
| `CreateMenusTable1704711000000.ts` | สร้าง menus table (self-referencing) | 1704711000000 |
| `CreatePermissionsTable1704711100000.ts` | สร้าง permissions table | 1704711100000 |
| `CreateUserRolesTable1704711200000.ts` | สร้าง user_roles junction table | 1704711200000 |
| `CreateUserDepartmentsTable1704711300000.ts` | สร้าง user_departments junction table | 1704711300000 |
| `CreateRolePermissionsTable1704711400000.ts` | สร้าง role_permissions junction table | 1704711400000 |
| `SeedRbacData1704711500000.ts` | Seed initial RBAC data (roles, departments, menus, permissions, assignments) | 1704711500000 |

**หมายเหตุ:** `permission_effect` enum ถูกสร้างไว้ล่วงหน้าสำหรับระบบสิทธิ์ในอนาคต

### 7.14 Seed Data (จาก `SeedRbacData1704711500000`)

**Departments:**
- ADMIN, PRODUCTION, WAREHOUSE, DELIVERY, MASTER_DATA

**System Roles:**
- SUPER_ADMIN - Full system access
- ADMIN - Administrator with management access
- USER - Regular user

**Menus:**
- USER_MANAGEMENT, MATERIALS, PRODUCTIONS, DELIVERY, MASTER_DATA

**Permissions:**
- USER_MANAGEMENT: VIEW, CREATE, UPDATE, DELETE, ASSIGN_ROLE, ASSIGN_DEPARTMENT
- ทุก module (ROLE, MENU, PERMISSION): VIEW, CREATE, UPDATE, DELETE
- MATERIALS: VIEW, CREATE, UPDATE, DELETE
- PRODUCTIONS: VIEW, CREATE, UPDATE, DELETE, PRINT
- DELIVERY: VIEW, UPDATE, PRINT
- MASTER_DATA: VIEW, CREATE, UPDATE, DELETE

**Role-Permission Assignments:**
- SUPER_ADMIN: ทุก permission
- ADMIN: ทุก permission
- USER: เฉพาะ permission ที่ action = 'VIEW'

**User-Role Assignments:**
- ผู้ใช้ที่มี `user.role = 'SUPER_ADMIN'` จะถูก assign SUPER_ADMIN role โดยอัตโนมัติ

### 7.15 CORS Configuration
- CORS เปิดให้ทุก origin ในโหมด development (`origin: true`)
- รองรับ methods: `GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS`
- รองรับ headers: `Content-Type, Accept, Authorization`
- ตั้งค่าอยู่ใน `src/main.ts`

---

## 8. Environment Variables

### 8.1 ตัวแปรสภาพแวดล้อมที่จำเป็น

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=9203106
DB_DATABASE=cps_db
DB_SCHEMA=access_control
DB_SSL=false
DB_LOGGING=true

# JWT Configuration
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
PORT=3001
NODE_ENV=development
```

### 8.2 รายละเอียด Environment Variables

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|--------|------------|-----------|
| DB_HOST | localhost | ที่อยู่ PostgreSQL server |
| DB_PORT | 5432 | พอร์ต PostgreSQL |
| DB_USERNAME | postgres | ชื่อผู้ใช้ฐานข้อมูล |
| DB_PASSWORD | - | รหัสผ่าน (required) |
| DB_DATABASE | cps_db | ชื่อ database |
| DB_SCHEMA | access_control | ชื่อ schema |
| DB_SSL | false | เปิด/ปิด SSL connection |
| DB_LOGGING | false | เปิด/ปิด logging query |
| JWT_SECRET | - | Secret key สำหรับ JWT (required) |
| JWT_EXPIRES_IN | 15m | เวลาหมดอายุ access token |
| JWT_REFRESH_EXPIRES_IN | 7d | เวลาหมดอายุ refresh token |
| PORT | 3001 | พอร์ตของ server |
| NODE_ENV | development | สภาพแวดล้อม |

### 8.3 การโหลด .env
- NestJS `ConfigModule` โหลด `.env` โดยอัตโนมัติเมื่อรันแอป
- CLI scripts ใช้ `dotenv.config()` โหลด `.env` ก่อนเชื่อมต่อ database

---

## 9. Scripts และ CLI Commands

### 9.1 NPM Scripts (ใน `package.json`)

```bash
# Development
pnpm run start         # รันปกติ
pnpm run start:dev     # รันแบบ watch (recommended สำหรับพัฒนา)
pnpm run start:debug   # รัน debug mode

# Build
pnpm run build         # Compile TypeScript ไปยัง dist/
pnpm run start:prod    # รัน production build

# Code Quality
pnpm run lint          # รัน ESLint + auto-fix
pnpm run format        # จัดรูปแบบด้วย Prettier

# Testing
pnpm run test          # Unit tests
pnpm run test:watch    # Unit tests (watch)
pnpm run test:cov      # Unit tests + coverage
pnpm run test:e2e      # End-to-end tests

# Database
pnpm run migration:run      # รัน migrations
pnpm run migration:revert   # ย้อน migration ล่าสุด
pnpm run migration:show     # ดูสถานะ migrations
pnpm run migration:create   # สร้าง migration file เปล่า
pnpm run migration:generate # สร้าง migration จาก entity changes

# Utilities
pnpm run create-super-admin <username> <email> <password> [full_name] [phone]
```

### 9.2 การใช้งาน `create-super-admin`
```bash
pnpm run create-super-admin admin.global admin.global@example.com "Passw0rd!" "Super Admin" "1234567890"
```

### 9.3 การรัน Migrations
**สำคัญ:** TypeORM สร้าง migrations table ใน schema ก่อนรัน migrations ดังนั้นต้องสร้าง schema ก่อนเสมอ  
**หมายเหตุ:** Migrations ส่วนใหญ่ถูกออกแบบให้ idempotent (รันซ้ำได้โดยไม่ error) เพื่อความปลอดภัยใน development

```bash
# Step 1: สร้าง schema
pnpm typeorm query "CREATE SCHEMA IF NOT EXISTS access_control"

# Step 2: รัน migrations
pnpm run migration:run

# หาก migration ล้มเหลวแบบทำ transaction rollback (เช่น table มีอยู่แล้ว)
# สามารถแก้ไข migration แล้วรันใหม่ได้เลย
```

---

## 10. คู่มือการติดตั้ง (Setup Guide)

### 10.1 สิ่งที่ต้องเตรียม
- Node.js (แนะนำ LTS)
- pnpm
- PostgreSQL server

### 10.2 ขั้นตอนการติดตั้ง

1. **ติดตั้ง dependencies:**
   ```bash
   pnpm install
   ```

2. **สร้างไฟล์ `.env`:**
   ```bash
   copy .env.example .env
   ```

3. **แก้ไขค่า `.env`** ให้ตรงกับ PostgreSQL ของคุณ

4. **สร้าง schema แล้วรัน migrations:**
   ```bash
   pnpm typeorm query "CREATE SCHEMA IF NOT EXISTS access_control"
   pnpm run migration:run
   ```

5. **สร้าง Super Admin:**
   ```bash
   pnpm run create-super-admin admin.global admin.global@example.com "Passw0rd!" "Super Admin" "1234567890"
   ```

6. **รัน server:**
   ```bash
   pnpm run start:dev
   ```

7. **ทดสอบ:**
   - `curl http://localhost:3001/`
   - `curl http://localhost:3001/health/database`
   - `curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d '{"username":"admin.global","password":"Passw0rd!"}'`
   - `curl -H "Authorization: Bearer <token>" http://localhost:3001/auth/me`

---

## 11. การทำงานของ Authentication & Authorization

### 11.1 Login Flow
1. Client ส่ง `POST /auth/login` พร้อม `username` และ `password`
2. `LoginDto` ตรวจสอบความถูกต้องเบื้องต้นด้วย `class-validator`
3. `AuthService.validateUser()` ค้นหาผู้ใช้จาก `UsersService.findByUsername()`
4. ตรวจสอบว่า `user.status === ACTIVE`
5. เปรียบเทียบรหัสผ่านด้วย `bcryptjs.compare()`
6. สร้าง JWT payload ประกอบด้วย:
   - `sub`: user id
   - `username`
   - `email`
   - `role`
7. `JwtService.sign()` สร้าง access token
8. ส่งกลับ access_token, token_type, expires_in, และข้อมูล user

### 11.2 Token Configuration
- Secret: `JWT_SECRET` จาก `.env`
- Expiration: `JWT_EXPIRES_IN` (default 15m)
- Token Type: Bearer

### 11.3 Password Security
- เก็บรหัสผ่านในรูปแบบ `bcrypt hash` ด้วย salt rounds 10
- ไม่มีการส่งรหัสผ่านกลับไปยัง client

### 11.4 Authorization Flow (RBAC)
1. หลังจาก Login แล้ว ผู้ใช้จะมี JWT token
2. ทุก request (ยกเว้น public endpoints) ผ่าน `JwtAuthGuard`:
   - ตรวจสอบ JWT token จาก `Authorization: Bearer <token>`
   - ดึงข้อมูล user จาก token และตรวจสอบว่า user ยัง ACTIVE
   - แนบ user object ลงใน `request.user`
3. หลังจากผ่าน JwtAuthGuard แล้ว ผ่าน `PermissionsGuard`:
   - อ่าน required permissions จาก decorator `@Permissions('PERMISSION1', 'PERMISSION2')`
   - ถ้าไม่มี decorator ให้ผ่าน (public permission)
   - ตรวจสอบว่า user มี permissions ทั้งหมดที่ต้องการ:
     - ถ้า user เป็น SUPER_ADMIN (user.role = 'SUPER_ADMIN' หรือมี role SUPER_ADMIN) → อนุญาตทุกอย่าง
     - ถ้าไม่ใช่ SUPER_ADMIN → ค้นหาจาก user_roles → role_permissions → permissions
   - ถ้าไม่มีสิทธิ์ครบ → 403 Forbidden
4. Controller ดำเนินการตามปกติ

### 11.5 Public Endpoints
Endpoints ต่อไปนี้ไม่ต้องใช้ JWT token:
- `POST /auth/login`
- `POST /users/create-super-admin`
- `GET /health/database`
- (อื่นๆ ที่ติด decorator `@Public()`)

### 11.6 Permission Naming Convention
- Format: `<MODULE>_<ACTION>`
- Examples:
  - `USER_MANAGEMENT_VIEW`
  - `USER_MANAGEMENT_CREATE`
  - `DEPARTMENT_UPDATE`
  - `ROLE_ASSIGN_PERMISSION`
  - `MENU_VIEW`
  - `PERMISSION_CREATE`

---

## 12. การทำงานของ API Logging

### 12.1 Logging Interceptor Flow
`LoggingInterceptor` ทำงานแบบ global (ผูกกับ `APP_INTERCEPTOR` ใน `AppModule`)

1. เมื่อมี HTTP request เข้ามา Interceptor จะบันทึกเวลาเริ่มต้น
2. อ่านข้อมูลจาก request:
   - HTTP method (`GET`, `POST`, ฯลฯ)
   - URL path
   - IP address (จาก `x-forwarded-for` หรือ `request.ip`)
   - User-Agent header
   - Request body (ถ้ามี)
3. หากมี `request.user` (หลังจาก JWT Guard ตรวจสอบ token) จะบันทึก `user_id` และ `username`
4. เมื่อ request สำเร็จ Interceptor จะบันทึก:
   - HTTP status code
   - ระยะเวลาการประมวลผล (`duration_ms`)
   - `status = SUCCESS`
5. หา request เกิด error จะบันทึก:
   - HTTP status code
   - ข้อความ error
   - `status = ERROR`
6. ข้อมูลถูกบันทึกลง `access_control.activity_logs` ผ่าน `ActivityLogsService`

### 12.2 การป้องกันข้อมูล sensitive ใน log
- `request_body` จะถูก mask ก่อนบันทึกสำหรับ fields ดังนี้:
  - `password`
  - `token`
  - `secret`
  - `authorization`
- ค่าของ fields เหล่านี้จะถูกแทนที่ด้วย `***`

### 12.3 ตาราง activity_logs
ดู schema ได้ที่ [7.12 ตาราง `access_control.activity_logs`](#712-ตาราง-access_controlactivity_logs)

---

## 13. การแก้ไขปัญหา (Troubleshooting)

### 13.1 `schema "access_control" does not exist`
**สาเหตุ:** TypeORM สร้าง migrations table ใน schema ก่อนรัน migrations  
**แก้ไข:**
```bash
pnpm typeorm query "CREATE SCHEMA IF NOT EXISTS access_control"
pnpm run migration:run
```

### 13.2 `The server does not support SSL connections`
**สาเหตุ:** `DB_SSL` ถูก parse เป็น truthy แม้เป็น `false`  
**แก้ไข:** ตั้งค่า `DB_SSL=false` (lowercase) ใน `.env`

### 13.3 `column User.password does not exist`
**สาเหตุ:** ฐานข้อมูลไม่มี column `password`  
**แก้ไข:**
```bash
pnpm typeorm query "DROP SCHEMA IF EXISTS access_control CASCADE"
pnpm typeorm query "CREATE SCHEMA IF NOT EXISTS access_control"
pnpm run migration:run
```

### 13.4 `relation "users" already exists`
**สาเหตุ:** มี table อยู่แล้วแต่ migrations table ว่างเปล่า หรือ migration เก่าไม่ใช่ idempotent  
**แก้ไข:** ตอนนี้ `CreateUsersTable1704710500000` ใช้ `CREATE TABLE IF NOT EXISTS` และ `CREATE INDEX IF NOT EXISTS` แล้ว สามารถรันใหม่ได้:
```bash
pnpm run migration:run
```
หากยังไม่ได้ ให้ drop schema แล้วเริ่มต้นใหม่ตามขั้นตอนข้อ 13.3

### 13.5 `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`
**สาเหตุ:** CLI script ไม่ได้โหลด `.env` ก่อน  
**สถานะ:** ได้รับการแก้ไขโดยใส่ `dotenv.config()` แล้ว

### 13.6 JWT TypeScript Errors
**สาเหตุ:** Type ของ `expiresIn` ใน @nestjs/jwt ไม่รับ `string` ธรรมดา  
**สถานะ:** ได้รับการแก้ไขโดยใช้ `as any` สำหรับ `expiresIn` ใน `auth.module.ts`

### 13.7 CORS policy error from frontend (e.g. localhost:3000)
**สาเหตุ:** เรียก API จาก frontend ที่ run คนลาง port แต่ server ไม่ได้เปิด CORS  
**แก้ไข:** ตรวจสอบ `src/main.ts` มี `app.enableCors()` และค่า `origin` อนุญาตต้นทางของ frontend แล้ว จากนั้นรีสตาร์ท server:
```bash
pnpm run start:dev
```

---

## 14. Best Practices ที่ใช้ในโปรเจกต์

- **Module by Feature** - แยก feature เป็น module ย่อย
- **Constructor Injection** - ใช้ DI ผ่าน constructor
- **DTO Validation** - ตรวจสอบ input ด้วย `class-validator`
- **Global ValidationPipe** - ใช้ `ValidationPipe` แบบ global
- **HTTP Logging Interceptor** - บันทึกประวัติการเรียก API ลงฐานข้อมูล
- **Environment Variables** - ไม่ hardcode ค่า config
- **Database Migrations** - จัดการ schema ด้วย migrations
- **synchronize: false** - ปิดการ sync อัตโนมัติเพื่อความปลอดภัย
- **Password Hashing** - ใช้ bcryptjs ก่อนบันทึก
- **HTTP Exceptions** - ใช้ `UnauthorizedException` แทน plain error

---

## 15. แผนพัฒนาในอนาคต (Future Roadmap)

- [x] เชื่อมต่อ PostgreSQL ด้วย TypeORM
- [x] ระบบ Migrations
- [x] Health Check
- [x] Environment validation
- [x] User Entity + Role/Status
- [x] Super Admin creation (CLI + API)
- [x] Login API + JWT
- [x] API Call Logging (ActivityLogs)
- [x] JWT Guard / AuthGuard
- [x] RBAC permissions (Departments, Roles, Menus, Permissions)
- [x] Role and Permission modules
- [x] User CRUD APIs
- [x] Permission-based Authorization (PermissionsGuard)
- [x] Current user info endpoints (/auth/me, /auth/me/menus, /auth/me/permissions)
- [ ] Refresh token
- [ ] API versioning
- [ ] Rate limiting
- [ ] Password reset flow
- [ ] Email verification
- [ ] Two-factor authentication (2FA)

---

## 16. References

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

**อัปเดตล่าสุด:** 9 July 2026  
**สถานะ:** Development Phase - RBAC + Authorization + User Management
