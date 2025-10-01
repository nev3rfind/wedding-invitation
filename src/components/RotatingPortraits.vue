<template>
  <div
    class="portrait-container relative w-full aspect-[3/4] overflow-hidden rounded-xl-soft"
    @mouseenter="pauseRotation"
    @mouseleave="resumeRotation"
    @focusin="pauseRotation"
    @focusout="resumeRotation"
    tabindex="0"
    role="img"
    :aria-label="`Wedding portrait ${currentIndex + 1} of ${portraits.length}`"
  >
    <img
      ref="portraitImage"
      :src="currentPortrait"
      :alt="`Wedding portrait ${currentIndex + 1}`"
      class="absolute inset-0 w-full h-full object-cover object-center"
      loading="eager"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { gsap } from 'gsap'
import { tracker } from '../services/tracker'

const props = defineProps({
  portraits: {
    type: Array,
    required: true,
    default: () => []
  }
})

const portraitImage = ref(null)
const currentIndex = ref(0)
const isPaused = ref(false)
let rotationInterval = null

const currentPortrait = computed(() => {
  if (props.portraits.length === 0) return ''
  return props.portraits[currentIndex.value]
})

const prefersReducedMotion = computed(() => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const rotateToNext = () => {
  if (isPaused.value || props.portraits.length <= 1) return

  const nextIndex = (currentIndex.value + 1) % props.portraits.length

  if (!prefersReducedMotion.value && portraitImage.value) {
    gsap.timeline()
      .to(portraitImage.value, {
        opacity: 0,
        scale: 1.05,
        duration: 0.45,
        ease: 'power2.in'
      })
      .call(() => {
        currentIndex.value = nextIndex
        tracker.trackImageChange(nextIndex)
      })
      .fromTo(portraitImage.value,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out'
        }
      )
  } else {
    currentIndex.value = nextIndex
    tracker.trackImageChange(nextIndex)
  }
}

const pauseRotation = () => {
  isPaused.value = true
}

const resumeRotation = () => {
  isPaused.value = false
}

const preloadImages = () => {
  props.portraits.forEach(src => {
    const img = new Image()
    img.src = src
  })
}

onMounted(() => {
  preloadImages()

  rotationInterval = setInterval(() => {
    rotateToNext()
  }, 5000)
})

onUnmounted(() => {
  if (rotationInterval) {
    clearInterval(rotationInterval)
  }
})
</script>

<style scoped>
.portrait-container:focus {
  outline: 2px solid #B0D5C0;
  outline-offset: 4px;
}
</style>
