import { api } from './api'
import type { TrackingEvent } from '@/types'

class Tracker {
  private sessionId: string = ''
  private inviteGuid: string = ''
  private eventQueue: TrackingEvent[] = []
  private batchInterval: number | null = null
  private heartbeatInterval: number | null = null
  private sessionStartTime: number = 0

  init(inviteGuid: string) {
    this.inviteGuid = inviteGuid
    this.sessionId = this.getOrCreateSessionId()
    this.sessionStartTime = Date.now()

    this.startBatching()
    this.startHeartbeat()

    this.track('page_visit', {
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    })

    window.addEventListener('beforeunload', () => this.destroy())
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = this.generateUUID()
      sessionStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  track(eventType: TrackingEvent['event_type'], extraData: Record<string, any> = {}) {
    const event: TrackingEvent = {
      invite_guid: this.inviteGuid,
      session_id: this.sessionId,
      event_type: eventType,
      extra_data: extraData,
    }

    this.eventQueue.push(event)

    if (this.eventQueue.length >= 10) {
      this.flush()
    }
  }

  trackButtonClick(buttonId: string, buttonLabel: string) {
    this.track('button_click', {
      button_id: buttonId,
      button_label: buttonLabel,
    })
  }

  trackModalOpen(modalName: string) {
    this.track('modal_open', {
      modal_name: modalName,
    })
  }

  trackHeroImageChange(imageIndex: number) {
    this.track('hero_image_change', {
      image_index: imageIndex,
    })
  }

  private startBatching() {
    this.batchInterval = window.setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush()
      }
    }, 10000)
  }

  private startHeartbeat() {
    this.heartbeatInterval = window.setInterval(() => {
      const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000)
      this.track('time_on_page', {
        session_duration: sessionDuration,
      })
    }, 30000)
  }

  private async flush() {
    if (this.eventQueue.length === 0) return

    const events = [...this.eventQueue]
    this.eventQueue = []

    try {
      await api.track(events)
    } catch (error) {
      console.error('Failed to send tracking events:', error)
      this.eventQueue.push(...events)
    }
  }

  destroy() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval)
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000)
    this.track('time_on_page', {
      session_duration: sessionDuration,
      final: true,
    })

    this.flush()
  }
}

export const tracker = new Tracker()
