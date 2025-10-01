import { supabase } from './supabase'

export const api = {
  async getInvite(inviteGuid) {
    const { data: guest, error: guestError } = await supabase
      .from('guest_invitations')
      .select(`
        *,
        fly_from_country:countries(country_code, country_name_en, country_name_lt),
        status:invitation_status(name),
        responses:guest_responses(*)
      `)
      .eq('invite_guid', inviteGuid)
      .maybeSingle()

    if (guestError) throw guestError

    const { data: settings } = await supabase
      .from('settings')
      .select('*')

    const { data: media } = await supabase
      .from('media')
      .select('*')

    const settingsMap = {}
    settings?.forEach(s => {
      settingsMap[s.key] = s.value
    })

    const mediaMap = {}
    media?.forEach(m => {
      mediaMap[m.key] = m.url
    })

    return {
      guest,
      settings: settingsMap,
      media: mediaMap
    }
  },

  async updateRsvp(inviteGuid, answer) {
    const statusMap = {
      accept: 2,
      reject: 3
    }

    const { data: guest } = await supabase
      .from('guest_invitations')
      .select('id')
      .eq('invite_guid', inviteGuid)
      .single()

    const { data, error } = await supabase
      .from('guest_invitations')
      .update({
        status_id: statusMap[answer],
        updated_at: new Date().toISOString()
      })
      .eq('invite_guid', inviteGuid)
      .select()
      .single()

    if (error) throw error

    await this.trackActivity(inviteGuid, 'button_click', {
      button: answer === 'accept' ? 'I\'ll come' : 'Unfortunately no'
    })

    await this.trackActivity(inviteGuid, 'status_change', {
      new_status: answer
    })

    return data
  },

  async submitResponse(inviteGuid, formData) {
    const { data: guest } = await supabase
      .from('guest_invitations')
      .select('id')
      .eq('invite_guid', inviteGuid)
      .single()

    if (!guest) throw new Error('Guest not found')

    const { data, error } = await supabase
      .from('guest_responses')
      .insert({
        guest_id: guest.id,
        days_in_vietnam: formData.days_in_vietnam,
        flight_ticket_date: formData.flight_ticket_date,
        days_before_wedding: formData.days_before_wedding,
        coming_with: formData.coming_with,
      })
      .select()
      .single()

    if (error) throw error

    await supabase
      .from('guest_invitations')
      .update({ status_id: 2 })
      .eq('invite_guid', inviteGuid)

    await this.trackActivity(inviteGuid, 'form_submit', {
      success: true
    })

    await this.trackActivity(inviteGuid, 'status_change', {
      new_status: 'accepted'
    })

    return data
  },

  async revealAddress(inviteGuid) {
    await this.trackActivity(inviteGuid, 'address_reveal', {
      timestamp: new Date().toISOString()
    })

    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'wedding.venue_address')
      .single()

    return data?.value
  },

  async trackActivity(inviteGuid, activityType, extraData = {}) {
    const { data: guest } = await supabase
      .from('guest_invitations')
      .select('id')
      .eq('invite_guid', inviteGuid)
      .maybeSingle()

    const sessionId = sessionStorage.getItem('session_id')

    await supabase
      .from('guest_activities')
      .insert({
        guest_id: guest?.id || null,
        activity_type: activityType,
        extra_data: extraData,
        session_id: sessionId
      })
  },

  async batchTrackActivities(events) {
    await supabase
      .from('guest_activities')
      .insert(events)
  }
}
