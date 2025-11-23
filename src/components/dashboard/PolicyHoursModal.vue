<!-- PolicyHoursModal.vue -->
<!-- Модальне вікно для редагування Policy Hours (Check-in/Check-out години) -->
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
          {{ t("dashboard.policyHoursModal.title") }}
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
              {{ t("dashboard.policyHoursModal.checkInHour") }}
            </label>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="decreaseCheckInHour"
                class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  ></path>
                </svg>
              </button>
              <input
                v-model.number="localForm.checkInHour"
                type="number"
                min="0"
                max="23"
                placeholder="14"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand text-center"
              />
              <button
                type="button"
                @click="increaseCheckInHour"
                class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t("dashboard.policyHoursModal.format24") }}
            </p>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ t("dashboard.policyHoursModal.checkOutHour") }}
            </label>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="decreaseCheckOutHour"
                class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  ></path>
                </svg>
              </button>
              <input
                v-model.number="localForm.checkOutHour"
                type="number"
                min="0"
                max="23"
                placeholder="10"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand text-center"
              />
              <button
                type="button"
                @click="increaseCheckOutHour"
                class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t("dashboard.policyHoursModal.format24") }}
            </p>
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
            {{ t("dashboard.policyHoursModal.cancel") }}
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
              {{ t("dashboard.policyHoursModal.saving") }}
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              {{ t("dashboard.policyHoursModal.save") }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// src/components/dashboard/PolicyHoursModal.vue
// Модальне вікно для редагування Policy Hours

import { ref, computed, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import type { BulkPolicyHoursRequest } from "@/types/rooms";

interface Props {
  modelValue: boolean;
  checkInHour: number | null;
  checkOutHour: number | null;
  saving: boolean;
}

const props = defineProps<Props>();

const { t } = useI18n();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save", payload: BulkPolicyHoursRequest): void;
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
const localForm = ref<BulkPolicyHoursRequest>({
  checkInHour: props.checkInHour,
  checkOutHour: props.checkOutHour,
});

// Оновлюємо локальну форму при зміні props
watch(
  () => [props.checkInHour, props.checkOutHour],
  ([newCheckIn, newCheckOut]) => {
    localForm.value.checkInHour = newCheckIn;
    localForm.value.checkOutHour = newCheckOut;
  },
  { immediate: true }
);

// Валідація
const isValid = computed(() => {
  const checkIn = localForm.value.checkInHour;
  const checkOut = localForm.value.checkOutHour;

  return (
    checkIn !== null &&
    checkOut !== null &&
    checkIn >= 0 &&
    checkIn <= 23 &&
    checkOut >= 0 &&
    checkOut <= 23
  );
});

// Функції для зміни годин
function increaseCheckInHour(): void {
  const current = localForm.value.checkInHour ?? 0;
  localForm.value.checkInHour = Math.min(23, current + 1);
}

function decreaseCheckInHour(): void {
  const current = localForm.value.checkInHour ?? 0;
  localForm.value.checkInHour = Math.max(0, current - 1);
}

function increaseCheckOutHour(): void {
  const current = localForm.value.checkOutHour ?? 0;
  localForm.value.checkOutHour = Math.min(23, current + 1);
}

function decreaseCheckOutHour(): void {
  const current = localForm.value.checkOutHour ?? 0;
  localForm.value.checkOutHour = Math.max(0, current - 1);
}

// Обробка відправки форми
function handleSubmit(): void {
  if (!isValid.value) {
    return;
  }

  const payload: BulkPolicyHoursRequest = {
    checkInHour: localForm.value.checkInHour
      ? Number(localForm.value.checkInHour)
      : null,
    checkOutHour: localForm.value.checkOutHour
      ? Number(localForm.value.checkOutHour)
      : null,
  };

  emit("save", payload);
}
</script>

