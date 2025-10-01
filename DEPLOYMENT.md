# Deployment Guide

## Prerequisites

- Completed database setup (see `database/setup.md`)
- Built project (`npm run build`)
- Chosen hosting platform

## Recommended Hosting Platforms

### 1. Vercel (Recommended)

**Why Vercel:**
- Zero configuration for Vite projects
- Automatic HTTPS
- Global CDN
- Free tier available

**Steps:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to project settings
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_SUPABASE_ANON_KEY`

4. Redeploy after setting variables

**Custom Domain:**
- Go to project settings → Domains
- Add your custom domain
- Update DNS records as instructed

### 2. Netlify

**Steps:**

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Set environment variables:
```bash
netlify env:set VITE_SUPABASE_URL "your_url"
netlify env:set VITE_SUPABASE_SUPABASE_ANON_KEY "your_key"
```

### 3. Cloudflare Pages

**Steps:**

1. Push code to GitHub/GitLab
2. Go to Cloudflare Pages dashboard
3. Connect your repository
4. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variables in settings

## Environment Variables

All hosting platforms need these environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_SUPABASE_ANON_KEY=your_anon_key
```

Get these from:
- Supabase Dashboard → Settings → API

## Post-Deployment Checklist

### 1. Test Invite Links

Visit: `https://your-domain.com/invite/{test-guid}`

Use one of the test GUIDs from seed data:
- `550e8400-e29b-41d4-a716-446655440001`

### 2. Test Full Flow

1. Click "I'll come"
2. Button morphs to "Satisfy my curiosity"
3. Fill out questionnaire
4. Submit successfully
5. Address reveal works

### 3. Check Admin Dashboard

Visit: `https://your-domain.com/admin`

Verify:
- Guest list loads
- Stats show correct numbers
- Activities are tracked

### 4. Verify Analytics

1. Visit an invite page
2. Check Supabase → Table Editor → guest_activities
3. Confirm events are being logged

### 5. Test on Mobile

- Open invite on mobile device
- Check responsive layout
- Test all interactions
- Verify images load correctly

## Domain Configuration

### Custom Domain Setup

1. Purchase domain (Google Domains, Namecheap, etc.)
2. Point DNS to hosting provider:
   - For Vercel: Add CNAME record pointing to `cname.vercel-dns.com`
   - For Netlify: Add CNAME record pointing to your Netlify subdomain
   - For Cloudflare: Use Cloudflare nameservers

3. Wait for DNS propagation (up to 48 hours, usually minutes)
4. Enable HTTPS in hosting dashboard (automatic)

### SSL Certificate

All recommended platforms provide free SSL automatically via Let's Encrypt.

## Performance Optimization

### Image Optimization

1. **Hero Background**: Already optimized at ~500KB
2. **Portrait Images**: Should be:
   - Format: WebP or JPEG
   - Size: 1200x1600 pixels
   - Quality: 80-85%
   - File size: < 200KB each

Use tools like:
- TinyPNG
- Squoosh
- ImageOptim

### CDN Configuration

Images should be served from:
- Supabase Storage (has built-in CDN)
- Cloudinary
- imgix
- Cloudflare Images

Update URLs in `media` table to point to CDN.

### Caching Headers

Most hosting platforms set optimal cache headers automatically.

For custom servers, set:
```
Cache-Control: public, max-age=31536000, immutable
```

For HTML:
```
Cache-Control: public, max-age=0, must-revalidate
```

## Monitoring

### Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/vue
```

In `src/main.js`:
```javascript
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: 'your_sentry_dsn',
  environment: import.meta.env.MODE
})
```

### Analytics

Consider adding:
- Google Analytics 4
- Plausible Analytics
- Fathom Analytics

### Database Monitoring

In Supabase dashboard:
- Enable database backups (Settings → Database → Backups)
- Monitor query performance (Database → Query Performance)
- Set up alerts for errors

## Scaling Considerations

### Database

For 100+ guests:
- Current free tier is sufficient
- Upgrade to Pro if needed ($25/month)

For 500+ guests:
- Consider connection pooling
- Enable read replicas in Supabase

### Frontend

- All platforms auto-scale
- Vite build is already optimized
- Images should be on CDN

### Rate Limiting

If experiencing abuse, add rate limiting:
- Cloudflare (automatic in free tier)
- Vercel Edge Config
- Supabase Auth (built-in)

## Backup Strategy

### Database Backups

In Supabase:
1. Enable automatic daily backups
2. Before major changes, create manual backup
3. Download backup SQL occasionally

### Code Backups

- Push to GitHub/GitLab regularly
- Tag releases: `git tag v1.0.0`
- Keep deployment history in hosting platform

## Rollback Procedure

If deployment fails:

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
Go to Deploys → Click previous deployment → "Publish deploy"

**Cloudflare:**
Go to Deployments → Click previous → "Retry deployment"

## Security Checklist

- [ ] Environment variables set correctly
- [ ] Supabase RLS policies active
- [ ] HTTPS enabled and forced
- [ ] Database backups enabled
- [ ] Admin routes protected (consider adding auth)
- [ ] Test invite GUIDs removed or updated
- [ ] CORS configured if needed
- [ ] Rate limiting enabled

## Going Live

1. Complete all checklist items above
2. Test with 2-3 real guests
3. Gather feedback
4. Fix any issues
5. Send to all guests
6. Monitor analytics daily
7. Be ready to fix issues quickly

## Support

If issues arise:
- Check hosting platform status page
- Review Supabase logs
- Check browser console for errors
- Review recent deployments
- Contact hosting platform support

## Cost Estimate

**Free Tier (sufficient for most weddings):**
- Supabase: Free (up to 500MB database, 2GB bandwidth/month)
- Vercel/Netlify: Free (100GB bandwidth/month)
- Domain: $10-15/year

**If you exceed free tier:**
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Total: ~$45/month (only needed if >1000 guests or very active)

For a wedding with 100-200 guests, free tier is completely sufficient.
