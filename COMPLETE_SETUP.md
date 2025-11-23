# ✅ Complete Setup Guide

## 🎯 What You Need to Do Now

### Step 1: Update Your Supabase Schema

Run `UPDATE_PROFILES_SCHEMA.sql` in your Supabase SQL Editor:

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy contents of `UPDATE_PROFILES_SCHEMA.sql`
4. Click **Run**

This will:
- ✅ Add `email` column to profiles table
- ✅ Update trigger to include email when creating profiles
- ✅ Set correct RLS policies
- ✅ Sync existing profiles with auth.users emails

### Step 2: Disable Email Confirmation (For Development)

1. Go to **Authentication → Settings**
2. Find "Enable email confirmations"
3. **Turn it OFF**
4. Click Save

**For Production:** Leave this ON and implement proper email verification flow

### Step 3: Test the Signup Flow

1. Go to http://localhost:3001 (or 3000)
2. Click "I'm a Creator" or "Sign up as a creator"
3. Fill in the enrollment form:
   - Username
   - Email
   - Password
   - Bio (optional)
   - Experience level
4. Agree to terms
5. Click "Create Account"

### Step 4: Verify It Worked

Check in Supabase:

**Authentication → Users:**
- Your user should be listed
- Email confirmed status

**Table Editor → profiles:**
```sql
SELECT id, username, email, is_creator, creator_joined_at, created_at
FROM profiles
WHERE is_creator = true;
```

You should see:
- ✅ Your username
- ✅ Your email
- ✅ `is_creator = true`
- ✅ `creator_joined_at` timestamp

### Step 5: Sign In

1. Go to sign in page
2. Enter your email and password
3. Should redirect to dashboard

## 📊 How It Works Now

### Signup Flow:
1. User fills enrollment form on creator dashboard
2. **Supabase Auth** creates user in `auth.users`
3. **Database Trigger** automatically creates profile in `profiles` table:
   - Sets `email` from auth.users
   - Sets `username` from signup metadata
   - Sets `is_creator = false` (default)
   - Creates timestamp
4. **Enrollment Code** updates the profile:
   - Updates `username` to user's choice
   - Sets `is_creator = true` ← **This is the key!**
   - Sets `creator_bio`
   - Sets `creator_joined_at`

### Regular User vs Creator:
- **Regular User**: Signs up through mobile app → `is_creator = false`
- **Creator**: Signs up through dashboard → `is_creator = true`

### Sign In Flow:
1. User enters email + password
2. NextAuth validates with Supabase
3. Fetches profile from `profiles` table
4. **Checks `is_creator` flag**
5. If `is_creator = true` → Allow access to dashboard
6. If `is_creator = false` → Show error message

## 🗄️ Updated Database Schema

### profiles table:
```sql
- id (uuid, primary key, references auth.users)
- username (text)
- email (text)              ← Added!
- is_creator (boolean)      ← Critical for dashboard access
- creator_bio (text)
- creator_joined_at (timestamp)
- created_at (timestamp)
```

### Row Level Security Policies:
- Users can INSERT their own profile
- Users can SELECT their own profile  
- Users can UPDATE their own profile
- Creators can only see their own data

## 🐛 Troubleshooting

### "Email not confirmed"
- Disable email confirmation in Supabase settings (dev only)
- OR check your email inbox for verification link

### "User is not a creator"
- Check profiles table: `is_creator` should be `true`
- Run this SQL to fix:
```sql
UPDATE profiles 
SET is_creator = true, creator_joined_at = NOW()
WHERE email = 'your-email@example.com';
```

### "Profile not found"
- Check if profile exists in profiles table
- Run the trigger manually:
```sql
SELECT handle_new_user();
```

### "Row violates RLS policy"
- Make sure you ran `UPDATE_PROFILES_SCHEMA.sql`
- Verify policies exist:
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## ✨ Next Steps After Setup

1. **Test Upload:** Try uploading a game
2. **Check Analytics:** View the analytics page
3. **Test Settings:** Update your profile
4. **Mobile App Integration:** Connect your React Native app to same Supabase

## 📝 Important Notes

- **Email is managed by auth.users** - Don't allow manual editing in settings
- **is_creator flag** determines dashboard access
- **Profiles table** stores both regular users and creators
- **creator_joined_at** tracks when someone became a creator

## 🎉 You're All Set!

Once you run the SQL and test signup, your dashboard is fully functional!

