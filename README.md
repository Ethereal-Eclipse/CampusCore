# CampusCore

A unified campus portal that brings together student services, resources, marketplace, events, and more.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: MongoDB Atlas, Mongoose
- **Auth**: NextAuth.js (Auth.js) with Google OAuth
- **Storage**: Cloudflare R2 (files), Cloudinary (images)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Copy `.env.example` to `.env.local` and fill in the values.
   ```bash
   cp .env.example .env.local
   ```
   If you don't have keys right away, the app will run with mock data and a "Development Fallback" login.

3. Database Seeding (Optional):
   To run the seed script with dummy data (requires `MONGODB_URI`):
   ```bash
   npx tsx scripts/seed.ts
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Vercel Deployment

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project from your repository.
3. Add the environment variables from your `.env.local` to the Vercel project settings.
4. Deploy!
