import { supabase } from './supabase'

export const api = {
  async getGuest(invitationCode) {
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select(`
        *,
        rsvp:rsvp_responses(*)
      `)
      .eq('invitation_code', invitationCode)
      .maybeSingle()

    if (guestError) throw guestError
    if (!guest) throw new Error('Guest not found')

    return guest
  },

  async updateAttending(invitationCode, attending) {
    const { data: guest, error } = await supabase
      .from('guests')
      .update({ attending })
      .eq('invitation_code', invitationCode)
      .select()
      .maybeSingle()

    if (error) throw error

    if (guest) {
      await this.trackInteraction(guest.id, 'button_click', {
        button: attending ? "I'll come" : 'Not attending'
      })
    }

    return guest
  },

  async submitResponse(invitationCode, formData) {
    const { data: guest } = await supabase
      .from('guests')
      .select('id')
      .eq('invitation_code', invitationCode)
      .maybeSingle()

    if (!guest) throw new Error('Guest not found')

    const { data, error } = await supabase
      .from('rsvp_responses')
      .upsert({
        guest_id: guest.id,
        ticket_purchase_date: formData.ticket_purchase_date,
        has_plus_one: formData.has_plus_one,
        days_staying: formData.days_staying,
        additional_message: formData.additional_message
      }, {
        onConflict: 'guest_id'
      })
      .select()
      .maybeSingle()

    if (error) throw error

    await this.trackInteraction(guest.id, 'form_submit', {
      success: true
    })

    return data
  },

  async trackInteraction(guestId, interactionType, interactionData = {}) {
    await supabase
      .from('user_interactions')
      .insert({
        guest_id: guestId,
        interaction_type: interactionType,
        interaction_data: interactionData
      })
  },

}
