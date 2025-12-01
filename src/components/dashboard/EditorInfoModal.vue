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

          <div class="ml-auto flex flex-col md:flex-row md:items-center gap-2">
            <!-- Выпадающее меню управления -->
            <div class="relative" ref="actionsDropdownRef">
              <button
                type="button"
                class="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors"
                :class="
                  editor.isBlocked
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-emerald-400 text-white hover:bg-emerald-500'
                "
                @click="toggleActionsDropdown"
              >
                <span>{{
                  editor.isBlocked
                    ? t("editorInfoModal.status.blocked")
                    : t("editorInfoModal.status.active")
                }}</span>
                <span class="text-xs" :class="{ 'rotate-180': isActionsDropdownOpen }">▼</span>
              </button>

              <!-- Выпадающее меню -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="isActionsDropdownOpen"
                  class="absolute top-full right-0 mt-1 min-w-[150px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    type="button"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-colors duration-150"
                    role="menuitem"
                    @click="handleEditClick"
                  >
                    {{ t("editorInfoModal.actions.edit") }}
                  </button>
                  <button
                    v-if="!editor.isBlocked"
                    type="button"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-colors duration-150 border-t border-gray-200 dark:border-gray-700"
                    role="menuitem"
                    @click="handleBlockClick"
                  >
                    {{ t("editorInfoModal.actions.block") }}
                  </button>
                  <button
                    v-else
                    type="button"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-brand hover:text-white dark:hover:bg-brand dark:hover:text-white transition-colors duration-150 border-t border-gray-200 dark:border-gray-700"
                    role="menuitem"
                    @click="handleUnblockClick"
                  >
                    {{ t("editorInfoModal.actions.unblock") }}
                  </button>
                  <button
                    type="button"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 border-t border-gray-200 dark:border-gray-700"
                    role="menuitem"
                    @click="handleDeleteClick"
                  >
                    {{ t("editorInfoModal.actions.delete") }}
                  </button>
                </div>
              </Transition>
            </div>

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
/**
 * EditorInfoModal with dropdown actions menu
 * - Shows status (active/blocked) as base button
 * - Dropdown menu with Edit, Block/Unblock, Delete actions
 */
import { ref, onMounted, onUnmounted } from "vue";
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

// Actions dropdown state
const isActionsDropdownOpen = ref(false);
const actionsDropdownRef = ref<HTMLElement | null>(null);

// Toggle actions dropdown menu
function toggleActionsDropdown(): void {
  isActionsDropdownOpen.value = !isActionsDropdownOpen.value;
}

// Close actions dropdown
function closeActionsDropdown(): void {
  isActionsDropdownOpen.value = false;
}

// Handle actions with menu close
function handleEditClick(): void {
  closeActionsDropdown();
  if (props.editor) {
    emit("edit", props.editor);
  }
}

function handleBlockClick(): void {
  closeActionsDropdown();
  if (props.editor) {
    emit("block", props.editor.id);
  }
}

function handleUnblockClick(): void {
  closeActionsDropdown();
  if (props.editor) {
    emit("unblock", props.editor.id);
  }
}

function handleDeleteClick(): void {
  closeActionsDropdown();
  if (props.editor) {
    emit("delete", props.editor.username);
  }
}

function close(): void {
  emit("close");
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent): void {
  if (
    actionsDropdownRef.value &&
    !actionsDropdownRef.value.contains(event.target as Node)
  ) {
    isActionsDropdownOpen.value = false;
  }
}

// Add/remove click outside listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString(locale.value || undefined);
}
</script>
