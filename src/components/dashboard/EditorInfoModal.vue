<!-- Модалка с полной информацией о редакторе (по аналогии с SaHotelDetail) -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto"
    >
      <div v-if="editor" class="p-6 space-y-6">
        <!-- Заголовок + кнопки действий -->
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-lg bg-brand/10 dark:bg-emerald-400/10 flex items-center justify-center">
            <svg
              class="w-8 h-8 text-brand dark:text-emerald-400"
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
            <h1 class="text-2xl font-semibold text-brand dark:text-white">
              {{ editor.full_name || editor.username }}
            </h1>
            <div class="text-gray-500 dark:text-gray-400">
              {{ editor.username }}
            </div>
          </div>

          <div class="ml-auto flex items-center gap-2">
            <span
              :class="
                editor.isBlocked
                  ? 'bg-red-600 py-[2px] px-[10px] rounded-lg text-white'
                  : 'bg-emerald-400 py-[2px] px-[10px] rounded-lg text-white'
              "
            >
              {{
                editor.isBlocked
                  ? t("editorInfoModal.status.blocked")
                  : t("editorInfoModal.status.active")
              }}
            </span>

            <button
              class="btn btn-sm underline"
              @click="handleEdit"
            >
              {{ t("editorInfoModal.actions.edit") }}
            </button>

            <button
              v-if="!editor.isBlocked"
              class="btn btn-sm btn-warning underline"
              @click="handleBlock"
            >
              {{ t("editorInfoModal.actions.block") }}
            </button>
            <button
              v-else
              class="btn btn-sm btn-success underline"
              @click="handleUnblock"
            >
              {{ t("editorInfoModal.actions.unblock") }}
            </button>

            <button
              class="btn btn-sm btn-error underline"
              @click="handleDelete"
            >
              {{ t("editorInfoModal.actions.delete") }}
            </button>

            <button
              class="btn btn-sm underline"
              @click="close"
            >
              {{ t("editorInfoModal.actions.back") }}
            </button>
          </div>
        </div>

        <!-- Карточки с информацией о редакторе -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
          >
            <h2 class="font-medium mb-3 text-brand dark:text-white">
              {{ t("editorInfoModal.sections.contacts") }}
            </h2>
            <ul class="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.login") }}:</b
                >
                {{ editor.username }}
              </li>
              <li>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.name") }}:</b
                >
                {{ editor.full_name ?? "—" }}
              </li>
              <li>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.email") }}:</b
                >
                {{ editor.email ?? "—" }}
              </li>
              <li>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.phone") }}:</b
                >
                {{
                  editor.phoneCountryCode && editor.phoneNumber
                    ? `${editor.phoneCountryCode} ${editor.phoneNumber}`
                    : editor.phone ?? "—"
                }}
              </li>
            </ul>
          </div>

          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
          >
            <h2 class="font-medium mb-3 text-brand dark:text-white">
              {{ t("editorInfoModal.sections.status") }}
            </h2>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.role") }}:</b
                >
                {{ t("editorInfoModal.fields.roleEditor") }}
              </div>
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.status") }}:</b
                >
                <span
                  :class="
                    editor.isBlocked
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  "
                >
                  {{
                    editor.isBlocked
                      ? t("editorInfoModal.status.blocked")
                      : t("editorInfoModal.status.active")
                  }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
          >
            <h2 class="font-medium mb-3 text-brand dark:text-white">
              {{ t("editorInfoModal.sections.userStats") }}
            </h2>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.created") }}:</b
                >
                {{ formatDate(editor.createdAt) }}
              </div>
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.updated") }}:</b
                >
                {{ formatDate(editor.updatedAt) }}
              </div>
            </div>
          </div>
        </section>

        <!-- Информация об отеле и админе -->
        <section v-if="hotel" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Информация об отеле -->
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
          >
            <h2 class="font-medium mb-3 text-brand dark:text-white">
              {{ t("editorInfoModal.sections.hotelInfo") }}
            </h2>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.hotelName") }}:</b
                >
                {{ hotel.hotel_name ?? "—" }}
              </div>
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.address") }}:</b
                >
                <div class="text-gray-600 dark:text-gray-400 mt-1">
                  {{ formatHotelAddress(hotel) }}
                </div>
              </div>
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.checkInTime") }}:</b
                >
                {{ hotel.checkInHour ?? t("editorInfoModal.fields.default") }}
              </div>
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.checkOutTime") }}:</b
                >
                {{ hotel.checkOutHour ?? t("editorInfoModal.fields.default") }}
              </div>
            </div>
          </div>

          <!-- Информация об админе (владельце отеля) -->
          <div
            class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:col-span-2"
          >
            <h2 class="font-medium mb-3 text-brand dark:text-white">
              {{ t("editorInfoModal.sections.adminInfo") }}
            </h2>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.login") }}:</b
                >
                {{ hotel.username }}
              </div>
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.owner") }}:</b
                >
                {{ hotel.full_name ?? "—" }}
              </div>
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.email") }}:</b
                >
                {{ hotel.email ?? "—" }}
              </div>
              <div>
                <b class="text-brand dark:text-white"
                  >{{ t("editorInfoModal.fields.phone") }}:</b
                >
                {{
                  hotel.phoneCountryCode && hotel.phoneNumber
                    ? `${hotel.phoneCountryCode} ${hotel.phoneNumber}`
                    : hotel.phone ?? "—"
                }}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { PublicAdminUser } from "@/types/hotel";
import { formatHotelAddress } from "@/utils/formatAddress";

interface Props {
  show: boolean;
  editor: PublicAdminUser["editors"][number] | null;
  hotel: PublicAdminUser | null; // Информация об отеле и админе
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "edit", editor: PublicAdminUser["editors"][number]): void;
  (e: "block", editorId: number): void;
  (e: "unblock", editorId: number): void;
  (e: "delete", username: string): void;
}>();

const { t, locale } = useI18n();

function close(): void {
  emit("close");
}

function handleEdit(): void {
  if (props.editor) {
    emit("edit", props.editor);
  }
}

function handleBlock(): void {
  if (props.editor) {
    emit("block", props.editor.id);
  }
}

function handleUnblock(): void {
  if (props.editor) {
    emit("unblock", props.editor.id);
  }
}

function handleDelete(): void {
  if (props.editor) {
    emit("delete", props.editor.username);
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString(locale.value || undefined);
}
</script>
