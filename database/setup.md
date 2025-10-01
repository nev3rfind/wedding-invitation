# Database Setup Guide

## Quick Setup for Supabase

Follow these steps to set up your database:

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Click on your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run Schema

1. Click "New Query"
2. Copy the entire contents of `database/schema.sql`
3. Paste into the SQL editor
4. Click "Run" or press `Ctrl/Cmd + Enter`

You should see: "Success. No rows returned"

### Step 3: Run Seeds

1. Click "New Query" again
2. Copy the entire contents of `database/seeds.sql`
3. Paste into the SQL editor
4. Click "Run"

You should see confirmation that rows were inserted.

### Step 4: Verify Setup

Run this query to verify:

```sql
SELECT
  (SELECT COUNT(*) FROM countries) as countries_count,
  (SELECT COUNT(*) FROM invitation_status) as status_count,
  (SELECT COUNT(*) FROM guest_invitations) as guests_count,
  (SELECT COUNT(*) FROM settings) as settings_count,
  (SELECT COUNT(*) FROM media) as media_count;
```

Expected results:
- countries_count: 15
- status_count: 3
- guests_count: 4
- settings_count: 6
- media_count: 5

### Step 5: Test Invite Links

Try accessing one of the test invite links:
```
http://localhost:5173/invite/550e8400-e29b-41d4-a716-446655440001
```

## Manual Table Creation (Alternative)

If you prefer to create tables individually, run each CREATE TABLE statement from `schema.sql` separately, then run the INSERT statements from `seeds.sql`.

## Updating Settings

To change the wedding date or other settings after initial setup:

```sql
UPDATE settings
SET value = '2026-04-05T17:00:00+07:00'
WHERE key = 'wedding.start_datetime';
```

## Adding New Guests

```sql
INSERT INTO guest_invitations (guest_full_name, guest_call, guest_language, fly_from, status_id)
VALUES ('Guest Name', 'Nickname', 'EN', 1, 1);
```

The `invite_guid` will be automatically generated. Retrieve it with:

```sql
SELECT invite_guid, guest_full_name
FROM guest_invitations
ORDER BY created_at DESC
LIMIT 1;
```

## Troubleshooting

### Permission Errors
Make sure you're logged into Supabase and have access to the SQL Editor. Only project owners and admins can run DDL statements.

### Tables Already Exist
If you see "relation already exists" errors, the tables are already created. You can either:
1. Drop the existing tables first (⚠️ this deletes all data)
2. Skip the CREATE TABLE statements and only run the INSERT statements

### Row Level Security Issues
If you can't access data from the frontend:
1. Verify RLS policies are created correctly
2. Check that the policies allow public read access
3. Try disabling RLS temporarily for testing (not recommended for production)

## Production Checklist

Before going live:

- [ ] Update `admin_users` with secure password hash
- [ ] Remove or update test guest data
- [ ] Set correct wedding datetime
- [ ] Set link availability dates
- [ ] Upload real portrait images and update URLs
- [ ] Test all invite links
- [ ] Verify RLS policies are restrictive
- [ ] Enable database backups in Supabase
