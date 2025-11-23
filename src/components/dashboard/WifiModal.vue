<!-- WifiModal.vue -->
<!-- Модальне вікно для редагування Wi-Fi даних -->
<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('update:modelValue', false)"
  >
    <div
      class="bg-white border border-brand dark:border-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl flex flex-col"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6 flex-shrink-0">
        <h3 class="text-xl font-semibold text-brand dark:text-white">
          {{ t("dashboard.wifiModal.title") }}
        </h3>
        <button
          @click="$emit('update:modelValue', false)"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6 flex-1 overflow-y-auto">
        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <div class="flex items-center">
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
                {{ t("dashboard.wifiModal.networkName") }}
              </div>
            </label>
            <input
              v-model.trim="localForm.wifiName"
              type="text"
              :placeholder="t('dashboard.wifiModal.placeholderName')"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              required
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This will be updated for all rooms
            </p>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <div class="flex items-center">
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
                {{ t("dashboard.wifiModal.password") }}
              </div>
            </label>
            <input
              v-model.trim="localForm.wifiPassword"
              type="text"
              :placeholder="t('dashboard.wifiModal.placeholderPassword')"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand font-mono"
              required
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Password is visible for security purposes during editing
            </p>
          </div>
        </div>

        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div class="text-sm text-blue-800 dark:text-blue-200">
              <p class="font-medium mb-1">
                {{ t("dashboard.wifiModal.noteTitle") }}
              </p>
              <p>
                {{ t("dashboard.wifiModal.noteText") }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
        >
          <button
            type="button"
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {{ t("dashboard.wifiModal.cancel") }}
          </button>
          <button
            type="submit"
            :disabled="saving || !isValid"
            class="px-6 py-3 text-sm font-medium text-white bg-brand hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <span v-if="saving" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ t("dashboard.wifiModal.saving") }}
            </span>
            <span v-else class="flex items-center">
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
              {{ t("dashboard.wifiModal.save") }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// src/components/dashboard/WifiModal.vue
// Модальне вікно для редагування Wi-Fi даних

import { ref, computed, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import type { BulkWiFiRequest } from "@/types/rooms";

interface Props {
  modelValue: boolean;
  wifiName: string;
  wifiPassword: string;
  saving: boolean;
}

const props = defineProps<Props>();

const { t } = useI18n();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", payload: BulkWiFiRequest): void;
}>();

// Керування overflow body при відкритті/закритті модального вікна
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
  { immediate: true }
);

// Гарантуємо відновлення overflow при розмонтуванні
onUnmounted(() => {
  document.body.style.overflow = "";
});

// Локальна копія форми
const localForm = ref<BulkWiFiRequest>({
  wifiName: props.wifiName,
  wifiPassword: props.wifiPassword,
});

// Оновлюємо локальну форму при зміні props
watch(
  () => [props.wifiName, props.wifiPassword],
  ([newName, newPassword]) => {
    localForm.value.wifiName = newName;
    localForm.value.wifiPassword = newPassword;
  },
  { immediate: true }
);

// Валідація
const isValid = computed(() => {
  return (
    localForm.value.wifiName.trim().length > 0 &&
    localForm.value.wifiPassword.trim().length > 0
  );
});

// Обробка відправки форми
function handleSubmit(): void {
  if (!isValid.value) {
    return;
  }

  const payload: BulkWiFiRequest = {
    wifiName: localForm.value.wifiName.trim(),
    wifiPassword: localForm.value.wifiPassword.trim(),
  };

  emit("save", payload);
}
</script>

