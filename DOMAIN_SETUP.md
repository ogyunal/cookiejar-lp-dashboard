# 🌐 Domain Setup Guide

This guide explains how to set up the dual-domain architecture for CookieJar:
- **`thecookiejar.app`** → Main landing page
- **`creator.thecookiejar.app`** → Creator dashboard (requires `is_creator = true`)

## 📋 Architecture Overview

### Domain Routing

1. **Main Domain (`thecookiejar.app`)**
   - Shows the landing page only
   - Any attempts to access `/dashboard` or `/auth` routes are redirected to `creator.thecookiejar.app`

2. **Creator Subdomain (`creator.thecookiejar.app`)**
   - Accessing root (`/`) redirects to `/dashboard/overview`
   - If not authenticated → Redirects to `/auth/signin`
   - If authenticated but `is_creator = false` → Shows "Access Denied" message
   - If authenticated and `is_creator = true`:
     - `creator_status = 'user'` → Redirects to enrollment flow
     - `creator_status = 'pending'` → Shows pending approval page
     - `creator_status = 'approved'` → Full dashboard access
     - `creator_status = 'rejected'` → Shows rejection page

### Code Changes Made

1. **`middleware.js`** (NEW)
   - Enforces domain-based routing
   - Redirects dashboard/auth routes from main domain to creator subdomain
   - Redirects landing page routes from creator subdomain to main domain

2. **`next.config.js`**
   - Updated `images.domains` to include `creator.thecookiejar.app`
   - Maintains `/dashboard` to `/dashboard/overview` redirect

3. **`components/dashboard/DashboardLayout.js`**
   - Added explicit `is_creator` check
   - Shows "Access Denied" message for non-creators
   - Maintains creator status flow (enrollment, pending, approved, rejected)

4. **`pages/index.js`**
   - Added detection for creator subdomain
   - Redirects to `/dashboard/overview` if on creator domain

5. **Landing Page Components**
   - Updated all "Creator Dashboard" links to use absolute URLs
   - Points to `https://creator.thecookiejar.app/auth/signin` (or localhost for dev)

## 🚀 Vercel Deployment

### Step 1: Add Domains in Vercel

1. Go to your Vercel Dashboard
2. Select your `cookiejar-lp-dashboard` project
3. Go to **Settings → Domains**
4. Add both domains:
   - `thecookiejar.app` (main site)
   - `creator.thecookiejar.app` (dashboard)

Both domains point to the **same Vercel project**. The middleware handles routing.

### Step 2: DNS Configuration

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

```
Type    Name      Value                    TTL
A       @         76.76.21.21             Auto  (for thecookiejar.app)
CNAME   www       cname.vercel-dns.com    Auto
CNAME   creator   cname.vercel-dns.com    Auto  ← Add this!
```

**DNS propagation can take 5-60 minutes.**

### Step 3: Environment Variables

In Vercel **Settings → Environment Variables**, ensure you have:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# NextAuth
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=https://creator.thecookiejar.app

# Note: NEXTAUTH_URL should point to the creator subdomain
```

### Step 4: Deploy

```bash
git add .
git commit -m "Setup dual-domain architecture"
git push
```

Vercel will automatically deploy. Both domains will be served from the same deployment.

## 🔐 Supabase Configuration

### Step 1: Update Redirect URLs

Go to **Supabase Dashboard → Authentication → URL Configuration**:

**Site URL:**
```
https://thecookiejar.app
```

**Redirect URLs (add all of these):**
```
https://creator.thecookiejar.app/auth/callback
https://creator.thecookiejar.app/auth/verify
https://creator.thecookiejar.app/api/auth/callback/credentials
http://localhost:3000/auth/callback
http://localhost:3000/auth/verify
http://localhost:3000/api/auth/callback/credentials
```

### Step 2: Verify Database Schema

Ensure your `profiles` table has these columns:
```sql
- id (uuid, primary key)
- email (text)
- username (text)
- avatar_url (text)
- bio (text)
- is_creator (boolean, default: false)
- creator_status (text, default: 'user')
- creator_experience (text)
- portfolio_link (text)
- social_links (jsonb)
- created_at (timestamp)
- updated_at (timestamp)
```

Run the migration script if needed:
```bash
psql -f NEW_SCHEMA_CREATOR_ENROLLMENT.sql
```

## 🧪 Testing

### Local Development

For local testing, everything runs on `localhost:3000`:
- Landing page: `http://localhost:3000/`
- Creator dashboard: `http://localhost:3000/dashboard/overview`
- Sign in: `http://localhost:3000/auth/signin`

