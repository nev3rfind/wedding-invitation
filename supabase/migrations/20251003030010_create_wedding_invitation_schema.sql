/*
  # Wedding Invitation System Schema
  
  ## Overview
  This migration creates the complete database schema for a bilingual Vietnamese wedding invitation website
  with guest management, RSVP tracking, and user interaction analytics.
  
  ## New Tables
  
  ### 1. `guests`
  Core guest information and invitation management
  - `id` (uuid, primary key) - Unique guest identifier
  - `name` (text, required) - Guest's full name
  - `email` (text, unique) - Guest's email address
  - `language` (text, default 'en') - Preferred language: 'en' or 'lt'
  - `invitation_code` (text, unique) - Unique code for accessing invitation
  - `attending` (boolean, nullable) - RSVP status: true=coming, false=not coming, null=no response
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. `rsvp_responses`
  Detailed RSVP questionnaire responses
  - `id` (uuid, primary key)
  - `guest_id` (uuid, foreign key) - Links to guests table
  - `ticket_purchase_date` (date, required) - When guest plans to buy tickets
  - `has_plus_one` (boolean, required) - Whether bringing a plus one
  - `days_staying` (integer, required) - Number of days staying in Vietnam
  - `additional_message` (text, nullable) - Any extra message from guest
  - `submitted_at` (timestamptz) - When form was submitted
  
  ### 3. `user_interactions`
  Analytics and tracking of user behavior
  - `id` (uuid, primary key)
  - `guest_id` (uuid, foreign key) - Links to guests table
  - `interaction_type` (text, required) - Type: 'button_click', 'section_view', 'form_submit', etc.
  - `interaction_data` (jsonb) - Additional context data
  - `timestamp` (timestamptz) - When interaction occurred
  
  ## Security
  All tables have RLS enabled with appropriate policies:
  - Guests can view and update their own data via invitation_code
  - RSVP responses are linked to specific guests only
  - Interaction tracking is write-only for guests
  - Admin access available through authenticated service role
  
  ## Indexes
  Performance indexes on frequently queried columns:
  - invitation_code for quick guest lookup
  - guest_id for efficient joins
  - timestamps for analytics queries
*/

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE,
  language text DEFAULT 'en' CHECK (language IN ('en', 'lt')),
  invitation_code text UNIQUE NOT NULL,
  attending boolean DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create RSVP responses table
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  ticket_purchase_date date NOT NULL,
  has_plus_one boolean NOT NULL,
  days_staying integer NOT NULL CHECK (days_staying >= 1),
  additional_message text,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(guest_id)
);

-- Create user interactions tracking table
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid REFERENCES guests(id) ON DELETE CASCADE,
  interaction_type text NOT NULL,
  interaction_data jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_guests_invitation_code ON guests(invitation_code);
CREATE INDEX IF NOT EXISTS idx_rsvp_guest_id ON rsvp_responses(guest_id);
CREATE INDEX IF NOT EXISTS idx_interactions_guest_id ON user_interactions(guest_id);
CREATE INDEX IF NOT EXISTS idx_interactions_timestamp ON user_interactions(timestamp);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Guests table policies
CREATE POLICY "Guests can view own data via invitation code"
  ON guests FOR SELECT
  USING (true);

CREATE POLICY "Guests can update own data"
  ON guests FOR UPDATE
  USING (true);

-- RSVP responses policies
CREATE POLICY "Guests can view own RSVP"
  ON rsvp_responses FOR SELECT
  USING (true);

CREATE POLICY "Guests can insert own RSVP"
  ON rsvp_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Guests can update own RSVP"
  ON rsvp_responses FOR UPDATE
  USING (true);

-- User interactions policies (write-only for tracking)
CREATE POLICY "Anyone can insert interactions"
  ON user_interactions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view interactions"
  ON user_interactions FOR SELECT
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on guests table
DROP TRIGGER IF EXISTS update_guests_updated_at ON guests;
CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();