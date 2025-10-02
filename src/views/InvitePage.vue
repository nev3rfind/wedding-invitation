<template>
  <main class="overflow-hidden bg-background">
    <section id="home" class="relative">
      <div class="absolute inset-0 max-md:hidden top-[400px] -z-10 h-[400px] w-full bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#a8a29e_1px,transparent_1px),linear-gradient(to_bottom,#a8a29e_1px,transparent_1px)]"></div>

      <div class="flex flex-col items-center justify-center px-6 text-center">
        <div class="mb-6 mt-10 sm:justify-center md:mb-4 md:mt-40">
          <div v-if="guestData" class="relative flex items-center rounded-full border bg-popover px-3 py-1 text-xs text-primary/60">
            <TypingGreeting :guest-call="guestData.guest_call" />
          </div>
        </div>

        <div class="mx-auto max-w-5xl">
          <div class="border-text-red-500 relative mx-auto h-full bg-background border py-12 p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)]">
            <h1 class="flex flex-col text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
              <Plus
                :stroke-width="4"
                class="text-red-500 absolute -left-5 -top-5 h-10 w-10"
              />
              <Plus
                :stroke-width="4"
                class="text-red-500 absolute -bottom-5 -left-5 h-10 w-10"
              />
              <Plus
                :stroke-width="4"
                class="text-red-500 absolute -right-5 -top-5 h-10 w-10"
              />
              <Plus
                :stroke-width="4"
                class="text-red-500 absolute -bottom-5 -right-5 h-10 w-10"
              />
              <span>
                {{ t('hero.title') }} <span class="text-red-500">{{ t('hero.date') }}</span>
              </span>
            </h1>
            <div class="flex items-center mt-4 justify-center gap-1">
              <span class="relative flex h-3 w-3 items-center justify-center">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <p class="text-xs text-green-500">{{ t('hero.location') }}</p>
            </div>
          </div>

          <h2 ref="invitationText" class="mt-8 text-2xl md:text-2xl">
            {{ currentInvitationText }}
          </h2>

          <Countdown v-if="weddingDate" :wedding-date="weddingDate" />

          <div class="flex flex-col md:flex-row items-center justify-center gap-2 mt-6">
            <ShineBorder
              v-if="rsvpState === 'initial'"
              :border-width="3"
              custom-class="border cursor-pointer h-auto w-auto p-2 bg-white/5 backdrop-blur-md dark:bg-black/5"
              :color="['#FF007F', '#39FF14', '#00FFFF']"
            >
              <ConfettiButton
                class="w-full rounded-xl"
                @click="onAccept"
              >
                {{ t('rsvp.accept') || "I'll come" }}
              </ConfettiButton>
            </ShineBorder>

            <Button
              v-if="rsvpState === 'initial'"
              class="rounded-xl"
              variant="outline"
              @click="onReject"
            >
              {{ t('rsvp.reject') || "Can't make it" }}
            </Button>

            <ShineBorder
              v-if="rsvpState === 'morphed'"
              :border-width="3"
              custom-class="border cursor-pointer h-auto w-auto p-2 bg-white/5 backdrop-blur-md dark:bg-black/5"
              :color="['#FF007F', '#39FF14', '#00FFFF']"
            >
              <Button
                class="w-full rounded-xl"
                @click="onOpenModal"
              >
                {{ t('rsvp.satisfy_curiosity') || "Satisfy my curiosity" }}
              </Button>
            </ShineBorder>

            <Button
              v-if="rsvpState === 'answered'"
              class="rounded-xl"
              @click="onRevealAddress"
            >
              {{ t('rsvp.reveal_address') || "Show venue address" }}
            </Button>
          </div>

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
      </div>

      <AnimatedCanvas canvas-id="canvas" />
    </section>

    <div class="absolute inset-0 max-md:hidden -z-20">
      <RotatingPortraits
        v-if="portraits.length > 0"
        :portraits="portraits"
        class="absolute right-0 top-20 w-full md:w-1/3 lg:w-1/4"
      />
    </div>

    <QuestionsModal
      :is-open="showModal"
      @close="onCloseModal"
      @submit="onSubmitForm"
    />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { Plus } from 'lucide-vue-next'
import TypingGreeting from '../components/TypingGreeting.vue'
import RotatingPortraits from '../components/RotatingPortraits.vue'
import Countdown from '../components/Countdown.vue'
import QuestionsModal from '../components/QuestionsModal.vue'
import FooterLinks from '../components/FooterLinks.vue'
import AddressReveal from '../components/AddressReveal.vue'
import Button from '../components/ui/Button.vue'
import ShineBorder from '../components/ui/ShineBorder.vue'
import ConfettiButton from '../components/ui/ConfettiButton.vue'
import AnimatedCanvas from '../components/ui/AnimatedCanvas.vue'
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
    await new Promise(resolve => setTimeout(resolve, 300))

    if (invitationText.value) {
      gsap.to(invitationText.value, {
        duration: 0.8,
        text: t('hero.after_accept'),
        ease: 'none'
      })
    }
    currentInvitationText.value = t('hero.after_accept')
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
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
