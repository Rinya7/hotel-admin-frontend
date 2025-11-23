<template>
  <div class="flex items-start justify-between">
    <span class="label">{{ label }}</span>
    <span class="value">{{ displayValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  value: string | number | null;
}

const props = defineProps<Props>();

// Обробка null значень - показуємо "—" замість null
const displayValue = computed(() => {
  if (props.value === null || props.value === undefined) {
    return "—";
  }
  return props.value;
});
</script>

<style scoped>
.label {
  @apply text-sm text-gray-600 dark:text-gray-400 font-medium;
}

.value {
  @apply text-sm text-gray-900 dark:text-white font-semibold text-right;
}
</style>
  