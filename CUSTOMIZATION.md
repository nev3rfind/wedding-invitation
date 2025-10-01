# Customization Checklist

Use this checklist to customize the wedding invitation for Donatas & Trang.

## Essential Customizations

### 1. Wedding Details

- [ ] Update wedding date and time in database:
  ```sql
  UPDATE settings SET value = '2026-04-05T17:00:00+07:00'
  WHERE key = 'wedding.start_datetime';
  ```

- [ ] Update venue address:
  ```sql
  UPDATE settings SET value = 'Your Venue, City, Country'
  WHERE key = 'wedding.venue_address';
  ```

### 2. Portrait Images

- [ ] Prepare 4 portrait images (3:4 aspect ratio, 1200x1600px)
- [ ] Upload to hosting service (Supabase Storage, Cloudinary, etc.)
- [ ] Update URLs in database:
  ```sql
  UPDATE media SET url = 'https://your-cdn.com/portrait-1.jpg' WHERE key = 'portrait-1';
  UPDATE media SET url = 'https://your-cdn.com/portrait-2.jpg' WHERE key = 'portrait-2';
  UPDATE media SET url = 'https://your-cdn.com/portrait-3.jpg' WHERE key = 'portrait-3';
  UPDATE media SET url = 'https://your-cdn.com/portrait-4.jpg' WHERE key = 'portrait-4';
  ```

### 3. Guest List

- [ ] Remove test guests:
  ```sql
  DELETE FROM guest_invitations WHERE invite_guid IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004'
  );
  ```

- [ ] Add real guests (see "Adding Guests" section below)

### 4. Link Availability

- [ ] Set when "Vietnam info" link becomes available:
  ```sql
  UPDATE settings SET value = '2025-11-01T00:00:00Z'
  WHERE key = 'links.available_from';
  ```

- [ ] Set when "Tickets info" link becomes available:
  ```sql
  UPDATE settings SET value = '2025-10-01T00:00:00Z'
  WHERE key = 'links.tickets_available_from';
  ```

## Optional Customizations

### 5. Colors (if needed)

Edit `tailwind.config.js`:

```js
colors: {
  'ivory-crepe': '#FFFFF8',    // Background color
  'spring-poppy': '#FCB2A9',   // Primary accent (buttons, headings)
  'english-pear': '#B0D5C0',   // Secondary accent (links, highlights)
  'nimble': '#989CA0',         // Text color
  'gold-accent': '#E2C275',    // Gold highlights
}
```

### 6. Fonts (if needed)

Current fonts:
- **Script (headings)**: Great Vibes
- **Serif (subheadings)**: Playfair Display
- **Sans (body)**: Montserrat

To change, update `index.html` Google Fonts link and `tailwind.config.js`.

### 7. Translations

Edit `src/i18n/index.js` to customize text for EN and LT languages.

Key sections:
- `hero` - Main invitation text
- `countdown` - Timer labels
- `links` - Link text and badges
- `modal` - Form labels and validation
- `address` - Venue address display

### 8. Hero Background

Replace `public/assets/hero-background-watercolor.png` with your own image.

Recommended specs:
- Size: 1920x1080 or larger
- Format: PNG or JPG
- Style: Watercolor, soft, low contrast
- Colors: Should complement the palette

## Adding Guests

### Method 1: Individual Insert

```sql
INSERT INTO guest_invitations (guest_full_name, guest_call, guest_language, fly_from, status_id)
VALUES ('John Doe', 'John', 'EN', 1, 1);

-- Get the invite link
SELECT
  guest_full_name,
  'https://your-domain.com/invite/' || invite_guid as invite_link
FROM guest_invitations
WHERE guest_full_name = 'John Doe';
```

### Method 2: Bulk Import

Create a CSV file `guests.csv`:
```
guest_full_name,guest_call,guest_language,fly_from,status_id
John Doe,John,EN,1,1
Jane Smith,Jane,EN,3,1
Petras Petraitis,Petras,LT,1,1
```

In Supabase:
1. Go to Table Editor → guest_invitations
2. Click "Insert" → "Import data from CSV"
3. Upload your CSV

