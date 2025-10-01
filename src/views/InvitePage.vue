<template>
  <div class="invite-page min-h-screen bg-ivory-crepe">
    <div
      ref="heroSection"
      class="hero-section min-h-screen relative overflow-hidden"
      :style="heroBackgroundStyle"
    >
      <div class="hero-overlay absolute inset-0 bg-gradient-to-b from-ivory-crepe/95 to-english-pear/60"></div>

      <div class="hero-content relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center min-h-screen">
          <div class="lg:col-span-3 space-y-6 text-center lg:text-left">
            <TypingGreeting v-if="guestData" :guest-call="guestData.guest_call" />

            <h1 ref="heroTitle" class="text-5xl sm:text-6xl md:text-7xl font-script text-spring-poppy leading-tight">
              {{ t('hero.title') }}
            </h1>

            <div class="space-y-2">
              <p class="text-2xl sm:text-3xl font-serif uppercase tracking-wide text-nimble" style="font-variant: small-caps;">
                {{ t('hero.date') }}
              </p>
              <p class="text-xl sm:text-2xl font-serif italic text-nimble">
                {{ t('hero.location') }}
              </p>
            </div>

            <p ref="invitationText" class="text-lg sm:text-xl text-english-pear max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {{ currentInvitationText }}
            </p>

            <Countdown v-if="weddingDate" :wedding-date="weddingDate" />

            <RsvpPrimary
              :current-state="rsvpState"
              @accept="onAccept"
              @reject="onReject"
              @open-modal="onOpenModal"
              @reveal-address="onRevealAddress"
            />

            <AddressReveal
              :is-visible="showAddress"
              :venue-address="venueAddress"
            />

            <FooterLinks
              :vietnam-link-date="vietnamLinkDate"
              :tickets-link-date="ticketsLinkDate"
              :fly-from-country="flyFromCountry"
              @vietnam-info="onVietnamInfo"
              @tickets-info="onTicketsInfo"
            />
          </div>

          <div class="lg:col-span-2">
            <RotatingPortraits
              v-if="portraits.length > 0"
              :portraits="portraits"
            />
          </div>
        </div>
      </div>
    </div>

    <QuestionsModal
      :is-open="showModal"
      @close="onCloseModal"
      @submit="onSubmitForm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import TypingGreeting from '../components/TypingGreeting.vue'
import RotatingPortraits from '../components/RotatingPortraits.vue'
import Countdown from '../components/Countdown.vue'
import RsvpPrimary from '../components/RsvpPrimary.vue'
import QuestionsModal from '../components/QuestionsModal.vue'
import FooterLinks from '../components/FooterLinks.vue'
import AddressReveal from '../components/AddressReveal.vue'
import { api } from '../services/api'
import { tracker } from '../services/tracker'

gsap.registerPlugin(TextPlugin)

const route = useRoute()
const { t, locale } = useI18n()

const guestData = ref(null)
const settings = ref({})
const media = ref({})
const rsvpState = ref('initial')
const showModal = ref(false)
const showAddress = ref(false)
const heroSection = ref(null)
const heroTitle = ref(null)
const invitationText = ref(null)
const currentInvitationText = ref('')

const weddingDate = computed(() => settings.value['wedding.start_datetime'])
const venueAddress = computed(() => settings.value['wedding.venue_address'] || 'Lotus Garden, West Lake, Hanoi, Vietnam')
const vietnamLinkDate = computed(() => settings.value['links.available_from'])
const ticketsLinkDate = computed(() => settings.value['links.tickets_available_from'])

const heroBackgroundStyle = computed(() => {
  const bgImage = media.value['hero-background-watercolor'] || '/assets/hero-background-watercolor.png'
  return {
    backgroundImage: `linear-gradient(to bottom, rgba(255,255,248,0.95), rgba(176,213,192,0.6)), url('${bgImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center 30%',
    backgroundAttachment: 'fixed'
  }
})

const portraits = computed(() => {
  try {
    const keys = JSON.parse(settings.value['portrait.keys'] || '[]')
    return keys.map(key => media.value[key]).filter(Boolean)
  } catch {
    return []
  }
})

const flyFromCountry = computed(() => {
  if (!guestData.value?.fly_from_country) return ''
  return guestData.value.fly_from_country.country_name_en
})

const loadInviteData = async () => {
  try {
    const inviteGuid = route.params.inviteGuid
    const data = await api.getInvite(inviteGuid)

    guestData.value = data.guest
    settings.value = data.settings
    media.value = data.media

    if (guestData.value?.guest_language) {
      locale.value = guestData.value.guest_language
    }

    if (guestData.value?.responses && guestData.value.responses.length > 0) {
      rsvpState.value = 'answered'
    }

    currentInvitationText.value = t('hero.invitation')
  } catch (error) {
    console.error('Failed to load invite:', error)
  }
}

const onAccept = async () => {
  try {
    await api.updateRsvp(route.params.inviteGuid, 'accept')

    const secondaryBtn = document.querySelector('.rsvp-buttons-container button:nth-child(2)')
    if (secondaryBtn) {
      gsap.to(secondaryBtn, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        onComplete: () => {
          secondaryBtn.style.display = 'none'
        }
      })
    }

    await new Promise(resolve => setTimeout(resolve, 300))

    if (invitationText.value) {
      gsap.to(invitationText.value, {
        duration: 0.8,
        text: t('hero.after_accept'),
        ease: 'none'
      })
    }
    currentInvitationText.value = t('hero.after_accept')

    const primaryBtn = document.getElementById('rsvp-action-btn')
    if (primaryBtn) {
      gsap.to(primaryBtn, {
        backgroundColor: '#B0D5C0',
        duration: 0.5,
        onComplete: () => {
          rsvpState.value = 'morphed'
        }
      })
    } else {
      rsvpState.value = 'morphed'
    }
  } catch (error) {
    console.error('Failed to update RSVP:', error)
  }
}

const onReject = async () => {
  try {
    await api.updateRsvp(route.params.inviteGuid, 'reject')
  } catch (error) {
    console.error('Failed to update RSVP:', error)
  }
}

const onOpenModal = () => {
  showModal.value = true
}

const onCloseModal = () => {
  showModal.value = false
}

const onSubmitForm = async (formData) => {
  try {
    await api.submitResponse(route.params.inviteGuid, formData)

    showModal.value = false

    if (invitationText.value) {
      gsap.to(invitationText.value, {
        duration: 0.8,
        text: t('hero.after_questions'),
        ease: 'none'
      })
    }
    currentInvitationText.value = t('hero.after_questions')

    rsvpState.value = 'answered'
  } catch (error) {
    console.error('Failed to submit form:', error)
    throw error
  }
}

const onRevealAddress = async () => {
  try {
    await api.revealAddress(route.params.inviteGuid)
    showAddress.value = true
  } catch (error) {
    console.error('Failed to reveal address:', error)
  }
}

const onVietnamInfo = () => {
  tracker.trackButtonClick('vietnam-info-link', 'Vietnam Info')
}

const onTicketsInfo = () => {
  tracker.trackButtonClick('tickets-info-link', 'Tickets Info')
}

onMounted(async () => {
  tracker.init(route.params.inviteGuid)
  await loadInviteData()
})

onUnmounted(() => {
  tracker.destroy()
})
</script>

<style scoped>
.hero-section {
  position: relative;
}

@media (max-width: 768px) {
  .hero-section {
    background-position: 50% 70% !important;
  }
}
</style>
