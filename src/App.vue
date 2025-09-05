<!-- frontend/src/App.vue -->
<template>
  <!-- Весь основний контент сторінки -->
  <div class="container py-4 md:py-6">
    <!-- Тут або <RouterView/>, або власний layout із хедером тощо -->
    <!-- Тут у тебе тільки <RouterView/>, або якщо ти залишив порожній App.vue -->
    <RouterView />
    <!-- Глобальний loader — завжди змонтований, але видимий лише під час запитів -->
    <GlobalLoader />
  </div>
</template>

<script setup lang="ts">
import GlobalLoader from "./components/GlobalLoader.vue";
</script>
