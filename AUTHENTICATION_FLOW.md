# 🔐 Authentication Flow Documentation

This document explains the complete authentication flow for CookieJar's dual-domain architecture.

---

## 🎯 Overview

- **Main Site (`thecookiejar.app`)**: Landing page only, no authentication
- **Creator Dashboard (`creator.thecookiejar.app`)**: Sign-in required, only shows login page when NOT authenticated

---

## 📋 User Flows

### 1️⃣ NOT Signed In → Visit Creator Subdomain

```
User visits: creator.thecookiejar.app
    ↓
Middleware redirects to: /dashboard/overview
    ↓
DashboardLayout checks authentication
    ↓
status = 'unauthenticated'
    ↓
Redirects to: /auth/signin
    ↓
Shows login page ✅
```

**Result:** User sees the login page at `creator.thecookiejar.app/auth/signin`

---

### 2️⃣ Already Signed In → Visit Creator Subdomain

```
User visits: creator.thecookiejar.app
    ↓
Middleware redirects to: /dashboard/overview
    ↓
DashboardLayout checks authentication
    ↓
status = 'authenticated' && is_creator = true
    ↓
Checks creator_status:
    ↓
┌───────────────┬──────────────┬────────────┐
│ 'user'        │ 'pending'    │ 'approved' │
└───────────────┴──────────────┴────────────┘
       ↓              ↓              ↓
   Enrollment    Pending Page   Dashboard ✅
```

**Result:** User goes directly to dashboard (or appropriate status page), NO login page shown

---

### 3️⃣ Already Signed In → Try to Access Login Page

```
User visits: creator.thecookiejar.app/auth/signin
    ↓
SignIn page useEffect checks session
    ↓
status = 'authenticated'
    ↓
Redirects to: /dashboard/overview
    ↓
Shows dashboard ✅
```

**Result:** User is immediately redirected to dashboard, login page is NOT shown

---

### 4️⃣ NOT Signed In → Sign In Successfully

```
User fills login form at /auth/signin
    ↓
Submits credentials
    ↓
NextAuth authenticates
    ↓
Redirects to: /dashboard/overview
    ↓
DashboardLayout checks:
  - is_creator = true ✅
  - creator_status = 'approved' ✅
    ↓
Shows dashboard ✅
```

**Result:** User sees dashboard immediately after successful login

---

### 5️⃣ Mobile App User → Try to Access Dashboard

```
User signs in (has account from mobile app)
    ↓
is_creator = false
    ↓
DashboardLayout checks is_creator
    ↓
Shows: "Access Denied" message
    ↓
Button: "Go to Home" → thecookiejar.app
```

**Result:** Mobile app users cannot access creator dashboard

---

## 🔒 Security Layers

### Layer 1: Middleware (Edge)
- **Location:** `middleware.js`
- **Purpose:** Route traffic based on domain
- **Actions:**
  - Main domain → Only landing page
  - Creator domain root → Redirect to `/dashboard/overview`
  - Dashboard/auth routes on main domain → Redirect to creator subdomain

### Layer 2: Sign-In Page
- **Location:** `pages/auth/signin.js`
- **Purpose:** Only show login to unauthenticated users
- **Actions:**
  - Check session status on load
  - If `status === 'authenticated'` → Redirect to dashboard
  - If `status === 'unauthenticated'` → Show login form

### Layer 3: Dashboard Layout
- **Location:** `components/dashboard/DashboardLayout.js`
- **Purpose:** Protect all dashboard pages
- **Actions:**
  - If `status === 'unauthenticated'` → Redirect to `/auth/signin`
  - If `is_creator === false` → Show "Access Denied"
  - If `creator_status` needs action → Redirect to appropriate page

### Layer 4: Database (Supabase RLS)
- **Location:** Supabase database
- **Purpose:** Protect data at database level
- **Actions:**
  - Users can only read/write their own data
  - Creators can only modify their own games

---

## 🛠 Code Implementation

### `pages/auth/signin.js` - Auto-redirect when authenticated

```javascript
import { useSession } from 'next-auth/react';

export default function SignIn() {
  const { data: session, status } = useSession();

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard/overview');
    }
  }, [status, router]);

  // Show loading while checking auth
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  // If authenticated, show loading (while redirecting)
  if (status === 'authenticated') {
    return <LoadingSpinner />;
  }

  // Only show login form if NOT authenticated
  return <LoginForm />;
}
```

