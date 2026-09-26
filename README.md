# ⚡ RELIEFGRID // Donation Drive & Volunteer Coordination Platform

> A mission-critical, real-time command dashboard engineered for NGOs and disaster response teams. Eliminates fragmented spreadsheets and chat threads by centralizing donation drives, volunteer deployment, field task dispatch, and immutable contribution tracking.

---

## 🚀 Live Demo & Rapid Vercel Deployment

### Deploy to Vercel in 60 Seconds:
1. **Push this repo to your GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete platform with auth, tutorial, payment gateway & admin portal"
   git push
   ```
2. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) and select this repository.
3. **Add Environment Variable:**
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://postgres.fuqqzozgzwiomwgzjjpa:adi20062024%40gmail.com@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require`
4. **Click Deploy.** Your app will go live instantly.

---

## 🔑 Fast Evaluator & Judge Demo Logins
Use the 1-click login buttons in the **Sign In** modal or enter these credentials:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **NGO Director (Admin)** | `admin@reliefgrid.org` | `admin123` | Full NGO Command Portal, drive editing/deletion, volunteer verification, CSV export, broadcast banner |
| **Field Volunteer** | `volunteer@relief.org` | `volunteer123` | Claim field tasks, update Kanban lanes, view emergency assignments |
| **Community Donor** | `donor@gmail.com` | `donor123` | Access ReliefPay sandbox portal, pledge donations, download vouchers |

---

## 🎨 Design System & Aesthetic Directives
- **Palette:** High-contrast Light Theme — **Pure White** (`#ffffff`), **Industrial Orange** (`#ea580c` / `#f97316`), and **Solid Black** (`#000000` / `#09090b`).
- **Geometry:** **100% Sharp Corners** (`rounded-none`). No soft radii; bold brutalist typography, solid 2px black borders, and hard drop-shadows (`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).
- **Micro-Interactions:** Multi-stage payment gateway authorization animation, confetti celebration (`canvas-confetti`), live Supabase ping indicator, and responsive status transitions.

---

## ⚡ Core Features & Capabilities

### 1. 🔐 User Authentication & Role Management
- Database-backed user accounts stored in Supabase PostgreSQL `users` table.
- Three specialized roles: `admin` (Director), `volunteer`, and `donor`.
- Persistent session state (remembers logged in user across refreshes).
- 1-click evaluator login shortcuts.

### 2. 📖 Interactive Walkthrough & Tutorial ("How It Works")
- 4-step guided tutorial modal accessible from the navbar and footer.
- Visual breakdown of live drive tracking, payment simulation, volunteer dispatch, and public transparency.

### 3. 💳 Realistic Dummy Payment Gateway ("ReliefPay")
- Multi-channel sandbox payment checkout:
  - **Credit / Debit Card:** Realistic embossed card preview with auto-formatted numbers, expiry, CVV, and auto-fill sandbox card helper.
  - **UPI & Dynamic QR Code:** Live QR code simulator with copyable VPA (`reliefgrid@ybl`).
  - **NetBanking:** Institutional bank simulator (Chase, BoA, Wells Fargo, Citibank, HDFC).
- Realistic multi-stage authorization animation ("Handshake ➔ Authorizing ➔ Ledgering").
- Confetti celebration upon approval + printable tax-deductible voucher with transaction reference.

### 4. ⚙️ NGO Command & Admin Management Portal
- **Campaign Operations:** Pause, activate, or permanently delete drives, and update funding targets.
- **Volunteer Verification:** Verify volunteer credentials (`active`, `verified`, `standby`) or reassign them to specific drives.
- **Task Dispatcher:** Assign and delete operational directives.
- **1-Click CSV Export:** Download full financial ledger (`/api/export/donations`) for audit and spreadsheet reporting.
- **Global Emergency Broadcast:** Toggle high-priority red alert ticker across all site screens.

### 5. 🎯 Dynamic Donation Drives & Campaigns
- Filter by category: **Disaster Relief**, **Food & Hunger**, **Winter Relief**, **Education**, **Medical Aid**.
- Real-time progress bars calculating dynamic funding percentage and remaining goals.
- Urgency indicators: **Critical**, **High**, and **Normal**.

### 6. 📋 Field Task Dispatch Kanban
- 3-column real-time Kanban board: **To Do / Pending**, **In Progress / Mobilized**, and **Completed / Verified**.
- 1-click status transitions with instantaneous Supabase updates (`PATCH /api/tasks`).

### 7. 🛡️ Public Transparency & Audit Ledger
- Real-time searchable log of all incoming financial support with verifiable transaction hashes.

---

## 🛠️ Tech Stack & Database Architecture

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions, React 19)
- **Database:** [Supabase PostgreSQL 17](https://supabase.com/) via Session Pooler (port `5432`)
- **Database Driver:** `postgres` (porsager/postgres) — ultra-fast serverless-ready client
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Celebration Effects:** `canvas-confetti`

### PostgreSQL Tables in Supabase:
- `users` — Authentication credentials, roles (`admin`, `volunteer`, `donor`), and affiliations.
- `campaigns` — Drive details, funding targets, raised amounts, urgency, and deadlines.
- `donations` — Contributor info, amounts, payment channels, and unique transaction hashes.
- `volunteers` — Emergency volunteer directory, capabilities, availability, and assignments.
- `tasks` — Field directives, priorities, statuses (`todo`, `in_progress`, `completed`), and assigned personnel.

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
