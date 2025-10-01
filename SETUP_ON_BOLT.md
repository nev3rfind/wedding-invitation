# Setup on Bolt.new

This guide will help you set up the wedding invitation system directly on Bolt.new.

## Quick Setup (5 minutes)

### Step 1: Access the Setup Page

When you run the application, you'll automatically be directed to the setup page at:
```
http://localhost:5173/
```

### Step 2: Create Database Tables

The setup page will show you the SQL schema. You need to:

1. **Open Supabase Dashboard** in a new tab:
   - Go to: https://supabase.com/dashboard
   - Navigate to your project
   - Click "SQL Editor" in the left sidebar

2. **Copy the SQL Schema** from the setup page (it's displayed in a code block)

3. **Run the Schema**:
   - Paste the SQL into the Supabase SQL Editor
   - Click "Run" or press `Ctrl/Cmd + Enter`
   - You should see "Success. No rows returned"

### Step 3: Populate Data

Back on the Bolt.new setup page:

1. Click the **"Populate Database"** button
2. Wait a few seconds while it inserts:
   - 15 countries
   - 3 invitation statuses
   - 6 settings
   - 5 media assets
   - 4 test guests

3. If successful, you'll see:
   - ✓ Countries inserted
   - ✓ Invitation statuses inserted
   - ✓ Settings inserted
   - ✓ Media inserted
   - ✓ Test guests inserted

### Step 4: Test the Application

After successful setup, test links will appear:

**Test Invite Pages:**
- John Smith (English) - Click to view
- Jane Doe (English) - Click to view
- Petras Petraitis (Lithuanian) - Click to view
- Maria Garcia (English) - Click to view

**Admin Dashboard:**
- Click the admin link to see all guests and statistics

## Manual SQL Setup (Alternative)

If you prefer to run everything via SQL:

### 1. Run Schema (Required First)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(8) NOT NULL,
  country_name_en VARCHAR(128) NOT NULL,
  country_name_lt VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invitation_status (
  id SERIAL PRIMARY KEY,
  name VARCHAR(16) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guest_invitations (
  id SERIAL PRIMARY KEY,
  invite_guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  guest_full_name VARCHAR(255) NOT NULL,
  guest_call VARCHAR(128) NOT NULL,
  guest_language VARCHAR(2) NOT NULL DEFAULT 'EN',
  fly_from INTEGER REFERENCES countries(id),
  status_id INTEGER REFERENCES invitation_status(id) DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guest_responses (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guest_invitations(id) ON DELETE CASCADE NOT NULL,
  days_in_vietnam INTEGER CHECK (days_in_vietnam >= 0),
  flight_ticket_date DATE,
  days_before_wedding INTEGER CHECK (days_before_wedding >= 0),
  coming_with VARCHAR(255),
  submitted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guest_activities (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guest_invitations(id) ON DELETE SET NULL,
  activity_type VARCHAR(32) NOT NULL,
  event_time TIMESTAMPTZ DEFAULT now(),
  session_duration INTEGER,
  extra_data JSONB DEFAULT '{}'::jsonb,
  session_id UUID
);

CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(128) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  key VARCHAR(128) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guest_invitations_invite_guid ON guest_invitations(invite_guid);
CREATE INDEX IF NOT EXISTS idx_guest_invitations_status ON guest_invitations(status_id);
```

### 2. Run Seeds (After Schema)

Then run the contents of `database/seeds.sql` in the Supabase SQL Editor.

## Troubleshooting

### Error: "relation does not exist"

**Cause:** Tables haven't been created yet.

**Solution:**
1. Run the schema SQL in Supabase SQL Editor first
2. Then click "Populate Database" button

### Error: "duplicate key value violates unique constraint"

**Cause:** Data already exists in database.

**Solution:** This is normal if you run setup multiple times. The data is already there.

### Error: "Failed to fetch"

**Cause:** Supabase connection issue.

**Solution:**
1. Check your `.env` file has correct Supabase URL and key
2. Verify your Supabase project is active
3. Check browser console for detailed error

### Nothing Loads on Invite Page

**Cause:** Database might not be set up correctly.

**Solutions:**
1. Go back to setup page (http://localhost:5173/)
2. Run setup again
3. Check browser console for errors
4. Verify data exists in Supabase Table Editor

## Test URLs

After setup, use these URLs to test:

```
# Invite Pages
http://localhost:5173/invite/550e8400-e29b-41d4-a716-446655440001
http://localhost:5173/invite/550e8400-e29b-41d4-a716-446655440002
http://localhost:5173/invite/550e8400-e29b-41d4-a716-446655440003
http://localhost:5173/invite/550e8400-e29b-41d4-a716-446655440004

# Admin Dashboard
http://localhost:5173/admin

# Setup Page (to run setup again)
http://localhost:5173/
```

## What Gets Created

### Tables (8)
- `countries` - 15 countries
- `invitation_status` - 3 statuses (pending, accepted, rejected)
- `guest_invitations` - 4 test guests with unique invite links
- `guest_responses` - Empty (fills when guests RSVP)
- `guest_activities` - Empty (fills when guests interact)
- `settings` - 6 configuration values
- `media` - 5 asset URLs
- `admin_users` - Empty (for future admin auth)

### Test Guests Created

1. **John Smith** (EN, from Lithuania)
   - GUID: 550e8400-e29b-41d4-a716-446655440001
   - Status: Pending

2. **Jane Doe** (EN, from United Kingdom)
   - GUID: 550e8400-e29b-41d4-a716-446655440002
   - Status: Pending

3. **Petras Petraitis** (LT, from Lithuania)
   - GUID: 550e8400-e29b-41d4-a716-446655440003
   - Status: Accepted (for testing accepted state)

4. **Maria Garcia** (EN, from Spain)
   - GUID: 550e8400-e29b-41d4-a716-446655440004
   - Status: Pending

## Next Steps After Setup

1. **Test Complete Flow:**
   - Open a test invite link
   - Click "I'll come"
   - Fill out the questionnaire
   - Submit and verify it works

2. **Customize:**
   - Update wedding date in settings table
   - Upload your own portrait photos
   - Add real guests
   - Update venue address

3. **Deploy:**
   - Once working locally, deploy to production
   - Follow DEPLOYMENT.md guide

## Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify Supabase project is active
3. Ensure .env file has correct credentials
4. Try running setup again
5. Check Supabase Table Editor to see if data exists
