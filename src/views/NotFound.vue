<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 px-4">
    <div class="max-w-md w-full text-center space-y-8 animate-fade-in">
      <div class="text-9xl font-bold text-spring-poppy animate-bounce">
        404
      </div>

      <h1 class="text-3xl md:text-4xl font-serif font-bold text-gray-800">
        Invitation Not Found
      </h1>

      <p class="text-lg text-gray-600">
        Unfortunately, we couldn't find the invitation you're looking for. Please check your invitation link and try again.
      </p>

      <div class="pt-6">
        <router-link
          to="/"
          class="inline-block px-8 py-4 bg-gradient-to-r from-spring-poppy to-gold-accent hover:from-spring-poppy/90 hover:to-gold-accent/90 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Go to Homepage
        </router-link>
      </div>

      <div class="pt-8 opacity-50">
        <svg class="w-32 h-32 mx-auto text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
