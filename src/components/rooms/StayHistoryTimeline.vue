<template>
    <div class="space-y-6">
  
      <div v-if="logs.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
        {{ t("stayDetails.history.empty") }}
      </div>
  
      <ol class="relative border-l border-gray-300 dark:border-gray-600 ml-3 pl-6 space-y-8">
        <li
          v-for="log in logs"
          :key="log.id"
          class="relative"
        >
          <!-- Marker -->
          <span
            class="absolute -left-3 top-1.5 w-3 h-3 rounded-full bg-brand dark:bg-emerald-400 shadow"
          ></span>
  
          <!-- Content -->
          <div class="space-y-1">
            <p class="text-sm text-gray-900 dark:text-white font-semibold">
              {{ t(`roomStays.status.${log.newStatus}`) }}
            </p>
  
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(log.changedAt) }}
            </p>
  
            <p v-if="log.changedBy" class="text-xs text-gray-600 dark:text-gray-300">
              {{ t("stayDetails.history.changedBy") }}:
              <span class="font-medium">{{ log.changedBy }}</span>
            </p>
  
            <p
              v-if="log.comment"
              class="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-line"
            >
              {{ log.comment }}
            </p>
          </div>
        </li>
      </ol>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import type { StayStatusLog } from "@/types/stays";
  import { useI18n } from "vue-i18n";
  
  const { t } = useI18n();
  
  interface Props {
    logs: StayStatusLog[];
  }
  const props = defineProps<Props>();
  
  function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }
  </script>
  