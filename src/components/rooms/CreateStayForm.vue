<!-- CreateStayForm.vue — спрощена форма з вибором дат та двома кнопками -->
<template>
  <details
    open
    class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4"
  >
    <summary
      class="text-lg font-medium text-brand dark:text-white cursor-pointer mb-4"
    >
      {{ t("roomStays.createNewStay") }}
    </summary>
    <div class="space-y-4">
      <!-- Вибір дат -->
      <div class="flex gap-2">
        <input
          v-model="checkIn"
          type="date"
          required
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
          @change="handleInput"
        />
        <input
          v-model="checkOut"
          type="date"
          required
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
          @change="handleInput"
        />
      </div>

      <!-- Повідомлення про помилку -->
      <div
        v-if="error"
        class="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      >
        <svg
          class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p class="text-sm text-red-700 dark:text-red-400 flex-1">{{ error }}</p>
        <button
          type="button"
          @click="error = ''"
          class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Дві кнопки дій -->
      <div class="flex gap-3 justify-center py-4">
        <button
          type="button"
          @click="handleCreateBooking"
          class="px-6 py-2.5 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
        >
          {{ t("roomStays.createBooking.button") }}
        </button>
        <button
          type="button"
          @click="handleCheckIn"
          :disabled="!canCheckInToday"
          :title="!canCheckInToday ? (t('roomStays.checkIn.disabledHint') as string) : undefined"
          class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ t("roomStays.checkIn.button") }}
        </button>
      </div>
      <p
        v-if="!canCheckInToday && checkIn"
        class="text-sm text-gray-500 dark:text-gray-400 text-center"
      >
        {{ t("roomStays.checkIn.hint") }}
      </p>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import type { Stay } from "@/types/stays";

interface Props {
  roomNumber: string;
  existingStays: Stay[];
}

interface Emits {
  (e: "openCreateModal", dates: { checkIn: string; checkOut: string }): void;
  (e: "checkIn", dates: { checkIn: string; checkOut: string }): void;
  (e: "error", message: string): void;
  (e: "warning", message: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();

const checkIn = ref("");
const checkOut = ref("");
const error = ref("");

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const canCheckInToday = computed(() => {
  if (!checkIn.value) {
    return false;
  }
  return checkIn.value === getTodayDate();
});

function hasActiveOverlap(newCheckIn: string, newCheckOut: string): boolean {
  if (!newCheckIn || !newCheckOut) {
    return false;
  }
  const start = new Date(`${newCheckIn}T00:00:00`);
  const end = new Date(`${newCheckOut}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }
  return props.existingStays.some((stay) => {
    if (!stay.checkIn || !stay.checkOut) {
      return false;
    }
    if (stay.status !== "booked" && stay.status !== "occupied") {
      return false;
    }
    const stayStart = new Date(`${stay.checkIn}T00:00:00`);
    const stayEnd = new Date(`${stay.checkOut}T00:00:00`);
    if (Number.isNaN(stayStart.getTime()) || Number.isNaN(stayEnd.getTime())) {
      return false;
    }
    // Перевірка перекриття: нове бронювання може починатися в день закінчення існуючого
    return start < stayEnd && end > stayStart;
  });
}

function validateDates(): boolean {
  error.value = "";

  if (!checkIn.value || !checkOut.value) {
    error.value = t("roomStays.messages.invalidData") as string;
    emit("error", error.value);
    return false;
  }

  if (checkOut.value <= checkIn.value) {
    error.value = t("roomStays.messages.invalidRange") as string;
    emit("error", error.value);
    return false;
  }

  if (hasActiveOverlap(checkIn.value, checkOut.value)) {
    const conflictMessage = t("roomStays.messages.dateConflict") as string;
    error.value = conflictMessage;
    emit("warning", conflictMessage);
    return false;
  }

  return true;
}

function handleInput(): void {
  error.value = "";
}

function handleCreateBooking(): void {
  if (!validateDates()) {
    return;
  }
  emit("openCreateModal", {
    checkIn: checkIn.value,
    checkOut: checkOut.value,
  });
}

function handleCheckIn(): void {
  if (!validateDates()) {
    return;
  }
  if (!canCheckInToday.value) {
    error.value = t("roomStays.checkIn.mustBeToday") as string;
    emit("error", error.value);
    return;
  }
  emit("checkIn", {
    checkIn: checkIn.value,
    checkOut: checkOut.value,
  });
}

function resetForm(): void {
  checkIn.value = "";
  checkOut.value = "";
  error.value = "";
}

defineExpose({
  resetForm,
});
</script>
