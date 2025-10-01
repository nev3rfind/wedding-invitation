import { supabase } from '../services/supabase'

export async function setupDatabase() {
  const results = {
    success: false,
    steps: [],
    errors: []
  }

  try {
    // Step 1: Insert countries
    results.steps.push('Inserting countries...')
    const { error: countriesError } = await supabase
      .from('countries')
      .upsert([
        { id: 1, country_code: 'LT', country_name_en: 'Lithuania', country_name_lt: 'Lietuva' },
        { id: 2, country_code: 'VN', country_name_en: 'Vietnam', country_name_lt: 'Vietnamas' },
        { id: 3, country_code: 'GB', country_name_en: 'United Kingdom', country_name_lt: 'Jungtinė Karalystė' },
        { id: 4, country_code: 'US', country_name_en: 'United States', country_name_lt: 'Jungtinės Valstijos' },
        { id: 5, country_code: 'DE', country_name_en: 'Germany', country_name_lt: 'Vokietija' },
        { id: 6, country_code: 'FR', country_name_en: 'France', country_name_lt: 'Prancūzija' },
        { id: 7, country_code: 'ES', country_name_en: 'Spain', country_name_lt: 'Ispanija' },
        { id: 8, country_code: 'IT', country_name_en: 'Italy', country_name_lt: 'Italija' },
        { id: 9, country_code: 'NL', country_name_en: 'Netherlands', country_name_lt: 'Nyderlandai' },
        { id: 10, country_code: 'BE', country_name_en: 'Belgium', country_name_lt: 'Belgija' },
        { id: 11, country_code: 'PL', country_name_en: 'Poland', country_name_lt: 'Lenkija' },
        { id: 12, country_code: 'SE', country_name_en: 'Sweden', country_name_lt: 'Švedija' },
        { id: 13, country_code: 'NO', country_name_en: 'Norway', country_name_lt: 'Norvegija' },
        { id: 14, country_code: 'DK', country_name_en: 'Denmark', country_name_lt: 'Danija' },
        { id: 15, country_code: 'FI', country_name_en: 'Finland', country_name_lt: 'Suomija' }
      ], { onConflict: 'id', ignoreDuplicates: true })

    if (countriesError) results.errors.push(`Countries: ${countriesError.message}`)
    else results.steps.push('✓ Countries inserted')

    // Step 2: Insert invitation statuses
    results.steps.push('Inserting invitation statuses...')
    const { error: statusError } = await supabase
      .from('invitation_status')
      .upsert([
        { id: 1, name: 'pending' },
        { id: 2, name: 'accepted' },
        { id: 3, name: 'rejected' }
      ], { onConflict: 'id', ignoreDuplicates: true })

    if (statusError) results.errors.push(`Statuses: ${statusError.message}`)
    else results.steps.push('✓ Invitation statuses inserted')

    // Step 3: Insert settings
    results.steps.push('Inserting settings...')
    const { error: settingsError } = await supabase
      .from('settings')
      .upsert([
        { key: 'wedding.start_datetime', value: '2026-04-05T17:00:00+07:00' },
        { key: 'wedding.venue_address', value: 'Lotus Garden, West Lake, Hanoi, Vietnam' },
        { key: 'links.available_from', value: '2025-11-01T00:00:00Z' },
        { key: 'links.tickets_available_from', value: '2025-10-01T00:00:00Z' },
        { key: 'hero.image_key', value: 'hero-background-watercolor' },
        { key: 'portrait.keys', value: '["portrait-1","portrait-2","portrait-3","portrait-4"]' }
      ], { onConflict: 'key' })

    if (settingsError) results.errors.push(`Settings: ${settingsError.message}`)
    else results.steps.push('✓ Settings inserted')

    // Step 4: Insert media
    results.steps.push('Inserting media...')
    const { error: mediaError } = await supabase
      .from('media')
      .upsert([
        { key: 'hero-background-watercolor', url: '/assets/hero-background-watercolor.png', metadata: { type: 'hero-background' } },
        { key: 'portrait-1', url: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=1', metadata: { type: 'portrait', order: 1 } },
        { key: 'portrait-2', url: 'https://images.pexels.com/photos/1024969/pexels-photo-1024969.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=1', metadata: { type: 'portrait', order: 2 } },
        { key: 'portrait-3', url: 'https://images.pexels.com/photos/1024968/pexels-photo-1024968.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=1', metadata: { type: 'portrait', order: 3 } },
        { key: 'portrait-4', url: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&dpr=1', metadata: { type: 'portrait', order: 4 } }
      ], { onConflict: 'key' })

    if (mediaError) results.errors.push(`Media: ${mediaError.message}`)
    else results.steps.push('✓ Media inserted')

    // Step 5: Insert test guests
    results.steps.push('Inserting test guests...')
    const { error: guestsError } = await supabase
      .from('guest_invitations')
      .upsert([
        {
          invite_guid: '550e8400-e29b-41d4-a716-446655440001',
          guest_full_name: 'John Smith',
          guest_call: 'John',
          guest_language: 'EN',
          fly_from: 1,
          status_id: 1
        },
        {
          invite_guid: '550e8400-e29b-41d4-a716-446655440002',
          guest_full_name: 'Jane Doe',
          guest_call: 'Jane',
          guest_language: 'EN',
          fly_from: 3,
          status_id: 1
        },
        {
          invite_guid: '550e8400-e29b-41d4-a716-446655440003',
          guest_full_name: 'Petras Petraitis',
          guest_call: 'Petras',
          guest_language: 'LT',
          fly_from: 1,
          status_id: 2
        },
        {
          invite_guid: '550e8400-e29b-41d4-a716-446655440004',
          guest_full_name: 'Maria Garcia',
          guest_call: 'Maria',
          guest_language: 'EN',
          fly_from: 7,
          status_id: 1
        }
      ], { onConflict: 'invite_guid', ignoreDuplicates: true })

    if (guestsError) results.errors.push(`Guests: ${guestsError.message}`)
    else results.steps.push('✓ Test guests inserted')

    results.success = results.errors.length === 0
    return results

  } catch (error) {
    results.errors.push(`Unexpected error: ${error.message}`)
    return results
  }
}
