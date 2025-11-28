<template>
    <div class="grid grid-cols-1 gap-4">
  
      <div
        v-for="stay in stays"
        :key="stay.id"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow p-5 transition hover:shadow-lg"
      >
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  
          <!-- Ліва частина -->
          <div class="space-y-1">
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ stay.mainGuestName }}
            </p>
  
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ formatRange(stay) }}
            </p>
  
            <span
              :class="[getStatusClass(stay.status),'px-2 py-1 text-xs rounded-full font-medium inline-block mt-1']"
            >
              {{ t(`roomStays.status.${stay.status}`) }}
            </span>
          </div>
  
          <!-- Права частина -->
          <div class="flex flex-col sm:items-end gap-2">
            <button
              v-if="stay.status === 'booked'"
              @click="$emit('edit', stay)"
              class="btn-secondary"
            >
              {{ t("roomStays.editStayModal.open") }}
            </button>
  
            <button
              :disabled="!canCheckIn(stay)"
              @click="$emit('checkin', stay)"
              class="btn-warning disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t("roomStays.table.checkIn") }}
            </button>
          </div>
        </div>
  
      </div>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Stay } from "@/types/stays";
  import { useI18n } from "vue-i18n";
  
  interface Props {
    stays: Stay[];
  }
  defineProps<Props>();
  
  const { t } = useI18n();
  
  function canCheckIn(stay: Stay): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return stay.status === "booked" && stay.checkIn <= today && stay.checkOut >= today;
  }
  
  function formatDate(date: string): string {
    return new Intl.DateTimeFormat("uk-UA").format(new Date(date));
  }
  
  function formatRange(stay: Stay): string {
    return `${formatDate(stay.checkIn)} → ${formatDate(stay.checkOut)}`;
  }
  
  function getStatusClass(status: Stay["status"]): string {
    const map: Record<Stay["status"], string> = {
      booked: "bg-yellow-100 text-yellow-800",
      occupied: "bg-blue-100 text-blue-800",
      completed: "bg-gray-200 text-gray-700",
      cancelled: "bg-red-100 text-red-800",
    };
    return map[status];
  }
  </script>
  
  <style scoped>
  .btn-secondary {
    @apply px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition;
  }
  
  .btn-warning {
    @apply px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition;
  }
  </style>
  