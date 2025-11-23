<template>
    <div
      class="rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 p-6 space-y-4"
    >
      <h4 class="text-lg font-semibold text-brand dark:text-emerald-300">
        {{ t("roomStays.summary.nextStay.title") }}
      </h4>
  
      <p v-if="!stay" class="text-sm text-gray-500 dark:text-gray-400">
        {{ t("roomStays.summary.nextStay.empty") }}
      </p>
  
      <div v-else class="space-y-4">
  
        <!-- Guest -->
        <InfoItem
          :label="t('roomStays.summary.nextStay.guest')"
          :value="stay.mainGuestName"
        />
  
        <!-- Booking -->
        <InfoItem
          :label="t('roomStays.summary.nextStay.booking')"
          :value="formatBooking(stay)"
        />
  
        <!-- Dates -->
        <InfoItem
          :label="t('roomStays.summary.nextStay.dates')"
          :value="formatRange(stay)"
        />
  
        <!-- Status -->
        <div class="flex items-center gap-2 pt-2">
          <span class="info-label">
            {{ t("roomStays.summary.nextStay.status") }}:
          </span>
  
          <span
            :class="[getStatusClass(stay.status), 'px-3 py-1 text-xs font-semibold rounded-full']"
          >
            {{ t(`roomStays.status.${stay.status}`) }}
          </span>
        </div>
  
        <!-- Mark as current -->
        <p
          v-if="stay.status === 'occupied' && isActive(stay)"
          class="text-xs font-medium text-emerald-600 dark:text-emerald-300"
        >
          {{ t("roomStays.summary.nextStay.current") }}
        </p>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import type { Stay } from "@/types/stays";
import { useI18n } from "vue-i18n";
import InfoItem from "@/components/rooms/ui/InfoItem.vue";

const { t } = useI18n();
  
  interface Props {
    stay: Stay | null | undefined;
  }
  defineProps<Props>();
  
  function formatDate(date: string): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat("uk-UA").format(d);
  }
  
  function formatRange(stay: Stay): string {
    return `${formatDate(stay.checkIn)} → ${formatDate(stay.checkOut)}`;
  }
  
  function formatBooking(stay: Stay): string {
    return `${stay.room.roomNumber}-${stay.id}`;
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
  
  function isActive(stay: Stay): boolean {
    const now = Date.now();
    const start = new Date(stay.checkIn).getTime();
    const end = new Date(stay.checkOut).getTime();
    return start <= now && now <= end;
  }
  </script>
  
  <style scoped>
  .info-label {
    @apply text-sm text-gray-600 dark:text-gray-300 font-medium;
  }
  </style>
  