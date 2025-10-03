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
          <div class="text-center lg:text-left space-y-6 animate-fade-in">
            <h1
              class="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-tight animate-slide-up"
              style="animation-delay: 0.1s"
            >
              <span class="text-gray-800">Donatas & </span>
              <span class="text-red-500">Trang</span>
              <br />
              <span class="text-gray-800">Wedding</span>
            </h1>

            <div class="text-3xl sm:text-4xl font-semibold text-gray-700 animate-slide-up" style="animation-delay: 0.2s">
              {{ t('hero.date') }}
            </div>

            <div class="text-xl sm:text-2xl text-gray-600 animate-slide-up" style="animation-delay: 0.3s">
              {{ t('hero.location') }}
            </div>

            <div class="text-2xl sm:text-3xl font-serif py-4 animate-slide-up" style="animation-delay: 0.4s">
              <TypingGreeting v-if="guestData" :guest-call="guestData.name" />
            </div>

            <p
              ref="invitationText"
              class="text-lg sm:text-xl text-gray-700 leading-relaxed font-serif italic animate-slide-up"
              style="animation-delay: 0.5s"
            >
              {{ currentMessage }}
            </p>

            <div class="py-6 animate-slide-up" style="animation-delay: 0.6s">
              <Countdown :wedding-date="weddingDate" />
            </div>

            <div class="flex flex-col items-center lg:items-start gap-4 animate-slide-up" style="animation-delay: 0.7s">
              <FloralButton
                v-if="rsvpState === 'initial'"
                @click="handleAccept"
              >
                {{ t('hero.primary_button') }}
              </FloralButton>

              <button
                v-if="rsvpState === 'accepted'"
                @click="openQuestionsModal"
                class="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {{ t('hero.secondary_button') }}
              </button>

              <button
                v-if="rsvpState === 'completed'"
                disabled
                class="px-8 py-4 bg-gray-400 text-white text-lg font-semibold rounded-2xl shadow-lg cursor-not-allowed opacity-70"
              >
                {{ t('hero.questions_answered') }}
              </button>
            </div>

            <div class="flex flex-col items-center lg:items-start gap-3 pt-4 animate-slide-up" style="animation-delay: 0.8s">
              <a
                href="#vietnam"
                class="relative group text-green-600 hover:text-green-700 font-semibold text-base sm:text-lg transition-colors"
              >
                {{ t('links.vietnam_info') }}
                <span class="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  {{ t('links.available_after') }}
                </span>
              </a>
              <a
                href="#tickets"
                class="relative group text-blue-600 hover:text-blue-700 font-semibold text-base sm:text-lg transition-colors"
              >
                {{ t('links.tickets_info') }}
                <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {{ t('links.link_soon') }}
                </span>
              </a>
            </div>
          </div>

          <div class="flex justify-center lg:justify-end animate-fade-in" style="animation-delay: 0.5s">
            <RotatingImages :images="portraits" />
          </div>
        </div>
      </div>
    </section>

    <DialogModal
      v-model="showQuestionsModal"
      :title="t('modal.title')"
      @close="closeQuestionsModal"
    >
      <form @submit.prevent="submitQuestions" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t('modal.ticket_date') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.ticket_purchase_date"
            type="date"
            required
            class="w-full px-4 py-3 bg-pink-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
          />
          <p v-if="errors.ticket_purchase_date" class="text-red-500 text-sm mt-1">
            {{ errors.ticket_purchase_date }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t('modal.has_plus_one') }} <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.has_plus_one"
            required
            class="w-full px-4 py-3 bg-pink-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
          >
            <option :value="null" disabled selected>{{ t('modal.yes') }} / {{ t('modal.no') }}</option>
            <option :value="true">{{ t('modal.yes') }}</option>
            <option :value="false">{{ t('modal.no') }}</option>
          </select>
          <p v-if="errors.has_plus_one" class="text-red-500 text-sm mt-1">
            {{ errors.has_plus_one }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t('modal.days_staying') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="formData.days_staying"
            type="number"
            min="1"
            required
            class="w-full px-4 py-3 bg-pink-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
          />
          <p v-if="errors.days_staying" class="text-red-500 text-sm mt-1">
            {{ errors.days_staying }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t('modal.additional_message') }}
          </label>
          <textarea
            v-model="formData.additional_message"
            rows="4"
            class="w-full px-4 py-3 bg-pink-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none"
          ></textarea>
        </div>

        <div class="flex gap-4 justify-end">
          <button
            type="button"
            @click="closeQuestionsModal"
            class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            {{ t('modal.cancel') }}
          </button>
          <button
            type="submit"
            class="px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {{ t('modal.save') }}
          </button>
        </div>
      </form>
    </DialogModal>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import FallingPetals from '../components/FallingPetals.vue'
