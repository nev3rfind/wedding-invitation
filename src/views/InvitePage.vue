<template>
  <main class="min-h-screen overflow-hidden relative bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
    <FallingPetals />

    <div
      ref="parallaxBg"
      class="fixed inset-0 -z-10"
      :style="parallaxStyle"
    >
      <div
        class="absolute inset-0 opacity-40"
        style="background-image: url('/assets/hero-background-watercolor.png'); background-size: cover; background-position: center;"
      ></div>
    </div>

    <section class="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
      <div class="max-w-7xl w-full mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="text-center lg:text-left space-y-8 animate-fade-in">
            <HeroHighlight container-class-name="h-auto py-8">
              <div class="space-y-4">
                <h1 class="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
                  <span class="text-gray-800">Donatas & </span>
                  <span class="text-wedding-red">Trang</span>
                  <br />
                  <span class="text-gray-800">Wedding</span>
                </h1>

                <Highlight class-name="inline-block">
                  <div class="text-3xl sm:text-4xl font-semibold text-gray-700">
                    {{ t('hero.date') }}
                  </div>
                </Highlight>

                <div class="text-xl sm:text-2xl text-gray-600">
                  {{ t('hero.location') }}
                </div>
              </div>
            </HeroHighlight>

            <TypingGreeting v-if="guestData" :guest-call="guestData.guest_call" />

            <p
              ref="invitationText"
              class="text-lg sm:text-xl text-gray-700 leading-relaxed font-serif italic"
            >
              {{ currentMessage }}
            </p>

            <div class="py-6">
              <Countdown v-if="weddingDate" :wedding-date="weddingDate" />
            </div>

            <RsvpPrimary
              ref="rsvpComponent"
              :initial-state="initialRsvpState"
              @accept="handleAccept"
              @reject="handleReject"
              @open-modal="openQuestionsModal"
            />

            <div class="flex flex-col items-center lg:items-start gap-3 pt-4">
              <a
                href="#vietnam"
                class="link-card-cta group relative text-green-600 hover:text-green-700 font-bold text-base sm:text-lg transition-all duration-300 px-6 py-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 shadow-md hover:shadow-lg"
              >
                <span class="relative z-10 shiny-text">{{ t('links.vietnamInfo') }}</span>
                <span class="ml-2 px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {{ t('links.availableAfter') }}
                </span>
              </a>

              <a
                href="#tickets"
                class="link-card-cta group relative text-blue-600 hover:text-blue-700 font-bold text-base sm:text-lg transition-all duration-300 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 shadow-md hover:shadow-lg"
              >
                <span class="relative z-10 shiny-text">{{ t('links.ticketsInfo') }}</span>
                <span v-if="flyingFrom" class="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {{ t('links.flyingFrom') }} {{ flyingFrom }}
                </span>
                <span v-else class="ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {{ t('links.linkAvailableSoon') }}
                </span>
              </a>
            </div>
          </div>

          <div class="flex justify-center lg:justify-end animate-fade-in" style="animation-delay: 0.5s">
            <RotatingPortraits :portraits="portraits" />
          </div>
        </div>
      </div>
    </section>

    <QuestionsModal
      :is-open="showQuestionsModal"
      @close="closeQuestionsModal"
      @submit="submitQuestions"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import confetti from 'canvas-confetti'
import FallingPetals from '@/components/FallingPetals.vue'
import TypingGreeting from '@/components/TypingGreeting.vue'
import Countdown from '@/components/Countdown.vue'
import RotatingPortraits from '@/components/RotatingPortraits.vue'
import RsvpPrimary from '@/components/RsvpPrimary.vue'
import QuestionsModal from '@/components/QuestionsModal.vue'
import { HeroHighlight, Highlight } from '@/components/ui'
import { api } from '@/services/api'
import { tracker } from '@/services/tracker'
import type { GuestInvitation } from '@/types'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const guestData = ref<GuestInvitation | null>(null)
const showQuestionsModal = ref(false)
const invitationText = ref<HTMLElement | null>(null)
const parallaxBg = ref<HTMLElement | null>(null)
const rsvpComponent = ref<InstanceType<typeof RsvpPrimary> | null>(null)
const scrollY = ref(0)

