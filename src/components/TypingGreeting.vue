<template>
  <div class="typing-greeting-container text-center py-8">
    <div class="typing-wrapper mb-4">
      <Typewriter
        :text="['HELLO', 'XIN CHÀO', 'LABAS']"
        :speed="100"
        :wait-time="2000"
        :delete-speed="50"
        :loop="true"
        class-name="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-wedding-red via-spring-poppy to-gold-accent"
        cursor-char="_"
        cursor-class-name="text-gold-accent"
        @cycle-complete="handleCycleComplete"
      />
    </div>

    <transition name="fade-slide">
      <div v-if="showGuestName" class="guest-name-wrapper">
        <span class="text-3xl md:text-4xl font-serif text-gray-700">
          {{ guestCall }}
        </span>
      </div>
    </transition>

    <div class="welcome-text mt-6">
      <p class="text-xl md:text-2xl text-gray-600 font-light">
        Welcome to my world ✈️
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Typewriter } from '@/components/ui'

interface TypingGreetingProps {
  guestCall: string
}

const props = defineProps<TypingGreetingProps>()

const showGuestName = ref(false)
const cycleCount = ref(0)

const handleCycleComplete = (index: number) => {
  cycleCount.value++
  if (cycleCount.value === 1 && !showGuestName.value) {
    setTimeout(() => {
      showGuestName.value = true
    }, 500)
  }
}

onMounted(() => {
  setTimeout(() => {
    showGuestName.value = true
  }, 8000)
})
</script>

<style scoped>
.typing-greeting-container {
  min-height: 200px;
}

.typing-wrapper {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guest-name-wrapper {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 5px rgba(252, 178, 169, 0.5));
  }
  to {
    filter: drop-shadow(0 0 15px rgba(252, 178, 169, 0.8));
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.6s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (prefers-reduced-motion: reduce) {
  .guest-name-wrapper {
    animation: none;
    filter: none;
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: none;
  }
}
</style>
