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

        <div class="md:col-span-2">
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.address") }}*</label
          >
          <input
            v-model.trim="form.address"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.fields.address')"
            required
            autocomplete="off"
          />
        </div>
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

        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("hotelForm.fields.phone") }}</label
          >
          <input
            v-model.trim="form.phone"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('hotelForm.fields.phone')"
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
import { reactive, ref } from "vue";
import { useSuperHotelsStore } from "@/stores/superadmin";
import type { CreateAdminRequest } from "@/types/dto";
import Button from "../ui/Button.vue";
import { useLocale } from "@/composables/useLocale";

// Підключаємо стора супер-адміна
const store = useSuperHotelsStore();

// Підключаємо i18n
const { t } = useLocale();

// Стан форми: суворий тип DTO, без any
const form = reactive<CreateAdminRequest>({
  username: "",
  password: "",
  confirmPassword: "",
  hotel_name: "",
  address: "",
  // нижче — опційні поля (можуть бути пусті)
  full_name: "",
  phone: "",
  email: "",
  // Встановлюємо значення за замовчуванням (14/10)
  checkInHour: 14,
  checkOutHour: 10,
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

  // 2) Сабмітимо у стору
  try {
    submitting.value = true;
    await store.createHotelAdmin(form);

    // 3) Очищаємо форму після успішного створення
    form.username = "";
    form.password = "";
    form.confirmPassword = "";
    form.hotel_name = "";
    form.address = "";
    form.full_name = "";
    form.phone = "";
    form.email = "";
    form.checkInHour = 14;
    form.checkOutHour = 10;
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
