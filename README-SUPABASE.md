# Supabase Authentication & Database Setup

This project now uses **Supabase** for authentication and database - a complete backend solution that replaces Convex.

## 🚀 Quick Setup

### 1. Set up Supabase Database

1. Go to your Supabase project: https://supabase.com/dashboard/project/uvpiquvbgrdtjlixqmlt
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to create all necessary tables

### 2. Configure Authentication

1. In Supabase Dashboard, go to **Authentication > Settings**
2. Ensure **"Enable email confirmations"** is turned OFF (for easier testing)
3. Add your site URL to **Site URL**:
   - Local: `http://localhost:5173`
   - Production: `https://your-site.netlify.app`

### 3. Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://uvpiquvbgrdtjlixqmlt.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_D8QeDOQCzrZ0JWVD7LTPjw_WRWV8hzu
```

## 📊 Database Schema

### Tables Created:
- `profiles` - User profiles with email, name, avatar
- `clients` - Client management data
- `projects` - Project tracking
- `services` - Service offerings

### Security:
- ✅ Row Level Security (RLS) enabled
- ✅ Users can only access their own data
- ✅ Automatic user profile creation on signup

## 🔐 Authentication Features

- **Email & Password** authentication
- **User registration** with email confirmation (optional)
- **Session management** - users stay logged in
- **Profile management** - names, avatars, preferences
- **Secure logout** - clear all sessions

## 📁 New Files Structure

```
project/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── contexts/
│   └── SupabaseAuthContext.tsx # Authentication state management
├── components/
│   └── SupabaseLogin.tsx    # Login/Register component
├── supabase/
│   └── schema.sql           # Database schema
├── SupabaseApp.tsx          # Main app with Supabase integration
└── .env.example             # Environment variables template
```

## 🚀 Features Available

### Authentication:
- ✅ Register new users
- ✅ Login existing users
- ✅ Session persistence
- ✅ User profiles
- ✅ Email verification (optional)

### Database:
- ✅ Secure user data storage
- ✅ Client management
- ✅ Project tracking
- ✅ Service catalog
- ✅ Real-time updates (future feature)

## 🎯 Benefits of Supabase

1. **Complete Backend** - Auth, DB, Storage, Real-time
2. **Easy to Use** - Simple JavaScript client
3. **Secure by Default** - RLS, JWT tokens, secure API
4. **Scalable** - Built on PostgreSQL
5. **Free Tier** - Generous free plan for development
6. **Great Dashboard** - Visual database management

## 🔧 Development

Run the app:
```bash
npm run dev
```

Test authentication:
1. Register a new account
2. Check email (if confirmation enabled)
3. Login with your credentials
4. You should see the CRM dashboard!

## 🌐 Deployment

For Netlify deployment:
1. Add Supabase URL and Anon Key to environment variables
2. Deploy as normal
3. Update Site URL in Supabase settings

## 🤝 Need Help?

- Supabase Documentation: https://supabase.com/docs
- This CRM now has a complete, production-ready backend!