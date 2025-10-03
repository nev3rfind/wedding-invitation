<template>
  <div
    :class="cn('relative flex items-center justify-center w-full group', containerClassName)"
    @mousemove="handleMouseMove"
  >
    <div class="absolute inset-0 pointer-events-none opacity-70" :style="dotPatternLight" />
    <div class="absolute inset-0 dark:opacity-70 opacity-0 pointer-events-none" :style="dotPatternDark" />

    <div
      class="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
      :style="{
        ...dotPatternHighlight,
        WebkitMaskImage: `radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
        maskImage: `radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
      }"
    />

    <div :class="cn('relative z-20', className)">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '@/lib/utils'

interface HeroHighlightProps {
  className?: string
  containerClassName?: string
}

defineProps<HeroHighlightProps>()

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (event: MouseEvent) => {
  const currentTarget = event.currentTarget as HTMLElement
  if (!currentTarget) return

  const { left, top } = currentTarget.getBoundingClientRect()
  mouseX.value = event.clientX - left
  mouseY.value = event.clientY - top
}

const dotPattern = (color: string) => ({
  backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
  backgroundSize: '16px 16px',
})

const dotPatternLight = computed(() => dotPattern('rgb(212 212 212)'))
const dotPatternDark = computed(() => dotPattern('rgb(38 38 38)'))
const dotPatternHighlight = computed(() => dotPattern('rgb(252 178 169)'))
</script>

<style scoped>
.group:hover .pointer-events-none {
  pointer-events: none;
}
</style>
