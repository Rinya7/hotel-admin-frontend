<!-- EditDatesModal.vue -->
<!-- Модальне вікно для редагування дат check-in та check-out -->
<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('update:modelValue', false)"
  >
    <div
      class="bg-white border border-brand dark:border-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-brand dark:text-white">
          {{ t("dashboard.needsAction.modals.editDates.title") }}
        </h3>
        <button
          @click="$emit('update:modelValue', false)"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <form @submit.prevent="handleSubmit" class="space-y-4 mb-6">
        <!-- Stay Info -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ t("dashboard.needsAction.view.table.room") }}:
            </span>
            <span class="text-sm text-gray-900 dark:text-gray-100">
              {{ stay?.roomNumber }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ t("dashboard.needsAction.view.table.guest") }}:
            </span>
            <span class="text-sm text-gray-900 dark:text-gray-100">
              {{ stay?.mainGuestName }}
            </span>
          </div>
        </div>

        <!-- Check-in Date -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {{ t("dashboard.needsAction.modals.editDates.checkIn") }}
          </label>
          <input
            v-model="form.checkIn"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            :min="minDate"
          />
          <p v-if="errors.checkIn" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.checkIn }}
          </p>
        </div>

        <!-- Check-out Date -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {{ t("dashboard.needsAction.modals.editDates.checkOut") }}
          </label>
          <input
            v-model="form.checkOut"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            :min="form.checkIn || minDate"
          />
          <p v-if="errors.checkOut" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.checkOut }}
          </p>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </p>
      </form>

      <!-- Actions -->
      <div class="flex gap-3 justify-end">
        <button
          @click="$emit('update:modelValue', false)"
          :disabled="loading"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ t("dashboard.needsAction.modals.editDates.cancel") }}
        </button>
        <button
          @click="handleSubmit"
          :disabled="loading || !isFormValid"
          class="px-4 py-2 bg-brand text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="loading" class="animate-spin">⏳</span>
          {{ t("dashboard.needsAction.modals.editDates.confirm") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useLocale } from "@/composables/useLocale";
import { useNeedsActionStore } from "@/stores/needsAction";
import { useNotifications } from "@/composables/useNotifications";
import type { StayNeedsAction } from "@/types/stays";

const { t } = useLocale();
const needsActionStore = useNeedsActionStore();
const { showSuccess, showError } = useNotifications();

interface Props {
  modelValue: boolean;
  stay: StayNeedsAction | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirmed: [];
}>();

/**
 * Мінімальна дата (сьогодні)
 */
const minDate = new Date().toISOString().split("T")[0];

const form = ref({
  checkIn: "",
  checkOut: "",
});

const loading = ref(false);
const error = ref<string | null>(null);
const errors = ref({
  checkIn: "",
  checkOut: "",
});

/**
 * Валідація форми
 */
const isFormValid = computed(() => {
  if (!form.value.checkIn || !form.value.checkOut) {
    return false;
  }

  const checkInDate = new Date(form.value.checkIn);
  const checkOutDate = new Date(form.value.checkOut);

  if (checkOutDate <= checkInDate) {
    return false;
  }

  return true;
});

/**
 * Ініціалізує форму з даними stay
 */
function initializeForm(): void {
  if (props.stay) {
    form.value.checkIn = props.stay.checkIn;
    form.value.checkOut = props.stay.checkOut;
  }
}

/**
 * Валідує форму
 */
function validateForm(): boolean {
  errors.value = { checkIn: "", checkOut: "" };

  if (!form.value.checkIn) {
    errors.value.checkIn = "Дата заїзду обов'язкова";
    return false;
  }

  if (!form.value.checkOut) {
    errors.value.checkOut = "Дата виїзду обов'язкова";
    return false;
  }

  const checkInDate = new Date(form.value.checkIn);
  const checkOutDate = new Date(form.value.checkOut);

  if (checkOutDate <= checkInDate) {
    errors.value.checkOut = "Дата виїзду повинна бути пізніше дати заїзду";
    return false;
  }

  return true;
}

/**
 * Скидає форму при закритті модального вікна
 */
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      initializeForm();
    } else {
      form.value = { checkIn: "", checkOut: "" };
      errors.value = { checkIn: "", checkOut: "" };
      error.value = null;
    }
  }
);

/**
 * Обробляє відправку форми
 */
async function handleSubmit(): Promise<void> {
  if (!props.stay) {
    error.value = "Stay не вибрано";
    return;
  }

  if (!validateForm()) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    await needsActionStore.resolveEditDates(props.stay.id, {
      checkIn: form.value.checkIn,
      checkOut: form.value.checkOut,
    });

    showSuccess("Дати успішно оновлено");
    emit("update:modelValue", false);
    emit("confirmed");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Не вдалося оновити дати";
    error.value = message;
    showError(message);
  } finally {
    loading.value = false;
  }
}
</script>

