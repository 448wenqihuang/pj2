# Lunchbox Beat Vault (Mini Project)

This is a small Next.js App Router project that lets multiple producers upload beats into a shared vault.

## Files included

- app/layout.tsx — global layout and navigation
- app/page.tsx — home page with hero + beat list
- app/upload/page.tsx — upload form (anyone with link can upload)
- app/globals.css — visual style (Lunchbox gradient + glassmorphism)
- app/api/beats/route.ts — API for GET and POST beats
- components/BeatList.tsx — beat list grid
- components/BeatCard.tsx — beat card with audio player
- lib/db.ts — MongoDB connection helper
- models/Beat.ts — Mongoose model for beats

## Setup

1. Create a Next.js (App Router + Tailwind) project, then drop these folders/files into it.
2. Create `public/uploads` folder in your project root.
3. Add a `.env.local` file with:

```env
MONGODB_URI=your_teacher_connection_string_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 to see the vault, and http://localhost:3000/upload to upload beats.
