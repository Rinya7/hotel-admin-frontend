<template>
    <div class="flex flex-col">
      <dt class="info-label">{{ label }}</dt>
      <dd class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-line">
        {{ value }}
      </dd>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    label: string;
    value: string;
  }
  defineProps<Props>();
  </script>
  
  <style scoped>
  .info-label {
    @apply text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400;
  }
  </style>
  