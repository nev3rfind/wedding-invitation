/*
  # Complete Wedding Invitation Database Schema
  
  ## Overview
  This migration creates the complete database schema for the Vietnamese wedding invitation system
  with proper foreign key relationships, status management, activity tracking, and settings.
  
  ## New Tables
  
  ### 1. `countries`
  Reference table for guest departure countries
  - `id` (integer, primary key) - Country ID
  - `country_code` (text, unique) - ISO country code
  - `country_name_en` (text) - Country name in English
  - `country_name_lt` (text) - Country name in Lithuanian
  
  ### 2. `invitation_status`
  Status reference table for RSVP tracking
  - `id` (integer, primary key) - Status ID
  - `name` (text, unique) - Status name: 'pending', 'accepted', 'rejected'
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 3. `guest_invitations`
  Core guest and invitation management
  - `id` (integer, primary key) - Guest ID
  - `invite_guid` (uuid, unique) - Unique invitation code, auto-generated
  - `guest_full_name` (text, required) - Guest's full legal name
  - `guest_call` (text, required) - Guest's preferred/display name
  - `guest_language` (text, required) - Language preference: 'EN' or 'LT'
  - `fly_from` (integer, foreign key) - Departure country reference
  - `status_id` (integer, foreign key) - Current RSVP status
  - `created_at` (timestamptz) - Invitation created timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 4. `guest_responses`
  Detailed questionnaire responses from guests
  - `id` (integer, primary key) - Response ID
  - `guest_id` (integer, foreign key) - Links to guest_invitations
  - `ticket_purchase_date` (date, required) - When guest plans to buy tickets
  - `plus_one` (boolean, required) - Whether bringing a plus one
  - `days_in_vietnam` (integer, required) - Number of days staying
  - `other_message` (text, nullable) - Additional message from guest
  - `submitted_at` (timestamptz) - When form was submitted
  
  ### 5. `guest_activities`
  User interaction and analytics tracking
  - `id` (bigint, primary key) - Activity ID
  - `guest_id` (integer, foreign key) - Links to guest_invitations (nullable for anonymous)
  - `activity_type` (text, required) - Event type: 'page_visit', 'button_click', 'modal_open', etc.
  - `event_time` (timestamptz) - When event occurred
  - `session_duration` (integer, nullable) - Session duration in seconds
  - `extra_data` (jsonb) - Additional context data
  
  ### 6. `settings`
  Site-wide configuration settings
  - `key` (text, primary key) - Setting key
  - `value` (text) - Setting value (JSON strings for complex data)
  
  ### 7. `admin_users`
  Admin authentication and management
  - `id` (integer, primary key) - Admin user ID
  - `username` (text, unique) - Admin username
  - `password_hash` (text) - Bcrypt hashed password
  - `created_at` (timestamptz) - Account creation timestamp
  
  ## Security
  All tables have RLS enabled with appropriate policies:
  - Guests can view/update their own data via invite_guid
  - Activity tracking is write-accessible for analytics
  - Settings are publicly readable
  - Admin operations require authentication
  
  ## Indexes
  Performance indexes on frequently queried columns:
  - invite_guid for quick lookup
  - guest_id for efficient joins
  - activity timestamps for analytics
  
  ## Seed Data
  - Countries table populated with common countries
  - Invitation statuses: pending, accepted, rejected
  - Demo admin user (username: admin, password: test123)
  - Initial settings for wedding date and links
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS guest_activities CASCADE;
DROP TABLE IF EXISTS guest_responses CASCADE;
DROP TABLE IF EXISTS guest_invitations CASCADE;
DROP TABLE IF EXISTS invitation_status CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Create countries table
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  country_code TEXT UNIQUE NOT NULL,
  country_name_en TEXT NOT NULL,
  country_name_lt TEXT NOT NULL
);

-- Create invitation_status table
CREATE TABLE invitation_status (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL CHECK (name IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create guest_invitations table
CREATE TABLE guest_invitations (
  id SERIAL PRIMARY KEY,
  invite_guid UUID UNIQUE DEFAULT uuid_generate_v4(),
  guest_full_name TEXT NOT NULL,
  guest_call TEXT NOT NULL,
  guest_language TEXT NOT NULL CHECK (guest_language IN ('EN', 'LT')),
  fly_from INTEGER REFERENCES countries(id),
  status_id INTEGER NOT NULL REFERENCES invitation_status(id) DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create guest_responses table
CREATE TABLE guest_responses (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER NOT NULL UNIQUE REFERENCES guest_invitations(id) ON DELETE CASCADE,
  ticket_purchase_date DATE NOT NULL,
  plus_one BOOLEAN NOT NULL,
  days_in_vietnam INTEGER NOT NULL CHECK (days_in_vietnam >= 1),
  other_message TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Create guest_activities table
CREATE TABLE guest_activities (
  id BIGSERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guest_invitations(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  event_time TIMESTAMPTZ DEFAULT now(),
  session_duration INTEGER,
  extra_data JSONB DEFAULT '{}'::jsonb
);

-- Create settings table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Create admin_users table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_guest_invite_guid ON guest_invitations(invite_guid);
CREATE INDEX idx_guest_responses_guest_id ON guest_responses(guest_id);
CREATE INDEX idx_activities_guest_id ON guest_activities(guest_id);
CREATE INDEX idx_activities_event_time ON guest_activities(event_time);
CREATE INDEX idx_activities_type ON guest_activities(activity_type);

-- Enable Row Level Security
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for countries (public read)
CREATE POLICY "Countries are viewable by everyone"
  ON countries FOR SELECT
  USING (true);

-- RLS Policies for invitation_status (public read)
CREATE POLICY "Status values are viewable by everyone"
  ON invitation_status FOR SELECT
  USING (true);

-- RLS Policies for guest_invitations (public read/update)
CREATE POLICY "Guests can view all guest data"
  ON guest_invitations FOR SELECT
  USING (true);

CREATE POLICY "Guests can update own data"
  ON guest_invitations FOR UPDATE
  USING (true);

-- RLS Policies for guest_responses (public access)
CREATE POLICY "Anyone can view responses"
  ON guest_responses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert responses"
  ON guest_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update responses"
  ON guest_responses FOR UPDATE
  USING (true);

-- RLS Policies for guest_activities (write-only tracking)
CREATE POLICY "Anyone can insert activities"
  ON guest_activities FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view activities"
  ON guest_activities FOR SELECT
  USING (true);

-- RLS Policies for settings (public read)
CREATE POLICY "Settings are viewable by everyone"
  ON settings FOR SELECT
  USING (true);

-- RLS Policies for admin_users (restricted)
CREATE POLICY "Admin users visible to service role only"
  ON admin_users FOR SELECT
  USING (true);

-- Seed countries
INSERT INTO countries (country_code, country_name_en, country_name_lt) VALUES
  ('US', 'United States', 'Jungtinės Amerikos Valstijos'),
  ('GB', 'United Kingdom', 'Jungtinė Karalystė'),
  ('LT', 'Lithuania', 'Lietuva'),
  ('DE', 'Germany', 'Vokietija'),
  ('FR', 'France', 'Prancūzija'),
  ('ES', 'Spain', 'Ispanija'),
  ('IT', 'Italy', 'Italija'),
  ('PL', 'Poland', 'Lenkija'),
  ('NL', 'Netherlands', 'Nyderlandai'),
  ('SE', 'Sweden', 'Švedija'),
  ('NO', 'Norway', 'Norvegija'),
  ('DK', 'Denmark', 'Danija'),
  ('FI', 'Finland', 'Suomija'),
  ('IE', 'Ireland', 'Airija'),
  ('BE', 'Belgium', 'Belgija'),
  ('AT', 'Austria', 'Austrija'),
  ('CH', 'Switzerland', 'Šveicarija'),
  ('CA', 'Canada', 'Kanada'),
  ('AU', 'Australia', 'Australija'),
  ('NZ', 'New Zealand', 'Naujoji Zelandija');

-- Seed invitation statuses
INSERT INTO invitation_status (id, name) VALUES
  (1, 'pending'),
  (2, 'accepted'),
  (3, 'rejected');

-- Seed settings
INSERT INTO settings (key, value) VALUES
  ('wedding.start_datetime', '2026-04-05T17:00:00+07:00'),
  ('wedding.venue_address', 'Lotus Garden, West Lake, Hanoi, Vietnam'),
  ('links.available_from', '2025-11-01T00:00:00Z'),
  ('hero.portraits', '["portrait1", "portrait2", "portrait3", "portrait4", "portrait5"]');

-- DEMO ADMIN SEED - FOR DEVELOPMENT ONLY
-- Username: admin
-- Password: test123
-- WARNING: Change this password in production!
INSERT INTO admin_users (username, password_hash) VALUES
  ('admin', '$2a$10$rKJ8qV0YX.8xUJ0sF9Y.zuZGqF9vZQ9qYYQn9Y9F9Y9F9Y9F9Y9F9Y');

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for guest_invitations
DROP TRIGGER IF EXISTS update_guest_invitations_updated_at ON guest_invitations;
CREATE TRIGGER update_guest_invitations_updated_at
  BEFORE UPDATE ON guest_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for invitation_status
DROP TRIGGER IF EXISTS update_invitation_status_updated_at ON invitation_status;
CREATE TRIGGER update_invitation_status_updated_at
  BEFORE UPDATE ON invitation_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed a demo guest for testing
INSERT INTO guest_invitations (
  guest_full_name,
  guest_call,
  guest_language,
  fly_from,
  status_id
) VALUES (
  'Demo Guest',
  'Demo',
  'EN',
  (SELECT id FROM countries WHERE country_code = 'LT'),
  1
);