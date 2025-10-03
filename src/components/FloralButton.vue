<template>
  <button
    :disabled="disabled"
    @click="handleClick"
    class="floral-button relative px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    :class="buttonClasses"
  >
    <span class="floral-decoration absolute -top-2 -left-2 text-2xl">
      <span class="text-red-500">&#127801;</span>
    </span>
    <span class="floral-decoration absolute -top-2 -right-2 text-2xl">
      <span class="text-green-500">&#127807;</span>
    </span>
    <span class="floral-decoration absolute -bottom-2 -left-2 text-2xl">
      <span class="text-green-500">&#127807;</span>
    </span>
    <span class="floral-decoration absolute -bottom-2 -right-2 text-2xl">
      <span class="text-red-500">&#127801;</span>
    </span>

    <span class="relative z-10">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}

const buttonClasses = {
  'bg-white/90 backdrop-blur-sm text-green-600 border-2 border-green-500 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white': true
}
</script>

<style scoped>
.floral-button {
  min-width: 200px;
}

.floral-decoration {
  animation: float 3s ease-in-out infinite;
}

.floral-button:hover .floral-decoration {
  animation: float 1.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
}
</style>
