# Pre-Launch Checklist

Use this checklist to ensure your wedding invitation is ready to send to guests.

## ⚙️ Initial Setup

- [ ] **Run verification script**: `./verify.sh`
- [ ] **Install dependencies**: `npm install` (if not done)
- [ ] **Check environment variables** in `.env` file

## 🗄️ Database Setup

- [ ] **Log into Supabase Dashboard**: https://app.supabase.com
- [ ] **Navigate to SQL Editor**
- [ ] **Run schema.sql**:
  - Copy contents of `database/schema.sql`
  - Paste in SQL Editor
  - Click "Run"
  - Confirm "Success. No rows returned"
- [ ] **Run seeds.sql**:
  - Copy contents of `database/seeds.sql`
  - Paste in SQL Editor
  - Click "Run"
  - Confirm rows inserted
- [ ] **Verify tables created**:
  ```sql
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public';
  ```
  Should see: countries, invitation_status, guest_invitations, guest_responses, guest_activities, settings, media, admin_users

## 🎨 Content Customization

### Wedding Details
- [ ] **Update wedding date**:
  ```sql
  UPDATE settings SET value = '2026-04-05T17:00:00+07:00'
  WHERE key = 'wedding.start_datetime';
  ```
- [ ] **Update venue address**:
  ```sql
  UPDATE settings SET value = 'Your Venue Name, City, Country'
  WHERE key = 'wedding.venue_address';
  ```
- [ ] **Set link availability dates**:
  ```sql
  UPDATE settings SET value = '2025-11-01T00:00:00Z'
  WHERE key = 'links.available_from';

  UPDATE settings SET value = '2025-10-01T00:00:00Z'
  WHERE key = 'links.tickets_available_from';
  ```

### Images
- [ ] **Prepare 4 portrait photos** (1200x1600px, 3:4 ratio)
- [ ] **Upload to hosting** (Supabase Storage, Cloudinary, etc.)
- [ ] **Update portrait URLs in database**:
  ```sql
  UPDATE media SET url = 'https://your-cdn.com/portrait-1.jpg' WHERE key = 'portrait-1';
  UPDATE media SET url = 'https://your-cdn.com/portrait-2.jpg' WHERE key = 'portrait-2';
  UPDATE media SET url = 'https://your-cdn.com/portrait-3.jpg' WHERE key = 'portrait-3';
  UPDATE media SET url = 'https://your-cdn.com/portrait-4.jpg' WHERE key = 'portrait-4';
  ```

### Guest List
- [ ] **Remove test guests**:
  ```sql
  DELETE FROM guest_invitations WHERE invite_guid IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004'
  );
  ```
- [ ] **Add real guests** (see CUSTOMIZATION.md for methods)
- [ ] **Export invite links**:
  ```sql
  SELECT
    guest_full_name,
    guest_call,
    guest_language,
    'https://your-domain.com/invite/' || invite_guid as invite_link
  FROM guest_invitations
  ORDER BY guest_full_name;
  ```

## 🧪 Local Testing

- [ ] **Start dev server**: `npm run dev`
- [ ] **Open invite page**: http://localhost:5173/invite/{test-guid}
- [ ] **Test typing animation** - Verify greeting cycles through Hello → Xin Chào → Labas
- [ ] **Test portrait rotation** - Confirm 4 images rotate smoothly
- [ ] **Test countdown** - Verify countdown shows correct date
- [ ] **Test RSVP flow**:
  - [ ] Click "I'll come"
  - [ ] Verify secondary button fades
  - [ ] Verify hero text changes
  - [ ] Verify button morphs to "Satisfy my curiosity"
  - [ ] NO duplicate buttons appear
  - [ ] Click morphed button
  - [ ] Modal opens with focus trapped
  - [ ] Fill form and submit
  - [ ] Verify "Questions answered :)" appears
  - [ ] Click "Reveal venue address"
  - [ ] Verify address appears with animation
- [ ] **Test rejection flow**:
  - [ ] Click "Unfortunately no"
  - [ ] Verify message appears
- [ ] **Test footer links**:
  - [ ] Check availability badges
  - [ ] Verify disabled state if before availability date
- [ ] **Test admin dashboard**: http://localhost:5173/admin
  - [ ] Verify guest list appears
  - [ ] Check stats are correct
  - [ ] Verify recent activities show
  - [ ] Test "Copy Link" button

## 📱 Mobile Testing

- [ ] **Test on actual mobile device** (not just browser dev tools)
- [ ] **Portrait layout** - Verify portrait stacks below text on small screens
- [ ] **Button layout** - Confirm buttons stack vertically on mobile
- [ ] **Typing animation** - Works on mobile
- [ ] **Form inputs** - Easy to fill on mobile
- [ ] **Modal** - Properly sized on mobile
- [ ] **All interactions work with touch**

## ♿ Accessibility Testing

