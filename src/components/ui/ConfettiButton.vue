<template>
  <Button
    @click="handleClick"
    :variant="variant"
    :size="size"
    v-bind="$attrs"
  >
    <slot />
  </Button>
</template>

<script setup>
import confetti from 'canvas-confetti'
import Button from './Button.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'default'
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const handleClick = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  confetti({
    ...props.options,
    origin: {
      x: x / window.innerWidth,
      y: y / window.innerHeight,
    },
  })
}
</script>
