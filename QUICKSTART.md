# Quick Start Guide - Run Wedding Invitation Locally

Follow these steps to run the wedding invitation system on your local computer.

## What You'll Need

Before starting, make sure you have:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Supabase account** (free) - [Sign up here](https://supabase.com/)
- **Terminal/Command Prompt** access
- **Text Editor** (VS Code recommended)

---

## Step 1: Create Your Supabase Database

### 1.1 Create a New Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the form:
   - **Name**: `wedding-invitation` (or any name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your location
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### 1.2 Get Your API Credentials

Once your project is ready:

1. In your Supabase dashboard, click **Settings** (gear icon in left sidebar)
2. Click **API** in the settings menu
3. You'll see two important values:
   - **Project URL** - looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key** - long text starting with `eyJ...`
4. **KEEP THIS PAGE OPEN** - you'll need these values soon!

---

## Step 2: Setup the Project on Your Computer

### 2.1 Open Terminal/Command Prompt

**Windows**: Press `Win + R`, type `cmd`, press Enter
**Mac**: Press `Cmd + Space`, type `terminal`, press Enter
**Linux**: Press `Ctrl + Alt + T`

### 2.2 Navigate to Project Folder

```bash
# Change to your project directory
cd path/to/wedding-invitation

# For example:
# Windows: cd C:\Users\YourName\wedding-invitation
# Mac/Linux: cd ~/wedding-invitation
```

### 2.3 Install Dependencies

Run this command in your terminal:

```bash
npm install
```

This will take 1-2 minutes. You'll see progress messages. Wait until it completes.

---

## Step 3: Configure Environment Variables

### 3.1 Update the .env File

1. Open the `.env` file in your project folder using a text editor
2. Replace the existing values with YOUR Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-actual-key...
```

3. **Save the file** (Ctrl+S or Cmd+S)

---

## Step 4: Create Database Tables

### 4.1 Open Supabase SQL Editor

1. Go back to your Supabase dashboard
2. Click **SQL Editor** (icon in left sidebar - looks like a document)
3. Click **"New query"** button

### 4.2 Run the Database Schema

1. In your project folder, open the file `CREATE_TABLES.sql`
2. Copy **ALL** the contents (Ctrl+A, then Ctrl+C)
3. Paste into the Supabase SQL Editor (Ctrl+V)
4. Click the **"RUN"** button (or press Ctrl+Enter)
5. You should see: ✅ "Success. No rows returned"

### 4.3 Verify Tables Were Created

1. Click **Table Editor** (icon in left sidebar - looks like a grid)
2. You should see these 8 tables:
   - ✓ countries
   - ✓ invitation_status
   - ✓ admin_users
   - ✓ guest_invitations
   - ✓ guest_responses
   - ✓ guest_activities
   - ✓ settings
   - ✓ media

---

## Step 5: Start the Application

### 5.1 Run Development Server

In your terminal, run:

```bash
npm run dev
```

You should see output like:

```
VITE v5.x.x  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### 5.2 Open in Your Browser

1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: **http://localhost:5173/**
3. You should see the Setup Page with instructions!

---

## Step 6: Populate with Test Data

### 6.1 Click the Populate Button

On the page you just opened:

1. Read the instructions on the page
2. Click the blue button: **"▶ Populate Database (Step 2)"**
3. Wait 5-10 seconds while data loads
4. You'll see success messages and test invite links appear

### 6.2 Test Your First Invitation

After population completes, you'll see test links like:

- `http://localhost:5173/invite/550e8400-e29b-41d4-a716-446655440001`

**Click any link** to see your beautiful wedding invitation in action!

---

## Step 7: Try the Features

### Test the RSVP Flow

1. Click **"I'll come"** button
2. Watch the button transform
3. Click **"Satisfy my curiosity"** to open questionnaire
4. Fill out the form with test data
5. Submit and see the address reveal!

### View Admin Dashboard

1. In your browser, go to: **http://localhost:5173/admin**
2. You'll see all guests, their RSVP statuses, and activity tracking

---

## Common Problems & Solutions

### ❌ "npm: command not found"

**Problem**: Node.js is not installed
**Solution**: Download and install Node.js from [nodejs.org](https://nodejs.org/)
After installation, close and reopen your terminal, then try again.

### ❌ White screen or blank page

**Problem**: Environment variables not set correctly
**Solution**:
1. Check `.env` file exists in project root folder
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` have YOUR values
3. Stop the server (Ctrl+C in terminal)
4. Run `npm run dev` again

### ❌ "Port 5173 is already in use"

**Problem**: Another application is using that port
**Solution**: Run on a different port:

```bash
npm run dev -- --port 3000
```

Then open `http://localhost:3000/` instead.

### ❌ "relation does not exist" errors

**Problem**: Database tables weren't created
**Solution**: Go back to Step 4 and run the SQL script again. Make sure you copied ALL the SQL code.

### ❌ Can't see data on invite page

**Problem**: Database not populated
**Solution**:
1. Make sure Step 4 (create tables) completed successfully
2. Run Step 6 (populate data) again
3. Check browser console for errors (press F12, click Console tab)

---

## Next Steps - Make It Yours!

### Add Your Own Guests

1. Go to Supabase dashboard → **Table Editor** → **guest_invitations**
2. Click **"Insert"** → **"Insert row"**
3. Fill in:
   - `guest_full_name`: "Jane Doe"
   - `guest_call`: "Jane"
   - `guest_language`: "EN" or "LT"
   - `fly_from`: 1 (for Lithuania) or 2 (for Vietnam)
   - `status_id`: 1 (pending)
4. Click **"Save"**
5. Find the `invite_guid` in the row you just created
6. Your guest's link: `http://localhost:5173/invite/[paste-guid-here]`

### Change Wedding Details

1. Go to Supabase → **Table Editor** → **settings**
2. Edit these rows:
   - `wedding.start_datetime` → Your wedding date and time
   - `wedding.venue_address` → Your venue name and address

### Upload Your Photos

1. Go to **Table Editor** → **media**
2. Edit the `url` column for each portrait (portrait-1, portrait-2, etc.)
3. Paste your own image URLs
4. Recommended size: 1200x1600 pixels

---

## Stopping the Application

To stop the development server:

1. Go to your terminal where `npm run dev` is running
2. Press **Ctrl+C**
3. The server will stop

To start again: just run `npm run dev`

---

## Summary of Commands

```bash
# First time setup
npm install              # Install all dependencies
npm run dev              # Start development server

# Building for production
npm run build            # Create production build
npm run preview          # Preview production build locally

# Stop the server
Ctrl+C                   # Press in the terminal
```

---

## Getting Help

If something isn't working:

1. Check the error message in your terminal
2. Open browser console (press F12, click Console tab)
3. Make sure all steps were completed in order
4. Verify your Supabase credentials are correct in `.env`
5. Try stopping (Ctrl+C) and restarting the server (`npm run dev`)

---

**🎉 Congratulations!** Your wedding invitation system is now running locally. Enjoy customizing it for your special day!

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
