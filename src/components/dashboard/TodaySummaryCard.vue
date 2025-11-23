<!-- TodaySummaryCard.vue -->
<!-- Окрема картка для arrivals або departures -->
<template>
  <button
    @click="$emit('toggle')"
    :class="[
      'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
      isActive ? getActiveClasses() : getInactiveClasses(),
    ]"
  >
    <div class="flex items-center justify-between">
      <div>
        <strong :class="['text-sm block mb-1', getTitleClasses()]">
          {{ getTitle() }}
        </strong>
        <div :class="['text-3xl font-bold', getCountClasses()]">
          {{ stays.length }}
        </div>
        <p :class="['text-xs', getDescriptionClasses()]">
          {{ getDescription() }}
        </p>
        <!-- Список номеров -->
        <div v-if="stays.length > 0" class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="stay in stays.slice(0, 3)"
            :key="stay.stayId"
            :class="['px-2 py-1 text-xs rounded-full', getBadgeClasses()]"
          >
            {{ stay.room.number }}
          </span>
          <span
            v-if="stays.length > 3"
            :class="['px-2 py-1 text-xs rounded-full', getBadgeClasses()]"
          >
            +{{ stays.length - 3 }}
          </span>
        </div>
      </div>
      <div :class="['w-12 h-12 rounded-full flex items-center justify-center', getIconBgClasses()]">
        <component :is="getIconComponent()" class="w-6 h-6 text-white" />
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
// src/components/dashboard/TodaySummaryCard.vue
// Окрема картка для arrivals або departures

import { h } from "vue";
import { useI18n } from "vue-i18n";
import type { TodayStay } from "@/types/stays";

interface Props {
  type: "arrivals" | "departures";
  stays: TodayStay[];
  isActive: boolean;
}

const props = defineProps<Props>();

const { t } = useI18n();

defineEmits<{
  (e: "toggle"): void;
}>();

/**
 * Отримати класи для активної кнопки
 */
function getActiveClasses(): string {
  if (props.type === "arrivals") {
    return "border-white bg-blue-500/90 dark:bg-blue-700/90";
  }
  return "border-white bg-red-500/90 dark:bg-red-700/90";
}

/**
 * Отримати класи для неактивної кнопки
 */
function getInactiveClasses(): string {
  return "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50";
}

/**
 * Отримати класи для заголовка
 */
function getTitleClasses(): string {
  if (props.isActive) {
    if (props.type === "arrivals") {
      return "text-white dark:text-blue-300";
    }
    return "text-white dark:text-green-300";
  }
  if (props.type === "arrivals") {
    return "text-blue-800 dark:text-blue-200";
  }
  return "text-green-800 dark:text-green-200";
}

/**
 * Отримати класи для лічильника
 */
function getCountClasses(): string {
  if (props.isActive) {
    if (props.type === "arrivals") {
      return "text-white dark:text-blue-300";
    }
    return "text-white dark:text-green-300";
  }
  if (props.type === "arrivals") {
    return "text-blue-900 dark:text-blue-100";
  }
  return "text-green-900 dark:text-green-100";
}

/**
 * Отримати класи для опису
 */
function getDescriptionClasses(): string {
  if (props.isActive) {
    if (props.type === "arrivals") {
      return "text-white/80 dark:text-blue-300/80";
    }
    return "text-white/80 dark:text-green-300/80";
  }
  if (props.type === "arrivals") {
    return "text-blue-600 dark:text-blue-300";
  }
  return "text-green-600 dark:text-green-300";
}

/**
 * Отримати класи для badge номерів
 */
function getBadgeClasses(): string {
  if (props.isActive) {
    return "bg-white/20 text-white";
  }
  if (props.type === "arrivals") {
    return "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200";
  }
  return "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200";
}

/**
 * Отримати класи для фону іконки
 */
function getIconBgClasses(): string {
  if (props.isActive) {
    return "bg-white/20";
  }
  if (props.type === "arrivals") {
    return "bg-blue-500";
  }
  return "bg-green-500";
}

/**
 * Отримати компонент іконки
 */
function getIconComponent() {
  if (props.type === "arrivals") {
    return h("svg", {
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
    }, [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      }),
    ]);
  }
  return h("svg", {
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
  }, [
    h("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    }),
  ]);
}

/**
 * Отримати заголовок
 */
function getTitle(): string {
  return props.type === "arrivals"
    ? (t("dashboard.todaySummary.arrivals") as string)
    : (t("dashboard.todaySummary.departures") as string);
}

/**
 * Отримати опис
 */
function getDescription(): string {
  return props.type === "arrivals"
    ? (t("dashboard.todaySummary.guestsCheckingIn") as string)
    : (t("dashboard.todaySummary.roomsBecomingAvailable") as string);
}
</script>




