-- Fix the is_creator flag for existing users
-- Run this in Supabase SQL Editor

-- Update your existing profile to be a creator
UPDATE profiles
SET is_creator = true,
    creator_joined_at = NOW()
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);

-- Or update ALL profiles to be creators (if testing)
-- UPDATE profiles SET is_creator = true, creator_joined_at = NOW();

-- Verify the update
SELECT id, username, is_creator, creator_joined_at 
FROM profiles 
WHERE is_creator = true;

