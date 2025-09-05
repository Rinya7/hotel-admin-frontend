<template>
  <!-- Простий модальний діалог без бібліотек -->
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/40" @click="onClose"></div>

    <div class="relative w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
      <h3 class="text-lg font-semibold mb-4">
        Редагувати готель: {{ initial.username }}
      </h3>

      <form class="space-y-3" @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Назва готелю</label>
            <input
              v-model.trim="form.hotel_name"
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Адреса</label>
            <input
              v-model.trim="form.address"
              class="input input-bordered w-full"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"
              >Імʼя власника</label
            >
            <input
              v-model.trim="form.full_name"
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Email</label>
            <input
              v-model.trim="form.email"
              type="email"
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Телефон</label>
            <input
              v-model.trim="form.phone"
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1"
              >Логотип (URL)</label
            >
            <input
              v-model.trim="form.logo_url"
              class="input input-bordered w-full"
            />
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"
              >Check-in (0..23, або порожньо)</label
            >
            <input
              v-model.number="form.checkInHour"
              type="number"
              min="0"
              max="23"
              class="input input-bordered w-full"
            />
            <small class="text-gray-400"
              >Постав null (в полі введи "null") щоб слідувати дефолту
              готелю</small
            >
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"
              >Check-out (0..23, або порожньо)</label
            >
            <input
              v-model.number="form.checkOutHour"
              type="number"
              min="0"
              max="23"
              class="input input-bordered w-full"
            />
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <div class="mt-4 flex gap-2 justify-end">
          <button type="button" class="btn" @click="onClose">Скасувати</button>
          <button class="btn btn-primary" :disabled="submitting">
            {{ submitting ? "Зберігаємо..." : "Зберегти" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import type { PublicAdminUser } from "@/types/hotel";
import type { UpdateHotelAdminRequest } from "@/types/dto";

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
    error.value = "checkInHour має бути 0..23 або null";
    submitting.value = false;
    return;
  }
  if (
    typeof form.checkOutHour !== "undefined" &&
    !isHourOrNull(form.checkOutHour)
  ) {
    error.value = "checkOutHour має бути 0..23 або null";
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
