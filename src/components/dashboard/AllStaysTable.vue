<!-- AllStaysTable.vue -->
<!-- Компонент для відображення таблиці всіх бронювань -->
<template>
  <section
    class="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
  >
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-brand dark:text-white">
          {{ t("dashboard.allStays.title") }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t("dashboard.allStays.subtitle") }}
        </p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="checking"
          @click="$emit('check-overdue')"
        >
          {{ checking ? t("common.loading") : "Check Overdue" }}
        </button>
        <RouterLink
          :to="{ name: 'needs-action' }"
          :class="[
            'px-3 py-1 text-sm rounded-md transition-colors inline-flex items-center font-medium',
            props.needsActionCount && props.needsActionCount > 0
              ? 'bg-red-100 hover:bg-red-200 dark:bg-red-700 dark:hover:bg-red-600 text-red-700 dark:text-red-300'
              : 'bg-green-100 hover:bg-green-200 dark:bg-green-700 dark:hover:bg-green-600 text-green-700 dark:text-green-300',
          ]"
        >
          Needs Action
          <span
            v-if="props.needsActionCount && props.needsActionCount > 0"
            class="ml-1.5 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full"
          >
            {{ props.needsActionCount }}
          </span>
        </RouterLink>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <button
        v-for="status in stayStatusOptions"
        :key="status"
        type="button"
        :class="getFilterButtonClasses(status)"
        @click="$emit('toggle-status-filter', status)"
      >
        {{ getStayStatusLabel(status) }}
      </button>
      <input
        :value="searchQuery"
        @input="(e) => $emit('update:search-query', (e.target as HTMLInputElement).value)"
        type="text"
        :placeholder="t('dashboard.allStays.searchPlaceholder')"
        class="ml-auto px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
      />
    </div>

    <div
      class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <!-- Контейнер с горизонтальным скроллом для таблицы -->
      <div class="overflow-x-auto -mx-4 px-4">
        <table class="min-w-[800px] text-sm w-full">
        <thead
          class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <tr>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.allStays.table.booking") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.allStays.table.room") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.allStays.table.guest") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.allStays.table.dates") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.allStays.table.status") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.allStays.table.createdAt") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.allStays.table.statusChangedAt") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.allStays.table.actions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td
              colspan="8"
              class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
            >
              {{ t("dashboard.loading") }}
            </td>
          </tr>
          <tr v-else-if="error">
            <td
              colspan="8"
              class="px-4 py-6 text-center text-red-500 dark:text-red-300"
            >
              {{ error }}
            </td>
          </tr>
          <tr v-else-if="filteredStays.length === 0">
            <td
              colspan="8"
              class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
            >
              {{ t("dashboard.allStays.empty") }}
            </td>
          </tr>
          <tr
            v-for="stay in filteredStays"
            :key="stay.stayId"
            class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td class="px-4 py-3 font-semibold text-gray-900 dark:text-white">
              {{ formatBookingCode(stay) }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ stay.room?.number }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ stay.mainGuestName }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ formatStayPeriod(stay) }}
            </td>
            <td class="px-4 py-3">
              <span
                :class="[
                  getStayStatusClass(stay.status, stay.checkIn, stay.checkOut),
                  'px-2 py-1 rounded text-xs font-medium',
                ]"
              >
                {{ getStayStatusLabel(stay.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ formatStatusChangedAt(stay.createdAt) }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ formatStatusChangedAt(stay.statusChangedAt) }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              <RouterLink
                :to="{
                  name: 'room-stays',
                  params: { roomNumber: stay.room?.number },
                }"
                class="text-brand hover:text-brand-light dark:text-emerald-300"
              >
                {{ t("dashboard.allStays.openRoom") }}
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// src/components/dashboard/AllStaysTable.vue
// Компонент для відображення таблиці всіх бронювань

import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import type { StayListItem, StayStatus } from "@/types/stays";

interface Props {
  loading: boolean;
  error: string | null;
  filteredStays: StayListItem[];
  statusFilters: StayStatus[];
  searchQuery: string;
  stayStatusOptions: StayStatus[];
  needsActionCount?: number;
}

const props = defineProps<Props>();

const { t, locale } = useI18n();

const checking = defineModel<boolean>("checking", { default: false });

defineEmits<{
  (e: "check-overdue"): void;
  (e: "toggle-status-filter", status: StayStatus): void;
  (e: "update:search-query", value: string): void;
}>();

/**
 * Отримати класи для кнопки фільтра
 */
function getFilterButtonClasses(status: StayStatus): string {
  const base =
    "px-3 py-1.5 text-sm font-medium rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";
  const isActive = props.statusFilters.includes(status);

  const activeClasses: Record<StayStatus, string> = {
    booked:
      "bg-yellow-100 border-yellow-300 text-yellow-900 dark:bg-yellow-900/60 dark:border-yellow-600 dark:text-yellow-100",
    occupied:
      "bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-900/60 dark:border-blue-600 dark:text-blue-100",
    completed:
      "bg-gray-200 border-gray-300 text-gray-900 dark:bg-gray-700/70 dark:border-gray-500 dark:text-gray-50",
    cancelled:
      "bg-red-100 border-red-300 text-red-900 dark:bg-red-900/60 dark:border-red-600 dark:text-red-100",
  };

  const inactiveClasses =
    "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand/60 hover:text-brand dark:hover:text-emerald-300";

  return `${base} ${isActive ? activeClasses[status] : inactiveClasses}`;
}

/**
 * Отримати класи для статусу з підсвіткою для сьогоднішніх та просрочених
 */
function getStayStatusClass(
  status: StayStatus,
  checkIn?: string | null,
  checkOut?: string | null
): string {
  const today = new Date().toISOString().split("T")[0];
  const checkInDate = checkIn ? new Date(checkIn).toISOString().split("T")[0] : null;
  const checkOutDate = checkOut ? new Date(checkOut).toISOString().split("T")[0] : null;

  // Просрочені (checkIn < today для booked, checkOut < today для occupied)
  if (status === "booked" && checkInDate && checkInDate < today) {
    return "bg-red-600 text-white dark:bg-red-700 dark:text-red-100";
  }
  if (status === "occupied" && checkOutDate && checkOutDate < today) {
    return "bg-red-600 text-white dark:bg-red-700 dark:text-red-100";
  }

  // Сьогоднішні (checkIn === today для booked)
  if (status === "booked" && checkInDate === today) {
    return "bg-green-500 text-white dark:bg-green-600 dark:text-green-100";
  }

  // Стандартні класи
  const classes: Record<StayStatus, string> = {
    booked:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return classes[status] ?? "";
}

/**
 * Отримати лейбл для статусу
 */
function getStayStatusLabel(status: StayStatus): string {
  return t(`roomStays.status.${status}`) as string;
}

/**
 * Форматувати код бронювання
 */
function formatBookingCode(stay: StayListItem): string {
  return `${stay.room?.number ?? "?"}-${stay.stayId}`;
}

/**
 * Форматувати період проживання
 */
function formatStayPeriod(stay: { checkIn: string; checkOut: string }): string {
  const formatDate = (value?: string | null): string => {
    if (!value) {
      return "—";
    }
    return new Intl.DateTimeFormat(locale.value ?? undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  };

  const start = formatDate(stay.checkIn);
  const end = formatDate(stay.checkOut);
  return `${start} → ${end}`;
}

/**
 * Форматувати дату последнего изменения статуса
 */
function formatStatusChangedAt(value?: string | null): string {
  if (!value) {
    return "—";
  }
  return new Intl.DateTimeFormat(locale.value ?? undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
</script>

