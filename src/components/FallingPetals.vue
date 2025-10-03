<template>
  <div class="falling-petals-container fixed inset-0 pointer-events-none z-10 overflow-hidden">
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="petal absolute"
      :style="{
        left: `${petal.left}%`,
        animationDelay: `${petal.delay}s`,
        animationDuration: `${petal.duration}s`,
        opacity: petal.opacity
      }"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" :fill="petal.color">
        <path d="M10 0C8 0 6 2 6 4C6 2 4 0 2 0C4 2 4 4 4 6C2 6 0 8 0 10C2 10 4 10 6 10C6 12 4 14 2 14C4 14 6 16 6 18C6 16 8 14 10 14C10 16 12 18 14 18C14 16 16 14 18 14C16 14 14 12 14 10C16 10 18 10 20 10C18 8 16 6 14 6C14 4 16 2 18 2C16 2 14 0 14 0C12 2 10 2 10 0Z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const petals = ref([])
const colors = ['#FCB2A9', '#FF6B6B', '#FFC1C1', '#FFB6C1', '#FF69B4']

const createPetals = () => {
  const petalCount = 20
  for (let i = 0; i < petalCount; i++) {
    petals.value.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      opacity: 0.3 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)]
    })
  }
}

onMounted(() => {
  createPetals()
})
</script>

<style scoped>
.petal {
  animation: fall linear infinite;
  will-change: transform;
}

@keyframes fall {
  0% {
    transform: translateY(-10vh) rotate(0deg);
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
  }
}
</style>
