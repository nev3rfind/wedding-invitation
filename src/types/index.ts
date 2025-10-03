export interface Country {
  id: number
  country_code: string
  country_name_en: string
  country_name_lt: string
}

export interface InvitationStatus {
  id: number
  name: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface GuestInvitation {
  id: number
  invite_guid: string
  guest_full_name: string
  guest_call: string
  guest_language: 'EN' | 'LT'
  fly_from: number | null
  status_id: number
  created_at: string
  updated_at: string
  country?: Country
  status?: InvitationStatus
  response?: GuestResponse
}

export interface GuestResponse {
  id: number
  guest_id: number
  ticket_purchase_date: string
  plus_one: boolean
  days_in_vietnam: number
  other_message: string | null
  submitted_at: string
}

export interface GuestActivity {
  id: number
  guest_id: number | null
  activity_type: string
  event_time: string
  session_duration: number | null
  extra_data: Record<string, any>
}

export interface Settings {
  'wedding.start_datetime': string
  'wedding.venue_address': string
  'links.available_from': string
  'hero.portraits': string
}

export interface TrackingEvent {
  invite_guid: string
  session_id: string
  event_type: 'page_visit' | 'button_click' | 'modal_open' | 'form_submit' | 'address_reveal' | 'hero_image_change' | 'time_on_page'
  session_duration?: number
  extra_data?: Record<string, any>
}

export interface InviteData {
  guest: GuestInvitation
  settings: Partial<Settings>
  portraits: string[]
}

export interface RsvpRequest {
  answer: 'accept' | 'reject'
}

export interface ResponseRequest {
  ticket_purchase_date: string
  plus_one: boolean
  days_in_vietnam: number
  other_message?: string
}
