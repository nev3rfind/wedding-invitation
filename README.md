# Donatas & Trang Wedding Invitation System

A premium, boutique-style wedding invitation application with immersive animations, guest management, and comprehensive analytics.

## Features

- **Immersive Invite Experience**: Cinematic animations with GSAP, rotating portrait gallery, live countdown timer
- **Multi-language Support**: English and Lithuanian translations with vue-i18n
- **Guest RSVP Flow**: Interactive questionnaire with animated button morphing
- **Activity Tracking**: Comprehensive event logging and analytics
- **Admin Dashboard**: Guest management, analytics visualization, and settings control
- **Accessibility**: Full keyboard navigation, ARIA labels, focus trapping, reduced motion support
- **Responsive Design**: Mobile-first approach with beautiful breakpoints

## Tech Stack

### Frontend
- **Vue 3** with Composition API
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **GSAP** (TextPlugin + ScrollTrigger) for animations
- **vue-i18n** for internationalization
- **dayjs** for date/time manipulation
- **canvas-confetti** for celebrations
- **@supabase/supabase-js** for backend integration

### Backend
- **Supabase** (PostgreSQL) for database and API
- Real-time data synchronization
- Row Level Security (RLS) for data protection

## Project Structure

```
project/
├── database/
│   ├── schema.sql          # Database schema definitions
│   └── seeds.sql           # Seed data for development
├── public/
│   └── assets/
│       └── hero-background-watercolor.png
├── src/
│   ├── components/
│   │   ├── AddressReveal.vue
│   │   ├── Countdown.vue
│   │   ├── FooterLinks.vue
│   │   ├── QuestionsModal.vue
│   │   ├── RotatingPortraits.vue
│   │   ├── RsvpPrimary.vue
│   │   └── TypingGreeting.vue
│   ├── services/
│   │   ├── api.js          # API client for backend calls
│   │   ├── supabase.js     # Supabase client setup
│   │   └── tracker.js      # Activity tracking service
│   ├── views/
│   │   ├── AdminDashboard.vue
│   │   └── InvitePage.vue
│   ├── router/
│   │   └── index.js
│   ├── i18n/
│   │   └── index.js        # EN/LT translations
│   ├── styles/
│   │   └── tailwind.css
│   ├── App.vue
│   └── main.js
├── .env                     # Environment variables
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account (or local Postgres database)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env` file should already contain Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

If using Supabase:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the schema from `database/schema.sql`
4. Run the seed data from `database/seeds.sql`

### 4. Upload Assets

#### Required Assets
Upload these images to your hosting or use the Pexels URLs in the seed data:

- **Hero Background**: Already included at `public/assets/hero-background-watercolor.png`
- **Portrait Images**: Replace the Pexels URLs in `database/seeds.sql` with your own:
  - `portrait-1.jpg` through `portrait-4.jpg`
  - Recommended size: 1200x1600 (3:4 aspect ratio)

To use your own portrait images:
1. Upload images to your hosting service (e.g., Supabase Storage, Cloudinary)
2. Update the URLs in the `media` table or in `database/seeds.sql`

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Access the Application

#### Invite Page
```
http://localhost:5173/invite/{invite_guid}
```

Example guest invite GUIDs from seed data:
- `550e8400-e29b-41d4-a716-446655440001` (John Smith)
- `550e8400-e29b-41d4-a716-446655440002` (Jane Doe)
- `550e8400-e29b-41d4-a716-446655440003` (Petras Petraitis)

#### Admin Dashboard
```
http://localhost:5173/admin
```

## Configuration

### Wedding Date & Time

Update the wedding date in the `settings` table or in `database/seeds.sql`:

```sql
INSERT INTO settings (key, value) VALUES
  ('wedding.start_datetime', '2026-04-05T17:00:00+07:00');
```

The countdown timer will automatically calculate from this datetime.

### Link Availability Dates

Control when certain links become available to guests:

```sql
INSERT INTO settings (key, value) VALUES
  ('links.available_from', '2025-11-01T00:00:00Z'),
  ('links.tickets_available_from', '2025-10-01T00:00:00Z');
```

### Venue Address

```sql
INSERT INTO settings (key, value) VALUES
  ('wedding.venue_address', 'Lotus Garden, West Lake, Hanoi, Vietnam');
```

## Key Features Explained

### Typing Greeting Animation
The hero section includes an animated greeting that cycles through:
- "Hello" → "Xin Chào" → "Labas" → Shows guest name

Respects `prefers-reduced-motion` for accessibility.

### Rotating Portrait Gallery
- Displays 3-4 portrait images in fixed 3:4 aspect ratio
- Auto-rotates every 5 seconds with smooth crossfade
- Pauses on hover or keyboard focus
- Single DOM element for performance

### RSVP Flow (Critical Implementation)
**Strict behavior to prevent duplicate buttons:**

1. Initial state: "I'll come" (primary) + "Unfortunately no" (secondary)
2. User clicks "I'll come":
   - Fade out secondary button
   - Update hero text with animation
   - Morph the SAME primary button to "Satisfy my curiosity"
3. User clicks "Satisfy my curiosity":
   - Open questions modal
4. After form submission:
   - Button changes to "Questions answered :)"
   - Reveal "Reveal venue address" button

The button uses a single `id="rsvp-action-btn"` that changes label and style based on state.

### Activity Tracking
Tracks:
- Page visits
- Button clicks
- Modal opens
- Form submissions
- Image rotations
- Time on page

Events are batched and sent every 10 seconds or on page unload.

### Accessibility Features
- Full keyboard navigation
- Focus trap in modal
- ARIA labels and live regions
- `prefers-reduced-motion` support
- Semantic HTML
- Color contrast compliance

## Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Database Schema Overview

### Tables
- `countries` - Country reference data
- `invitation_status` - Status types (pending, accepted, rejected)
- `guest_invitations` - Main guest records with invite_guid
- `guest_responses` - RSVP questionnaire answers
- `guest_activities` - Event tracking and analytics
- `settings` - System configuration
- `media` - Asset URLs and metadata
- `admin_users` - Admin authentication

### Security
- Row Level Security (RLS) enabled on all tables
- Public read access for invite viewing
- Activity logging unrestricted for tracking
- Admin operations require authentication

## Customization

### Color Palette
Update in `tailwind.config.js`:

```js
colors: {
  'ivory-crepe': '#FFFFF8',
  'spring-poppy': '#FCB2A9',
  'english-pear': '#B0D5C0',
  'nimble': '#989CA0',
  'gold-accent': '#E2C275',
}
```

### Fonts
Current fonts (loaded in `index.html`):
- **Script**: Great Vibes
- **Serif**: Playfair Display
- **Sans**: Montserrat

To change, update Google Fonts link and `tailwind.config.js`.

### Translations
Add or modify translations in `src/i18n/index.js`.

## Troubleshooting

### Images Not Loading
- Verify image URLs in the `media` table
- Check CORS settings if using external image hosting
- Ensure `public/assets/` directory exists

### Database Connection Issues
- Verify `.env` file has correct Supabase credentials
- Check Supabase project is active
- Verify RLS policies allow public read access

### Animations Not Working
- Check browser console for GSAP errors
- Verify GSAP plugins are registered in components
- Check `prefers-reduced-motion` setting

## Support

For issues or questions:
1. Check browser console for errors
2. Verify database schema matches `database/schema.sql`
3. Ensure all environment variables are set
4. Check Supabase project status

## License

Private wedding invitation system for Donatas & Trang.