# Environment Variables Setup Guide

This guide shows you how to configure the environment variables for your Blood Connect application.

## 🔧 **Required Environment Variables**

### **For Vercel Deployment:**

Go to your Vercel project → Settings → Environment Variables and add:

#### **1. Supabase Configuration**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### **2. Redirect URL Configuration**
```env
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://uyirthuli-final.vercel.app/dashboard
```

#### **3. Database Configuration (for Prisma)**
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

#### **4. Optional Configuration**
```env
NEXT_PUBLIC_BASE_URL=https://uyirthuli-final.vercel.app
```

## 📋 **Step-by-Step Setup**

### **1. Get Supabase Credentials**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **2. Get Database Connection String**

1. In Supabase Dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Select **URI** format
4. Copy the connection string → `DATABASE_URL`
5. Replace `[YOUR-PASSWORD]` with your actual database password

### **3. Set Up Vercel Environment Variables**

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:

   **Variable 1:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://your-project-ref.supabase.co`
   - **Environment**: Production, Preview, Development
   - Click **Save**

   **Variable 2:**
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `your-supabase-anon-key`
   - **Environment**: Production, Preview, Development
   - Click **Save**

   **Variable 3:**
   - **Name**: `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
   - **Value**: `https://uyirthuli-final.vercel.app/dashboard`
   - **Environment**: Production, Preview, Development
   - Click **Save**

   **Variable 4:**
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
   - **Environment**: Production, Preview, Development
   - Click **Save**

### **4. Configure Supabase OAuth**

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials
4. Set **Redirect URL** to: `https://uyirthuli-final.vercel.app/auth/callback`
5. Set **Site URL** to: `https://uyirthuli-final.vercel.app`

## 🔄 **How the Redirect URL Works**

The `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` environment variable is used in several places:

### **1. Google OAuth Flow**
- User clicks "Continue with Google"
- Redirects to Google OAuth
- Google redirects to `/auth/callback`
- Callback exchanges code for session
- Redirects to `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (dashboard)

### **2. Email Sign-up**
- User signs up with email
- Email confirmation redirects to `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

### **3. Session Management**
- When user is already logged in, redirects to `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
- Auth state changes redirect to `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

## 🧪 **Testing the Configuration**

### **1. Health Check**
Visit: `https://uyirthuli-final.vercel.app/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": {
    "supabaseUrl": "configured",
    "supabaseAnonKey": "configured",
    "databaseUrl": "configured",
    "nodeEnv": "production"
  }
}
```

### **2. OAuth Flow Test**
1. Go to `https://uyirthuli-final.vercel.app`
2. Click "Continue with Google"
3. Complete Google authentication
4. Should redirect to `https://uyirthuli-final.vercel.app/dashboard`

### **3. Email Login Test**
1. Go to `https://uyirthuli-final.vercel.app`
2. Enter email and password
3. Click "Login"
4. Should redirect to `https://uyirthuli-final.vercel.app/dashboard`

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **"Authentication failed" Error**
- Check that `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set correctly
- Verify Supabase OAuth configuration
- Ensure redirect URL matches in Supabase settings

#### **Redirect Loop**
- Check that environment variables are set for the correct environment
- Verify the redirect URL doesn't have trailing spaces
- Ensure Supabase project is active

#### **Session Not Persisting**
- Check that cookies are being set properly
- Verify middleware configuration
- Ensure Supabase client is configured correctly

## 📊 **Environment Variable Summary**

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Post-auth redirect URL | `https://uyirthuli-final.vercel.app/dashboard` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@db.abc123.supabase.co:5432/postgres` |

## ✅ **Success Checklist**

- [ ] All environment variables set in Vercel
- [ ] Supabase OAuth configured with correct redirect URL
- [ ] Health endpoint returns "healthy" status
- [ ] Google OAuth redirects to dashboard
- [ ] Email login redirects to dashboard
- [ ] Session persists after page refresh
- [ ] No authentication errors in console

Your Blood Connect application should now work correctly with the proper redirect URL! 🎉
