## 🎯 New Creator Enrollment Workflow

## Overview

The new workflow separates user signup (mobile app) from creator enrollment (dashboard):

1. **All users sign up through the mobile app** → `is_creator = false`, `creator_status = 'user'`
2. **Users sign in to dashboard** → First-time: Creator enrollment flow
3. **Submit application** → `creator_status = 'pending'`, `is_creator = true`
4. **Admin reviews** → Approve or reject
5. **Approved creators** → Can upload games

## 🔄 Complete User Flow

### Step 1: User Signs Up (Mobile App)
```
Mobile App → Supabase Auth → Creates user in auth.users
                           → Trigger creates profile:
                              - is_creator = false
                              - creator_status = 'user'
                              - email = user's email
```

### Step 2: User Signs In to Dashboard
```
User visits: https://creator.thecookiejar.app
           or: http://localhost:3001/auth/signin

Signs in with mobile app credentials

Dashboard checks creator_status:
├─ 'user'     → Redirect to /dashboard/creator-enrollment
├─ 'pending'  → Redirect to /dashboard/pending-approval
├─ 'rejected' → Redirect to /dashboard/rejected
└─ 'approved' → Access dashboard
```

### Step 3: Creator Enrollment (First Time)
```
/dashboard/creator-enrollment

User fills out:
- Creator bio
- Years of experience (required)
- Portfolio URL
- Social links (Twitter, YouTube, itch.io)
- Agree to terms

Submit → Updates profile:
         - creator_status = 'pending'
         - is_creator = true
         - creator_application_submitted_at = NOW()
```

### Step 4: Pending Approval
```
/dashboard/pending-approval

Shows:
- Application under review message
- What happens next
- Can only sign out

Waits for admin approval
```

### Step 5: Admin Reviews (To Be Implemented)
```
Admin Panel (Future):
- View pending applications
- Review creator profile
- Approve or Reject

If Approved:
  - creator_status = 'approved'
  - creator_approved_at = NOW()

If Rejected:
  - creator_status = 'rejected'
  - creator_rejected_at = NOW()
  - creator_rejection_reason = "..."
```

### Step 6: Approved Creator
```
User signs in again:
- creator_status = 'approved'
- Access to full dashboard
- Can upload games
- View analytics
- Track earnings
```

## 🗄️ Database Schema

### profiles table columns:

```sql
- id (uuid, primary key)
- username (text)
- email (text)
- is_creator (boolean)                     -- false by default, true after enrollment
- creator_status (text)                    -- 'user', 'pending', 'approved', 'rejected'
- creator_bio (text)
- creator_joined_at (timestamp)
- creator_application_submitted_at (timestamp)
- creator_approved_at (timestamp)
- creator_rejected_at (timestamp)
- creator_rejection_reason (text)
- years_experience (text)                  -- '0-1', '1-3', '3-5', '5+'
- portfolio_url (text)
- twitter (text)
- youtube (text)
- itchio (text)
- created_at (timestamp)
```

### Creator Status Values:

| Status | Description |
|--------|-------------|
| `user` | Default - Regular user from mobile app |
| `pending` | Applied to be creator, awaiting review |
| `approved` | Approved creator, full dashboard access |
| `rejected` | Application rejected |

## 🚀 Setup Instructions

### 1. Run the SQL Migration

```bash
# Run this in Supabase SQL Editor
# File: NEW_SCHEMA_CREATOR_ENROLLMENT.sql
```

This adds:
- `creator_status` column
- Review-related columns
- Updates trigger to set default status

### 2. Update Environment Variables

No changes needed to `.env.local`

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Implement creator enrollment workflow"
git push origin main
```

Vercel will auto-deploy.

### 4. Configure Custom Domain

**Main Site:**
- Domain: `thecookiejar.app`
- Points to: Vercel deployment

**Creator Dashboard:**
- Domain: `creator.thecookiejar.app`
- Points to: Same Vercel deployment

**In Vercel Dashboard:**
1. Go to Project Settings → Domains
2. Add domain: `creator.thecookiejar.app`
3. Add DNS record:
   ```
   Type: CNAME
   Name: creator
   Value: cname.vercel-dns.com
   ```

**In Supabase:**
1. Go to Authentication → URL Configuration
2. Add redirect URLs:
   - `https://creator.thecookiejar.app/auth/callback`
   - `https://creator.thecookiejar.app/auth/verify`
3. Update Site URL: `https://thecookiejar.app`

### 5. Update Next.js Config

The app automatically handles both domains. No changes needed!

## 📱 Mobile App Integration

### Sign Up Flow (Mobile App)

```javascript
// In your React Native app
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      username: username,
    },
  },
});

// This creates:
// - User in auth.users
// - Profile with is_creator=false, creator_status='user'
```

### Redirecting to Creator Dashboard

After signup, show a message:

