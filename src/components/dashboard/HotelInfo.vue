<!-- Компонент для отображения информации об отеле -->
<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
  >
    <!-- Заголовок с иконкой -->
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-lg bg-brand/10 dark:bg-emerald-400/10 flex items-center justify-center">
        <svg
          class="w-6 h-6 text-brand dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </div>
      <h2 class="text-lg font-semibold text-brand dark:text-white">
        {{ hotel?.hotel_name || t("hotelInfo.title") }}
      </h2>
    </div>

    <!-- Адрес -->
    <div v-if="hotel" class="mb-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ formatHotelAddress(hotel) }}
      </p>
    </div>

    <!-- Контакты -->
    <div v-if="hotel" class="space-y-2">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ t("hotelInfo.sections.contacts") }}
      </h3>
      <ul class="text-sm space-y-1 text-gray-700 dark:text-gray-300">
        <li>
          <span class="font-medium text-brand dark:text-white"
            >{{ t("hotelInfo.fields.login") }}:</span
          >
          {{ hotel.username || "—" }}
        </li>
        <li>
          <span class="font-medium text-brand dark:text-white"
            >{{ t("hotelInfo.fields.owner") }}:</span
          >
          {{ hotel.full_name || "—" }}
        </li>
        <li>
          <span class="font-medium text-brand dark:text-white"
            >{{ t("hotelInfo.fields.email") }}:</span
          >
          {{ hotel.email || "—" }}
        </li>
        <li>
          <span class="font-medium text-brand dark:text-white"
            >{{ t("hotelInfo.fields.phone") }}:</span
          >
          {{
            hotel.phoneCountryCode && hotel.phoneNumber
              ? `${hotel.phoneCountryCode} ${hotel.phoneNumber}`
              : hotel.phone || "—"
          }}
        </li>
      </ul>
    </div>
    <div v-else class="text-center py-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ t("hotelInfo.loading") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { PublicAdminUser } from "@/types/hotel";
import { formatHotelAddress } from "@/utils/formatAddress";

interface Props {
  hotel: PublicAdminUser | null;
}

defineProps<Props>();

const { t } = useI18n();
</script>

