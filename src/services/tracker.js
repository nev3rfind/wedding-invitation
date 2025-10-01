import { api } from './api'

class ActivityTracker {
  constructor() {
    this.events = []
    this.sessionId = null
    this.inviteGuid = null
    this.pageLoadTime = Date.now()
    this.batchInterval = null
  }

  init(inviteGuid) {
    this.inviteGuid = inviteGuid

    if (!sessionStorage.getItem('session_id')) {
      this.sessionId = crypto.randomUUID()
      sessionStorage.setItem('session_id', this.sessionId)
    } else {
      this.sessionId = sessionStorage.getItem('session_id')
    }

    this.trackEvent('page_visit', {
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      user_agent: navigator.userAgent
    })

    this.startBatchTracking()
    this.setupUnloadTracking()
  }

  trackEvent(eventType, extraData = {}) {
    if (!this.inviteGuid) return

    const event = {
      activity_type: eventType,
      extra_data: {
        ...extraData,
        timestamp: new Date().toISOString(),
        invite_guid: this.inviteGuid
      },
      session_id: this.sessionId
    }

    this.events.push(event)

    if (this.events.length >= 5) {
      this.flushEvents()
    }
  }

  async flushEvents() {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    try {
      await api.batchTrackActivities(eventsToSend)
    } catch (error) {
      console.error('Failed to track events:', error)
      this.events.push(...eventsToSend)
    }
  }

  startBatchTracking() {
    this.batchInterval = setInterval(() => {
      this.flushEvents()
    }, 10000)
  }

  setupUnloadTracking() {
    const trackUnload = () => {
      const timeOnPage = Math.floor((Date.now() - this.pageLoadTime) / 1000)

      this.trackEvent('time_on_page', {
        duration_seconds: timeOnPage
      })

      if (this.events.length > 0) {
        const eventsData = JSON.stringify(this.events)
        navigator.sendBeacon('/api/track', eventsData)
      }
    }

    window.addEventListener('beforeunload', trackUnload)
    window.addEventListener('pagehide', trackUnload)
  }

  trackButtonClick(buttonId, buttonLabel) {
    this.trackEvent('button_click', {
      button_id: buttonId,
      button_label: buttonLabel
    })
  }

  trackModalOpen(modalId) {
    this.trackEvent('modal_open', {
      modal_id: modalId
    })
  }

  trackImageChange(imageIndex) {
    this.trackEvent('hero_image_change', {
      image_index: imageIndex
    })
  }

  destroy() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval)
    }
    this.flushEvents()
  }
}

export const tracker = new ActivityTracker()
