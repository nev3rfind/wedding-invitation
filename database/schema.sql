/*
  # Wedding Invitation System - Database Schema

  Complete schema for Donatas & Trang wedding invitation system
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries reference table
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(8) NOT NULL,
  country_name_en VARCHAR(128) NOT NULL,
  country_name_lt VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invitation status reference table
CREATE TABLE IF NOT EXISTS invitation_status (
  id SERIAL PRIMARY KEY,
  name VARCHAR(16) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Guest invitations table
CREATE TABLE IF NOT EXISTS guest_invitations (
  id SERIAL PRIMARY KEY,
  invite_guid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  guest_full_name VARCHAR(255) NOT NULL,
  guest_call VARCHAR(128) NOT NULL,
  guest_language VARCHAR(2) NOT NULL DEFAULT 'EN' CHECK (guest_language IN ('EN','LT')),
  fly_from INTEGER REFERENCES countries(id),
  status_id INTEGER REFERENCES invitation_status(id) DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Guest responses table
CREATE TABLE IF NOT EXISTS guest_responses (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guest_invitations(id) ON DELETE CASCADE NOT NULL,
  days_in_vietnam INTEGER CHECK (days_in_vietnam >= 0),
  flight_ticket_date DATE,
  days_before_wedding INTEGER CHECK (days_before_wedding >= 0),
  coming_with VARCHAR(255),
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Guest activities tracking table
CREATE TABLE IF NOT EXISTS guest_activities (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guest_invitations(id) ON DELETE SET NULL,
  activity_type VARCHAR(32) NOT NULL,
  event_time TIMESTAMPTZ DEFAULT now(),
  session_duration INTEGER,
  extra_data JSONB DEFAULT '{}'::jsonb,
  session_id UUID
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(128) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Media assets table
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  key VARCHAR(128) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_guest_invitations_invite_guid ON guest_invitations(invite_guid);
CREATE INDEX IF NOT EXISTS idx_guest_invitations_status ON guest_invitations(status_id);
CREATE INDEX IF NOT EXISTS idx_guest_responses_guest_id ON guest_responses(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_activities_guest_id ON guest_activities(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_activities_event_time ON guest_activities(event_time);
CREATE INDEX IF NOT EXISTS idx_guest_activities_session_id ON guest_activities(session_id);
