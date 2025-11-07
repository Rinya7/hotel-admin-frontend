<!-- AuditLogViewer.vue — універсальний компонент для відображення історії змін -->
<template>
  <div class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4">
    <h2 class="text-xl font-semibold mb-3 text-brand dark:text-white">
      {{ resolvedTitle }}
    </h2>

    <div v-if="loading" class="text-center py-8 text-gray-500 dark:text-gray-400">
      {{ t("auditLogViewer.loading") }}
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>

    <div v-else-if="logs.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      {{ t("auditLogViewer.empty") }}
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="text-left border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <th class="py-2 px-2 text-gray-700 dark:text-gray-300">{{ t("auditLogViewer.table.date") }}</th>
            <th v-if="showType" class="py-2 px-2 text-gray-700 dark:text-gray-300">{{ t("auditLogViewer.table.type") }}</th>
            <th class="py-2 px-2 text-gray-700 dark:text-gray-300">{{ t("auditLogViewer.table.oldStatus") }}</th>
            <th class="py-2 px-2 text-gray-700 dark:text-gray-300">{{ t("auditLogViewer.table.newStatus") }}</th>
            <th class="py-2 px-2 text-gray-700 dark:text-gray-300">{{ t("auditLogViewer.table.changedBy") }}</th>
            <th class="py-2 px-2 text-gray-700 dark:text-gray-300">{{ t("auditLogViewer.table.role") }}</th>
            <th v-if="showComment" class="py-2 px-2 text-gray-700 dark:text-gray-300">
              {{ t("auditLogViewer.table.comment") }}
            </th>
            <th v-if="showEntity" class="py-2 px-2 text-gray-700 dark:text-gray-300">
              {{ t("auditLogViewer.table.entity") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(log, i) in logs"
            :key="i"
            class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td class="py-2 px-2 text-gray-700 dark:text-gray-300">
              {{ formatDate(log.changedAt) }}
            </td>
            <td v-if="showType" class="py-2 px-2">
              <span
                :class="{
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': log.type === 'room',
                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': log.type === 'stay',
                }"
                class="px-2 py-1 rounded text-xs font-medium"
              >
                {{ log.type === "room" ? "Кімната" : log.type === "stay" ? "Проживання" : "—" }}
              </span>
            </td>
            <td class="py-2 px-2">
              <span
                :class="getStatusClass(log.oldStatus)"
                class="px-2 py-1 rounded text-xs font-medium"
              >
                {{ log.oldStatus || "-" }}
              </span>
            </td>
            <td class="py-2 px-2">
              <span
                :class="getStatusClass(log.newStatus)"
                class="px-2 py-1 rounded text-xs font-medium"
              >
                {{ log.newStatus || "-" }}
              </span>
            </td>
            <td class="py-2 px-2 text-gray-700 dark:text-gray-300">
              {{ log.changedBy || "system" }}
            </td>
            <td class="py-2 px-2 text-gray-700 dark:text-gray-300">
              {{ log.changedByRole || "—" }}
            </td>
            <td v-if="showComment" class="py-2 px-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {{ log.comment && log.comment.length > 0 ? log.comment : "—" }}
            </td>
            <td v-if="showEntity" class="py-2 px-2">
              <RouterLink
                v-if="log.entityLink"
                :to="log.entityLink"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {{ log.entityLabel || t("auditLogViewer.table.details") }}
              </RouterLink>
              <span v-else class="text-gray-400">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import type { AuditLog } from "@/types/common";

interface Props {
  title?: string;
  logs: AuditLog[];
  showEntity?: boolean;
  showType?: boolean; // показувати колонку "Тип" (room/stay)
  showComment?: boolean;
  loading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  showEntity: false,
  showType: false,
  showComment: false,
  loading: false,
  error: null,
});

const { t, locale } = useI18n();

const resolvedTitle = computed(() => props.title ?? t("auditLogViewer.defaultTitle"));
const resolvedLocale = computed(() => locale.value ?? "uk-UA");

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString(resolvedLocale.value, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusClass(status?: string): string {
  if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";

  const classes: Record<string, string> = {
    // Room статуси
    free: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    booked: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    cleaning: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    // Stay статуси
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return classes[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
}
</script>

