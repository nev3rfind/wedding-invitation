<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click.self="onCancel"
      @keydown.esc="onCancel"
    >
      <div
        ref="modalContent"
        class="modal-content bg-ivory-crepe rounded-xl-soft shadow-2xl max-w-lg w-full p-6 sm:p-8 relative"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="modalTitleId"
      >
        <h2 :id="modalTitleId" class="text-2xl sm:text-3xl font-serif text-spring-poppy mb-6">
          {{ t('modal.title') }}
        </h2>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label
              for="days_in_vietnam"
              class="block text-sm font-medium text-nimble mb-1"
            >
              {{ t('modal.days_in_vietnam') }}
            </label>
            <input
              id="days_in_vietnam"
              v-model.number="formData.days_in_vietnam"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-nimble rounded-lg focus:ring-2 focus:ring-english-pear focus:border-transparent"
              :class="{ 'border-spring-poppy': errors.days_in_vietnam }"
              ref="firstInput"
            />
            <p v-if="errors.days_in_vietnam" class="text-spring-poppy text-sm mt-1">
              {{ errors.days_in_vietnam }}
            </p>
          </div>

          <div>
            <label
              for="flight_ticket_date"
              class="block text-sm font-medium text-nimble mb-1"
            >
              {{ t('modal.flight_ticket_date') }}
            </label>
            <input
              id="flight_ticket_date"
              v-model="formData.flight_ticket_date"
              type="date"
              class="w-full px-4 py-2 border border-nimble rounded-lg focus:ring-2 focus:ring-english-pear focus:border-transparent"
              :class="{ 'border-spring-poppy': errors.flight_ticket_date }"
            />
            <p v-if="errors.flight_ticket_date" class="text-spring-poppy text-sm mt-1">
              {{ errors.flight_ticket_date }}
            </p>
          </div>

          <div>
            <label
              for="days_before_wedding"
              class="block text-sm font-medium text-nimble mb-1"
            >
              {{ t('modal.days_before_wedding') }}
            </label>
            <input
              id="days_before_wedding"
              v-model.number="formData.days_before_wedding"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-nimble rounded-lg focus:ring-2 focus:ring-english-pear focus:border-transparent"
              :class="{ 'border-spring-poppy': errors.days_before_wedding }"
            />
            <p v-if="errors.days_before_wedding" class="text-spring-poppy text-sm mt-1">
              {{ errors.days_before_wedding }}
            </p>
          </div>

          <div>
            <label
              for="coming_with"
              class="block text-sm font-medium text-nimble mb-1"
            >
              {{ t('modal.coming_with') }}
            </label>
            <input
              id="coming_with"
              v-model="formData.coming_with"
              type="text"
              class="w-full px-4 py-2 border border-nimble rounded-lg focus:ring-2 focus:ring-english-pear focus:border-transparent"
              :class="{ 'border-spring-poppy': errors.coming_with }"
            />
            <p v-if="errors.coming_with" class="text-spring-poppy text-sm mt-1">
              {{ errors.coming_with }}
            </p>
          </div>

          <div v-if="submitError" class="text-spring-poppy text-sm">
            {{ submitError }}
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-spring-poppy text-ivory-crepe rounded-full font-semibold transition-all hover:scale-105 focus:scale-105 disabled:opacity-50"
            >
              {{ isSubmitting ? '...' : t('modal.submit') }}
            </button>
            <button
              type="button"
              @click="onCancel"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-nimble text-ivory-crepe rounded-full font-semibold transition-all hover:scale-105 focus:scale-105 disabled:opacity-50"
            >
              {{ t('modal.cancel') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import dayjs from 'dayjs'
import { tracker } from '../services/tracker'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const { t } = useI18n()

const modalTitleId = 'modal-title-' + Math.random().toString(36).substr(2, 9)
const modalContent = ref(null)
const firstInput = ref(null)
const isSubmitting = ref(false)
const submitError = ref('')

const formData = ref({
  days_in_vietnam: null,
  flight_ticket_date: '',
  days_before_wedding: null,
  coming_with: ''
})

const errors = ref({
  days_in_vietnam: '',
  flight_ticket_date: '',
  days_before_wedding: '',
  coming_with: ''
})

let previouslyFocusedElement = null

const validate = () => {
  errors.value = {
    days_in_vietnam: '',
    flight_ticket_date: '',
    days_before_wedding: '',
    coming_with: ''
  }

  let isValid = true

  if (!formData.value.days_in_vietnam || formData.value.days_in_vietnam < 0) {
    errors.value.days_in_vietnam = t('modal.errors.positive')
    isValid = false
  }

  if (!formData.value.flight_ticket_date) {
    errors.value.flight_ticket_date = t('modal.errors.required')
    isValid = false
  } else if (dayjs(formData.value.flight_ticket_date).isBefore(dayjs(), 'day')) {
    errors.value.flight_ticket_date = t('modal.errors.future_date')
    isValid = false
  }

  if (!formData.value.days_before_wedding || formData.value.days_before_wedding < 0) {
    errors.value.days_before_wedding = t('modal.errors.positive')
    isValid = false
  }

  return isValid
}

const onSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  submitError.value = ''

  try {
    await emit('submit', formData.value)
  } catch (error) {
    submitError.value = error.message || 'An error occurred'
    isSubmitting.value = false
  }
}

const onCancel = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

const setupFocusTrap = () => {
  if (!modalContent.value) return

  const focusableElements = modalContent.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  modalContent.value.addEventListener('keydown', handleTabKey)

  return () => {
    modalContent.value?.removeEventListener('keydown', handleTabKey)
  }
}

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    previouslyFocusedElement = document.activeElement
    tracker.trackModalOpen('questions-modal')

    await nextTick()

    if (modalContent.value) {
      gsap.fromTo(modalContent.value,
        { opacity: 0, y: -50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      )
    }

    setupFocusTrap()

    await nextTick()
    firstInput.value?.focus()
  } else {
    if (modalContent.value) {
      gsap.to(modalContent.value, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in'
      })
    }

    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus()
    }
  }
})
</script>

<style scoped>
.modal-overlay {
  backdrop-filter: blur(4px);
}
</style>
