<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        @click.self="handleClose"
      >
        <Transition name="modal-scale">
          <div
            v-if="isOpen"
            class="bg-gradient-to-br from-ivory-crepe to-pink-50 rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              @click="handleClose"
              class="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-3xl focus:outline-none focus:ring-2 focus:ring-spring-poppy rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 class="text-3xl md:text-4xl font-serif font-bold mb-6 text-gray-800">
              {{ t('modal.title') }}
            </h2>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t('modal.ticketDate') }} <span class="text-wedding-red">*</span>
                </label>
                <input
                  v-model="formData.ticketDate"
                  type="date"
                  required
                  class="w-full px-4 py-3 bg-pink-50/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-spring-poppy focus:border-transparent transition-all duration-200 text-gray-700 font-medium hover:bg-pink-50"
                />
                <p v-if="errors.ticketDate" class="text-wedding-red text-sm mt-1">
                  {{ errors.ticketDate }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t('modal.plusOne') }} <span class="text-wedding-red">*</span>
                </label>
                <select
                  v-model="formData.plusOne"
                  required
                  class="w-full px-4 py-3 bg-pink-50/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-spring-poppy focus:border-transparent transition-all duration-200 text-gray-700 font-medium hover:bg-pink-50"
                >
                  <option :value="null" disabled selected>{{ t('modal.yes') }} / {{ t('modal.no') }}</option>
                  <option :value="true">{{ t('modal.yes') }}</option>
                  <option :value="false">{{ t('modal.no') }}</option>
                </select>
                <p v-if="errors.plusOne" class="text-wedding-red text-sm mt-1">
                  {{ errors.plusOne }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t('modal.daysStaying') }} <span class="text-wedding-red">*</span>
                </label>
                <input
                  v-model.number="formData.daysStaying"
                  type="number"
                  min="1"
                  required
                  class="w-full px-4 py-3 bg-pink-50/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-spring-poppy focus:border-transparent transition-all duration-200 text-gray-700 font-medium hover:bg-pink-50"
                />
                <p v-if="errors.daysStaying" class="text-wedding-red text-sm mt-1">
                  {{ errors.daysStaying }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t('modal.otherMessage') }}
                </label>
                <textarea
                  v-model="formData.otherMessage"
                  rows="4"
                  class="w-full px-4 py-3 bg-pink-50/50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-spring-poppy focus:border-transparent transition-all duration-200 text-gray-700 resize-none hover:bg-pink-50"
                ></textarea>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 justify-end pt-4">
                <button
                  type="button"
                  @click="handleClose"
                  class="px-6 py-3 bg-nimble/20 hover:bg-nimble/30 text-gray-700 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-nimble"
                >
                  {{ t('modal.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-8 py-3 bg-gradient-to-r from-spring-poppy to-gold-accent hover:from-spring-poppy/90 hover:to-gold-accent/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-spring-poppy disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {{ isSubmitting ? 'Saving...' : t('modal.save') }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface QuestionsModalProps {
  isOpen: boolean
}

const props = defineProps<QuestionsModalProps>()

const emit = defineEmits<{
  close: []
  submit: [data: {
    ticketDate: string
    plusOne: boolean
    daysStaying: number
    otherMessage: string
  }]
}>()

const { t } = useI18n()

const formData = ref({
  ticketDate: '' as string,
  plusOne: null as boolean | null,
  daysStaying: 1,
  otherMessage: '',
})

const errors = ref({
  ticketDate: '',
  plusOne: '',
  daysStaying: '',
})

const isSubmitting = ref(false)

const validateForm = (): boolean => {
  errors.value = {
    ticketDate: '',
    plusOne: '',
    daysStaying: '',
  }

  let isValid = true

  if (!formData.value.ticketDate) {
    errors.value.ticketDate = t('modal.required')
    isValid = false
  }

  if (formData.value.plusOne === null) {
    errors.value.plusOne = t('modal.required')
    isValid = false
  }

  if (!formData.value.daysStaying || formData.value.daysStaying < 1) {
    errors.value.daysStaying = t('modal.positiveNumber')
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    emit('submit', {
      ticketDate: formData.value.ticketDate,
      plusOne: formData.value.plusOne!,
      daysStaying: formData.value.daysStaying,
      otherMessage: formData.value.otherMessage,
    })

    resetForm()
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  formData.value = {
    ticketDate: '',
    plusOne: null,
    daysStaying: 1,
    otherMessage: '',
  }
  errors.value = {
    ticketDate: '',
    plusOne: '',
    daysStaying: '',
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.3s ease;
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
</style>