import TypingGreeting from '../components/TypingGreeting.vue'
import Countdown from '../components/Countdown.vue'
import RotatingImages from '../components/RotatingImages.vue'
import FloralButton from '../components/FloralButton.vue'
import DialogModal from '../components/ui/DialogModal.vue'
import { api } from '../services/api'
import { useFireworks } from '../composables/useFireworks'

const route = useRoute()
const { t, locale } = useI18n()
const { triggerFireworks } = useFireworks()

const guestData = ref(null)
const rsvpState = ref('initial')
const showQuestionsModal = ref(false)
const invitationText = ref(null)
const currentMessage = ref('')
const parallaxBg = ref(null)
const scrollY = ref(0)

const formData = ref({
  ticket_purchase_date: null,
  has_plus_one: null,
  days_staying: 1,
  additional_message: ''
})

const errors = ref({})

const weddingDate = computed(() => new Date('2026-04-05'))

const portraits = computed(() => [
  'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpg?auto=compress&cs=tinysrgb&w=800'
])

const parallaxStyle = computed(() => ({
  transform: `translateY(${scrollY.value * 0.3}px)`
}))

const loadGuestData = async () => {
  try {
    const invitationCode = route.params.code
    const guest = await api.getGuest(invitationCode)

    guestData.value = guest

    if (guest.language) {
      locale.value = guest.language
    }

    if (guest.rsvp && guest.rsvp.length > 0) {
      rsvpState.value = 'completed'
      currentMessage.value = t('hero.after_questions')
    } else if (guest.attending === true) {
      rsvpState.value = 'accepted'
      currentMessage.value = t('hero.after_accept')
    } else {
      currentMessage.value = t('hero.invitation')
    }

    if (guestData.value?.id) {
      await api.trackInteraction(guestData.value.id, 'page_view', {
        page: 'invitation'
      })
    }
  } catch (error) {
    console.error('Failed to load guest data:', error)
  }
}

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const handleAccept = async () => {
  try {
    triggerFireworks()

    const invitationCode = route.params.code
    await api.updateAttending(invitationCode, true)

    animateTextChange(t('hero.after_accept'))
    rsvpState.value = 'accepted'

    if (guestData.value?.id) {
      await api.trackInteraction(guestData.value.id, 'button_click', {
        button: 'accept'
      })
    }
  } catch (error) {
    console.error('Failed to update RSVP:', error)
  }
}

const openQuestionsModal = () => {
  showQuestionsModal.value = true

  if (guestData.value?.id) {
    api.trackInteraction(guestData.value.id, 'modal_open', {
      modal: 'questions'
    })
  }
}

const closeQuestionsModal = () => {
  showQuestionsModal.value = false
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}

  if (!formData.value.ticket_purchase_date) {
    errors.value.ticket_purchase_date = t('modal.errors.required')
  }

  if (formData.value.has_plus_one === null) {
    errors.value.has_plus_one = t('modal.errors.required')
  }

  if (!formData.value.days_staying || formData.value.days_staying < 1) {
    errors.value.days_staying = t('modal.errors.positive')
  }

  return Object.keys(errors.value).length === 0
}

const submitQuestions = async () => {
  if (!validateForm()) {
    return
  }

  try {
    const invitationCode = route.params.code
    await api.submitResponse(invitationCode, formData.value)

    showQuestionsModal.value = false
    animateTextChange(t('hero.after_questions'))
    rsvpState.value = 'completed'

    if (guestData.value?.id) {
      await api.trackInteraction(guestData.value.id, 'form_submit', {
        form: 'questions',
        success: true
      })
    }
  } catch (error) {
    console.error('Failed to submit questions:', error)

    if (guestData.value?.id) {
      await api.trackInteraction(guestData.value.id, 'form_submit', {
        form: 'questions',
        success: false,
        error: error.message
      })
    }
  }
}

const animateTextChange = (newText) => {
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

onMounted(async () => {
  await loadGuestData()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
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
  animation: fade-in 1.2s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
  opacity: 0;
}
</style>