Then retrieve all invite links:
```sql
SELECT
  guest_full_name,
  guest_call,
  'https://your-domain.com/invite/' || invite_guid as invite_link
FROM guest_invitations
ORDER BY created_at DESC;
```

### Guest Fields Explained

- `guest_full_name`: Full name (e.g., "John Doe")
- `guest_call`: Nickname shown in greeting (e.g., "John")
- `guest_language`: 'EN' or 'LT'
- `fly_from`: Country ID from `countries` table (1 = Lithuania, 2 = Vietnam, etc.)
- `status_id`: Always 1 (pending) for new guests

### Common fly_from IDs

```sql
SELECT id, country_name_en FROM countries;
```

- 1 = Lithuania
- 2 = Vietnam
- 3 = United Kingdom
- 4 = United States
- 5 = Germany

## Advanced Customizations

### 9. Questionnaire Fields

To add/remove/modify form fields, edit:
- `src/components/QuestionsModal.vue` (form UI)
- `database/schema.sql` - guest_responses table (add columns)
- `src/services/api.js` - submitResponse method

### 10. Additional Settings

Add custom settings to control features:

```sql
INSERT INTO settings (key, value) VALUES
  ('rsvp.deadline', '2026-03-01T23:59:59Z'),
  ('website.message', 'Looking forward to celebrating with you!'),
  ('contact.email', 'wedding@example.com');
```

Access in components via the settings object.

### 11. Admin Authentication

Currently, admin dashboard is public. To secure it:

1. Add authentication using Supabase Auth
2. Create login page
3. Protect routes with auth guards
4. Update `admin_users` table with real credentials

Example implementation available in Supabase docs.

### 12. Email Notifications

To send invite emails automatically:

1. Set up email service (SendGrid, Mailgun, etc.)
2. Create Supabase Edge Function for sending emails
3. Trigger on guest creation
4. Include invite link in email template

### 13. WhatsApp/SMS Notifications

Similar to email, but use:
- Twilio for SMS
- WhatsApp Business API
- Or manual sending via apps

Export invite links:
```sql
SELECT
  guest_full_name,
  guest_call,
  'https://your-domain.com/invite/' || invite_guid as invite_link
FROM guest_invitations;
```

Copy and paste into WhatsApp/SMS app.

## Testing After Customization

### Test Checklist

- [ ] Create test guest with your details
- [ ] Open invite link in browser
- [ ] Verify wedding date in countdown
- [ ] Check all 4 portraits rotate correctly
- [ ] Test RSVP flow (accept → questionnaire → submit)
- [ ] Verify address reveal works
- [ ] Check links show correct availability
- [ ] Test on mobile device
- [ ] Test in different browsers (Chrome, Safari, Firefox)
- [ ] Verify admin dashboard shows correct data
- [ ] Check that activities are tracked

### Language Testing

If using Lithuanian:
- [ ] Create test guest with `guest_language = 'LT'`
- [ ] Open invite and verify all text is in Lithuanian
- [ ] Test full flow in Lithuanian

## Pre-Launch Checklist

- [ ] All customizations complete
- [ ] Test invites sent to 2-3 trusted friends
- [ ] Feedback gathered and addressed
- [ ] Database backed up
- [ ] Production environment variables set
- [ ] Analytics/monitoring configured
- [ ] Domain configured and SSL active
- [ ] Responsive design tested
- [ ] All browsers tested
- [ ] Performance verified (< 3s load time)

## Ongoing Maintenance

### Weekly Tasks
- Check admin dashboard for new RSVPs
- Review activity logs for issues
- Respond to guest questions

### Before Wedding
- Export final guest list
- Backup all data
- Print guest list for venue

### After Wedding
- Keep site live for 1 month for photos/memories
- Archive database
- Thank guests via the platform

## Need Help?

Refer to:
- `README.md` - Full documentation
- `QUICKSTART.md` - Setup guide
- `DEPLOYMENT.md` - Hosting guide
- Supabase docs - Database help
- Vue.js docs - Frontend help
