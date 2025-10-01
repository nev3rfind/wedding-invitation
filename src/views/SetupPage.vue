<template>
  <div class="setup-page min-h-screen bg-ivory-crepe p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-serif text-spring-poppy mb-8">Database Setup</h1>

      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-serif text-nimble mb-4">Setup Instructions</h2>

        <div class="space-y-4 mb-8">
          <p class="text-nimble">
            Welcome! Let's set up your wedding invitation database in 3 simple steps.
          </p>

          <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p class="font-semibold text-blue-800 mb-2">📋 Step 1: Start Database (Required First)</p>
            <p class="text-blue-700 mb-2">
              In Bolt.new chat, ask: <strong>"Please run the SQL from database/schema.sql to create the database tables"</strong>
            </p>
            <p class="text-blue-700 text-sm">
              Or copy the SQL schema below and paste it to Bolt.
            </p>
          </div>

          <div class="bg-green-50 border-l-4 border-green-400 p-4">
            <p class="font-semibold text-green-800 mb-2">✅ Step 2: Populate Data</p>
            <p class="text-green-700">
              Once tables are created, click the button below to populate with wedding data, test guests, and settings.
            </p>
          </div>

          <div class="bg-purple-50 border-l-4 border-purple-400 p-4">
            <p class="font-semibold text-purple-800 mb-2">🎉 Step 3: Test Your Invites</p>
            <p class="text-purple-700">
              After setup completes, test invite links will appear below. Click them to see your beautiful wedding invitation!
            </p>
          </div>
        </div>

        <button
          @click="runSetup"
          :disabled="isRunning"
          class="w-full px-6 py-4 bg-spring-poppy text-ivory-crepe rounded-lg font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {{ isRunning ? 'Populating database...' : '▶ Populate Database (Step 2)' }}
        </button>
      </div>

      <div v-if="results" class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-serif mb-4" :class="results.success ? 'text-green-600' : 'text-red-600'">
          {{ results.success ? 'Setup Complete!' : 'Setup Issues' }}
        </h2>

        <div class="space-y-2 mb-6">
          <div v-for="(step, index) in results.steps" :key="index" class="text-nimble">
            {{ step }}
          </div>
        </div>

        <div v-if="results.errors.length > 0" class="space-y-2 mb-6">
          <h3 class="font-semibold text-red-600">Errors:</h3>
          <div v-for="(error, index) in results.errors" :key="index" class="text-red-600 bg-red-50 p-3 rounded">
            {{ error }}
          </div>
          <p class="text-nimble mt-4">
            These errors might mean the tables don't exist yet. Please run the schema.sql first in Supabase SQL Editor.
          </p>
        </div>

        <div v-if="results.success" class="space-y-4">
          <h3 class="font-semibold text-english-pear">Test Invite Links:</h3>
          <div class="space-y-2">
            <a
              href="/invite/550e8400-e29b-41d4-a716-446655440001"
              target="_blank"
              class="block text-english-pear hover:text-spring-poppy underline"
            >
              → John Smith (English)
            </a>
            <a
              href="/invite/550e8400-e29b-41d4-a716-446655440002"
              target="_blank"
              class="block text-english-pear hover:text-spring-poppy underline"
            >
              → Jane Doe (English)
            </a>
            <a
              href="/invite/550e8400-e29b-41d4-a716-446655440003"
              target="_blank"
              class="block text-english-pear hover:text-spring-poppy underline"
            >
              → Petras Petraitis (Lithuanian)
            </a>
            <a
              href="/invite/550e8400-e29b-41d4-a716-446655440004"
              target="_blank"
              class="block text-english-pear hover:text-spring-poppy underline"
            >
              → Maria Garcia (English)
            </a>
          </div>

          <h3 class="font-semibold text-english-pear mt-6">Admin Dashboard:</h3>
          <a
            href="/admin"
            target="_blank"
            class="block text-english-pear hover:text-spring-poppy underline"
          >
            → View Admin Dashboard
          </a>
        </div>
      </div>

      <div class="mt-8 bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-serif text-nimble mb-4">Database Schema SQL</h2>
        <p class="text-nimble mb-4">Copy this and run in Supabase SQL Editor first:</p>
        <div class="bg-gray-100 p-4 rounded overflow-x-auto">
          <pre class="text-sm">{{ schemaSQL }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { setupDatabase } from '../utils/setupDatabase'

const isRunning = ref(false)
const results = ref(null)

const schemaSQL = `-- Run this in Supabase SQL Editor first!

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
CREATE INDEX IF NOT EXISTS idx_guest_invitations_status ON guest_invitations(status_id);`

const runSetup = async () => {
  isRunning.value = true
  results.value = null

  try {
    const setupResults = await setupDatabase()
    results.value = setupResults
  } catch (error) {
    results.value = {
      success: false,
      steps: [],
      errors: [error.message]
    }
  } finally {
    isRunning.value = false
  }
}
</script>
