<template>
  <div class="relative w-full h-[400px] sm:h-[500px] overflow-hidden rounded-3xl shadow-2xl">
    <transition-group name="fade-slide" tag="div" class="relative w-full h-full">
      <img
        v-for="(image, index) in images"
        :key="image"
        v-show="index === currentIndex"
        :src="image"
        :alt="`Wedding photo ${index + 1}`"
        class="absolute inset-0 w-full h-full object-cover"
      />
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  },
  interval: {
    type: Number,
    default: 4000
  }
})

const currentIndex = ref(0)
let intervalId = null

const nextImage = () => {
  if (props.images.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length
  }
}

onMounted(() => {
  if (props.images.length > 1) {
    intervalId = setInterval(nextImage, props.interval)
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 1.5s ease;
}

.fade-slide-leave-active {
  transition: all 1.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(1.1);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
