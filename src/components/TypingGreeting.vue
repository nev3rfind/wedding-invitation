<template>
  <div
    class="typing-greeting mb-4 sm:mb-6"
    role="status"
    :aria-live="prefersReducedMotion ? 'off' : 'polite'"
  >
    <span ref="greetingText" class="text-2xl sm:text-3xl font-serif text-ivory-crepe">
      {{ staticGreeting }}
    </span>
    <span
      v-if="showCursor && !prefersReducedMotion"
      class="cursor-blink text-spring-poppy text-2xl sm:text-3xl ml-1"
      aria-hidden="true"
    >|</span>
    <span
      v-if="showGuestName"
      ref="guestNameText"
      class="text-2xl sm:text-3xl font-serif text-ivory-crepe ml-2"
    >
      {{ guestCall }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

const props = defineProps({
  guestCall: {
    type: String,
    required: true
  }
})

const greetingText = ref(null)
const guestNameText = ref(null)
const showCursor = ref(true)
const showGuestName = ref(false)
const staticGreeting = ref('')

const prefersReducedMotion = computed(() => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

let timeline = null

const revealGuestName = () => {
  showGuestName.value = true
  if (guestNameText.value && !prefersReducedMotion.value) {
    gsap.fromTo(
      guestNameText.value,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
  }
}

onMounted(() => {
  if (prefersReducedMotion.value) {
    staticGreeting.value = 'Hello'
    showGuestName.value = true
    return
  }

  gsap.registerPlugin(TextPlugin)

  timeline = gsap.timeline({
    onComplete: () => {
      showCursor.value = false
    }
  })

  timeline
    .to(greetingText.value, {
      duration: 0.8,
      text: 'Hello',
      ease: 'none',
    })
    .to(greetingText.value, {
      duration: 0.6,
      text: '',
      ease: 'none',
      delay: 0.8
    })
    .to(greetingText.value, {
      duration: 0.8,
      text: 'Xin Chào',
      ease: 'none',
    })
    .to(greetingText.value, {
      duration: 0.6,
      text: '',
      ease: 'none',
      delay: 0.8
    })
    .to(greetingText.value, {
      duration: 0.6,
      text: 'Labas',
      ease: 'none',
    })
    .to({}, { duration: 0.5 })
    .call(revealGuestName)
})

onUnmounted(() => {
  if (timeline) {
    timeline.kill()
  }
})
</script>

<style scoped>
.typing-greeting {
  min-height: 2.5rem;
}
</style>
