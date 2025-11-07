<template>
  <!-- Форма створення готелю (адміна-власника). -->
  <!-- Розбита на зрозумілі поля. Обов'язкові помічені *. -->
  <form class="space-y-6" @submit.prevent="onSubmit">
    <!-- Базові обов'язкові поля -->
    <div
      class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
    >
      <h3 class="text-lg font-semibold text-brand dark:text-white mb-4">
        {{ t("hotelForm.sections.basicInfo") }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.username") }}*</label
          >
          <input
            v-model.trim="form.username"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.fields.username')"
            required
            autocomplete="off"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.hotelName") }}*</label
          >
          <input
            v-model.trim="form.hotel_name"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.fields.hotelName')"
            required
            autocomplete="off"
          />
        </div>

        <!-- Детальная структура адреса -->
        <div class="md:col-span-2">
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.street") }}*</label
          >
          <input
            v-model.trim="form.street"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.street')"
            required
            autocomplete="off"
          />
        </div>
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.buildingNumber") }}</label
          >
          <input
            v-model.trim="form.buildingNumber"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.buildingNumber')"
            autocomplete="off"
          />
        </div>
        <!-- 
          Номер помещения (apartmentNumber) - скрыто для будущего использования
          Назначение: для аренды апартаментов, когда один отель/здание содержит несколько отдельных апартаментов
          Если нужно будет использовать - раскомментировать блок ниже
        -->
        <!-- <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.apartmentNumber") }}</label
          >
          <input
            v-model.trim="form.apartmentNumber"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.apartmentNumber')"
            autocomplete="off"
          />
        </div> -->
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.country") }}</label
          >
          <select
            v-model="form.country"
            class="w-full text-brand bg-white dark:bg-gray-700 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base focus:ring-2 focus:ring-brand focus:border-brand"
          >
            <option value="">{{ t("hotelForm.placeholders.country") }}</option>
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.code"
            >
              {{ country.name }}
            </option>
          </select>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.province") }}</label
          >
          <select
            v-model="form.province"
            class="w-full text-brand bg-white dark:bg-gray-700 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base focus:ring-2 focus:ring-brand focus:border-brand"
            :disabled="!form.country || form.country !== 'IT'"
          >
            <option value="">{{ t("hotelForm.placeholders.province") }}</option>
            <option
              v-for="province in italianProvinces"
              :key="province.code"
              :value="province.code"
            >
              {{ province.name }}
            </option>
          </select>
          <input
            v-if="form.country && form.country !== 'IT'"
            v-model.trim="form.province"
            class="w-full mt-2 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.province')"
            autocomplete="off"
          />
        </div>
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.postalCode") }}</label
          >
          <input
            v-model.trim="form.postalCode"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.postalCode')"
            autocomplete="off"
          />
        </div>
        <!-- Logo URL -->
        <div class="md:col-span-2">
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.logoUrl") }}</label
          >
          <input
            v-model.trim="form.logo_url"
            type="url"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.logoUrl')"
          />
        </div>
        <!-- Координаты заполняются автоматически, не показываем поля -->
      </div>
    </div>

    <!-- Паролі -->
    <div
      class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
    >
      <h3 class="text-lg font-semibold text-brand dark:text-white mb-4">
        {{ t("hotelForm.sections.security") }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.password") }}*</label
          >
          <input
            v-model="form.password"
            @input="validatePassword"
            type="password"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :class="{ 'border-red-500': passwordError }"
            :placeholder="t('hotelForm.fields.password')"
            required
            minlength="6"
            autocomplete="new-password"
          />
          <p
            v-if="passwordError"
            class="text-sm text-red-600 dark:text-red-400 mt-1"
          >
            {{ passwordError }}
          </p>
        </div>

        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.confirmPassword") }}*</label
          >
          <input
            v-model="form.confirmPassword"
            @input="validateConfirmPassword"
            type="password"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :class="{ 'border-red-500': confirmPasswordError }"
            :placeholder="t('hotelForm.fields.confirmPassword')"
            required
            minlength="6"
            autocomplete="new-password"
          />
          <p
            v-if="confirmPasswordError"
            class="text-sm text-red-600 dark:text-red-400 mt-1"
          >
            {{ confirmPasswordError }}
          </p>
        </div>
      </div>
    </div>

    <!-- Необов'язкові контактні поля -->
    <div
      class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
    >
      <h3 class="text-lg font-semibold text-brand dark:text-white mb-4">
        {{ t("hotelForm.sections.contactInfo") }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.fullName") }}</label
          >
          <input
            v-model.trim="form.full_name"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.fields.fullName')"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.email") }}</label
          >
          <input
            v-model.trim="form.email"
            type="email"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.fields.email')"
          />
        </div>

        <!-- Телефон разделен на код страны и номер -->
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.phoneCountryCode") }}</label
          >
          <select
            v-model="form.phoneCountryCode"
            class="w-full text-brand bg-white dark:bg-gray-700 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base focus:ring-2 focus:ring-brand focus:border-brand"
          >
            <option value="">
              {{ t("hotelForm.placeholders.phoneCountryCode") }}
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
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.phoneNumber") }}</label
          >
          <input
            v-model="formattedPhoneNumber"
            @input="handlePhoneInput"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.phoneNumber')"
            maxlength="13"
          />
        </div>
      </div>
    </div>

    <!-- Опційні політики заселення/виїзду (якщо порожньо — бек застосує дефолт) -->
    <div
      class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
    >
      <h3 class="text-lg font-semibold text-brand dark:text-white mb-4">
        {{ t("hotelForm.sections.checkinPolicies") }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.checkInHour") }}</label
          >
          <input
            v-model.number="form.checkInHour"
            type="number"
            min="0"
            max="23"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.checkInDefault')"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.checkOutHour") }}</label
          >
          <input
            v-model.number="form.checkOutHour"
            type="number"
            min="0"
            max="23"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.checkOutDefault')"
          />
        </div>
      </div>
    </div>

    <!-- WiFi інформація -->
    <div
      class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
    >
      <h3 class="text-lg font-semibold text-brand dark:text-white mb-4">
        {{ t("hotelForm.sections.wifiInfo") }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.wifiName") }}</label
          >
          <input
            v-model.trim="form.defaultWifiName"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.wifiName')"
            autocomplete="off"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.wifiPassword") }}</label
          >
          <input
            v-model="form.defaultWifiPassword"
            type="password"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.placeholders.wifiPassword')"
            autocomplete="new-password"
          />
        </div>
      </div>
    </div>

    <!-- Повідомлення про помилку (з фронт-валідації чи з бекенду) -->
    <p v-if="error" class="text-sm text-red-600 dark:text-red-400 text-center">
      {{ error }}
    </p>
    <p
      v-if="success"
      class="text-sm text-emerald-700 dark:text-emerald-400 text-center"
    >
      {{ success }}
    </p>

    <!-- Кнопка сабміту з індикатором стану -->
    <div class="flex items-center justify-center">
      <Button
        :loading="submitting"
        :disabled="submitting"
        variant="solid"
        size="md"
        type="submit"
      >
        {{
          submitting
            ? t("hotelForm.messages.creating")
            : t("hotelForm.messages.createHotel")
        }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
/**
 * Логіка форми:
 *  - тримаємо стан у reactive-об’єкті строго типізованим `CreateAdminRequest`;
 *  - робимо мінімальну фронт-валідацію (паролі, межі годин);
 *  - викликаємо store.createHotelAdmin(payload);
 *  - після успіху: очищаємо форму, показуємо повідомлення, рефреш уже зробить стор.
 */
import { reactive, ref, computed } from "vue";
import { useSuperHotelsStore } from "@/stores/superadmin";
import type { CreateAdminRequest } from "@/types/dto";
import Button from "../ui/Button.vue";
import { useLocale } from "@/composables/useLocale";
import { getCountries } from "@/constants/countries";
import { ITALIAN_PROVINCES } from "@/constants/italianProvinces";
import { formatPhoneNumber, normalizePhoneNumber } from "@/utils/formatPhone";
import {
  DEFAULT_PHONE_COUNTRY_CODE,
  DEFAULT_CHECK_IN_HOUR,
  DEFAULT_CHECK_OUT_HOUR,
} from "@/constants/defaults";

// Підключаємо стора супер-адміна
const store = useSuperHotelsStore();

// Підключаємо i18n
const { t, current } = useLocale();

// Константы для списков (локализованные названия стран)
const countries = getCountries(current.value as "uk" | "en" | "de" | "it");
const italianProvinces = ITALIAN_PROVINCES;

// Стан форми: суворий тип DTO, без any
const form = reactive<CreateAdminRequest>({
  username: "",
  password: "",
  confirmPassword: "",
  hotel_name: "",
  // Детальная структура адреса
  street: "", // Обязательное поле
  buildingNumber: "",
  apartmentNumber: "",
  country: "",
  province: "",
  postalCode: "",
  // Координаты заполняются автоматически, не нужно передавать
  // нижче — опційні поля (можуть бути пусті)
  full_name: "",
  phoneCountryCode: "",
  phoneNumber: "",
  email: "",
  logo_url: "",
  // Встановлюємо значення за замовчуванням (из constants/defaults.ts)
  checkInHour: DEFAULT_CHECK_IN_HOUR,
  checkOutHour: DEFAULT_CHECK_OUT_HOUR,
  // WiFi поля
  defaultWifiName: "",
  defaultWifiPassword: "",
});

// Локальні прапорці стану
const submitting = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

// Валідація паролів
const passwordError = ref<string | null>(null);
const confirmPasswordError = ref<string | null>(null);

// Форматирование телефона при отображении (111-111-11-11)
const formattedPhoneNumber = computed({
  get: () => formatPhoneNumber(form.phoneNumber),
  set: (value: string) => {
    // При изменении форматируем и сохраняем только цифры
    form.phoneNumber = normalizePhoneNumber(value);
  },
});

// Обработчик ввода телефона
function handlePhoneInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  // Сохраняем только цифры в форме
  form.phoneNumber = normalizePhoneNumber(value);
  // Обновляем отображаемое значение с форматированием
  target.value = formatPhoneNumber(form.phoneNumber);
}

// Допоміжна перевірка для годин
function isHour(v: unknown): v is number {
  return Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 23;
}

// Валідація паролів
function validatePassword(): void {
  if (form.password.length < 6) {
    passwordError.value = t("hotelForm.messages.passwordMinLength");
  } else {
    passwordError.value = null;
  }
}

function validateConfirmPassword(): void {
  if (form.confirmPassword && form.password !== form.confirmPassword) {
    confirmPasswordError.value = t("hotelForm.messages.passwordsMismatch");
  } else {
    confirmPasswordError.value = null;
  }
}

async function onSubmit(): Promise<void> {
  error.value = null;
  success.value = null;

  // Валідуємо паролі перед відправкою
  validatePassword();
  validateConfirmPassword();

  // 1) Мінімальна фронт-валідація
  if (form.password !== form.confirmPassword) {
    error.value = t("hotelForm.messages.passwordsMismatch");
    return;
  }

  // Перевіряємо чи є помилки валідації
  if (passwordError.value || confirmPasswordError.value) {
    error.value = t("hotelForm.messages.fixPasswordErrors");
    return;
  }
  if (
    form.checkInHour !== undefined &&
    form.checkInHour !== null &&
    !isHour(form.checkInHour)
  ) {
    error.value = t("hotelForm.messages.invalidHour");
    return;
  }
  if (
    form.checkOutHour !== undefined &&
    form.checkOutHour !== null &&
    !isHour(form.checkOutHour)
  ) {
    error.value = t("hotelForm.messages.invalidHour");
    return;
  }

  // 2) Нормализуем номер телефона (убираем форматирование) перед отправкой
  // Если код страны не выбран, используем значение по умолчанию
  const payload: CreateAdminRequest = {
    ...form,
    phoneCountryCode: form.phoneCountryCode || DEFAULT_PHONE_COUNTRY_CODE,
    phoneNumber: normalizePhoneNumber(form.phoneNumber), // Сохраняем только цифры
  };

  // 3) Сабмітимо у стору
  try {
    submitting.value = true;
    await store.createHotelAdmin(payload);

    // 3) Очищаємо форму після успішного створення
    form.username = "";
    form.password = "";
    form.confirmPassword = "";
    form.hotel_name = "";
    // Очищаем детальную структуру адреса
    form.street = "";
    form.buildingNumber = "";
    form.apartmentNumber = "";
    form.country = "";
    form.province = "";
    form.postalCode = "";
    form.full_name = "";
    form.phoneCountryCode = "";
    form.phoneNumber = "";
    form.email = "";
    form.logo_url = "";
    form.checkInHour = DEFAULT_CHECK_IN_HOUR;
    form.checkOutHour = DEFAULT_CHECK_OUT_HOUR;
    form.defaultWifiName = "";
    form.defaultWifiPassword = "";

    // Очищаємо помилки валідації
    passwordError.value = null;
    confirmPasswordError.value = null;

    success.value = t("hotelForm.messages.success");
  } catch (e) {
    // Показуємо людині зрозуміле повідомлення (бек може повернути 400/403)
    error.value =
      e instanceof Error ? e.message : t("hotelForm.messages.error");
  } finally {
    submitting.value = false;
  }
}
</script>
