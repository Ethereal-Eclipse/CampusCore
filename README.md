# CampusCore

A unified digital campus ecosystem for students and faculty. CampusCore streamlines academic resources, student grievances, peer-to-peer campus commerce, schedule management, and lost & found reporting into a cohesive, responsive portal.

## Modules

- **Grievance Desk (Tickets)**: File, track, and resolve campus issues with category tags and real-time status tracking.
- **Academic Vault**: Centralized repository for previous year question papers, lab manuals, and study notes.
- **Campus Marketplace**: Safe, peer-to-peer student marketplace for textbooks, electronics, and dorm essentials.
- **Timetable & Events**: Visual class schedule and campus event notifications.
- **Lost & Found**: Community board for reporting and recovering lost items across campus.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS, shadcn/ui primitives, CSS variable design tokens
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: NextAuth.js (Auth.js) with Google OAuth and institutional domain filtering
- **File Storage**: Cloudflare R2 (documents) and Cloudinary (images)

## Getting Started

### 1. Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure your `.env.local` keys:
- `NEXTAUTH_SECRET`: Random 32+ character string
- `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: Google Cloud OAuth credentials
- `CAMPUS_DOMAIN`: Optional domain restriction (e.g. `glbitm.ac.in`)
- `MONGODB_URI`: MongoDB Atlas connection string

> In local development, if external credentials are not set, CampusCore includes a Development Fallback login for testing UI and workflows immediately.

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
CampusCore/
├── src/
│   ├── app/                # Next.js App Router routes and page layouts
│   │   ├── api/            # Route handlers (NextAuth, REST endpoints)
│   │   ├── dashboard/      # Authenticated dashboard views and sub-modules
│   │   ├── login/          # Authentication entry page
│   │   └── globals.css     # Global styles and design tokens
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Navigation and structure components
│   │   ├── providers/      # Theme and session context providers
│   │   └── ui/             # Primitives and centralized Lucide icons
│   ├── lib/                # Database connection, auth configuration, utils
│   └── models/             # Mongoose schemas and TypeScript interfaces
└── public/                 # Static assets and media
```
