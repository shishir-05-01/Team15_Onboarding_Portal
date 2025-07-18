# Personalized Onboarding Portal MVP

A Next.js-based onboarding portal where new hires can register, complete their profile, and receive personalized checklists based on their role and seniority level.

## Features

- **User Authentication**: Firebase Auth with email/password registration and login
- **Onboarding Profile**: Collect user's role, department, and seniority level
- **Personalized Checklists**: Dynamic task lists based on user profile
- **Progress Tracking**: Users can check off completed tasks with progress visualization
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop compatibility

## Tech Stack

- **Frontend**: Next.js (React framework)
- **Styling**: Tailwind CSS
- **Backend & Database**: Firebase (Authentication and Firestore)
- **Deployment**: Vercel/Netlify (frontend), Firebase (backend/database)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Copy your Firebase config and update `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## User Flow

1. **Registration/Login**: Users register with email/password or login if they have an account
2. **Onboarding Form**: After login, users complete their profile (role, department, seniority level)
3. **Dashboard**: Users see their personalized checklist and can mark tasks as complete
4. **Progress Tracking**: Visual progress bar shows completion percentage

## Project Structure

```
/pages
  /_app.js       // App-level configuration and CSS imports
  /index.js      // Landing/Login/Register page
  /onboarding.js // Profile form (role, department, level)
  /dashboard.js  // Personalized checklist dashboard
/lib
  firebaseConfig.js   // Firebase initialization
/components
  OnboardingForm.js   // Reusable onboarding form component
/data
  templates.js        // Hardcoded checklist task mappings
/styles
  globals.css         // Global styles with Tailwind imports
```

## Customization

### Adding New Roles or Tasks

Edit `/data/templates.js` to add new roles or modify existing checklists:

```js
export const templates = {
  sales: {
    junior: ["CRM Intro", "Product Demo", "Meet Mentor"],
    senior: ["CRM Advanced", "Client Strategy Session", "Team Leadership"]
  },
  engineering: {
    junior: ["Dev Env Setup", "Onboarding Docs Review", "Meet Team"],
    senior: ["Codebase Access", "Infra Overview", "Join Arch Review"]
  },
  // Add new roles here
  marketing: {
    junior: ["Brand Guidelines", "Campaign Tools", "Content Calendar"],
    senior: ["Strategy Planning", "Budget Management", "Team Coordination"]
  }
}
```

## Deployment

### Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Netlify

1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables in Netlify dashboard

## Firebase Security Rules

For production, update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## License

MIT License

