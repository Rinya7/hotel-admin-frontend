<template>
  <span v-if="active" class="inline-block align-middle" aria-hidden="true">
    <svg
      v-if="dir === 'asc'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-4 w-4"
    >
      <path
        d="M7 14l5-5 5 5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="h-4 w-4"
    >
      <path
        d="M7 10l5 5 5-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>
<script lang="ts" setup>
// Проста іконка-індикатор для активного сортування
defineProps<{ active: boolean; dir: "asc" | "desc" }>();
</script>
