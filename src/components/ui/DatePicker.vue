<template>
  <div class="relative w-full max-w-sm">
    <div class="mb-2">
      <input
        type="text"
        :value="formattedDate"
        @click="toggleCalendar"
        readonly
        class="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-300 focus:outline-none transition cursor-pointer"
        :placeholder="placeholder"
      />
    </div>

    <Transition name="dropdown">
      <div
        v-if="showCalendar"
        class="absolute z-50 mt-1 bg-white rounded-lg shadow-xl border border-neutral-200 p-4 w-full"
      >
        <div class="flex items-center justify-between mb-4">
          <button
            type="button"
            @click="previousMonth"
            class="p-1 hover:bg-neutral-100 rounded"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="font-semibold text-sm">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </div>
          <button
            type="button"
            @click="nextMonth"
            class="p-1 hover:bg-neutral-100 rounded"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in dayNames"
            :key="day"
            class="text-center text-xs font-medium text-neutral-500 py-1"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="text-center"
          >
            <button
              v-if="day"
              type="button"
              @click="selectDate(day)"
              :class="[
                'w-8 h-8 rounded-lg text-sm transition',
                isSelectedDate(day)
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'hover:bg-neutral-100 text-neutral-700'
              ]"
            >
              {{ day }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Date, String, null],
    default: null
  },
  placeholder: {
    type: String,
    default: 'Select date'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const showCalendar = ref(false)
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDate = ref(props.modelValue ? new Date(props.modelValue) : null)

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  const date = new Date(selectedDate.value)
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }
  return days
})

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDate = (day) => {
  const date = new Date(currentYear.value, currentMonth.value, day)
  selectedDate.value = date
  emit('update:modelValue', date)
  emit('change', date)
  showCalendar.value = false
}

const isSelectedDate = (day) => {
  if (!selectedDate.value) return false
  const date = new Date(selectedDate.value)
  return (
    date.getDate() === day &&
    date.getMonth() === currentMonth.value &&
    date.getFullYear() === currentYear.value
  )
}

const handleClickOutside = (event) => {
  const target = event.target
  if (!target.closest('.relative')) {
    showCalendar.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
