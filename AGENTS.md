<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Yasky AI - Agent Instructions

## Quick Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# TypeScript check
npx tsc --noEmit
```

## Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - Reusable React components
- `src/lib/` - Utilities and configurations
- `src/contexts/` - React Context providers

## Key Files

- `src/lib/firebase.ts` - Firebase configuration
- `src/contexts/AuthContext.tsx` - Authentication logic
- `src/lib/prompts.ts` - AI role system prompts
- `src/lib/ai.ts` - Puter AI integration
- `src/components/layout/Sidebar.tsx` - Navigation sidebar

## Environment Variables

Configure Firebase in `.env.local`:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

## Notes

- Uses TailwindCSS for styling
- Dark luxury theme with purple accents
- 4 AI assistants: Sales Coach, Ad Copy, Design Mentor, SEO Blog
- Firebase Authentication - only approved users can access