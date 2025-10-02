<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="handleClose"
      >
        <Transition name="modal-scale">
          <div
            v-if="open"
            class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative text-neutral-900 mx-4"
          >
            <button
              type="button"
              @click="handleClose"
              class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 text-2xl focus:outline-none focus:ring-2 focus:ring-neutral-400 rounded-full w-8 h-8 flex items-center justify-center"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 class="text-2xl font-bold mb-1 tracking-tight">
              <slot name="title">{{ title }}</slot>
            </h2>

            <p class="text-neutral-500 mb-7 text-sm">
              <slot name="description">{{ description }}</slot>
            </p>

            <slot name="content">
              <form @submit.prevent="handleSave" autocomplete="off">
                <div class="mb-5">
                  <label for="name" class="block text-sm font-semibold mb-2">Name</label>
                  <input
                    id="name"
                    type="text"
                    v-model="formName"
                    class="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300 focus:outline-none transition"
                    autocomplete="off"
                    required
                  />
                </div>

                <div class="mb-5">
                  <label for="email" class="block text-sm font-semibold mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    v-model="formEmail"
                    class="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300 focus:outline-none transition"
                    autocomplete="off"
                    required
                  />
                </div>

                <div class="mb-8">
                  <label for="message" class="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    id="message"
                    v-model="formMessage"
                    rows="3"
                    class="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300 focus:outline-none transition resize-none"
                    autocomplete="off"
                  ></textarea>
                </div>

                <div class="flex justify-end gap-3">
                  <button
                    type="button"
                    @click="handleClose"
                    class="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-neutral-700 font-medium hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 rounded-lg bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 transition"
                  >
                    {{ submitText }}
                  </button>
                </div>
              </form>
            </slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'RSVP'
  },
  description: {
    type: String,
    default: 'Please fill in your details'
  },
  submitText: {
    type: String,
    default: 'Save changes'
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'save'])

const open = ref(props.modelValue)
const formName = ref(props.name)
const formEmail = ref(props.email)
const formMessage = ref(props.message)

watch(() => props.modelValue, (newVal) => {
  open.value = newVal
})

watch(() => props.name, (newVal) => {
  formName.value = newVal
})

watch(() => props.email, (newVal) => {
  formEmail.value = newVal
})

watch(() => props.message, (newVal) => {
  formMessage.value = newVal
})

const handleClose = () => {
  open.value = false
  emit('update:modelValue', false)
  emit('close')
}

const handleSave = () => {
  emit('save', {
    name: formName.value,
    email: formEmail.value,
    message: formMessage.value
  })
  handleClose()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
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
  transform: scale(0.9);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
