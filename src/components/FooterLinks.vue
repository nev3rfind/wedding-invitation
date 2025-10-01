<template>
  <div class="footer-links mt-8 space-y-4 text-center">
    <div class="link-wrapper">
      <button
        @click="onVietnamInfoClick"
        :disabled="!vietnamLinkAvailable"
        class="text-english-pear hover:text-spring-poppy transition-colors underline disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
        :title="vietnamLinkAvailable ? '' : tooltipText"
      >
        {{ t('links.vietnam_info') }}
      </button>
      <span
        v-if="!vietnamLinkAvailable"
        class="ml-2 text-xs px-2 py-1 bg-nimble text-ivory-crepe rounded-full"
      >
        {{ availableFromBadge }}
      </span>
    </div>

    <div class="link-wrapper">
      <button
        @click="onTicketsInfoClick"
        :disabled="!ticketsLinkAvailable"
        class="text-english-pear hover:text-spring-poppy transition-colors underline disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
      >
        {{ t('links.tickets_info') }}
      </button>
      <span
        v-if="flyFromCountry"
        class="ml-2 text-xs px-2 py-1 bg-gold-accent text-ivory-crepe rounded-full"
      >
        {{ t('links.flying_from') }} {{ flyFromCountry }}
      </span>
      <span
        v-else
        class="ml-2 text-xs px-2 py-1 bg-nimble text-ivory-crepe rounded-full"
      >
        {{ t('links.set_country') }}
      </span>
      <span
        v-if="!ticketsLinkAvailable"
        class="ml-2 text-xs px-2 py-1 bg-nimble text-ivory-crepe rounded-full"
      >
        {{ t('links.coming_soon') }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const props = defineProps({
  vietnamLinkDate: {
    type: String,
    default: ''
  },
  ticketsLinkDate: {
    type: String,
    default: ''
  },
  flyFromCountry: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['vietnamInfo', 'ticketsInfo'])

const { t } = useI18n()

const vietnamLinkAvailable = computed(() => {
  if (!props.vietnamLinkDate) return true
  return dayjs().isAfter(dayjs(props.vietnamLinkDate))
})

const ticketsLinkAvailable = computed(() => {
  if (!props.ticketsLinkDate) return true
  return dayjs().isAfter(dayjs(props.ticketsLinkDate))
})

const availableFromBadge = computed(() => {
  if (!props.vietnamLinkDate) return t('links.coming_soon')
  const date = dayjs(props.vietnamLinkDate)
  return `${t('links.available_from')} ${date.format('DD MMM')}`
})

const tooltipText = computed(() => {
  if (!props.vietnamLinkDate) return ''
  return `Available from ${dayjs(props.vietnamLinkDate).format('DD MMM YYYY HH:mm')}`
})

const onVietnamInfoClick = () => {
  if (vietnamLinkAvailable.value) {
    emit('vietnamInfo')
  }
}

const onTicketsInfoClick = () => {
  if (ticketsLinkAvailable.value) {
    emit('ticketsInfo')
  }
}
</script>
