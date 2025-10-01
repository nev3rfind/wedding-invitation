-- Wedding Invitation System - Copy and paste this entire file to create all tables
-- Run this in Bolt.new chat or in Project Settings -> Database

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

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
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
  days_in_vietnam INTEGER,
  flight_ticket_date DATE,
  days_before_wedding INTEGER,
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
