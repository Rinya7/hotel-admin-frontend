<template>
  <!-- Форма создания номера -->
  <form class="space-y-6" @submit.prevent="onSubmit">
    <!-- Основные поля -->
    <div
      class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-100 dark:bg-gray-800"
    >
      <h3 class="text-lg font-semibold text-brand dark:text-white mb-4">
        {{ t("roomForm.sections.basicInfo") }}
      </h3>
      <div class="space-y-3">
        <div>
          <label
            class="block text-sm font-medium text-brand dark:text-white mb-1"
            >{{ t("roomForm.fields.roomNumber") }}*</label
          >
          <input
            v-model.trim="form.roomNumber"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            :placeholder="t('roomForm.fields.roomNumber')"
            :disabled="submitting"
            required
            autocomplete="off"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label
              class="block text-sm font-medium text-brand dark:text-white mb-1"
              >{{ t("roomForm.fields.floor") }}*</label
            >
            <input
              v-model.number="form.floor"
              type="number"
              min="1"
              max="50"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('roomForm.fields.floor')"
              :disabled="submitting"
              required
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-brand dark:text-white mb-1"
              >{{ t("roomForm.fields.capacity") }}*</label
            >
            <input
              v-model.number="form.capacity"
              type="number"
              min="1"
              max="10"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('roomForm.fields.capacity')"
              :disabled="submitting"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Сообщения об ошибке/успехе -->
    <p v-if="error" class="text-sm text-red-600 dark:text-red-400 text-center">
      {{ error }}
    </p>
    <p
      v-if="success"
      class="text-sm text-emerald-700 dark:text-emerald-400 text-center"
    >
      {{ success }}
    </p>

    <!-- Кнопки -->
    <div class="flex items-center justify-center gap-3">
      <Button
        :loading="submitting"
        :disabled="submitting"
        variant="solid"
        size="md"
        type="submit"
      >
        {{
          submitting
            ? t("roomForm.messages.creating")
            : t("roomForm.messages.createRoom")
        }}
      </Button>
      <Button
        :disabled="submitting"
        variant="outline"
        size="md"
        type="button"
        @click="emit('cancel')"
      >
        {{ t("common.cancel") }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { createRoom } from "@/api/rooms";
import type { CreateRoomRequest } from "@/types/rooms";
import Button from "../ui/Button.vue";
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();

// Эмиты для родительского компонента
const emit = defineEmits<{
  success: [];
  cancel: [];
}>();

// Состояние формы
const form = reactive<CreateRoomRequest>({
  roomNumber: "",
  floor: 1,
  capacity: 1,
});

// Локальные флаги состояния
const submitting = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

async function onSubmit(): Promise<void> {
  error.value = null;
  success.value = null;

  // Валидация
  if (!form.roomNumber.trim()) {
    error.value = t("roomForm.messages.roomNumberRequired");
    return;
  }
  if (form.floor < 1 || form.floor > 50) {
    error.value = t("roomForm.messages.invalidFloor");
    return;
  }
  if (form.capacity < 1 || form.capacity > 10) {
    error.value = t("roomForm.messages.invalidCapacity");
    return;
  }

  try {
    submitting.value = true;
    await createRoom(form);

    // Очищаем форму после успешного создания
    form.roomNumber = "";
    form.floor = 1;
    form.capacity = 1;

    success.value = t("roomForm.messages.success");

    // Эмитим событие успеха для родительского компонента
    emit("success");

    // Автоматически скрываем сообщение об успехе через 3 секунды
    setTimeout(() => {
      success.value = null;
    }, 3000);
  } catch (e: any) {
    console.error("Room creation error:", e);

    // Обработка различных типов ошибок
    if (e?.response?.status === 409) {
      error.value = t("roomForm.messages.roomExists");
    } else if (e?.response?.status === 400) {
      error.value =
        e?.response?.data?.message || t("roomForm.messages.validationError");
    } else if (e?.response?.status === 403) {
      error.value = t("roomForm.messages.permissionDenied");
    } else if (e?.response?.status >= 500) {
      error.value = t("roomForm.messages.serverError");
    } else {
      error.value = e?.message || t("roomForm.messages.error");
    }
  } finally {
    submitting.value = false;
  }
}
</script>
