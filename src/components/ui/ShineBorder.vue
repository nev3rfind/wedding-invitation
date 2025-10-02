<template>
  <div
    :style="{
      '--border-radius': `${borderRadius}px`,
    }"
    :class="cn(
      'relative grid h-full w-full place-items-center rounded-3xl bg-white p-3 text-black dark:bg-black dark:text-white',
      customClass
    )"
  >
    <div
      :style="{
        '--border-width': `${borderWidth}px`,
        '--border-radius': `${borderRadius}px`,
        '--shine-pulse-duration': `${duration}s`,
        '--mask-linear-gradient': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        '--background-radial-gradient': `radial-gradient(transparent,transparent, ${colorString},transparent,transparent)`,
      }"
      class="before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-3xl before:p-[--border-width] before:will-change-[background-position] before:content-[''] before:![-webkit-mask-composite:xor] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:![mask-composite:exclude] before:[mask:--mask-linear-gradient] motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]"
    ></div>
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cn } from '../../lib/utils'

const props = defineProps({
  borderRadius: {
    type: Number,
    default: 8
  },
  borderWidth: {
    type: Number,
    default: 1
  },
  duration: {
    type: Number,
    default: 14
  },
  color: {
    type: [String, Array],
    default: '#000000'
  },
  customClass: {
    type: String,
    default: ''
  }
})

const colorString = computed(() => {
  if (Array.isArray(props.color)) {
    return props.color.join(',')
  }
  return props.color
})
</script>

<style scoped>
@keyframes shine-pulse {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style>
