# Donatas & Trang Wedding Invitation - Setup Guide

## Overview
A fully-featured Vietnamese wedding invitation website built with Vue 3, TypeScript, Vite, and Tailwind CSS. Features include bilingual support (EN/LT), real-time countdown, RSVP management, guest tracking analytics, and an admin dashboard.

## Tech Stack
- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS (shadcn-style component structure)
- **Database**: PostgreSQL (Supabase)
- **Internationalization**: vue-i18n
- **Animations**: GSAP, Framer Motion
- **Date/Time**: dayjs with timezone support

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
The database schema has been automatically created via migration. It includes:

- **countries** - Reference data for guest departure countries
- **invitation_status** - RSVP status values (pending, accepted, rejected)
- **guest_invitations** - Core guest records with invite GUIDs
- **guest_responses** - Detailed questionnaire responses
- **guest_activities** - User interaction tracking
- **settings** - Site configuration
- **admin_users** - Admin authentication

**Demo Admin Credentials** (FOR DEVELOPMENT ONLY):
- Username: `admin`
- Password: `test123`
- **⚠️ CHANGE THIS PASSWORD IN PRODUCTION!**

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173/invite/{invite_guid}` to view a guest invitation.

### 5. Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shared UI components (shadcn-style)
│   │   ├── Typewriter.vue
│   │   ├── HeroHighlight.vue
│   │   ├── Highlight.vue
│   │   ├── DatePicker.vue
│   │   ├── DialogModal.vue
│   │   └── index.ts    # Single entry point for UI components
│   ├── Countdown.vue
│   ├── TypingGreeting.vue
│   ├── RotatingPortraits.vue
│   ├── RsvpPrimary.vue
│   ├── QuestionsModal.vue
│   ├── FallingPetals.vue
│   └── Hero.vue
├── views/
│   ├── InvitePage.vue
│   └── AdminDashboard.vue
├── services/
│   ├── api.ts          # API service with all endpoints
│   ├── tracker.ts      # Analytics tracking service
│   └── supabase.ts     # Supabase client
├── i18n/
│   └── index.ts        # EN/LT translations
├── styles/
│   ├── tokens.ts       # Design tokens
│   └── tailwind.css
├── lib/
│   └── utils.ts        # Utility functions (cn helper)
└── types/
    └── index.ts        # TypeScript type definitions
```

## Component Architecture

### UI Components (/components/ui)
Follows shadcn-style design system:
- Single source of truth for shared components
- Re-exported via `index.ts` for clean imports
- TypeScript-first with proper typing
- Accessible and keyboard-friendly

### Core Components
- **Typewriter**: Ported from React with Vue Composition API
- **HeroHighlight**: Interactive dot pattern animation on mouse move
- **Countdown**: Timezone-aware countdown with month/day/hour/minute/second display
- **RotatingPortraits**: Equal-size portrait slideshow with crossfade
- **RsvpPrimary**: State machine for button morphing (Initial → Accepted → Questions)
- **QuestionsModal**: Form with validation and bilingual field labels

## API Endpoints

### Guest Endpoints
- `GET /api/invite/:invite_guid` - Get guest invitation data
- `POST /api/invite/:invite_guid/rsvp` - Update RSVP status (accept/reject)
- `POST /api/invite/:invite_guid/respond` - Submit questionnaire responses
- `POST /api/invite/:invite_guid/reveal-address` - Get venue address
- `POST /api/track` - Batch tracking events

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication (JWT)
- `GET /api/admin/guests` - List all guests
- `GET /api/admin/guest/:id` - Get specific guest details
- `POST /api/admin/settings` - Update site settings

## Configuration

### Wedding Settings
Update via admin dashboard or directly in database `settings` table:

- `wedding.start_datetime` - Wedding date/time (ISO 8601 with timezone)
- `wedding.venue_address` - Venue location
- `links.available_from` - When Vietnam info link becomes active
- `hero.portraits` - JSON array of portrait image keys

### Adding Portraits
1. Upload images to your hosting service
2. Update `settings.hero.portraits` with image URLs
3. Images should be 3:4 aspect ratio for best results

### Changing Languages
Guest language preference is stored in `guest_invitations.guest_language` (EN or LT).
All UI text automatically adapts based on this setting.

## Analytics & Tracking

### Tracked Events
- `page_visit` - When invitation page loads
- `button_click` - Any button interaction
- `modal_open` - When modals are opened
- `form_submit` - Form submissions
- `address_reveal` - When venue address is revealed
- `hero_image_change` - Portrait slideshow changes
- `time_on_page` - Session duration tracking (30s heartbeats)

### Batching
Events are batched every 10 seconds or when queue reaches 10 events.
Final session data sent on page unload.

## Accessibility Features

- ✅ Keyboard navigation support
- ✅ Focus management (modal trap)
- ✅ ARIA labels and live regions
- ✅ `prefers-reduced-motion` support
- ✅ Semantic HTML structure
- ✅ Sufficient color contrast

## Design Tokens

### Color Palette
```typescript
'ivory-crepe': '#FFFFF8'     // Background, tiles
'spring-poppy': '#FCB2A9'    // Primary accent, numbers
'english-pear': '#B0D5C0'    // Buttons after acceptance
'nimble': '#989CA0'          // Labels, muted text
'gold-accent': '#E2C275'     // Highlights, badges
'wedding-red': '#FF6B6B'     // Names in title
```

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Montserrat/Lato (sans-serif)
- **Script**: Great Vibes (cursive, for special text)

## Development Notes

### TypeScript Support
Full TypeScript support with strict mode enabled. All components, services, and utilities are typed.

### State Management
No Vuex/Pinia - using Vue 3 Composition API with reactive state.

### Testing
Unit tests should verify:
- RsvpPrimary renders single `#rsvp-action-btn` at all times
- Button label morphs based on state
- API calls triggered on interactions
- Form validation works correctly

E2E tests should cover:
- Full guest flow (view invite → accept → answer questions → see confirmation)
- Database updates verified
- Hero text animations

## Migration & Portability

### Adding New Guests
Via admin dashboard:
1. Enter guest details (full name, preferred name, language, country)
2. System auto-generates `invite_guid`
3. Share invitation link: `/invite/{invite_guid}`

### Updating Wedding Date
Admin dashboard → Settings → Update `wedding.start_datetime`
Use ISO 8601 format with timezone: `2026-04-05T17:00:00+07:00`

### Changing Admin Password
**IMPORTANT**: Default password (`test123`) is for demo only!

To change:
1. Generate bcrypt hash of new password
2. Update `admin_users.password_hash` in database
3. Never commit passwords to repository

## Troubleshooting

### Portraits not loading
- Check `settings.hero.portraits` contains valid URLs
- Verify CORS headers if using external hosting
- Ensure images are optimized (< 500KB each)

### Countdown not updating
- Verify `wedding.start_datetime` is valid ISO 8601
- Check timezone is correct
- Browser console for JavaScript errors

### Tracking not working
- Check Supabase RLS policies allow inserts
- Verify `session_id` is generated
- Check network tab for batch requests

## License
Private wedding invitation system. All rights reserved.

## Support
For issues or questions, contact the development team.
