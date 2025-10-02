<template>
  <div class="countdown-wrapper py-6 sm:py-8" role="timer" aria-live="off">
    <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
      <div
        v-for="unit in timeUnits"
        :key="unit.label"
        class="countdown-tile bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-4 sm:p-6 min-w-[90px] sm:min-w-[110px] text-center shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <div
          class="countdown-number text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent"
          :aria-label="`${unit.value} ${unit.label}`"
        >
          {{ String(unit.value).padStart(2, '0') }}
        </div>
        <div class="countdown-label text-xs sm:text-sm text-gray-600 mt-2 uppercase tracking-wider font-medium">
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
