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
