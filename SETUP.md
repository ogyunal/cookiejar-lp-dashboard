# 🚀 Quick Setup Guide

Follow these steps to get CookieJar running locally in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works!)
- Git installed

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up (~2 minutes)
3. Go to Settings > API to find your credentials

### 3. Set Up Environment Variables

Create a file called `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXTAUTH_SECRET=run-this-command-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
```

**To generate a random NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Set Up Database

1. Go to your Supabase project > SQL Editor
2. Copy and paste the SQL from the "Database Setup" section below
3. Click "Run"

### 5. Set Up Storage

1. Go to Storage in Supabase
2. Create a new bucket called `games`
3. Set it to **Public**
4. Copy and paste the storage policies from the "Storage Setup" section below

### 6. Configure Authentication

1. Go to Authentication > Settings
2. Make sure "Email" is enabled
3. Under "Redirect URLs", add:
   - `http://localhost:3000/auth/verify`

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Database Setup

Run this SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  review_status TEXT DEFAULT 'pending',
  is_active BOOLEAN DEFAULT false,
  total_plays INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Games policies
CREATE POLICY "Creators can view their own games"
  ON games FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert games"
  ON games FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their games"
  ON games FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their games"
  ON games FOR DELETE
  USING (auth.uid() = creator_id);

CREATE POLICY "Public can view approved games"
  ON games FOR SELECT
  USING (review_status = 'approved' AND is_active = true);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Storage Setup

After creating the `games` bucket, run these storage policies:

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'games' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'games' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public to read all game files
CREATE POLICY "Public can read game files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'games');

-- Allow authenticated users to update their files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'games' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'games' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Testing the Setup

### 1. Test Landing Page
- Navigate to `http://localhost:3000`
- Should see the beautiful landing page with hero, features, etc.

### 2. Test Sign Up
- Click "I'm a Creator" or "Sign up as a creator"
- Fill out the enrollment form
- Check your email for verification link

### 3. Test Sign In
- Go to sign in page
- Use your email and password
- Should redirect to dashboard

### 4. Test File Upload
- Go to "Upload Game"
- Try uploading a test .pck file
- Upload a thumbnail image
- Submit the form

## Common Issues

### "Supabase client error"
✅ Double-check your environment variables
✅ Make sure `.env.local` file exists and has correct values
✅ Restart your dev server after changing env vars

### "Cannot read properties of undefined"
✅ Make sure database tables are created
✅ Check that RLS policies are set up
✅ Verify you're signed in

### File upload fails
✅ Check that `games` bucket exists in Supabase Storage
✅ Verify storage policies are applied
✅ Make sure file is under 50MB

### Email not sending
✅ Check Supabase email settings
✅ In development, check Supabase > Authentication > Logs
✅ Emails might be in spam folder

## Next Steps

Once everything works locally:

1. **Add Your Logo**
   - Place logo files in `public/images/`
   - Update references in components

2. **Customize Content**
   - Edit landing page copy
   - Update colors in `tailwind.config.js`
   - Customize email templates in Supabase

3. **Deploy to Production**
   - Follow the deployment guide in README.md
   - Set up custom domains
   - Configure production environment variables

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Open an issue on GitHub
- Contact support@thecookiejar.app

Happy coding! 🍪