```javascript
// In your app after successful signup
Alert.alert(
  "Welcome to CookieJar!",
  "Want to become a creator and publish games? Visit creator.thecookiejar.app",
  [
    { text: "Maybe Later", style: "cancel" },
    { 
      text: "Become a Creator", 
      onPress: () => Linking.openURL('https://creator.thecookiejar.app/auth/signin')
    }
  ]
);
```

Or add a button in app settings:

```javascript
<Button
  title="Become a Game Creator"
  onPress={() => Linking.openURL('https://creator.thecookiejar.app/auth/signin')}
/>
```

## 🔐 Security & Permissions

### Row Level Security (RLS)

All profiles are protected by RLS:
- Users can only view/update their own profile
- Creators can only access their own games
- Admin access (future) will use service role

### Protected Routes

| Route | Access |
|-------|--------|
| `/auth/signin` | Public |
| `/dashboard/creator-enrollment` | Authenticated, status='user' |
| `/dashboard/pending-approval` | Authenticated, status='pending' |
| `/dashboard/rejected` | Authenticated, status='rejected' |
| `/dashboard/*` (other pages) | Authenticated, status='approved' |

## 🛠️ Admin Panel (To Be Implemented)

Create a separate admin panel to review applications:

```
/admin/applications

Features:
- List all pending applications
- View creator profile & portfolio
- View years of experience
- Check social links
- Approve button → Sets creator_status='approved'
- Reject button → Sets creator_status='rejected', asks for reason
- Email notifications on approve/reject
```

SQL for admin actions:

```sql
-- Approve creator
UPDATE profiles
SET creator_status = 'approved',
    creator_approved_at = NOW()
WHERE id = 'creator-uuid';

-- Reject creator
UPDATE profiles
SET creator_status = 'rejected',
    creator_rejected_at = NOW(),
    creator_rejection_reason = 'Reason here'
WHERE id = 'creator-uuid';
```

## 📧 Email Notifications (To Be Implemented)

### On Application Submitted
```
To: creator@email.com
Subject: Creator Application Received

Thank you for applying! We'll review within 24-48 hours.
```

### On Approval
```
To: creator@email.com
Subject: Creator Application Approved! 🎉

Welcome to CookieJar Creators! You can now upload games.
Visit: https://creator.thecookiejar.app
```

### On Rejection
```
To: creator@email.com
Subject: Creator Application Update

Unfortunately, we can't approve your application at this time.
Reason: {reason}
You can reapply in 30 days.
```

## 🧪 Testing the Flow

### Test as a New User

1. **Sign up in mobile app** (or create manually in Supabase)
   ```sql
   -- Create test user in Supabase SQL Editor
   -- This will trigger profile creation
   ```

2. **Sign in to creator dashboard**
   - Go to http://localhost:3001/auth/signin
   - Should redirect to `/dashboard/creator-enrollment`

3. **Fill enrollment form**
   - Add bio, experience, portfolio
   - Agree to terms
   - Submit

4. **Check pending page**
   - Should redirect to `/dashboard/pending-approval`
   - Can only sign out

5. **Approve manually** (since admin panel not built yet)
   ```sql
   UPDATE profiles
   SET creator_status = 'approved',
       creator_approved_at = NOW()
   WHERE email = 'test@example.com';
   ```

6. **Sign in again**
   - Should have full dashboard access
   - Can upload games

## 🎨 Customization

### Change Review Timeline

Update the message in `/dashboard/pending-approval.js`:
```javascript
<span>Our team will review your application within 24-48 hours</span>
```

### Add More Questions

Edit `/dashboard/creator-enrollment.js` to add fields:
```javascript
<Input
  label="Why do you want to become a creator?"
  type="textarea"
  name="motivation"
  // ...
/>
```

## 🚨 Troubleshooting

### User stuck in 'pending'
```sql
-- Check status
SELECT id, email, creator_status FROM profiles WHERE email = 'user@example.com';

-- Manually approve
UPDATE profiles SET creator_status = 'approved', creator_approved_at = NOW() 
WHERE email = 'user@example.com';
```

### User can't sign in
- Check they signed up through mobile app first
- Verify email in auth.users table
- Check profile exists and has correct email

### Dashboard access denied
- Verify creator_status = 'approved'
- Check session includes creatorStatus
- Clear browser cookies and sign in again

## ✅ Deployment Checklist

- [ ] Run SQL migration in Supabase
- [ ] Update code on GitHub
- [ ] Deploy to Vercel
- [ ] Configure `creator.thecookiejar.app` domain
- [ ] Update Supabase redirect URLs
- [ ] Test complete flow
- [ ] Update mobile app with creator link
- [ ] Build admin panel (future)
- [ ] Set up email notifications (future)

---

🎉 **You're all set!** Users can now sign up in the app and apply to become creators through the dashboard.

