# CareerCatalystX — Student Portal 🎓

CareerCatalystX is a full-stack career acceleration platform designed to bridge the gap between students, professors, and real-world project opportunities.  
The **Student Portal** empowers students to discover faculty-led projects, apply with verified profiles, and build career-ready experience.

This repository contains the **student-facing application** of CareerCatalystX.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ed) ![Razorpay](https://img.shields.io/badge/Razorpay-Integrated-ef)

---

## 🚀 Key Features

### 🔍 Project Discovery
- Browse real-world projects posted by professors from Tier-1 institutes (IITs, NITs, etc.)
- Filter projects by:
  - Department
  - Required skills
  - Project category
  - College access (subscription-based)

### 📝 Project Applications
- Apply to projects with:
  - Cover letter
  - Skill-based matching
- Track application status:
  - Pending
  - Shortlisted
  - Accepted
  - Rejected

### 👤 Student Profile Management
- Academic details (branch, year, GPA)
- Skills mapping
- Resume / CV upload
- Profile completion tracking

### 🔐 Authentication & Authorization
- Secure authentication with role-based access (STUDENT / PROFESSOR / ADMIN)
- OTP & password-based flows
- College domain-based access control

### 💳 Subscription System
- Access projects from other colleges using plans
- Plan-based feature gating
- Active / expired subscription lifecycle handling
- Powered by Razorpay

---
# 🗃️ File Structure 
```
Student-Project-Portal/
├── .github/
│   └── workflows/
│       └── build.yml
├── .gitignore
├── README.md
├── app/
│   ├── (student)/
│   │   ├── (profile_context)/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── update/
│   │   │       └── page.tsx
│   │   ├── apply/
│   │   │   └── [id]/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── enrollment-success/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── closed/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── overdue/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── purchase/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── subscriptions/
│   │   │   └── page.tsx
│   │   ├── update-password/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── verify-otp/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── api/
│   │   ├── applications/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── auth/
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   ├── profile/
│   │   │   │   └── student/
│   │   │   │       └── route.ts
│   │   │   ├── reset-password/
│   │   │   │   └── route.ts
│   │   │   ├── student/
│   │   │   │   ├── signin/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── signup/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── skill/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── update/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── upload/
│   │   │   │   │   └── route.ts
│   │   │   │   └── verify-otp/
│   │   │   │       └── route.ts
│   │   │   └── update-password/
│   │   │       └── route.ts
│   │   ├── payments/
│   │   │   └── verify/
│   │   │       └── route.ts
│   │   ├── plans/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── professors/
│   │   │   └── [id]/
│   │   │       ├── projects/
│   │   │       │   └── route.ts
│   │   │       └── route.ts
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   ├── category/
│   │   │   │   └── route.ts
│   │   │   ├── enroll/
│   │   │   │   └── route.ts
│   │   │   ├── list/
│   │   │   │   ├── closed/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── overdue/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── unenroll/
│   │   │       └── route.ts
│   │   ├── purchase/
│   │   │   └── route.ts
│   │   ├── skills/
│   │   │   └── route.ts
│   │   └── subscriptions/
│   │       └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components.json
├── components/
│   ├── ProjectDetails.tsx
│   ├── animata/
│   │   ├── bento-grid/
│   │   │   └── eight.tsx
│   │   ├── button/
│   │   │   └── get-started-button.tsx
│   │   ├── graphs/
│   │   │   └── bar-chart.tsx
│   │   └── text/
│   │       ├── counter.tsx
│   │       ├── ticker.tsx
│   │       └── typing-text.tsx
│   ├── app-sidebar.tsx
│   ├── dashboard/
│   │   ├── ProfileBanner.tsx
│   │   ├── applications-list.tsx
│   │   ├── cvDisplay.tsx
│   │   ├── header.tsx
│   │   └── student-profile.tsx
│   ├── gradientcircle.tsx
│   ├── header.tsx
│   ├── home.tsx
│   ├── no_project.tsx
│   ├── professor/
│   │   ├── ProfileBanner.tsx
│   │   ├── closeDialog.tsx
│   │   ├── header.tsx
│   │   ├── professor-profile.tsx
│   │   └── projects-list.tsx
│   ├── projects-list.tsx
│   └── ui/
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── command.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── gradient-heading.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── logo-carousel.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── sticky-banner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── text-gif.tsx
│       ├── textarea.tsx
│       ├── tooltip.tsx
│       └── typewriter.tsx
├── contexts/
│   ├── categorySkillsContext.tsx
│   ├── dashboardContext.tsx
│   └── professorDashboardContext.tsx
├── eslint.config.mjs
├── hooks/
│   └── use-mobile.tsx
├── lib/
│   ├── auth.ts
│   ├── cloudinary.ts
│   ├── email.ts
│   ├── prisma.ts
│   ├── utils.ts
│   └── validations.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma/
│   ├── migrations/
│   │   ├── 20250412134335_init/
│   │   │   └── migration.sql
│   │   ├── 20250412165149_professor/
│   │   │   └── migration.sql
│   │   ├── 20250515131417_plan_cycle_enum/
│   │   │   └── migration.sql
│   │   ├── 20250520044104_plan/
│   │   │   └── migration.sql
│   │   ├── 20250526131944_updated/
│   │   │   └── migration.sql
│   │   ├── 20250531063324_is_updated/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public/
│   ├── 1.png
│   ├── 3.png
│   ├── 4.png
│   ├── 5.png
│   ├── 6.png
│   ├── AIIMSJAMMU.png
│   ├── IITJAMMU.png
│   ├── LOGO.svg
│   ├── MIETJAMMU.png
│   ├── UNIJAMMU.png
│   ├── bgHome.jpg
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── logo-master.png
│   ├── logo.png
│   ├── next.svg
│   ├── pdf.worker.min.mjs
│   ├── vercel.svg
│   └── window.svg
├── tailwind.config.ts
├── tsconfig.json
├── types/
│   ├── api-professor.ts
│   ├── api.ts
│   ├── profile.ts
│   └── project.ts
└── utils/
    ├── auth.ts
    ├── project-id.ts
    └── redirect-student.ts
```
---

## 🧠 Architecture Highlights

- **Role-driven data model** using Prisma
- **Relational schema design** with:
  - Many-to-many skill mapping
  - Application lifecycle tracking
  - Subscription & plan access control
- **Scalable backend structure** aligned with production systems

---

## 🛠 Tech Stack

### Frontend
- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Razorpay Frontend Integration**

### Backend
- **Node.js**
- **Express.js**
- **REST APIs**
- **Zod** (validation)

### Database
- **PostgreSQL**
- **Prisma ORM**

### Tooling
- Git & GitHub
- Docker (optional)
- Postman
- JWT-based auth

---

## 📂 Core Models (Student-Centric)

- User / UserAuth
- Student Profile
- Project
- Application
- Skill & StudentSkill
- Subscription & Plan

---

## 🧪 Local Setup

```bash
git clone https://github.com/CareerCatalystX/Student-Project-Portal.git
cd careercatalystx-student-portal

npm install
npx prisma generate
npx prisma migrate dev
npm run dev


# ================================
# Database Configuration
# ================================
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>/<DB_NAME>?sslmode=require"

# ================================
# Environment
# ================================
NODE_ENV="development"

# ================================
# Authentication
# ================================
JWT_SECRET="<your_jwt_secret>"

# ================================
# Application URLs
# ================================
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# ================================
# Email Service (Transactional Emails)
# ================================
EMAIL_USER="no-reply@yourdomain.com"
EMAIL_PASS="<email_password_or_app_key>"

# ================================
# Cloudinary (File Uploads / Resume Storage)
# ================================
CLOUDINARY_CLOUD_NAME="<cloudinary_cloud_name>"
CLOUDINARY_API_KEY="<cloudinary_api_key>"
CLOUDINARY_API_SECRET="<cloudinary_api_secret>"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<cloudinary_cloud_name>"

# ================================
# Payments (Razorpay - Test Mode)
# ================================
NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID="<razorpay_test_key_id>"
RAZORPAY_TEST_KEY_SECRET="<razorpay_test_key_secret>"
