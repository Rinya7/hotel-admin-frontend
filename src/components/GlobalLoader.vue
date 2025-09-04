<template>
  <!-- Overlay with semi-transparent background and centered spinner -->
  <div
    v-if="ui.isLoading"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm"
    role="status"
    aria-live="polite"
    aria-label="Loading"
  >
    <!-- Large brand-colored spinner -->
    <Spinner size="lg" />
  </div>
</template>

<script setup lang="ts">
/**
 * Global overlay loader
 * - Uses reusable <Spinner /> with brand color
 */
import { useUiStore } from "@/stores/ui";
import Spinner from "./Spinner.vue";

const ui = useUiStore();
</script>
