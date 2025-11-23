-- New Creator Enrollment Schema
-- Run this in Supabase SQL Editor

-- 1. Add creator_status column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS creator_status TEXT DEFAULT 'user';
-- Possible values: 'user', 'pending', 'approved', 'rejected'

-- 2. Add review-related columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS creator_application_submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS creator_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS creator_rejected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS creator_rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS years_experience TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS youtube TEXT,
ADD COLUMN IF NOT EXISTS itchio TEXT;

-- 3. Update the trigger to NOT set is_creator automatically
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    email,
    is_creator,
    creator_status,
    created_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8)),
    NEW.email,
    false,  -- Always false initially (set by enrollment)
    'user', -- Default status
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Update existing users (for testing)
-- This keeps existing creators as approved
UPDATE profiles
SET creator_status = 'approved',
    creator_approved_at = NOW()
WHERE is_creator = true AND creator_status = 'user';

-- 6. View the updated schema
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