### `middleware.js` - Root redirect on creator domain

```javascript
// Creator subdomain (creator.thecookiejar.app) logic
if (isCreatorDomain || isLocalhost) {
  // If on root path, redirect to dashboard
  if (isRootPath) {
    url.pathname = '/dashboard/overview';
    return NextResponse.redirect(url);
  }
  // Allow dashboard and auth routes
  if (isDashboardRoute || isAuthRoute) {
    return NextResponse.next();
  }
}
```

### `components/dashboard/DashboardLayout.js` - Authentication check

```javascript
export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();

  // Show loading
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  // Redirect to sign in if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  // Check if user is a creator
  if (!session.user.isCreator) {
    return <AccessDenied />;
  }

  // Handle creator status...
}
```

---

## ✅ Expected Behavior

### When NOT Signed In:

| URL Visited | Result |
|------------|--------|
| `thecookiejar.app` | ✅ Landing page |
| `thecookiejar.app/dashboard` | → Redirects to `creator.thecookiejar.app/dashboard/overview` → Login page |
| `creator.thecookiejar.app` | → Redirects to `/dashboard/overview` → Login page |
| `creator.thecookiejar.app/auth/signin` | ✅ Login page |
| `creator.thecookiejar.app/dashboard/overview` | → Redirects to login page |

### When Signed In (Creator):

| URL Visited | Result |
|------------|--------|
| `thecookiejar.app` | ✅ Landing page |
| `thecookiejar.app/dashboard` | → Redirects to `creator.thecookiejar.app/dashboard/overview` |
| `creator.thecookiejar.app` | → Shows dashboard ✅ |
| `creator.thecookiejar.app/auth/signin` | → Redirects to dashboard ✅ |
| `creator.thecookiejar.app/dashboard/overview` | ✅ Dashboard |

### When Signed In (NOT Creator):

| URL Visited | Result |
|------------|--------|
| `thecookiejar.app` | ✅ Landing page |
| `thecookiejar.app/dashboard` | → Redirects to `creator.thecookiejar.app` → "Access Denied" |
| `creator.thecookiejar.app` | ⛔ "Access Denied" message |
| `creator.thecookiejar.app/auth/signin` | → Redirects to dashboard → "Access Denied" |
| `creator.thecookiejar.app/dashboard/*` | ⛔ "Access Denied" message |

---

## 🧪 Testing

### Test 1: Login Page Only Shows When NOT Authenticated

```bash
# 1. Open incognito window
# 2. Visit creator.thecookiejar.app
# Expected: See login page ✅

# 3. Sign in with creator account
# Expected: Dashboard appears immediately ✅

# 4. Try to visit /auth/signin again
# Expected: Immediately redirected to dashboard ✅
```

### Test 2: Already Signed In → No Login Page

```bash
# 1. Sign in to creator dashboard
# 2. Close tab
# 3. Visit creator.thecookiejar.app again
# Expected: Dashboard appears immediately, NO login page ✅

# 4. Try to visit /auth/signin directly
# Expected: Redirected to dashboard ✅
```

### Test 3: Mobile App User Cannot Access

```bash
# 1. Sign up via mobile app (is_creator = false)
# 2. Visit creator.thecookiejar.app/auth/signin
# 3. Sign in with mobile app credentials
# Expected: "Access Denied" message ✅
```

---

## 🐛 Troubleshooting

### Issue: Login page shows briefly even when authenticated
**Cause:** Session check is slow
**Solution:** Already implemented loading spinner while checking `status === 'loading'`

### Issue: Infinite redirect loop
**Cause:** Middleware or auth logic conflict
**Solution:** Check that:
1. Middleware allows `/auth/signin` on creator domain
2. DashboardLayout redirects to `/auth/signin` when unauthenticated
3. SignIn page redirects to `/dashboard/overview` when authenticated

### Issue: "Access Denied" for actual creators
**Cause:** `is_creator` flag not set
**Solution:** Check database:
```sql
SELECT id, email, is_creator, creator_status 
FROM profiles 
WHERE email = 'creator@example.com';
```

---

## 📝 Summary

✅ **Login page ONLY shows when NOT authenticated**  
✅ **Authenticated users go directly to dashboard**  
✅ **No login page after successful sign-in**  
✅ **`creator.thecookiejar.app` handles both scenarios automatically**  
✅ **Multiple security layers protect the dashboard**  

The authentication flow is seamless and secure! 🎉

