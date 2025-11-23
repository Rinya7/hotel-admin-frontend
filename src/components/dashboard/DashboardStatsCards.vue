<!-- DashboardStatsCards.vue -->
<!-- Компонент для відображення статистики кімнат (free, occupied, cleaning) -->
<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <button
      v-for="status in statusOptions"
      :key="status"
      @click="$emit('toggle-filter', status)"
      :class="[
        'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
        statusFilters.includes(status)
          ? getActiveClasses(status)
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50',
      ]"
    >
      <strong
        :class="[
          'text-sm block mb-1',
          statusFilters.includes(status)
            ? getActiveTextClasses(status)
            : 'text-gray-600 dark:text-gray-400',
        ]"
      >
        {{ getStatusLabel(status) }}
      </strong>
      <div
        :class="[
          'text-3xl font-bold',
          statusFilters.includes(status)
            ? getActiveTextClasses(status)
            : 'text-gray-900 dark:text-white',
        ]"
      >
        {{ stats?.[status] ?? "—" }}
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
// src/components/dashboard/DashboardStatsCards.vue
// Компонент для відображення статистики кімнат

import { useI18n } from "vue-i18n";
import type { RoomsStats, RoomStatus } from "@/types/rooms";

interface Props {
  stats: RoomsStats | null;
  statusFilters: RoomStatus[];
}

const props = defineProps<Props>();

const { t } = useI18n();

defineEmits<{
  (e: "toggle-filter", status: RoomStatus): void;
}>();

const statusOptions: RoomStatus[] = ["free", "occupied", "cleaning"];

/**
 * Отримати класи для активної кнопки
 */
function getActiveClasses(status: RoomStatus): string {
  const classes: Record<RoomStatus, string> = {
    free: "bg-green-100 dark:bg-green-900 border-brand dark:border-white",
    occupied: "bg-red-100 dark:bg-red-900 border-brand dark:border-white",
    cleaning: "bg-blue-100 dark:bg-blue-900 border-brand dark:border-white",
  };
  return classes[status] ?? "";
}

/**
 * Отримати класи для тексту активної кнопки
 */
function getActiveTextClasses(status: RoomStatus): string {
  const classes: Record<RoomStatus, string> = {
    free: "text-green-800 dark:text-green-200",
    occupied: "text-red-800 dark:text-red-200",
    cleaning: "text-blue-800 dark:text-blue-200",
  };
  return classes[status] ?? "";
}

/**
 * Отримати лейбл для статусу
 */
function getStatusLabel(status: RoomStatus): string {
  return t(`dashboard.stats.${status}`) as string;
}
</script>

