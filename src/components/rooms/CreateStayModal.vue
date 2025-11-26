<!-- CreateStayModal.vue — модальне вікно для створення бронювання -->
<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
    @click.self="handleClose"
  >
    <div
      class="w-full max-w-lg max-h-[90vh] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl flex flex-col"
    >
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-semibold text-brand dark:text-emerald-300">
          {{ t("roomStays.createStayModal.title") }}
        </h3>
        <button
          type="button"
          @click="handleClose"
          class="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            class="w-5 h-5"
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

      <form @submit.prevent="handleSubmit" class="flex flex-col flex-1 overflow-hidden">
        <div class="px-4 py-5 space-y-4 overflow-y-auto flex-1 min-h-0">
          <!-- Ім'я -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("roomStays.form.firstName") }}
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model.trim="formData.firstName"
              type="text"
              required
              :placeholder="t('roomStays.form.firstName')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          <!-- Прізвище -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("roomStays.form.lastName") }}
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model.trim="formData.lastName"
              type="text"
              required
              :placeholder="t('roomStays.form.lastName')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("roomStays.form.email") }}
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model.trim="formData.email"
              type="email"
              required
              :placeholder="t('roomStays.form.email')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          <!-- Телефон разделен на код страны и номер -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("roomStays.form.phoneCountryCode") }}
              <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.phoneCountryCode"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            >
              <option value="">
                {{ t("roomStays.form.placeholders.phoneCountryCode") }}
              </option>
              <option
                v-for="country in countries"
                :key="country.code"
                :value="country.phoneCode"
              >
                {{ country.phoneCode }} - {{ country.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("roomStays.form.phoneNumber") }}
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model.trim="formData.phoneNumber"
              type="tel"
              required
              :placeholder="t('roomStays.form.placeholders.phoneNumber')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              maxlength="13"
            />
          </div>

          <!-- Кількість гостей -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("roomStays.form.guestsCount") }}
              <span class="text-red-500">*</span>
              <span v-if="roomCapacity" class="text-xs text-gray-500 dark:text-gray-400">
                ({{ t("roomStays.form.maxGuests", { capacity: roomCapacity }) }})
              </span>
            </label>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="decreaseGuestsCount"
                :disabled="!formData.guestsCount || formData.guestsCount <= 1"
                class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                v-model.number="formData.guestsCount"
                type="number"
                min="1"
                required
                :max="roomCapacity || undefined"
                :placeholder="t('roomStays.form.guestsCount')"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand text-center"
                @input="validateGuestsCount"
              />
              <button
                type="button"
                @click="increaseGuestsCount"
                :disabled="roomCapacity ? formData.guestsCount >= roomCapacity : false"
                class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p v-if="roomCapacity" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {{ t("roomStays.form.capacityInfo", { capacity: roomCapacity }) }}
            </p>
          </div>

          <!-- Тип документа -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("roomStays.form.documentType") }}
            </label>
            <select
              v-model="formData.documentType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            >
              <option value="">{{ t("roomStays.form.placeholders.documentType") }}</option>
              <option value="passport">{{ t("roomStays.form.documentTypes.passport") }}</option>
              <option value="id_card">{{ t("roomStays.form.documentTypes.idCard") }}</option>
              <option value="driver_license">{{ t("roomStays.form.documentTypes.driverLicense") }}</option>
              <option value="other">{{ t("roomStays.form.documentTypes.other") }}</option>
            </select>
          </div>

          <!-- Номер документа (необов'язкове) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("roomStays.form.documentNumber") }}
            </label>
            <input
              v-model.trim="formData.documentNumber"
              type="text"
              :placeholder="t('roomStays.form.documentNumber')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>

          <!-- Дата народження (необов'язкове) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t("roomStays.form.birthDate") }}
            </label>
            <input
              v-model="formData.birthDate"
              type="date"
              :placeholder="t('roomStays.form.birthDate')"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>
        </div>

        <!-- Помилка -->
        <div
          v-if="error"
          class="mx-4 mb-4 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex-shrink-0"
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

        <div class="flex items-center justify-end gap-3 px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
          <button
            type="button"
            @click="handleClose"
            class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {{ t("roomStays.createStayModal.cancel") }}
          </button>
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="animate-pulse">…</span>
            <span>{{ t("roomStays.createStayModal.create") }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { getCountries } from "@/constants/countries";

interface Props {
  visible: boolean;
  checkIn: string;
  checkOut: string;
  isLoading: boolean;
  error: string | null;
  roomCapacity?: number | null; // Вместимость комнаты для валидации количества гостей
}

interface Emits {
  (e: "close"): void;
  (e: "submit", data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
    guestsCount: number | null;
    documentType: string;
    documentNumber: string;
    birthDate: string;
  }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t, locale } = useI18n();

const countries = computed(() => getCountries(locale.value as "uk" | "en" | "de" | "it"));

const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phoneCountryCode: "",
  phoneNumber: "",
  guestsCount: 1 as number,
  documentType: "",
  documentNumber: "",
  birthDate: "",
});

const error = ref("");

// Функции для управления количеством гостей
function increaseGuestsCount(): void {
  if (props.roomCapacity) {
    formData.guestsCount = Math.min(props.roomCapacity, (formData.guestsCount || 1) + 1);
  } else {
    formData.guestsCount = (formData.guestsCount || 1) + 1;
  }
}

function decreaseGuestsCount(): void {
  formData.guestsCount = Math.max(1, (formData.guestsCount || 1) - 1);
}

function validateGuestsCount(): void {
  if (props.roomCapacity && formData.guestsCount && formData.guestsCount > props.roomCapacity) {
    formData.guestsCount = props.roomCapacity;
  }
  if (formData.guestsCount && formData.guestsCount < 1) {
    formData.guestsCount = 1;
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      // Скидаємо форму
      formData.firstName = "";
      formData.lastName = "";
      formData.email = "";
      formData.phoneCountryCode = "";
      formData.phoneNumber = "";
      formData.guestsCount = 1;
      formData.documentType = "";
      formData.documentNumber = "";
      formData.birthDate = "";
      error.value = "";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

watch(
  () => props.error,
  (newError) => {
    if (newError) {
      error.value = newError;
    } else {
      // Сбрасываем ошибку, если она была очищена извне
      error.value = "";
    }
  },
  { immediate: true }
);

function handleClose(): void {
  emit("close");
}

function handleSubmit(): void {
  error.value = "";

  // Безопасная нормализация строк (обработка null/undefined)
  const normalizeString = (value: string | null | undefined): string => {
    if (value === null || value === undefined) {
      return "";
    }
    return String(value).trim();
  };

  // Валидация обязательных полей
  const normalizedFirstName = normalizeString(formData.firstName);
  if (!normalizedFirstName) {
    error.value = t("roomStays.messages.firstNameRequired") as string;
    return;
  }

  const normalizedLastName = normalizeString(formData.lastName);
  if (!normalizedLastName) {
    error.value = t("roomStays.messages.lastNameRequired") as string;
    return;
  }

  const normalizedEmail = normalizeString(formData.email);
  if (!normalizedEmail) {
    error.value = t("roomStays.messages.emailRequired") as string;
    return;
  }

  const normalizedPhoneCountryCode = normalizeString(formData.phoneCountryCode);
  if (!normalizedPhoneCountryCode) {
    error.value = t("roomStays.messages.phoneCountryCodeRequired") as string;
    return;
  }

  const normalizedPhoneNumber = normalizeString(formData.phoneNumber);
  if (!normalizedPhoneNumber) {
    error.value = t("roomStays.messages.phoneNumberRequired") as string;
    return;
  }

  // Валидация количества гостей
  if (formData.guestsCount === null || formData.guestsCount === undefined || formData.guestsCount < 1) {
    error.value = t("roomStays.messages.guestsCountRequired") as string;
    return;
  }

  // Проверка, что количество гостей не превышает вместимость комнаты
  if (props.roomCapacity && formData.guestsCount > props.roomCapacity) {
    error.value = t("roomStays.messages.guestsCountExceedsCapacity", { capacity: props.roomCapacity }) as string;
    return;
  }

  const submitData = {
    firstName: normalizedFirstName,
    lastName: normalizedLastName,
    email: normalizedEmail,
    phoneCountryCode: normalizedPhoneCountryCode,
    phoneNumber: normalizedPhoneNumber,
    guestsCount: formData.guestsCount,
    documentType: normalizeString(formData.documentType),
    documentNumber: normalizeString(formData.documentNumber),
    birthDate: normalizeString(formData.birthDate),
  };

  console.log("[CreateStayModal] Emitting submit with data:", submitData);
  console.log("[CreateStayModal] Data types:", {
    firstName: typeof submitData.firstName,
    lastName: typeof submitData.lastName,
    email: typeof submitData.email,
    phoneCountryCode: typeof submitData.phoneCountryCode,
    phoneNumber: typeof submitData.phoneNumber,
    guestsCount: typeof submitData.guestsCount,
  });

  emit("submit", submitData);
}
</script>
