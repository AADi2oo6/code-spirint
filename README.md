# ⚡ RELIEFGRID // Donation Drive & Volunteer Coordination Platform

> A mission-critical, real-time command dashboard engineered for NGOs and disaster response teams. Eliminates fragmented spreadsheets and chat threads by centralizing donation drives, volunteer deployment, field task dispatch, and immutable contribution tracking.

---

## 🚀 Live Demo & Rapid Vercel Deployment

### Deploy to Vercel in 60 Seconds:
1. **Push this repo to your GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete donation drive & volunteer platform"
   git push
   ```
2. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) and select this repository.
3. **Add Environment Variable:**
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://postgres.fuqqzozgzwiomwgzjjpa:adi20062024%40gmail.com@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require`
4. **Click Deploy.** Your app will go live instantly.

---

## 🎨 Design System & Aesthetic Directives
- **Palette:** High-contrast Light Theme — **Pure White** (`#ffffff`), **Industrial Orange** (`#ea580c` / `#f97316`), and **Solid Black** (`#000000` / `#09090b`).
- **Geometry:** **100% Sharp Corners** (`rounded-none`). No soft radii; bold brutalist typography, solid 2px black borders, and hard drop-shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).
- **Micro-Interactions:** Confetti donation celebration (`canvas-confetti`), live Supabase ping indicator, and responsive status transitions.

---

## ⚡ Core Features & Capabilities

### 1. 🎯 Dynamic Donation Drives & Campaigns
- Filter by category: **Disaster Relief**, **Food & Hunger**, **Winter Relief**, **Education**, **Medical Aid**.
- Real-time progress bars with dynamic funding percentage, amount raised vs goal, and days remaining.
- Urgency indicators: **Critical**, **High**, and **Normal**.
- Beneficiaries impact counter and geographic zone tags.

### 2. 💸 Frictionless Contributions & Instant Receipts
- Preset contribution shortcuts ($25, $50, $100, $250, $500) and custom amount entry.
- Multi-channel payment simulation: **Card**, **UPI**, **Bank Wire**.
- Optional anonymous donation toggle.
- Atomic PostgreSQL transactions that immediately update campaign funding totals.
- Generated verifiable **Transaction Receipt** with 501(c)(3) tax deduction reference.

### 3. 👥 Volunteer Mobilization & Capability Matching
- Direct volunteer recruitment form capturing full name, email, phone, and availability window.
- Capability tag selection: *Emergency First Aid*, *Logistics & Transport*, *Heavy Driving*, *Food Safety*, *Triage / Paramedic*, *Warehouse Sorting*.
- Volunteer directory roster with 1-click mail and call shortcuts.

### 4. 📋 Field Task Dispatch Kanban
- 3-column real-time Kanban board: **To Do / Pending**, **In Progress / Mobilized**, and **Completed / Verified**.
- 1-click status transitions with instantaneous Supabase updates (`PATCH /api/tasks`).
- Task priority badging (*Critical*, *High*, *Medium*, *Low*), due dates, and volunteer assignment links.

### 5. 🛡️ Public Transparency & Audit Ledger
- Real-time ledger displaying all incoming contributions, transaction IDs, payment channels, timestamps, and donor dedications.
- Instant search filter by donor, transaction code, or campaign title.

### 6. ⚙️ NGO Command Center Mode
- Toggle between **Public Donor Portal** and **NGO Command Center**.
- Create and launch new campaigns on the fly.
- Dispatch targeted field tasks directly to registered volunteers.

---

## 🛠️ Tech Stack & Database Architecture

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions, React 19)
- **Database:** [Supabase PostgreSQL 17](https://supabase.com/) via Session Pooler (port `5432` with connection pooling)
- **Database Driver:** `postgres` (porsager/postgres) — ultra-fast serverless-ready client
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Celebration Effects:** `canvas-confetti`

### PostgreSQL Schema:
- `campaigns` — Drive details, funding targets, raised amounts, urgency, and deadlines.
- `donations` — Contributor info, amounts, payment channels, and unique transaction hashes.
- `volunteers` — Emergency volunteer directory, capabilities, availability, and assignments.
- `tasks` — Field directives, priorities, statuses (`todo`, `in_progress`, `completed`), and assigned volunteers.

---

## 💻 Local Development Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/AADi2oo6/code-spirint.git
   cd code-spirint
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment:**
   Ensure `.env.local` contains:
   ```env
   DATABASE_URL=postgresql://postgres.fuqqzozgzwiomwgzjjpa:adi20062024%40gmail.com@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require
   ```
4. **Seed Database (Already migrated to Supabase):**
   ```bash
   npm run db:migrate
   ```
5. **Start Dev Server:**
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000).
