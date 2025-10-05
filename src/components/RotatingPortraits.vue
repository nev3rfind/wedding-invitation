<template>
  <div
    class="portraits-container relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl shadow-2xl"
    @mouseenter="pauseRotation"
    @mouseleave="resumeRotation"
    @focus="pauseRotation"
    @blur="resumeRotation"
    tabindex="0"
    role="img"
    :aria-label="`Wedding portrait ${currentIndex + 1} of ${portraits.length}`"
  >
    <div
      v-for="(portrait, index) in portraits"
      :key="index"
      class="portrait-slide absolute inset-0 transition-opacity duration-1500"
      :class="{ 'opacity-100 z-10': index === currentIndex, 'opacity-0 z-0': index !== currentIndex }"
    >
      <img
        :src="portrait"
        :alt="`Wedding portrait ${index + 1}`"
        class="w-full h-full object-cover object-center-top"
        loading="lazy"
      />
    </div>

    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
      <button
        v-for="(_, index) in portraits"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'w-2 h-2 rounded-full transition-all duration-300',
          index === currentIndex
            ? 'bg-spring-poppy w-6'
            : 'bg-white/50 hover:bg-white/75'
        ]"
        :aria-label="`Go to portrait ${index + 1}`"
        :aria-current="index === currentIndex"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { tracker } from '@/services/tracker'

interface RotatingPortraitsProps {
  portraits: string[]
  interval?: number
}

const props = withDefaults(defineProps<RotatingPortraitsProps>(), {
  interval: 5000,
})

const currentIndex = ref(0)
const isPaused = ref(false)
let intervalId: number | null = null

const nextSlide = () => {
  if (isPaused.value) return

  currentIndex.value = (currentIndex.value + 1) % props.portraits.length
  tracker.trackHeroImageChange(currentIndex.value)
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  tracker.trackHeroImageChange(index)
  resetInterval()
}

const pauseRotation = () => {
  isPaused.value = true
}

const resumeRotation = () => {
  isPaused.value = false
}

const resetInterval = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
  startRotation()
}

const startRotation = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion || props.portraits.length <= 1) return

  intervalId = window.setInterval(nextSlide, props.interval)
}

onMounted(() => {
  startRotation()
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.portraits-container {
  aspect-ratio: 3 / 4;
  max-width: 500px;
}

.portrait-slide {
  transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.object-center-top {
  object-position: center top;
}

.portraits-container:focus {
  outline: 2px solid theme('colors.spring-poppy');
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .portrait-slide {
    transition: none;
  }
}
</style>
