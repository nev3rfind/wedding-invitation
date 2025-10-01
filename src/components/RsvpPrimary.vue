<template>
  <div class="rsvp-buttons-container flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
    <button
      v-if="currentState === 'initial' || currentState === 'morphed'"
      id="rsvp-action-btn"
      ref="primaryButton"
      @click="onPrimaryClick"
      :disabled="currentState === 'answered'"
      class="px-8 py-4 rounded-full text-lg sm:text-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
      :class="primaryButtonClasses"
    >
      {{ computedLabel }}
    </button>

    <button
      v-if="currentState === 'initial' && showSecondary"
      @click="onRejectClick"
      class="px-8 py-4 bg-nimble text-ivory-crepe rounded-full text-lg sm:text-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 min-w-[200px]"
    >
      {{ t('hero.secondary_button') }}
    </button>

    <button
      v-if="currentState === 'answered'"
      @click="onRevealAddress"
      class="px-6 py-3 bg-gold-accent text-ivory-crepe rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105"
    >
      {{ t('hero.reveal_address') }}
    </button>

    <div
      v-if="showRejectMessage"
      class="text-spring-poppy text-center text-lg sm:text-xl font-serif max-w-md"
    >
      {{ t('hero.reject_message') }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

const props = defineProps({
  currentState: {
    type: String,
    default: 'initial'
  }
})

const emit = defineEmits(['accept', 'reject', 'openModal', 'revealAddress'])

const { t } = useI18n()

const primaryButton = ref(null)
const showSecondary = ref(true)
const showRejectMessage = ref(false)

const computedLabel = computed(() => {
  switch (props.currentState) {
    case 'initial':
      return t('hero.primary_button')
    case 'morphed':
      return t('hero.morphed_button')
    case 'answered':
      return t('hero.questions_answered')
    default:
      return t('hero.primary_button')
  }
})

const primaryButtonClasses = computed(() => {
  switch (props.currentState) {
    case 'initial':
      return 'bg-spring-poppy text-ivory-crepe'
    case 'morphed':
      return 'bg-english-pear text-ivory-crepe'
    case 'answered':
      return 'bg-nimble text-ivory-crepe'
    default:
      return 'bg-spring-poppy text-ivory-crepe'
  }
})

const onPrimaryClick = () => {
  if (props.currentState === 'initial') {
    emit('accept')
  } else if (props.currentState === 'morphed') {
    emit('openModal')
  }
}

const onRejectClick = () => {
  animateReject()
  emit('reject')
}

const animateReject = () => {
  showSecondary.value = false
  showRejectMessage.value = true

  if (primaryButton.value) {
    gsap.to(primaryButton.value, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      onComplete: () => {
        primaryButton.value.style.display = 'none'
      }
    })
  }

  const message = document.querySelector('.text-spring-poppy')
  if (message) {
    gsap.fromTo(message,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
  }
}

const onRevealAddress = () => {
  emit('revealAddress')
}
</script>
