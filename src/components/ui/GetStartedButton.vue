<template>
  <Button
    class="group relative overflow-hidden"
    size="lg"
    :variant="variant"
    v-bind="$attrs"
  >
    <span class="mr-8 transition-opacity duration-500 group-hover:opacity-0">
      <slot>Get Started</slot>
    </span>
    <i class="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
      <ChevronRight :size="16" :stroke-width="2" aria-hidden="true" />
    </i>
  </Button>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next'
import Button from './Button.vue'

defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})
</script>
