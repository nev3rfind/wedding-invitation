# Quick Start Guide

Get your wedding invitation running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works fine)

## Setup Steps

### 1. Database Setup (2 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or use existing one
3. Go to **SQL Editor**
4. Copy and paste contents of `database/schema.sql`, then click Run
5. Copy and paste contents of `database/seeds.sql`, then click Run

### 2. Environment Variables (1 minute)

Your `.env` file should already have Supabase credentials. If not, get them from:
- Supabase Dashboard → Settings → API
- Copy **Project URL** and **anon public** key

Update `.env`:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Install & Run (2 minutes)

```bash
npm install
npm run dev
```

Open browser to `http://localhost:5173`

## Test the Application

### View an Invite

Go to: `http://localhost:5173/invite/550e8400-e29b-41d4-a716-446655440001`

This is a test invite for "John Smith"

### Try the Flow

1. Click "I'll come" button
2. Watch the button morph to "Satisfy my curiosity"
3. Click it to open the questionnaire
4. Fill out the form and submit
5. See "Questions answered" and reveal address button

### View Admin Dashboard

Go to: `http://localhost:5173/admin`

See all guests, their statuses, and recent activities.

## Next Steps

### Add Your Own Guests

In Supabase SQL Editor:

```sql
INSERT INTO guest_invitations (guest_full_name, guest_call, guest_language, fly_from, status_id)
VALUES ('Jane Doe', 'Jane', 'EN', 1, 1);
```

Then get the invite link:

```sql
SELECT invite_guid FROM guest_invitations WHERE guest_full_name = 'Jane Doe';
```

Visit: `http://localhost:5173/invite/{the-guid-you-got}`

### Upload Your Portrait Photos

1. Replace the Pexels URLs in `database/seeds.sql` with your own image URLs
2. Or update directly in Supabase:

```sql
UPDATE media SET url = 'your-image-url' WHERE key = 'portrait-1';
```

Recommended image size: 1200x1600 pixels (3:4 aspect ratio)

### Customize Wedding Details

In Supabase SQL Editor:

```sql
-- Update wedding date
UPDATE settings SET value = '2026-04-05T17:00:00+07:00'
WHERE key = 'wedding.start_datetime';

-- Update venue
UPDATE settings SET value = 'Your Venue Name and Address'
WHERE key = 'wedding.venue_address';

-- Update link availability
UPDATE settings SET value = '2025-11-01T00:00:00Z'
WHERE key = 'links.available_from';
```

## Common Issues

### Can't see data on invite page
- Check browser console for errors
- Verify Supabase URL and key in `.env`
- Make sure you ran both schema.sql and seeds.sql

### Images not loading
- Check that hero-background-watercolor.png exists in `public/assets/`
- Verify portrait image URLs are accessible
- Check browser network tab for 404 errors

### Animations not working
- Make sure GSAP is installed: `npm list gsap`
- Check browser console for JavaScript errors
- Try disabling browser extensions

## Build for Production

```bash
npm run build
```

Deploy the `dist/` folder to:
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting service

Remember to set environment variables in your hosting platform!

## Need Help?

Check the full README.md for detailed documentation.
