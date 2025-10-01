/*
  # Wedding Invitation System - Seed Data

  Prepopulate reference tables and example data
*/

-- Seed countries
INSERT INTO countries (country_code, country_name_en, country_name_lt) VALUES
  ('LT', 'Lithuania', 'Lietuva'),
  ('VN', 'Vietnam', 'Vietnamas'),
  ('GB', 'United Kingdom', 'Jungtinė Karalystė'),
  ('US', 'United States', 'Jungtinės Valstijos'),
  ('DE', 'Germany', 'Vokietija'),
  ('FR', 'France', 'Prancūzija'),
  ('ES', 'Spain', 'Ispanija'),
  ('IT', 'Italy', 'Italija'),
  ('NL', 'Netherlands', 'Nyderlandai'),
  ('BE', 'Belgium', 'Belgija'),
  ('PL', 'Poland', 'Lenkija'),
  ('SE', 'Sweden', 'Švedija'),
  ('NO', 'Norway', 'Norvegija'),
  ('DK', 'Denmark', 'Danija'),
  ('FI', 'Finland', 'Suomija')
ON CONFLICT (id) DO NOTHING;

-- Seed invitation statuses
INSERT INTO invitation_status (id, name) VALUES
  (1, 'pending'),
  (2, 'accepted'),
  (3, 'rejected')
ON CONFLICT (id) DO NOTHING;

-- Seed admin user (password: admin123)
-- Using bcrypt hash for 'admin123'
INSERT INTO admin_users (email, password_hash, full_name) VALUES
  ('admin@wedding.com', '$2b$10$rGHvZ7YUqvZ8gBQJ6H8K3.JF8LGY5KvWVJ9yXQW6FH7jYqNYXZJUW', 'Wedding Admin')
ON CONFLICT (email) DO NOTHING;

-- Seed example guest invitations
INSERT INTO guest_invitations (invite_guid, guest_full_name, guest_call, guest_language, fly_from, status_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'John', 'EN', 1, 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Jane Doe', 'Jane', 'EN', 3, 1),
  ('550e8400-e29b-41d4-a716-446655440003', 'Petras Petraitis', 'Petras', 'LT', 1, 2),
  ('550e8400-e29b-41d4-a716-446655440004', 'Maria Garcia', 'Maria', 'EN', 7, 1)
ON CONFLICT (invite_guid) DO NOTHING;

-- Seed default settings
INSERT INTO settings (key, value) VALUES
  ('wedding.start_datetime', '2026-04-05T17:00:00+07:00'),
  ('wedding.venue_address', 'Lotus Garden, West Lake, Hanoi, Vietnam'),
  ('links.available_from', '2025-11-01T00:00:00Z'),
  ('links.tickets_available_from', '2025-10-01T00:00:00Z'),
  ('hero.image_key', 'hero-background-watercolor'),
  ('portrait.keys', '["portrait-1","portrait-2","portrait-3","portrait-4"]')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed media assets
INSERT INTO media (key, url, metadata) VALUES
  ('hero-background-watercolor', '/assets/hero-background-watercolor.png', '{"type": "hero-background"}'),
  ('portrait-1', 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=1', '{"type": "portrait", "order": 1}'),
  ('portrait-2', 'https://images.pexels.com/photos/1024969/pexels-photo-1024969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=1', '{"type": "portrait", "order": 2}'),
  ('portrait-3', 'https://images.pexels.com/photos/1024968/pexels-photo-1024968.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=1', '{"type": "portrait", "order": 3}'),
  ('portrait-4', 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=1', '{"type": "portrait", "order": 4}')
ON CONFLICT (key) DO UPDATE SET url = EXCLUDED.url, metadata = EXCLUDED.metadata;
