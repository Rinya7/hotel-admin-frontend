<template>
  <!-- Простий модальний діалог без бібліотек -->
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="onClose"
    ></div>

    <div
      class="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div
        class="flex-shrink-0 bg-gradient-to-r from-brand to-brand-light dark:from-brand dark:to-brand-light px-6 py-4"
      >
        <h3 class="text-xl font-bold text-white">
          {{ t("editHotelDialog.title") }}: {{ initial.username }}
        </h3>
      </div>

      <!-- Form Content (scrollable) -->
      <div class="flex-1 overflow-y-auto p-6 dark:bg-gray-800">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Hotel Name -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.hotelName") }}</label
              >
              <input
                v-model.trim="form.hotel_name"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('editHotelDialog.fields.hotelName')"
              />
            </div>

            <!-- Детальная структура адреса -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.street") }}</label
              >
              <input
                v-model.trim="form.street"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('hotelForm.placeholders.street')"
              />
            </div>
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.buildingNumber") }}</label
              >
              <input
                v-model.trim="form.buildingNumber"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('hotelForm.placeholders.buildingNumber')"
              />
            </div>
            <!-- 
              Номер помещения (apartmentNumber) - скрыто для будущего использования
              Назначение: для аренды апартаментов, когда один отель/здание содержит несколько отдельных апартаментов
              Если нужно будет использовать - раскомментировать блок ниже
            -->
            <!-- <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.apartmentNumber") }}</label
              >
              <input
                v-model.trim="form.apartmentNumber"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('hotelForm.placeholders.apartmentNumber')"
              />
            </div> -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.country") }}</label
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
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.province") }}</label
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
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.postalCode") }}</label
              >
              <input
                v-model.trim="form.postalCode"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('hotelForm.placeholders.postalCode')"
              />
            </div>
            <!-- Координаты заполняются автоматически, не показываем -->

            <!-- Logo URL -->
            <div class="space-y-2 md:col-span-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.logoUrl") }}</label
              >
              <input
                v-model.trim="form.logo_url"
                type="url"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('hotelForm.placeholders.logoUrl')"
              />
            </div>

            <!-- Owner Name -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.fullName") }}</label
              >
              <input
                v-model.trim="form.full_name"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('editHotelDialog.fields.fullName')"
              />
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.email") }}</label
              >
              <input
                v-model.trim="form.email"
                type="email"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('editHotelDialog.fields.email')"
              />
            </div>

            <!-- Телефон разделен на код страны и номер -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.phoneCountryCode") }}</label
              >
              <select
                v-model="form.phoneCountryCode"
                class="w-full text-brand bg-white dark:bg-gray-700 dark:text-white px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base focus:ring-2 focus:ring-brand focus:border-brand"
              >
                <option value="">{{ t("hotelForm.placeholders.phoneCountryCode") }}</option>
                <option
                  v-for="country in countries"
                  :key="country.code"
                  :value="country.phoneCode"
                >
                  {{ country.phoneCode }} - {{ country.name }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.phoneNumber") }}</label
              >
              <input
                v-model="formattedPhoneNumber"
                @input="handlePhoneInput"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('hotelForm.placeholders.phoneNumber')"
                maxlength="13"
              />
            </div>

            <!-- Check-in Hour -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.checkInHour") }}</label
              >
              <input
                v-model.number="form.checkInHour"
                type="number"
                min="0"
                max="23"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="0-23"
              />
              <small class="text-gray-500 dark:text-gray-400 text-xs">{{
                t("editHotelDialog.messages.defaultNote")
              }}</small>
            </div>

            <!-- Check-out Hour -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.checkOutHour") }}</label
              >
              <input
                v-model.number="form.checkOutHour"
                type="number"
                min="0"
                max="23"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="0-23"
              />
            </div>
          </div>

          <!-- Error Message -->
          <p v-if="error" class="text-red-600 dark:text-red-400 text-center">
            {{ error }}
          </p>
        </form>
      </div>

      <!-- Action Buttons (fixed footer) -->
      <div
        class="flex-shrink-0 flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
            <Button type="button" variant="outline" @click="onClose">
              {{ t("editHotelDialog.messages.cancel") }}
            </Button>
            <Button
              type="submit"
              variant="solid"
              :loading="submitting"
              :disabled="submitting"
            >
              {{
                submitting
                  ? t("editHotelDialog.messages.saving")
                  : t("editHotelDialog.messages.save")
              }}
            </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import type { PublicAdminUser } from "@/types/hotel";
import type { UpdateHotelAdminRequest } from "@/types/dto";
import { useLocale } from "@/composables/useLocale";
import Button from "../ui/Button.vue";
import { getCountries } from "@/constants/countries";
import { ITALIAN_PROVINCES } from "@/constants/italianProvinces";
import { formatPhoneNumber, normalizePhoneNumber } from "@/utils/formatPhone";
import { DEFAULT_PHONE_COUNTRY_CODE } from "@/constants/defaults";

/**
 * Вхідні параметри:
 * - modelValue: керує видимістю модалки (v-model)
 * - initial: початкові дані готелю (із таблиці)
 */
const props = defineProps<{
  modelValue: boolean;
  initial: PublicAdminUser;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "save", payload: UpdateHotelAdminRequest): void;
}>();

