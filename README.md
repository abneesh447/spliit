# Spliit — Minimalist Expense Sharing Application

Spliit is a free, fast, and user-friendly expense sharing web application. Easily create groups, add shared expenses with friends or family, track balances in real-time, and calculate optimal reimbursements — without annoying ads or forced account registrations.

---

## 🌟 Key Features

- 👥 **Group Expense Management**: Create groups and share custom invite links with friends.
- 💵 **Multi-Currency Support**: Support for international currencies (pre-configured default: `INR`).
- ⚖️ **Smart Balance Calculation**: Automatically calculates who owes whom and suggests the fewest possible payments.
- 📊 **Stats & Breakdown**: Visual charts showing category-wise and monthly spending trends.
- 🌙 **Dark & Light Mode**: Seamless theme switching with system auto-detection.
- 🌐 **Multi-Language Support**: Fully localized into multiple international languages.
- 📱 **Progressive Web App (PWA)**: Works smoothly on mobile devices and desktops.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Language**: JavaScript (ES6+ / JSX)
- **Database**: [PostgreSQL](https://www.postgresql.org/) managed via [Prisma ORM](https://www.prisma.io/) (configured for [Supabase](https://supabase.com))
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **API & Client**: tRPC & TanStack React Query

---

## 🚀 Quick Start & Local Setup Guide

Follow these steps to run Spliit locally on your machine:

### 1. Prerequisites
- **Node.js**: v20.19+, v22.12+, or v24+
- **npm**: v10+

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/spliit-app/spliit.git
cd spliit
npm install
```

### 3. Environment & Database Configuration

Create a `.env` file in the root directory and configure your credentials:

```env
# 1. Database Connection Strings (Supabase / PostgreSQL)
POSTGRES_PRISMA_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# 2. Public Base URL
BASE_URL=http://localhost:3000

# 3. Default Currency Pre-selected for New Groups
DEFAULT_CURRENCY_CODE=INR
```

### 4. Run Database Migrations & Generate Prisma Client
```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔮 Optional Future Enhancements & Additional Features

You can enable optional advanced features anytime by updating your `.env` configuration:

### Step 4: Expense Receipts & File Attachments (S3 Storage)
Allow users to upload photos or PDF receipts to individual expenses.

To enable, uncomment and fill the following in `.env`:
```env
ENABLE_EXPENSE_DOCUMENTS=true
S3_UPLOAD_KEY=your_s3_access_key_id
S3_UPLOAD_SECRET=your_s3_secret_access_key
S3_UPLOAD_BUCKET=your_bucket_name
S3_UPLOAD_REGION=us-east-1
# S3_UPLOAD_ENDPOINT=https://your-custom-s3-endpoint.com  # Only needed for Cloudflare R2 / MinIO
```

### Step 5: AI-Powered Receipt Reader & Auto-Categorization (OpenAI API)
Extract expense totals and descriptions directly from uploaded receipt images, and auto-suggest expense categories using AI.

To enable, uncomment and fill the following in `.env`:
```env
ENABLE_RECEIPT_EXTRACT=true
ENABLE_CATEGORY_EXTRACT=true
OPENAI_API_KEY=sk-proj-your-openai-api-key
```

---

## 📦 Project Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server at `localhost:3000` |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Starts production server |
| `npm run lint` | Runs ESLint syntax and code quality checks |
| `npx prisma generate` | Regenerates Prisma Client models |
| `npx prisma migrate deploy` | Applies pending database schema migrations |

---

## 🌐 Production Deployment

### Deploy on Vercel
1. Push your project repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Add your `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, and `BASE_URL` under **Project Settings -> Environment Variables**.
4. Click **Deploy**.

---


All rights reserved.
