<template>
  <div class="inline whitespace-pre-wrap tracking-tight">
    <span>{{ displayText }}</span>
    <span
      v-if="showCursor"
      :class="cn(
        cursorClassName,
        hideCursorOnType && (currentIndex < texts[currentTextIndex].length || isDeleting) ? 'hidden' : '',
        'animate-blink'
      )"
    >
      {{ cursorChar }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { cn } from '../../lib/utils'

const props = defineProps({
  text: {
    type: [String, Array],
    required: true
  },
  speed: {
    type: Number,
    default: 50
  },
  initialDelay: {
    type: Number,
    default: 0
  },
  waitTime: {
    type: Number,
    default: 2000
  },
  deleteSpeed: {
    type: Number,
    default: 30
  },
  loop: {
    type: Boolean,
    default: true
  },
  showCursor: {
    type: Boolean,
    default: true
  },
  hideCursorOnType: {
    type: Boolean,
    default: false
  },
  cursorChar: {
    type: String,
    default: '|'
  },
  cursorClassName: {
    type: String,
    default: 'ml-1'
  }
})

const displayText = ref('')
const currentIndex = ref(0)
const isDeleting = ref(false)
const currentTextIndex = ref(0)

const texts = computed(() => Array.isArray(props.text) ? props.text : [props.text])

let timeout = null

const startTyping = () => {
  const currentText = texts.value[currentTextIndex.value]

  if (isDeleting.value) {
    if (displayText.value === '') {
      isDeleting.value = false
      if (currentTextIndex.value === texts.value.length - 1 && !props.loop) {
        return
      }
      currentTextIndex.value = (currentTextIndex.value + 1) % texts.value.length
      currentIndex.value = 0
      timeout = setTimeout(() => {}, props.waitTime)
    } else {
      timeout = setTimeout(() => {
        displayText.value = displayText.value.slice(0, -1)
      }, props.deleteSpeed)
    }
  } else {
    if (currentIndex.value < currentText.length) {
      timeout = setTimeout(() => {
        displayText.value = displayText.value + currentText[currentIndex.value]
        currentIndex.value++
      }, props.speed)
    } else if (texts.value.length > 1) {
      timeout = setTimeout(() => {
        isDeleting.value = true
      }, props.waitTime)
    }
  }
}

watch([currentIndex, displayText, isDeleting, currentTextIndex], () => {
  if (timeout) clearTimeout(timeout)

  if (currentIndex.value === 0 && !isDeleting.value && displayText.value === '') {
    timeout = setTimeout(startTyping, props.initialDelay)
  } else {
    startTyping()
  }
})

onMounted(() => {
  timeout = setTimeout(startTyping, props.initialDelay)
})

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}
</style>
