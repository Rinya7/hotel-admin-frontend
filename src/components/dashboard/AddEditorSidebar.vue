<!-- AddEditorSidebar.vue -->
<!-- Компонент для бічної панелі додавання редактора -->
<template>
  <aside
    v-if="canManage"
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4"
  >
    <div class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-brand dark:text-white">
        {{ t("dashboard.addEditor.cardTitle") }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ t("dashboard.addEditor.cardSubtitle") }}
      </p>
      <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <li>
          <span class="font-medium text-brand dark:text-emerald-300">•</span>
          {{ t("dashboard.addEditor.highlights.manage") }}
        </li>
        <li>
          <span class="font-medium text-brand dark:text-emerald-300">•</span>
          {{ t("dashboard.addEditor.highlights.audit") }}
        </li>
        <li>
          <span class="font-medium text-brand dark:text-emerald-300">•</span>
          {{ t("dashboard.addEditor.highlights.revoke") }}
        </li>
      </ul>
    </div>
    <button
      type="button"
      class="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      @click="$emit('open-modal')"
    >
      {{ t("dashboard.addEditor.button") }}
    </button>
  </aside>
</template>

<script setup lang="ts">
// src/components/dashboard/AddEditorSidebar.vue
// Компонент для бічної панелі додавання редактора

import { useI18n } from "vue-i18n";

interface Props {
  canManage: boolean;
}

defineProps<Props>();

const { t } = useI18n();

defineEmits<{
  (e: "open-modal"): void;
}>();
</script>

