# 📦 Deployment Guide

Complete guide to deploying CookieJar to production.

## Prerequisites

- Vercel account (free tier works!)
- Domain names configured:
  - `thecookiejar.app` (main site)
  - `dashboard.thecookiejar.app` (creator dashboard)
- Production Supabase project set up

## Option 1: Deploy with Vercel CLI

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

Follow the prompts:
- Link to existing project? **No**
- What's your project name? **cookiejar-landing**
- In which directory is your code? **./**
- Want to override settings? **No**

### 4. Set Environment Variables

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

Or add them via the Vercel dashboard.

### 5. Deploy to Production

```bash
vercel --prod
```

## Option 2: Deploy via Vercel Dashboard

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/cookiejar-landing.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: **.**
   - Build Command: `next build`
   - Output Directory: `.next`

### 3. Add Environment Variables

In Vercel project settings > Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://dashboard.thecookiejar.app
```

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Configure Custom Domains

### Main Landing Page

1. Go to Vercel project > Settings > Domains
2. Add domain: `thecookiejar.app`
3. Follow DNS instructions to configure:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Creator Dashboard

1. Add domain: `dashboard.thecookiejar.app`
2. Configure DNS:

```
Type: CNAME
Name: dashboard
Value: cname.vercel-dns.com
```

## Update Supabase Settings

### 1. Authentication Redirect URLs

Go to Supabase > Authentication > URL Configuration:

Add redirect URLs:
- `https://dashboard.thecookiejar.app/auth/verify`
- `https://dashboard.thecookiejar.app/auth/callback`

Site URL:
- `https://thecookiejar.app`

### 2. CORS Settings

If needed, add your domains to allowed origins in Supabase settings.

## Post-Deployment Checklist

- [ ] Landing page loads at `thecookiejar.app`
- [ ] Dashboard loads at `dashboard.thecookiejar.app`
- [ ] Sign up flow works
- [ ] Email verification works
- [ ] Sign in redirects to dashboard
- [ ] File uploads work
- [ ] Analytics load correctly
- [ ] Images load (if using Supabase Storage)
- [ ] SSL certificates are active
- [ ] Favicon displays correctly

## Performance Optimization

### 1. Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `pages/_app.js`:

```javascript
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### 2. Configure Caching

In `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 3. Enable Image Optimization

Images are automatically optimized by Next.js when using `next/image`.

## Monitoring

### Set Up Error Tracking

Consider adding Sentry or similar:

```bash
npm install @sentry/nextjs
```

### Set Up Uptime Monitoring

Use services like:
- Vercel Analytics (built-in)
- UptimeRobot
- Pingdom

## CI/CD

Vercel automatically:
- ✅ Deploys on every push to main
- ✅ Creates preview deployments for PRs
- ✅ Runs build checks
- ✅ Provides deployment URLs

## Rollback

If something goes wrong:

1. Go to Vercel project > Deployments
2. Find a previous working deployment
3. Click "..." > "Promote to Production"

## Custom Domain Email

Consider setting up:
- `support@thecookiejar.app`
- `hello@thecookiejar.app`

Using services like:
- Google Workspace
- Zoho Mail
- ProtonMail

## SSL Certificates

Vercel automatically provisions SSL certificates via Let's Encrypt.

If you need custom certificates:
1. Go to Settings > Domains
2. Click on domain
3. Upload custom certificate

## Environment-Specific Configs

### Development
```
NEXTAUTH_URL=http://localhost:3000
```

### Staging (optional)
```
NEXTAUTH_URL=https://staging.dashboard.thecookiejar.app
```

### Production
```
NEXTAUTH_URL=https://dashboard.thecookiejar.app
```

## Troubleshooting

### Build Fails

Check Vercel build logs:
1. Go to Deployments
2. Click on failed deployment
3. Check "Building" logs

Common issues:
- Missing environment variables
- TypeScript errors (if any)
- Missing dependencies

### Authentication Issues

- Verify `NEXTAUTH_URL` matches your domain
- Check Supabase redirect URLs
- Ensure `NEXTAUTH_SECRET` is set

### File Upload Issues

- Check Supabase storage policies
- Verify bucket is created
- Check CORS settings

### CORS Errors

Add to `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
      ],
    },
  ];
}
```

## Scaling

As your app grows:

1. **Database**: Upgrade Supabase plan
2. **Storage**: Monitor storage usage
3. **Bandwidth**: Vercel scales automatically
4. **CDN**: Enabled by default on Vercel

## Security Checklist

- [ ] Environment variables are secret
- [ ] RLS is enabled on all tables
- [ ] HTTPS is enforced
- [ ] API routes are protected
- [ ] File uploads are validated
- [ ] Rate limiting is configured (if needed)

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Supabase: [supabase.com/support](https://supabase.com/support)

---

🎉 **Congrats on deploying CookieJar!**

