<template>
  <span
    :class="cn('relative inline-block pb-1 px-1 rounded-lg bg-gradient-to-r from-spring-poppy/30 to-gold-accent/30', className)"
    :style="{
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left center',
      display: 'inline',
      ...animationStyle,
    }"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { cn } from '@/lib/utils'

interface HighlightProps {
  className?: string
  duration?: number
  delay?: number
}

const props = withDefaults(defineProps<HighlightProps>(), {
  duration: 2000,
  delay: 500,
})

const backgroundSize = ref('0% 100%')

const animationStyle = computed(() => ({
  backgroundSize: backgroundSize.value,
  transition: `background-size ${props.duration}ms linear ${props.delay}ms`,
}))

onMounted(() => {
  setTimeout(() => {
    backgroundSize.value = '100% 100%'
  }, 50)
})
</script>
