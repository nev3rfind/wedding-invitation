<template>
  <div class="rsvp-container flex flex-col items-center gap-4">
    <button
      v-if="currentState === 'initial'"
      id="rsvp-action-btn"
      @click="handleAccept"
      class="btn-primary px-8 py-4 text-lg md:text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-spring-poppy/50 bg-white text-green-600 border-4 border-green-500 hover:border-green-600 hover:shadow-xl relative overflow-hidden"
    >
      <span class="floral-corner top-left">🌹</span>
      <span class="floral-corner top-right">🌿</span>
      <span class="floral-corner bottom-left">🌿</span>
      <span class="floral-corner bottom-right">🌹</span>
      <span class="relative z-10">{{ t('buttons.illCome') }}</span>
    </button>

    <button
      v-if="currentState === 'accepted'"
      id="rsvp-action-btn"
      @click="handleOpenModal"
      class="btn-primary px-8 py-4 text-lg md:text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-english-pear/50 bg-gradient-to-r from-english-pear to-emerald-400 text-white hover:from-english-pear/90 hover:to-emerald-500 hover:shadow-xl"
    >
      {{ t('buttons.questions') }}
    </button>

    <button
      v-if="currentState === 'completed'"
      id="rsvp-action-btn"
      disabled
      class="btn-primary px-8 py-4 text-lg md:text-xl font-semibold rounded-2xl shadow-lg bg-nimble text-white cursor-not-allowed opacity-70"
    >
      {{ t('buttons.questionsAnswered') }}
    </button>

    <button
      v-if="currentState === 'initial'"
      @click="handleReject"
      class="btn-secondary px-8 py-4 text-base md:text-lg font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-nimble/50 bg-nimble/20 text-gray-700 hover:bg-nimble/30"
    >
      {{ t('buttons.unfortunately') }}
    </button>

    <transition name="fade-slide">
      <div
        v-if="showRejectMessage"
        class="reject-message text-center max-w-md px-6 py-4 bg-rose-50 border-2 border-rose-200 rounded-xl"
      >
        <p class="text-lg text-rose-700 font-serif">
          {{ t('hero.rejectMessage') }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

type RsvpState = 'initial' | 'accepted' | 'completed' | 'rejected'

interface RsvpPrimaryProps {
  initialState?: RsvpState
}

const props = withDefaults(defineProps<RsvpPrimaryProps>(), {
  initialState: 'initial',
})

const emit = defineEmits<{
  accept: []
  reject: []
  openModal: []
}>()

const { t } = useI18n()
const currentState = ref<RsvpState>(props.initialState)
const showRejectMessage = ref(false)

const handleAccept = () => {
  currentState.value = 'accepted'
  emit('accept')
}

const handleReject = () => {
  currentState.value = 'rejected'
  showRejectMessage.value = true
  emit('reject')
}

const handleOpenModal = () => {
  emit('openModal')
}

const setCompleted = () => {
  currentState.value = 'completed'
}

defineExpose({
  setCompleted,
  currentState,
})
</script>

<style scoped>
.rsvp-container {
  min-height: 120px;
}

.btn-primary,
.btn-secondary {
  min-width: 250px;
  position: relative;
}

.floral-corner {
  position: absolute;
  font-size: 1.5rem;
  pointer-events: none;
  animation: float 3s ease-in-out infinite;
}

.top-left {
  top: -8px;
  left: -8px;
}

.top-right {
  top: -8px;
  right: -8px;
}

.bottom-left {
  bottom: -8px;
  left: -8px;
}

.bottom-right {
  bottom: -8px;
  right: -8px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
}

.btn-primary:hover .floral-corner {
  animation: float 1.5s ease-in-out infinite;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.reject-message {
  animation: gentle-pulse 2s ease-in-out infinite;
}

@keyframes gentle-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
