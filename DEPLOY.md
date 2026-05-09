# Yasky AI - Deployment Guide

## Prerequisites

1. **Node.js** - v18 or higher
2. **npm** or **yarn**
3. **Firebase Project** - Create a project at [firebase.google.com](https://firebase.google.com)

## Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project named "Yasky AI" or similar
3. Enable **Authentication** service
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Optionally enable "Google" for OAuth
4. Get your configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" > Web app (</>)
   - Copy the config values

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Create User Accounts

Since there's no public signup:
1. Go to Firebase Console > Authentication > Users
2. Click "Add user"
3. Enter email and password for each team member
4. Only these users can access the platform

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Deployment to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your repository
5. Add your environment variables in the Vercel project settings
6. Click "Deploy"

### Option 2: Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Environment Variables on Vercel

Add these in Vercel Project Settings > Environment Variables:

| Variable | Value |
|----------|-------|
| NEXT_PUBLIC_FIREBASE_API_KEY | (from Firebase) |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | (from Firebase) |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | (from Firebase) |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | (from Firebase) |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | (from Firebase) |
| NEXT_PUBLIC_FIREBASE_APP_ID | (from Firebase) |

## Project Structure

```
yasky/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/              # Login page
│   │   ├── dashboard/          # Dashboard page
│   │   ├── chat/[roleId]/      # AI Chat interface
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Root redirect
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   └── layout/             # Layout components (Sidebar)
│   ├── contexts/               # React contexts (AuthContext)
│   └── lib/                    # Utilities and configs
│       ├── firebase.ts         # Firebase config
│       ├── ai.ts               # Puter AI integration
│       ├── prompts.ts          # AI role prompts
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── .env.local                  # Local environment variables
├── .env.local.example          # Example env file
└── package.json
```

## Features

- **4 AI Assistants**: Sales Coach, Ad Copy, Design Mentor, SEO Blog
- **Secure Authentication**: Firebase email/password
- **Dark Luxury Theme**: Premium UI with purple accents
- **Responsive Design**: Works on desktop and mobile
- **Markdown Rendering**: AI responses support markdown
- **Copy to Clipboard**: Easy copy functionality
- **Chat History**: Messages persist during session

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Firebase Authentication
- Puter.js (AI)
- Lucide React (Icons)
- React Markdown

## Troubleshooting

### Firebase Auth Errors
- Ensure email/password auth is enabled in Firebase Console
- Check that users are manually created (no public signup)

### Puter AI Issues
- Ensure you're running in a browser environment
- Check network connection
- The Puter script loads from CDN (js.puter.com)

### Build Errors
- Run `npm run lint` to check for issues
- Ensure all environment variables are set
- Clear `.next` folder: `rm -rf .next`

## Support

For issues or questions, contact the development team.