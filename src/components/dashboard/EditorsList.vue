<!-- Компонент для отображения списка редакторов -->
<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
  >
    <h2 class="text-lg font-semibold text-brand dark:text-white mb-4">
      {{ t("editorsList.title") }}
    </h2>

    <div v-if="loading" class="text-center py-4">
      <div class="text-gray-500 dark:text-gray-400">
        {{ t("editorsList.loading") }}
      </div>
    </div>

    <div v-else-if="editors.length === 0" class="text-center py-4">
      <div class="text-gray-500 dark:text-gray-400">
        {{ t("editorsList.noEditors") }}
      </div>
    </div>

    <ul v-else class="space-y-2">
      <li
        v-for="editor in editors"
        :key="editor.id"
        class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span class="text-sm text-gray-700 dark:text-gray-300">
          {{ editor.full_name || editor.username }}
        </span>
        <button
          @click="openEditorInfo(editor)"
          class="inline-flex items-center px-3 py-1 text-xs font-medium text-brand bg-brand/10 hover:bg-brand/20 dark:text-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20 rounded-lg transition-colors"
        >
          {{ t("editorsList.actions.info") }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { PublicAdminUser } from "@/types/hotel";

interface Props {
  editors: PublicAdminUser["editors"];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  (e: "open-info", editor: PublicAdminUser["editors"][number]): void;
}>();

const { t } = useI18n();

function openEditorInfo(editor: PublicAdminUser["editors"][number]): void {
  emit("open-info", editor);
}
</script>

