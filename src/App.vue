<!-- frontend/src/App.vue -->
<template>
  <div class="app-bg">
    <!-- Тут у тебе тільки <RouterView/>, або якщо ти залишив порожній App.vue -->
    <RouterView />
    <!-- Глобальний лоадер — завжди змонтований, але видимий лише під час запитів -->
    <GlobalLoader />
  </div>
</template>

<script setup lang="ts">
import GlobalLoader from "./components/GlobalLoader.vue";
</script>
<style>
.app-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #1b5e20, #2e7d32, #43a047);
}
</style>
