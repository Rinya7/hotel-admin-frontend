<!--components/GlobalLoader.vue-->
<!--Компонент оверлея-->
<template>
  <!-- Показуємо напівпрозорий фон + спінер поверх всього додатку,
       коли у нас є хоча б один активний запит -->
  <div
    v-if="ui.isLoading"
    class="overlay"
    role="status"
    aria-live="polite"
    aria-label="Loading"
  >
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from "../stores/ui";
const ui = useUiStore();
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0; /* top/right/bottom/left: 0 */
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* поверх усього */
}

/* трішки більший спінер */
.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #333;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
