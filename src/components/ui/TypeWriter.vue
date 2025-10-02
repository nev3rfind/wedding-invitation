<template>
  <VueTyped
    :strings="strings"
    :loop="true"
    :type-speed="80"
    :back-speed="20"
    :smart-backspace="true"
    :back-delay="1000"
    :show-cursor="true"
    cursor-char="|"
  />
</template>

<script setup>
import { VueTyped } from 'vue-typed-js'

defineProps({
  strings: {
    type: Array,
    required: true,
    default: () => []
  }
})
</script>
