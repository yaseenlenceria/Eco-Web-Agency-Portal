# Authentication Setup Guide

This project now has a complete authentication system with Google OAuth and user data storage using Convex.

## 🚀 Quick Setup

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your domain for production (including Netlify domain)

4. Get your Firebase config:
   - Project Settings > General > Your apps
   - Add a Web app
   - Copy the configuration values

5. Create a `.env.local` file in your project root:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# Convex Configuration (already set up)
VITE_CONVEX_URL=https://terrific-clownfish-592.convex.cloud
```

### 2. Netlify Deployment

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard:
   - Go to Site settings > Build & deploy > Environment
   - Add all the VITE_ variables from your `.env.local`

3. Deploy!

## 📁 Project Structure

```
project/
├── convex/
│   ├── auth.ts          # User authentication functions
│   ├── schema.ts        # Database schema (users, sessions)
│   └── _generated/      # Auto-generated types
├── contexts/
│   ├── AuthContext.tsx  # Authentication state management
│   └── ConvexProvider.tsx # Convex client provider
├── components/
│   └── Login.tsx        # Login component with Google button
├── lib/
│   └── firebase.ts      # Firebase configuration
└── netlify.toml         # Netlify deployment config
```

## 🔐 How It Works

1. **User Authentication**:
   - Users sign in with Google OAuth
   - Firebase handles the authentication
   - User data is stored in Convex database

2. **Session Management**:
   - Tokens are stored in localStorage
   - Sessions expire after 7 days
   - Automatic session validation

3. **User Data**:
   - Email, name, avatar from Google
   - Custom user roles and preferences
   - Persistent storage in Convex

## 🛠️ Features Included

- ✅ Google OAuth authentication
- ✅ User session management
- ✅ User profile storage
- ✅ Automatic login persistence
- ✅ Logout functionality
- ✅ Netlify deployment ready
- ✅ Responsive design
- ✅ Loading states

## 📝 Next Steps

1. Set up your Firebase project and get the API keys
2. Update the `.env.local` file with your Firebase configuration
3. Test the authentication locally with `npm run dev`
4. Deploy to Netlify with environment variables
5. Your CRM is now ready with full authentication!

## 🤝 Support

If you need help:
- Check Firebase documentation for Google OAuth setup
- Visit Convex docs for database operations
- Review Netlify docs for environment variables