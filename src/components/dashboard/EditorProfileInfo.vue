<!-- Компонент для отображения информации редактора, отеля и админа -->
<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
  >
    <div v-if="profile" class="space-y-6">
      <!-- Заголовок с именем редактора -->
      <div class="flex items-center gap-3">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-brand dark:text-white">
            {{ profile.editor.full_name || profile.editor.username }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ profile.editor.username }}
          </p>
        </div>
      </div>

      <!-- Контакты редактора -->
      <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h3 class="font-medium mb-3 text-brand dark:text-white">
          {{ t("editorProfileInfo.sections.contacts") }}
        </h3>
        <ul class="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>
            <b>{{ t("editorProfileInfo.fields.login") }}:</b> {{ profile.editor.username }}
          </li>
          <li>
            <b>{{ t("editorProfileInfo.fields.name") }}:</b> {{ profile.editor.full_name ?? "—" }}
          </li>
          <li>
            <b>{{ t("editorProfileInfo.fields.email") }}:</b> {{ profile.editor.email ?? "—" }}
          </li>
          <li>
            <b>{{ t("editorProfileInfo.fields.phone") }}:</b>
            {{
              profile.editor.phoneCountryCode && profile.editor.phoneNumber
                ? `${profile.editor.phoneCountryCode} ${profile.editor.phoneNumber}`
                : profile.editor.phone ?? "—"
            }}
          </li>
        </ul>
      </div>

      <!-- Информация об отеле -->
      <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h3 class="font-medium mb-3 text-brand dark:text-white">
          {{ t("editorProfileInfo.sections.hotelInformation") }}
        </h3>
        <ul class="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>
            <b>{{ t("editorProfileInfo.fields.hotelName") }}:</b>
            {{ profile.hotel.hotel_name ?? "—" }}
          </li>
          <li>
            <b>{{ t("editorProfileInfo.fields.address") }}:</b>
            {{ formatHotelAddress(profile.hotel) }}
          </li>
           
        </ul>
      </div>
    </div>
    <div v-else class="text-center py-4">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ t("editorProfileInfo.loading") }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { EditorProfile } from "@/types/hotel";
import { formatHotelAddress } from "@/utils/formatAddress";

interface Props {
  profile: EditorProfile | null;
}

defineProps<Props>();

const { t } = useI18n();
</script>

