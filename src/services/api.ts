import { supabase } from './supabase'
import type {
  GuestInvitation,
  InviteData,
  RsvpRequest,
  ResponseRequest,
  TrackingEvent,
} from '@/types'

export const api = {
  async getInvite(inviteGuid: string): Promise<InviteData> {
    const { data: guest, error: guestError } = await supabase
      .from('guest_invitations')
      .select(`
        *,
        country:countries(id, country_code, country_name_en, country_name_lt),
        status:invitation_status(id, name),
        response:guest_responses(*)
      `)
      .eq('invite_guid', inviteGuid)
      .maybeSingle()

    if (guestError) throw guestError
    if (!guest) throw new Error('Guest not found')

    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('key, value')

    if (settingsError) throw settingsError

    const settingsMap = settings?.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, {} as Record<string, string>) || {}

    let portraits: string[] = []
    try {
      const portraitKeys = JSON.parse(settingsMap['hero.portraits'] || '[]')
      portraits = Array.isArray(portraitKeys) ? portraitKeys : []
    } catch {
      portraits = []
    }

    return {
      guest: guest as GuestInvitation,
      settings: settingsMap,
      portraits,
    }
  },

  async updateRsvp(inviteGuid: string, request: RsvpRequest): Promise<GuestInvitation> {
    const statusMap = {
      accept: 2,
      reject: 3,
    }

    const { data: guest, error: guestError } = await supabase
      .from('guest_invitations')
      .select('id')
      .eq('invite_guid', inviteGuid)
      .maybeSingle()

    if (guestError || !guest) throw new Error('Guest not found')

    const { data, error } = await supabase
      .from('guest_invitations')
      .update({
        status_id: statusMap[request.answer],
        updated_at: new Date().toISOString(),
      })
      .eq('invite_guid', inviteGuid)
      .select()
      .maybeSingle()

    if (error) throw error

    await this.track([{
      invite_guid: inviteGuid,
      session_id: sessionStorage.getItem('session_id') || '',
      event_type: 'button_click',
      extra_data: { button: request.answer },
    }])

    return data as GuestInvitation
  },

  async submitResponse(inviteGuid: string, request: ResponseRequest): Promise<void> {
    const { data: guest, error: guestError } = await supabase
      .from('guest_invitations')
      .select('id')
      .eq('invite_guid', inviteGuid)
      .maybeSingle()

    if (guestError || !guest) throw new Error('Guest not found')

    const { error: responseError } = await supabase
      .from('guest_responses')
      .upsert({
        guest_id: guest.id,
        ticket_purchase_date: request.ticket_purchase_date,
        plus_one: request.plus_one,
        days_in_vietnam: request.days_in_vietnam,
        other_message: request.other_message || null,
      }, {
        onConflict: 'guest_id'
      })

    if (responseError) throw responseError

    const { error: statusError } = await supabase
      .from('guest_invitations')
      .update({ status_id: 2 })
      .eq('invite_guid', inviteGuid)

    if (statusError) throw statusError

    await this.track([{
      invite_guid: inviteGuid,
      session_id: sessionStorage.getItem('session_id') || '',
      event_type: 'form_submit',
      extra_data: { success: true },
    }])
  },

  async revealAddress(inviteGuid: string): Promise<string> {
    const { data: guest, error: guestError } = await supabase
      .from('guest_invitations')
      .select('response:guest_responses(*)')
      .eq('invite_guid', inviteGuid)
      .maybeSingle()

    if (guestError) throw guestError

    await this.track([{
      invite_guid: inviteGuid,
      session_id: sessionStorage.getItem('session_id') || '',
      event_type: 'address_reveal',
      extra_data: {},
    }])

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'wedding.venue_address')
      .maybeSingle()

    if (error) throw error
    return data?.value || ''
  },

  async track(events: TrackingEvent[]): Promise<void> {
    const activities = events.map(event => ({
      guest_id: null,
      activity_type: event.event_type,
      event_time: new Date().toISOString(),
      session_duration: event.session_duration || null,
      extra_data: {
        invite_guid: event.invite_guid,
        session_id: event.session_id,
        ...event.extra_data,
      },
    }))

    const { error } = await supabase
      .from('guest_activities')
      .insert(activities)

    if (error) console.error('Tracking error:', error)
  },
}
