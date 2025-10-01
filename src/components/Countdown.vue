<template>
  <div class="countdown-wrapper py-6 sm:py-8" role="timer" aria-live="off">
    <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
      <div
        v-for="unit in timeUnits"
        :key="unit.label"
        class="countdown-tile bg-ivory-crepe rounded-xl-soft p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] text-center shadow-md"
      >
        <div
          class="countdown-number text-3xl sm:text-4xl md:text-5xl font-bold text-spring-poppy"
          :aria-label="`${unit.value} ${unit.label}`"
        >
          {{ unit.value }}
        </div>
        <div class="countdown-label text-xs sm:text-sm text-nimble mt-2 uppercase tracking-wide">
          {{ unit.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useI18n } from 'vue-i18n'

dayjs.extend(duration)

const props = defineProps({
  weddingDate: {
    type: String,
    required: true
  }
})

const { t } = useI18n()

const months = ref(0)
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let intervalId = null

const timeUnits = computed(() => [
  { value: months.value, label: t('countdown.months') },
  { value: days.value, label: t('countdown.days') },
  { value: hours.value, label: t('countdown.hours') },
  { value: minutes.value, label: t('countdown.minutes') },
  { value: seconds.value, label: t('countdown.seconds') }
])

const calculateCountdown = () => {
  const now = dayjs()
  const target = dayjs(props.weddingDate)

  if (target.isBefore(now)) {
    months.value = 0
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    return
  }

  const totalMonths = target.diff(now, 'month')
  months.value = totalMonths

  const afterMonths = now.add(totalMonths, 'month')
  const remainingMs = target.diff(afterMonths)
  const dur = dayjs.duration(remainingMs)

  days.value = Math.floor(dur.asDays())
  hours.value = dur.hours()
  minutes.value = dur.minutes()
  seconds.value = dur.seconds()
}

onMounted(() => {
  calculateCountdown()
  intervalId = setInterval(calculateCountdown, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.countdown-tile {
  transition: transform 0.2s ease;
}

.countdown-tile:hover {
  transform: translateY(-2px);
}
</style>
