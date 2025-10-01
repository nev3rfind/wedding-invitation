<template>
  <div
    v-if="isVisible"
    ref="addressCard"
    class="address-card mt-8 p-6 bg-ivory-crepe rounded-xl-soft shadow-lg max-w-md mx-auto text-center"
  >
    <h3 class="text-2xl font-serif text-spring-poppy mb-4">
      {{ t('address.title') }}
    </h3>
    <p class="text-lg text-nimble mb-2">
      {{ venueAddress }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  venueAddress: {
    type: String,
    default: ''
  }
})

const { t } = useI18n()

const addressCard = ref(null)

watch(() => props.isVisible, async (isVisible) => {
  if (isVisible) {
    await nextTick()
    if (addressCard.value) {
      gsap.fromTo(addressCard.value,
        { opacity: 0, y: -30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }
      )
    }
  }
})
</script>