// Підключаємо i18n
const { t, current } = useLocale();

// Константы для списков (локализованные названия стран)
const countries = getCountries(current.value as "uk" | "en" | "de" | "it");
const italianProvinces = ITALIAN_PROVINCES;

// Локальна копія редагованих полів: тільки те, що можна змінювати
const form = reactive<UpdateHotelAdminRequest>({
  hotel_name: "",
  // Детальная структура адреса
  street: "",
  buildingNumber: "",
  apartmentNumber: "",
  country: "",
  province: "",
  postalCode: "",
  // Координаты заполняются автоматически
  full_name: "",
  phoneCountryCode: "",
  phoneNumber: "",
  email: "",
  logo_url: "",
  checkInHour: undefined,
  checkOutHour: undefined,
});

const submitting = ref(false);
const error = ref<string | null>(null);

// Коли відкриваємо модалку — заповнюємо з initial
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      form.hotel_name = props.initial.hotel_name ?? "";
      // Заполняем детальную структуру адреса
      form.street = props.initial.street ?? "";
      form.buildingNumber = props.initial.buildingNumber ?? "";
      form.apartmentNumber = props.initial.apartmentNumber ?? "";
      form.country = props.initial.country ?? "";
      form.province = props.initial.province ?? "";
      form.postalCode = props.initial.postalCode ?? "";
      form.full_name = props.initial.full_name ?? "";
      form.phoneCountryCode = props.initial.phoneCountryCode ?? "";
      form.phoneNumber = props.initial.phoneNumber ?? "";
      form.email = props.initial.email ?? "";
      form.logo_url = props.initial.logo_url ?? "";
      form.checkInHour = props.initial.checkInHour ?? undefined;
      form.checkOutHour = props.initial.checkOutHour ?? undefined;
      error.value = null;
    }
  },
  { immediate: true }
);

function onClose(): void {
  emit("update:modelValue", false);
}

function isHourOrNull(v: unknown): v is number | null {
  return (
    v === null ||
    (Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 23)
  );
}

// Форматирование телефона при отображении (111-111-11-11)
const formattedPhoneNumber = computed({
  get: () => formatPhoneNumber(form.phoneNumber ?? ""),
  set: (value: string) => {
    form.phoneNumber = normalizePhoneNumber(value) || undefined;
  },
});

// Обработчик ввода телефона
function handlePhoneInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  form.phoneNumber = normalizePhoneNumber(value) || undefined;
  target.value = formatPhoneNumber(form.phoneNumber ?? "");
}

async function onSubmit(): Promise<void> {
  error.value = null;
  submitting.value = true;

  // Простий контроль годин
  if (
    typeof form.checkInHour !== "undefined" &&
    !isHourOrNull(form.checkInHour)
  ) {
    error.value = t("editHotelDialog.messages.invalidHour");
    submitting.value = false;
    return;
  }
  if (
    typeof form.checkOutHour !== "undefined" &&
    !isHourOrNull(form.checkOutHour)
  ) {
    error.value = t("editHotelDialog.messages.invalidHourOut");
    submitting.value = false;
    return;
  }

  // Нормализуем номер телефона перед отправкой (убираем форматирование)
  // Если код страны не выбран и есть номер телефона, используем значение по умолчанию
  const payload: UpdateHotelAdminRequest = {
    ...form,
    phoneCountryCode:
      form.phoneCountryCode || (form.phoneNumber ? DEFAULT_PHONE_COUNTRY_CODE : undefined),
    phoneNumber: form.phoneNumber ? normalizePhoneNumber(form.phoneNumber) : undefined,
  };

  // Віддаємо «патч» нагору
  emit("save", payload);
  // Закриємо модалку (батько вирішує, що робити після запиту)
  onClose();
  submitting.value = false;
}
</script>
