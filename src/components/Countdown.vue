<template>
  <div
    class="countdown-container flex flex-wrap justify-center gap-4"
    role="timer"
    aria-live="assertive"
    :aria-label="`Time until wedding: ${countdownText}`"
  >
    <div v-if="timeLeft.months > 0" class="countdown-tile">
      <div class="countdown-number">{{ timeLeft.months }}</div>
      <div class="countdown-label">{{ t('countdown.months') }}</div>
    </div>
    <div class="countdown-tile">
      <div class="countdown-number">{{ timeLeft.days }}</div>
      <div class="countdown-label">{{ t('countdown.days') }}</div>
    </div>
    <div class="countdown-tile">
      <div class="countdown-number">{{ timeLeft.hours }}</div>
      <div class="countdown-label">{{ t('countdown.hours') }}</div>
    </div>
    <div class="countdown-tile">
      <div class="countdown-number">{{ timeLeft.minutes }}</div>
      <div class="countdown-label">{{ t('countdown.minutes') }}</div>
    </div>
    <div class="countdown-tile">
      <div class="countdown-number">{{ timeLeft.seconds }}</div>
      <div class="countdown-label">{{ t('countdown.seconds') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(duration)
dayjs.extend(timezone)
dayjs.extend(utc)

interface CountdownProps {
  weddingDate: string
}

const props = defineProps<CountdownProps>()
const { t } = useI18n()

const timeLeft = ref({
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

let intervalId: number | null = null

const countdownText = computed(() => {
  const parts = []
  if (timeLeft.value.months > 0) parts.push(`${timeLeft.value.months} ${t('countdown.months')}`)
  parts.push(`${timeLeft.value.days} ${t('countdown.days')}`)
  parts.push(`${timeLeft.value.hours} ${t('countdown.hours')}`)
  parts.push(`${timeLeft.value.minutes} ${t('countdown.minutes')}`)
  parts.push(`${timeLeft.value.seconds} ${t('countdown.seconds')}`)
  return parts.join(', ')
})

const calculateTimeLeft = () => {
  const now = dayjs()
  const wedding = dayjs(props.weddingDate)

  if (wedding.isBefore(now)) {
    timeLeft.value = { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  const diff = wedding.diff(now, 'second')
  const dur = dayjs.duration(diff, 'seconds')

  const totalMonths = wedding.diff(now, 'month')
  const afterMonths = now.add(totalMonths, 'month')
  const remainingDays = wedding.diff(afterMonths, 'day')

  timeLeft.value = {
    months: totalMonths,
    days: remainingDays,
    hours: dur.hours(),
    minutes: dur.minutes(),
    seconds: dur.seconds(),
  }
}

onMounted(() => {
  calculateTimeLeft()
  intervalId = window.setInterval(calculateTimeLeft, 1000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.countdown-container {
  margin: 2rem 0;
}

.countdown-tile {
  @apply bg-ivory-crepe rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center min-w-[100px];
  transition: transform 0.3s ease;
}

.countdown-tile:hover {
  transform: translateY(-4px);
}

.countdown-number {
  @apply text-5xl md:text-6xl font-bold text-spring-poppy;
  font-variant-numeric: tabular-nums;
}

.countdown-label {
  @apply text-sm md:text-base text-nimble font-semibold uppercase tracking-wider mt-2;
}
</style>
