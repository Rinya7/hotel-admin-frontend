<!-- NeedsActionModal.vue -->
<!-- Модальне вікно для відображення попередження про проживання, які потребують дії -->
<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('update:modelValue', false)"
  >
    <div
      class="bg-white border border-brand dark:border-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
      @click.stop
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-brand dark:text-white">
          {{ t("dashboard.needsAction.title") }}
        </h3>
        <button
          @click="$emit('update:modelValue', false)"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <p class="text-gray-700 dark:text-gray-300 mb-6">
        {{ t("dashboard.needsAction.count", { count: count }) }}
      </p>

      <div class="flex gap-3 justify-end">
        <button
          @click="$emit('view')"
          class="px-4 py-2 bg-brand text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          {{ t("dashboard.needsAction.viewAll") }}
        </button>
        <button
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {{ t("dashboard.needsAction.close") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();

interface Props {
  modelValue: boolean;
  count: number;
}

defineProps<Props>();

defineEmits<{
  "update:modelValue": [value: boolean];
  view: [];
}>();
</script>

