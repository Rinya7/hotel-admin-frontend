<!-- RoomManagementSidebar.vue -->
<!-- Компонент для бічної панелі управління готелем (Policy Hours, Wi-Fi, інформація) -->
<template>
  <section
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-brand dark:text-white">
        Hotel Management
      </h2>
      <button
        v-if="isAdmin"
        @click="$emit('open-policy-hours')"
        class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-brand bg-brand/10 hover:bg-brand/20 dark:text-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20 rounded-lg transition-colors"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        {{ t("dashboard.roomManagement.policyHours") }}
      </button>
    </div>

    <!-- Policy Hours Display -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div class="flex items-center mb-2">
            <svg
              class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.roomManagement.checkInTime") }}
            </span>
          </div>
          <p class="text-sm text-gray-900 dark:text-white font-mono">
            {{
              checkInHour !== null
                ? `${checkInHour}:00`
                : t("dashboard.roomManagement.notSet")
            }}
          </p>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div class="flex items-center mb-2">
            <svg
              class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.roomManagement.checkOutTime") }}
            </span>
          </div>
          <p class="text-sm text-gray-900 dark:text-white font-mono">
            {{
              checkOutHour !== null
                ? `${checkOutHour}:00`
                : t("dashboard.roomManagement.notSet")
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Wi-Fi Display -->
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-brand dark:text-white">
          {{ t("dashboard.roomManagement.wifiCredentials") }}
        </h3>
        <button
          v-if="isAdmin"
          @click="$emit('open-wifi')"
          class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-brand bg-brand/10 hover:bg-brand/20 dark:text-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20 rounded-lg transition-colors"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            ></path>
          </svg>
          {{ t("dashboard.roomManagement.editWifi") }}
        </button>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div class="flex items-center mb-2">
            <svg
              class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              ></path>
            </svg>
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.roomManagement.networkName") }}
            </span>
          </div>
          <p class="text-sm text-gray-900 dark:text-white font-mono">
            {{
              wifiName && wifiName.trim()
                ? wifiName
                : t("dashboard.roomManagement.notSet")
            }}
          </p>
        </div>

        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div class="flex items-center mb-2">
            <svg
              class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.roomManagement.password") }}
            </span>
          </div>
          <p class="text-sm text-gray-900 dark:text-white font-mono">
            {{
              wifiPassword && wifiPassword.trim()
                ? "••••••••"
                : t("dashboard.roomManagement.notSet")
            }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>{{ t("dashboard.roomManagement.info.viewAllRooms") }}</p>
          <p>{{ t("dashboard.roomManagement.info.filterByStatus") }}</p>
          <p>{{ t("dashboard.roomManagement.info.manageInRooms") }}</p>
        </div>
        <RouterLink
          to="/rooms"
          class="inline-flex items-center px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors"
        >
          {{ t("dashboard.roomManagement.goToRooms") }}
          <svg
            class="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// src/components/dashboard/RoomManagementSidebar.vue
// Компонент для бічної панелі управління готелем

import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";

interface Props {
  isAdmin: boolean;
  checkInHour: number | null;
  checkOutHour: number | null;
  wifiName: string;
  wifiPassword: string;
}

defineProps<Props>();

const { t } = useI18n();

defineEmits<{
  (e: "open-policy-hours"): void;
  (e: "open-wifi"): void;
}>();
</script>