const currentMessage = ref('')
const initialRsvpState = ref<'initial' | 'accepted' | 'completed'>('initial')

const weddingDate = computed(() => '2026-04-05T17:00:00+07:00')

const portraits = computed(() => [
  'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpg?auto=compress&cs=tinysrgb&w=800'
])

const flyingFrom = computed(() => {
  if (!guestData.value?.country) return ''
  return guestData.value.guest_language === 'LT'
    ? guestData.value.country.country_name_lt
    : guestData.value.country.country_name_en
})

const parallaxStyle = computed(() => ({
  transform: `translateY(${scrollY.value * 0.3}px)`
}))

const loadGuestData = async () => {
  try {
    const inviteGuid = route.params.code as string
    const data = await api.getInvite(inviteGuid)

    guestData.value = data.guest

    if (guestData.value.guest_language) {
      locale.value = guestData.value.guest_language
    }

    if (guestData.value.response) {
      initialRsvpState.value = 'completed'
      currentMessage.value = t('hero.afterQuestions')
    } else if (guestData.value.status_id === 2) {
      initialRsvpState.value = 'accepted'
      currentMessage.value = t('hero.afterAccept')
    } else {
      currentMessage.value = t('hero.invitation')
    }

    tracker.init(inviteGuid)
  } catch (error) {
    console.error('Failed to load guest data:', error)
    router.push('/404')
  }
}

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const triggerFireworks = () => {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
  }, 250)
}

const animateTextChange = (newText: string) => {
  if (invitationText.value) {
    gsap.to(invitationText.value, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      onComplete: () => {
        currentMessage.value = newText
        gsap.to(invitationText.value, {
          opacity: 1,
          y: 0,
          duration: 0.5
        })
      }
    })
  } else {
    currentMessage.value = newText
  }
}

const handleAccept = async () => {
  try {
    triggerFireworks()

    const inviteGuid = route.params.code as string
    await api.updateRsvp(inviteGuid, { answer: 'accept' })

    animateTextChange(t('hero.afterAccept'))

    tracker.trackButtonClick('rsvp-accept', t('buttons.illCome'))
  } catch (error) {
    console.error('Failed to update RSVP:', error)
  }
}

const handleReject = async () => {
  try {
    const inviteGuid = route.params.code as string
    await api.updateRsvp(inviteGuid, { answer: 'reject' })

    tracker.trackButtonClick('rsvp-reject', t('buttons.unfortunately'))
  } catch (error) {
    console.error('Failed to update RSVP:', error)
  }
}

const openQuestionsModal = () => {
  showQuestionsModal.value = true
  tracker.trackModalOpen('questions-modal')
}

const closeQuestionsModal = () => {
  showQuestionsModal.value = false
}

const submitQuestions = async (formData: {
  ticketDate: string
  plusOne: boolean
  daysStaying: number
  otherMessage: string
}) => {
  try {
    const inviteGuid = route.params.code as string
    await api.submitResponse(inviteGuid, {
      ticket_purchase_date: formData.ticketDate,
      plus_one: formData.plusOne,
      days_in_vietnam: formData.daysStaying,
      other_message: formData.otherMessage,
    })

    showQuestionsModal.value = false
    animateTextChange(t('hero.afterQuestions'))

    if (rsvpComponent.value) {
      rsvpComponent.value.setCompleted()
    }

    triggerFireworks()
  } catch (error) {
    console.error('Failed to submit questions:', error)
  }
}

onMounted(async () => {
  await loadGuestData()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  tracker.destroy()
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 1.2s ease-out;
}

.link-card-cta {
  position: relative;
  overflow: hidden;
}

.link-card-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.5s;
}

.link-card-cta:hover::before {
  left: 100%;
}

.shiny-text {
  background: linear-gradient(90deg, currentColor 0%, currentColor 40%, white 50%, currentColor 60%, currentColor 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 3s linear infinite;
}

@keyframes shine {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