- [ ] **Keyboard navigation**:
  - [ ] Tab through all interactive elements
  - [ ] Verify focus visible indicators
  - [ ] Test modal focus trap
  - [ ] Confirm Esc closes modal
- [ ] **Screen reader** (if available):
  - [ ] Test with VoiceOver (Mac) or NVDA (Windows)
  - [ ] Verify ARIA labels read correctly
  - [ ] Check live regions announce changes
- [ ] **Reduced motion**:
  - [ ] Enable "Reduce motion" in OS settings
  - [ ] Verify animations are minimal
  - [ ] Confirm greeting shows static "Hello"

## 🌐 Browser Testing

- [ ] **Chrome** - Test full flow
- [ ] **Safari** - Test full flow
- [ ] **Firefox** - Test full flow
- [ ] **Mobile Safari** - Test on iPhone
- [ ] **Chrome Mobile** - Test on Android

## 🚀 Deployment

- [ ] **Build for production**: `npm run build`
- [ ] **Verify build succeeded** - Check dist/ folder exists
- [ ] **Choose hosting platform** (Vercel recommended)
- [ ] **Set up deployment**:
  - [ ] Install CLI or connect via dashboard
  - [ ] Set environment variables
  - [ ] Deploy
- [ ] **Configure custom domain** (optional)
- [ ] **Enable HTTPS** (automatic on most platforms)
- [ ] **Test production URL**

## ✅ Production Testing

- [ ] **Visit production URL**
- [ ] **Test invite flow** with real invite link
- [ ] **Check images load** (including portraits)
- [ ] **Verify database connection** works
- [ ] **Test RSVP submission** on production
- [ ] **Check admin dashboard** on production
- [ ] **Verify analytics tracking** - Check guest_activities table
- [ ] **Test on mobile** with production URL

## 📧 Sending Invites

- [ ] **Create test message** with invite link
- [ ] **Send to yourself** and 2-3 trusted friends
- [ ] **Gather feedback**:
  - [ ] Any confusion?
  - [ ] Any bugs?
  - [ ] Loading speed acceptable?
  - [ ] Design appealing?
- [ ] **Fix any issues found**
- [ ] **Prepare final message** to all guests
- [ ] **Send invitations**! 🎉

## 📊 Post-Launch Monitoring

Daily checks for first week:
- [ ] **Check admin dashboard** for new RSVPs
- [ ] **Review guest_activities** for errors
- [ ] **Respond to guest questions** promptly
- [ ] **Monitor database usage** in Supabase dashboard

Weekly checks until wedding:
- [ ] **Export current RSVP list**
- [ ] **Backup database** (Supabase auto-backups)
- [ ] **Check any reported issues**

## 🎊 Before Wedding Day

- [ ] **Export final guest list**:
  ```sql
  SELECT
    guest_full_name,
    guest_call,
    status.name as rsvp_status,
    r.days_in_vietnam,
    r.flight_ticket_date,
    r.coming_with
  FROM guest_invitations gi
  LEFT JOIN invitation_status status ON gi.status_id = status.id
  LEFT JOIN guest_responses r ON gi.id = r.guest_id
  ORDER BY guest_full_name;
  ```
- [ ] **Print for venue** if needed
- [ ] **Backup all data** to CSV
- [ ] **Thank guests** for RSVPs

## 📸 After Wedding (Optional)

- [ ] **Keep site live** for 1-2 months
- [ ] **Add photo gallery** section (optional enhancement)
- [ ] **Share thank you message** on site
- [ ] **Archive database** for memories
- [ ] **Download all data** before shutting down

---

## Quick Reference

**Test Invite GUIDs** (from seed data):
```
550e8400-e29b-41d4-a716-446655440001  (John Smith, EN)
550e8400-e29b-41d4-a716-446655440002  (Jane Doe, EN)
550e8400-e29b-41d4-a716-446655440003  (Petras Petraitis, LT)
```

**Useful SQL Queries**:

Get all invite links:
```sql
SELECT guest_full_name, 'https://your-domain.com/invite/' || invite_guid
FROM guest_invitations;
```

Get RSVP statistics:
```sql
SELECT status.name, COUNT(*) as count
FROM guest_invitations gi
JOIN invitation_status status ON gi.status_id = status.id
GROUP BY status.name;
```

Get recent activities:
```sql
SELECT ga.activity_type, ga.event_time, gi.guest_full_name
FROM guest_activities ga
LEFT JOIN guest_invitations gi ON ga.guest_id = gi.id
ORDER BY ga.event_time DESC
LIMIT 20;
```

---

**Need Help?**
- `README.md` - Full documentation
- `QUICKSTART.md` - Fast setup
- `CUSTOMIZATION.md` - Customization guide
- `DEPLOYMENT.md` - Deployment guide
- `PROJECT_SUMMARY.md` - Technical overview
