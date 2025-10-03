<template>
  <div :class="cn('inline whitespace-pre-wrap tracking-tight', className)">
    <span>{{ displayText }}</span>
    <span
      v-if="showCursor"
      :class="cn(
        cursorClassName,
        hideCursorOnType && (currentIndex < texts[currentTextIndex].length || isDeleting) ? 'hidden' : ''
      )"
      class="cursor"
    >
      {{ cursorChar }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { cn } from '@/lib/utils'

interface TypewriterProps {
  text: string | string[]
  speed?: number
  initialDelay?: number
  waitTime?: number
  deleteSpeed?: number
  loop?: boolean
  className?: string
  showCursor?: boolean
  hideCursorOnType?: boolean
  cursorChar?: string
  cursorClassName?: string
}

const props = withDefaults(defineProps<TypewriterProps>(), {
  speed: 70,
  initialDelay: 0,
  waitTime: 1500,
  deleteSpeed: 40,
  loop: true,
  showCursor: true,
  hideCursorOnType: false,
  cursorChar: '|',
  cursorClassName: 'ml-1',
  className: '',
})

const emit = defineEmits<{
  complete: []
  cycleComplete: [index: number]
}>()

const displayText = ref('')
const currentIndex = ref(0)
const isDeleting = ref(false)
const currentTextIndex = ref(0)

const texts = computed(() => {
  return Array.isArray(props.text) ? props.text : [props.text]
})

let timeout: ReturnType<typeof setTimeout> | null = null

const startTyping = () => {
  const currentText = texts.value[currentTextIndex.value]

  if (isDeleting.value) {
    if (displayText.value === '') {
      isDeleting.value = false
      if (currentTextIndex.value === texts.value.length - 1 && !props.loop) {
        emit('complete')
        return
      }
      const nextIndex = (currentTextIndex.value + 1) % texts.value.length
      currentTextIndex.value = nextIndex
      emit('cycleComplete', nextIndex)
      currentIndex.value = 0
      timeout = setTimeout(startTyping, props.waitTime)
    } else {
      timeout = setTimeout(() => {
        displayText.value = displayText.value.slice(0, -1)
        startTyping()
      }, props.deleteSpeed)
    }
  } else {
    if (currentIndex.value < currentText.length) {
      timeout = setTimeout(() => {
        displayText.value = displayText.value + currentText[currentIndex.value]
        currentIndex.value++
        startTyping()
      }, props.speed)
    } else if (texts.value.length > 1) {
      timeout = setTimeout(() => {
        isDeleting.value = true
        startTyping()
      }, props.waitTime)
    } else {
      emit('complete')
    }
  }
}

onMounted(() => {
  if (currentIndex.value === 0 && !isDeleting.value && displayText.value === '') {
    timeout = setTimeout(startTyping, props.initialDelay)
  } else {
    startTyping()
  }
})

onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout)
  }
})

watch(
  () => props.text,
  () => {
    displayText.value = ''
    currentIndex.value = 0
    isDeleting.value = false
    currentTextIndex.value = 0
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(startTyping, props.initialDelay)
  }
)
</script>

<style scoped>
.cursor {
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
