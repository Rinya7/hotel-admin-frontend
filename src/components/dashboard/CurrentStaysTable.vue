<!-- CurrentStaysTable.vue -->
<!-- Компонент для відображення таблиці поточних проживань -->
<template>
  <section
    class="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-brand dark:text-white">
        {{ tableTitle }}
      </h3>
      <button
        @click="$emit('refresh')"
        :disabled="loading"
        class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? t("common.loading") : t("dashboard.refresh") }}
      </button>
    </div>

    <!-- Индикатор активных фильтров -->
    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div
        v-if="statusFilters.length > 0 || stayTypeFilters.length > 0"
        class="flex items-center gap-2"
      >
        <span class="text-sm text-gray-600 dark:text-gray-400">{{
          t("dashboard.activeFilters")
        }}:</span>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="status in statusFilters"
            :key="status"
            class="px-2 py-1 text-xs bg-brand/20 text-brand dark:text-brand-300 rounded-md"
          >
            {{ getStatusLabel(status) }}
          </span>
          <span
            v-for="type in stayTypeFilters"
            :key="type"
            class="px-2 py-1 text-xs rounded-md"
            :class="{
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                type === 'arrivals',
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                type === 'departures',
            }"
          >
            {{ getStayTypeLabel(type) }}
          </span>
          <button
            @click="$emit('clear-filters')"
            class="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-md transition-colors"
          >
            {{ t("dashboard.clearAll") }}
          </button>
        </div>
      </div>
      <input
        :value="searchQuery"
        @input="(e) => $emit('update:search-query', (e.target as HTMLInputElement).value)"
        type="text"
        :placeholder="t('dashboard.table.roomNumberSearchPlaceholder')"
        class="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
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
              {{ t("dashboard.table.roomNumber") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.table.floor") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.table.capacity") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.table.status") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.table.arrivalDate") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.table.departureDate") }}
            </th>
            <th class="px-4 py-3 text-left">
              {{ t("dashboard.table.actions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Состояние загрузки -->
          <tr v-if="loading">
            <td
              colspan="7"
              class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
            >
              {{ t("dashboard.loading") }}
            </td>
          </tr>

          <!-- Ошибка загрузки -->
          <tr v-else-if="error">
            <td
              colspan="7"
              class="px-4 py-6 text-center text-red-600 dark:text-red-400"
            >
              {{ error }}
            </td>
          </tr>

          <!-- Нет данных -->
          <tr v-else-if="filteredRooms.length === 0">
            <td
              colspan="7"
              class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
            >
              {{
                searchQuery.trim().length > 0 ||
                statusFilters.length > 0 ||
                stayTypeFilters.length > 0
                  ? t("dashboard.noRoomsMatch")
                  : t("dashboard.noRoomsFound")
              }}
            </td>
          </tr>
          <tr
            v-else
            v-for="room in filteredRooms"
            :key="room.id"
            class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">
              {{ room.roomNumber }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ room.floor }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ room.capacity }}
            </td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 text-xs rounded-full block text-center"
                :class="getStatusClass(room)"
              >
                {{ room.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ getRoomArrivalDate(room) }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ getRoomDepartureDate(room) }}
            </td>
            <td class="px-4 py-3">
              <RouterLink
                :to="{
                  name: 'room-stays',
                  params: { roomNumber: room.roomNumber },
                }"
                class="inline-flex items-center px-3 py-1 text-xs font-medium text-brand bg-brand/10 hover:bg-brand/20 dark:text-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20 rounded-md transition-colors"
              >
                {{ t("dashboard.viewRoom") }}
                <svg
                  class="w-3 h-3 ml-1"
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
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// src/components/dashboard/CurrentStaysTable.vue
// Компонент для відображення таблиці поточних проживань

import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import type { Room, RoomStatus } from "@/types/rooms";
import type { TodayStay } from "@/types/stays";

interface Props {
  loading: boolean;
  error: string | null;
  filteredRooms: Room[];
  statusFilters: RoomStatus[];
  stayTypeFilters: string[];
  searchQuery: string;
  tableTitle: string;
  todayArrivals: TodayStay[];
  todayDepartures: TodayStay[];
  currentStays: Array<{ room: { roomNumber: string }; checkIn: string; checkOut: string }>;
}

const props = defineProps<Props>();

const { t } = useI18n();

defineEmits<{
  (e: "refresh"): void;
  (e: "clear-filters"): void;
  (e: "update:search-query", value: string): void;
}>();

/**
 * Отримати класи для статусу з підсвіткою для free кімнат з заїздом сьогодні
 */
function getStatusClass(room: Room): string {
  // Перевіряємо, чи є заїзд сьогодні для цієї кімнати
  const hasArrivalToday = props.todayArrivals.some(
    (stay) => stay.room.number === room.roomNumber
  );
  
  // Якщо статус free і є заїзд сьогодні - жовтий колір
  if (room.status === "free" && hasArrivalToday) {
    return "bg-yellow-400 text-yellow-900 dark:bg-yellow-600 dark:text-yellow-100";
  }
  
  // Стандартні класи
  const classes: Record<RoomStatus, string> = {
    free: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    occupied: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    cleaning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };
  return classes[room.status] ?? "";
}

/**
 * Отримати лейбл для статусу
 */
function getStatusLabel(status: RoomStatus): string {
  return t(`dashboard.stats.${status}`) as string;
}

/**
 * Отримати лейбл для типу проживання
 */
function getStayTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    current: "Current",
    arrivals: "Arrival",
    departures: "Departure",
  };
  return labels[type] ?? type;
}

/**
 * Отримати дату заїзду для кімнати
 */
function getRoomArrivalDate(room: Room): string {
  // Приоритет 1: Ищем заезд сегодня для этой комнаты
  const arrival = props.todayArrivals.find(
    (stay) => stay.room.number === room.roomNumber
  );
  if (arrival) {
    return arrival.checkIn;
  }

  // Приоритет 2: Ищем выезд сегодня для этой комнаты (может быть заезд в тот же день)
  const departure = props.todayDepartures.find(
    (stay) => stay.room.number === room.roomNumber
  );
  if (departure) {
    return departure.checkIn;
  }

  // Приоритет 3: Ищем текущее проживание для этой комнаты
  const currentStay = props.currentStays.find(
    (stay) => stay.room.roomNumber === room.roomNumber
  );
  if (currentStay) {
    return currentStay.checkIn;
  }

  return "—";
}

/**
 * Отримати дату виїзду для кімнати
 */
function getRoomDepartureDate(room: Room): string {
  // Приоритет 1: Ищем выезд сегодня для этой комнаты
  const departure = props.todayDepartures.find(
    (stay) => stay.room.number === room.roomNumber
  );
  if (departure) {
    return departure.checkOut;
  }

  // Приоритет 2: Ищем заезд сегодня для этой комнаты (может быть выезд в тот же день)
  const arrival = props.todayArrivals.find(
    (stay) => stay.room.number === room.roomNumber
  );
  if (arrival) {
    return arrival.checkOut;
  }

  // Приоритет 3: Ищем текущее проживание для этой комнаты
  const currentStay = props.currentStays.find(
    (stay) => stay.room.roomNumber === room.roomNumber
  );
  if (currentStay) {
    return currentStay.checkOut;
  }

  return "—";
}
</script>

