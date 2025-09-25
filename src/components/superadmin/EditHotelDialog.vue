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
      class="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-brand to-brand-light dark:from-brand dark:to-brand-light px-6 py-4"
      >
        <h3 class="text-xl font-bold text-white">
          {{ t("editHotelDialog.title") }}: {{ initial.username }}
        </h3>
      </div>

      <!-- Form Content -->
      <div class="p-6 dark:bg-gray-800">
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

            <!-- Address -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.address") }}</label
              >
              <input
                v-model.trim="form.address"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('editHotelDialog.fields.address')"
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

            <!-- Phone -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.phone") }}</label
              >
              <input
                v-model.trim="form.phone"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('editHotelDialog.fields.phone')"
              />
            </div>

            <!-- Logo URL -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-brand dark:text-white"
                >{{ t("editHotelDialog.fields.logoUrl") }}</label
              >
              <input
                v-model.trim="form.logo_url"
                class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
                :placeholder="t('editHotelDialog.fields.logoUrl')"
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

          <!-- Action Buttons -->
          <div
            class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
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
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { PublicAdminUser } from "@/types/hotel";
import type { UpdateHotelAdminRequest } from "@/types/dto";
import { useLocale } from "@/composables/useLocale";
import Button from "../ui/Button.vue";

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
const { t } = useLocale();

// Локальна копія редагованих полів: тільки те, що можна змінювати
const form = reactive<UpdateHotelAdminRequest>({
  hotel_name: "",
  address: "",
  full_name: "",
  phone: "",
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
      form.address = props.initial.address ?? "";
      form.full_name = props.initial.full_name ?? "";
      form.phone = props.initial.phone ?? "";
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

  // Віддаємо «патч» нагору
  emit("save", { ...form });
  // Закриємо модалку (батько вирішує, що робити після запиту)
  onClose();
  submitting.value = false;
}
</script>
