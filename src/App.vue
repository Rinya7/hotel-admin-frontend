<!-- frontend/src/App.vue -->
<template>
  <div>
    <!-- Тут у тебе тільки <RouterView/>, або якщо ти залишив порожній App.vue -->
    <RouterView />
    <!-- Глобальний лоадер — завжди змонтований, але видимий лише під час запитів -->
    <GlobalLoader />
  </div>
</template>

<script setup lang="ts">
import GlobalLoader from "./components/GlobalLoader.vue";
</script>
