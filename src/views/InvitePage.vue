<template>
  <main class="min-h-screen overflow-hidden relative">
    <div
      ref="parallaxBg"
      class="fixed inset-0 -z-10 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
      :style="parallaxStyle"
    >
      <div class="absolute inset-0 opacity-30" style="background-image: url('/assets/hero-background-watercolor.png'); background-size: cover; background-position: center;"></div>
    </div>

    <section id="home" class="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div class="max-w-4xl w-full mx-auto text-center space-y-8 animate-fade-in">
        <div class="mb-8 animate-slide-up" style="animation-delay: 0.1s">
          <div class="text-sm sm:text-base text-green-600 font-semibold mb-2 uppercase tracking-wide">
            Save the Date
          </div>

          <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 animate-slide-up" style="animation-delay: 0.2s">
            <span class="text-gray-800">Donatas & </span>
            <span class="text-red-500">Trang</span>
            <span class="text-gray-800"> Wedding</span>
          </h1>

          <div class="text-5xl sm:text-6xl md:text-8xl font-extrabold text-gray-900 mb-6 animate-slide-up" style="animation-delay: 0.3s">
            5 April 2026
          </div>
        </div>

        <div class="text-xl sm:text-2xl md:text-3xl mb-8 animate-slide-up" style="animation-delay: 0.4s">
          <TypewriterEffect
            :text="['Labas', 'Hello', 'Xin Chào']"
            :speed="100"
            :wait-time="1500"
            :delete-speed="50"
            class="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          />
        </div>

        <p ref="invitationText" class="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10 animate-slide-up font-serif italic" style="animation-delay: 0.5s">
          {{ currentInvitationText || 'We warmly invite you to our wedding in the land of lotus lakes and golden paddies' }}
        </p>

        <div class="animate-slide-up" style="animation-delay: 0.6s">
          <Countdown v-if="weddingDate" :wedding-date="weddingDate" />
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-slide-up" style="animation-delay: 0.7s">
          <button
            v-if="rsvpState === 'initial'"
            @click="onAccept"
            class="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
          >
            {{ t('rsvp.accept') || "I'll come" }}
          </button>

          <button
            v-if="rsvpState === 'initial'"
            @click="onReject"
            class="px-8 py-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
          >
            {{ t('rsvp.reject') || "Unfortunately no" }}
          </button>

          <button
            v-if="rsvpState === 'morphed'"
            @click="onOpenModal"
            class="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {{ t('rsvp.satisfy_curiosity') || "Tell us more" }}
          </button>

          <button
            v-if="rsvpState === 'answered'"
            @click="onRevealAddress"
            class="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {{ t('rsvp.reveal_address') || "Show venue address" }}
          </button>
        </div>

        <div v-if="showAddress" class="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl animate-slide-up">
          <AddressReveal
            :is-visible="showAddress"
            :venue-address="venueAddress"
          />
        </div>

        <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style="animation-delay: 0.8s">
          <GetStartedButton
            @click="onVietnamInfo"
            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white min-w-[250px]"
          >
            What is waiting for me in Vietnam?
          </GetStartedButton>

          <GetStartedButton
            v-if="flyFromCountry"
            @click="onTicketsInfo"
            variant="outline"
            class="min-w-[250px]"
          >
            Flying from {{ flyFromCountry }}
          </GetStartedButton>
        </div>
      </div>
    </section>

    <DialogModal
      v-model="showModal"
      title="RSVP Details"
      description="Please share a few details with us so we can make your day special!"
      submit-text="Send RSVP"
      @save="onSubmitForm"
      @close="onCloseModal"
    />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import TypewriterEffect from '../components/ui/TypewriterEffect.vue'
import Countdown from '../components/Countdown.vue'
import AddressReveal from '../components/AddressReveal.vue'
import GetStartedButton from '../components/ui/GetStartedButton.vue'
import DialogModal from '../components/ui/DialogModal.vue'
import { api } from '../services/api'
import { tracker } from '../services/tracker'
import { useFireworks } from '../composables/useFireworks'

gsap.registerPlugin(TextPlugin)

const route = useRoute()
const { t, locale } = useI18n()

const guestData = ref(null)
const settings = ref({})
const media = ref({})
const rsvpState = ref('initial')
const showModal = ref(false)
const showAddress = ref(false)
const invitationText = ref(null)
const currentInvitationText = ref('')
const parallaxBg = ref(null)
const scrollY = ref(0)

const { triggerFireworks } = useFireworks()

const weddingDate = computed(() => settings.value['wedding.start_datetime'])
const venueAddress = computed(() => settings.value['wedding.venue_address'] || 'Lotus Garden, West Lake, Hanoi, Vietnam')
const vietnamLinkDate = computed(() => settings.value['links.available_from'])
const ticketsLinkDate = computed(() => settings.value['links.tickets_available_from'])


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

const parallaxStyle = computed(() => ({
  transform: `translateY(${scrollY.value * 0.5}px)`
}))

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const onAccept = async () => {
  try {
    triggerFireworks()
    await api.updateRsvp(route.params.inviteGuid, 'accept')
    await new Promise(resolve => setTimeout(resolve, 300))

    if (invitationText.value) {
      gsap.to(invitationText.value, {
        duration: 0.8,
        text: t('hero.after_accept') || 'Thank you! We can\'t wait to celebrate with you!',
        ease: 'none'
      })
    }
    currentInvitationText.value = t('hero.after_accept') || 'Thank you! We can\'t wait to celebrate with you!'
    rsvpState.value = 'morphed'
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
        text: t('hero.after_questions') || 'Perfect! All details saved.',
        ease: 'none'
      })
    }
    currentInvitationText.value = t('hero.after_questions') || 'Perfect! All details saved.'

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
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  tracker.destroy()
  window.removeEventListener('scroll', handleScroll)
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

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
  opacity: 0;
}
</style>