The middleware detects localhost and allows both domains to work on the same port.

### Production Testing

Once DNS propagates and domains are configured:

1. **Test Main Domain:**
   ```
   Visit: https://thecookiejar.app
   Expected: Landing page
   Click "Creator Dashboard" → Should redirect to creator.thecookiejar.app/auth/signin
   ```

2. **Test Creator Subdomain (Not Authenticated):**
   ```
   Visit: https://creator.thecookiejar.app
   Expected: Redirect to /auth/signin
   ```

3. **Test Creator Subdomain (Authenticated, Not Creator):**
   ```
   Sign in with a regular user (is_creator = false)
   Expected: "Access Denied" message
   ```

4. **Test Creator Subdomain (Authenticated, Is Creator):**
   ```
   Sign in with a creator (is_creator = true)
   Expected: Dashboard access based on creator_status
   ```

## 🔍 Troubleshooting

### Domain not working?
- **Wait longer** - DNS propagation can take up to 60 minutes
- Check DNS propagation: https://dnschecker.org
- Verify CNAME record points to `cname.vercel-dns.com`

### SSL Certificate issues?
- Vercel auto-provisions Let's Encrypt certificates
- Takes 5-10 minutes after DNS propagates
- Should show "Valid Configuration" ✅ in Vercel

### Authentication not working?
- Verify redirect URLs in Supabase
- Check `NEXTAUTH_URL` environment variable
- Check browser console for errors
- Ensure cookies are enabled

### "Access Denied" for creators?
- Check `is_creator` flag in Supabase database:
  ```sql
  SELECT id, email, is_creator, creator_status FROM profiles WHERE email = 'user@example.com';
  ```
- Update if needed:
  ```sql
  UPDATE profiles SET is_creator = true WHERE email = 'user@example.com';
  ```

### Infinite redirects?
- Clear browser cache and cookies
- Check middleware.js logic
- Verify environment variables are set correctly

## ✅ Quick Checklist

- [ ] Both domains added in Vercel (`thecookiejar.app` and `creator.thecookiejar.app`)
- [ ] DNS records configured (A record for main, CNAME for creator)
- [ ] Wait for DNS propagation (5-60 min)
- [ ] SSL certificates provisioned in Vercel ✅
- [ ] Environment variables set in Vercel
- [ ] Redirect URLs added in Supabase
- [ ] Database schema updated with new columns
- [ ] Test main domain shows landing page
- [ ] Test creator domain redirects to sign in when not authenticated
- [ ] Test creator access with `is_creator = true`
- [ ] Test access denied with `is_creator = false`

## 📚 Additional Resources

- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Middleware Documentation](https://nextjs.org/docs/advanced-features/middleware)

## 🎯 Expected User Journey

1. User visits `thecookiejar.app` → Sees landing page
2. User clicks "Creator Dashboard" → Redirects to `creator.thecookiejar.app/auth/signin`
3. User signs in:
   - **If `is_creator = false`:** Shows "Access Denied" (mobile app users)
   - **If `is_creator = true` and `creator_status = 'user'`:** Goes to enrollment flow
   - **If `is_creator = true` and `creator_status = 'pending'`:** Shows pending approval page
   - **If `is_creator = true` and `creator_status = 'approved'`:** Full dashboard access ✅
   - **If `is_creator = true` and `creator_status = 'rejected'`:** Shows rejection page

---

**Done!** Your dual-domain architecture is now set up. The main site stays clean on `thecookiejar.app` while creators get their own dedicated subdomain at `creator.thecookiejar.app`. 🎉

