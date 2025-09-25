<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
  >
    <div class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</div>
    <div class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
      {{ value }}
    </div>
    <div v-if="hint" class="mt-1 text-xs text-gray-400 dark:text-gray-500">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  hint?: string;
}>();
</script>
