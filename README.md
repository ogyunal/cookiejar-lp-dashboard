# 🍪 CookieJar Landing Page & Creator Dashboard

A beautiful, production-ready landing page and creator dashboard for **CookieJar** - a TikTok-style game discovery platform where users swipe through bite-sized Godot games.

## 🎯 Overview

CookieJar is a mobile game discovery platform (iOS/Android) that lets users:
- Swipe through bite-sized Godot games in a TikTok-like feed
- Play games instantly without downloads (streaming architecture)
- Discover indie games from creators worldwide

This repository contains:
- **Public Landing Page** (`thecookiejar.app`) - Marketing site for players
- **Creator Dashboard** (`dashboard.thecookiejar.app`) - Upload games, track analytics, manage earnings

## 🚀 Tech Stack

- **Framework:** Next.js 13+ with Pages Router
- **Language:** JavaScript
- **Styling:** Tailwind CSS + DaisyUI
- **Authentication:** NextAuth.js
- **Backend:** Supabase (Auth, Database, Storage)
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Hosting:** Vercel

## 📁 Project Structure

```
cookiejar-landing/
├── pages/
│   ├── index.js                    # Landing page
│   ├── dashboard/
│   │   ├── overview.js            # Dashboard home
│   │   ├── games.js               # My games
│   │   ├── upload.js              # Upload new game
│   │   ├── analytics.js           # Analytics & stats
│   │   ├── earnings.js            # Revenue tracking
│   │   └── settings.js            # Account settings
│   ├── auth/
│   │   ├── signin.js              # Sign in page
│   │   └── verify.js              # Email verification
│   └── api/
│       └── auth/
│           └── [...nextauth].js   # NextAuth config
├── components/
│   ├── landing/                   # Landing page components
│   ├── dashboard/                 # Dashboard components
│   ├── modals/                    # Modal components
│   └── shared/                    # Reusable components
├── lib/
│   ├── supabase.js                # Supabase client
│   └── utils.js                   # Helper functions
├── styles/
│   └── globals.css                # Global styles
└── public/
    └── images/                    # Static assets
```

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cookiejar-lp-dashboard.git
cd cookiejar-lp-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# For production:
# NEXTAUTH_URL=https://dashboard.thecookiejar.app
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Set Up Supabase

#### Database Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  is_creator BOOLEAN DEFAULT false,
  creator_bio TEXT,
  creator_joined_at TIMESTAMP WITH TIME ZONE,
  twitter TEXT,
  youtube TEXT,
  itchio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  pck_url TEXT,
  category TEXT,
  version TEXT DEFAULT '1.0.0',
  review_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  is_active BOOLEAN DEFAULT false,
  total_plays INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for games
CREATE POLICY "Creators can view their own games" ON games
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own games" ON games
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own games" ON games
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own games" ON games
  FOR DELETE USING (auth.uid() = creator_id);

-- Public can view approved games
CREATE POLICY "Public can view approved games" ON games
  FOR SELECT USING (review_status = 'approved' AND is_active = true);
```

#### Storage Buckets

1. Create a bucket called `games` in Supabase Storage
2. Set up the following policies:

```sql
-- Allow creators to upload to their own folders
CREATE POLICY "Creators can upload games"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'games' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow creators to read their own files
CREATE POLICY "Creators can read their files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'games' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public to read approved game files
CREATE POLICY "Public can read game files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'games');
```

#### Authentication Settings

1. Go to Authentication > Settings in Supabase
2. Enable Email authentication
3. Add redirect URLs:
   - `http://localhost:3000/auth/verify` (development)
   - `https://dashboard.thecookiejar.app/auth/verify` (production)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Configure Domains:**
   - Main site: `thecookiejar.app`
   - Dashboard: `dashboard.thecookiejar.app`

4. **Set Environment Variables:**
   - Go to Vercel dashboard > Settings > Environment Variables
   - Add all variables from `.env.local`
   - Make sure to set `NEXTAUTH_URL` to your production URL

### Post-Deployment

1. Update Supabase redirect URLs with production domains
2. Test authentication flow
3. Test file uploads to Supabase Storage
4. Verify all pages load correctly

## 🎨 Features

### Landing Page
- ✅ Beautiful hero section with animations
- ✅ Feature highlights
- ✅ How it works section
- ✅ Creator benefits showcase
- ✅ Responsive design (mobile-first)
- ✅ SEO optimized

### Creator Dashboard
- ✅ **Overview:** Stats, charts, recent games
- ✅ **My Games:** Grid/list view, search, filters
- ✅ **Upload:** Drag & drop file upload, thumbnail preview
- ✅ **Analytics:** Charts, metrics, player data
- ✅ **Earnings:** Revenue tracking, payout management
- ✅ **Settings:** Profile, account, notifications

### Authentication
- ✅ Email/password sign in
- ✅ Multi-step creator enrollment
- ✅ Email verification
- ✅ Protected routes
- ✅ Session management

## 📊 Database Schema

### `profiles`
- User profile information
- Creator status and bio
- Social links

### `games`
- Game metadata (title, description, category)
- File URLs (pck, thumbnail)
- Review status
- Play counts and analytics

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Creators can only access their own data
- File uploads are scoped to creator folders
- Protected routes require authentication
- CSRF protection via NextAuth

## 🎯 Next Steps

1. **Add Logo Files:**
   - Place logo files in `public/images/`
   - Update references in components

2. **Configure Analytics:**
   - Add Google Analytics or similar
   - Track conversions and user behavior

3. **Set Up Email Templates:**
   - Customize Supabase email templates
   - Add branding to verification emails

4. **Add Documentation:**
   - Create creator guide
   - Write API documentation (if applicable)

5. **Testing:**
   - Test on real devices
   - Verify responsive design
   - Test file upload limits

## 🐛 Troubleshooting

### "Invalid environment variables"
- Make sure `.env.local` file exists
- Check that all required variables are set
- Restart development server after changes

### Authentication Issues
- Verify Supabase credentials are correct
- Check redirect URLs are configured
- Ensure email provider is enabled

### File Upload Fails
- Check Supabase storage bucket exists
- Verify storage policies are set correctly
- Ensure file size is under 50MB limit

## 📝 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

This is a template project. Feel free to fork and customize for your needs!

## 📧 Support

For issues or questions, please open an issue on GitHub or contact support@thecookiejar.app

---

**Built with ❤️ for indie game creators**

