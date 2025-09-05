<template>
  <div class="rounded-2xl border bg-white p-4">
    <div class="text-sm text-gray-500">{{ title }}</div>
    <div class="mt-1 text-3xl font-semibold">{{ value }}</div>
    <div v-if="hint" class="mt-1 text-xs text-gray-400">{{ hint }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  hint?: string;
}>();
</script>
