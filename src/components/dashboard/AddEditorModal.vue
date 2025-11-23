<!-- AddEditorModal.vue -->
<!-- Модальне вікно для додавання нового редактора -->
<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    @click.self="$emit('update:modelValue', false)"
  >
    <div
      class="w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <div
        class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
      >
        <div>
          <h3 class="text-lg font-semibold text-brand dark:text-white">
            {{ t("dashboard.addEditor.modal.title") }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t("dashboard.addEditor.modal.subtitle") }}
          </p>
        </div>
        <button
          type="button"
          class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          @click="$emit('update:modelValue', false)"
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
            />
          </svg>
        </button>
      </div>

      <div class="px-5 py-6 space-y-6 flex-1 overflow-y-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.addEditor.modal.fields.username") }}
            </label>
            <input
              v-model.trim="localForm.username"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('dashboard.addEditor.modal.placeholders.username')"
            />
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.addEditor.modal.fields.fullName") }}
            </label>
            <input
              v-model.trim="localForm.fullName"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('dashboard.addEditor.modal.placeholders.fullName')"
            />
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.addEditor.modal.fields.password") }}
            </label>
            <input
              v-model="localForm.password"
              type="password"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('dashboard.addEditor.modal.placeholders.password')"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t("dashboard.addEditor.modal.hints.password") }}
            </p>
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.addEditor.modal.fields.confirmPassword") }}
            </label>
            <input
              v-model="localForm.confirmPassword"
              type="password"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="
                t('dashboard.addEditor.modal.placeholders.confirmPassword')
              "
            />
            <p
              v-if="passwordMismatch"
              class="text-xs text-red-600 dark:text-red-400"
            >
              {{ t("dashboard.addEditor.modal.errors.passwordMismatch") }}
            </p>
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.addEditor.modal.fields.email") }}
            </label>
            <input
              v-model.trim="localForm.email"
              type="email"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              placeholder="email"
            />
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.addEditor.modal.fields.phoneCountryCode") }}
            </label>
            <input
              v-model.trim="localForm.phoneCountryCode"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="
                t('dashboard.addEditor.modal.placeholders.phoneCountryCode')
              "
            />
          </div>
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("dashboard.addEditor.modal.fields.phoneNumber") }}
            </label>
            <input
              v-model.trim="localForm.phoneNumber"
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="
                t('dashboard.addEditor.modal.placeholders.phoneNumber')
              "
            />
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </p>
      </div>

      <div
        class="flex justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
      >
        <button
          type="button"
          class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          @click="$emit('update:modelValue', false)"
        >
          {{ t("dashboard.addEditor.modal.cancel") }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="!canSubmit || saving"
          @click="handleSubmit"
        >
          <span v-if="saving" class="animate-pulse">…</span>
          <span>{{ t("dashboard.addEditor.modal.submit") }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// src/components/dashboard/AddEditorModal.vue
// Модальне вікно для додавання нового редактора

import { ref, computed, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import type { CreateEditorRequest } from "@/types/dto";

interface Props {
  modelValue: boolean;
  saving: boolean;
  error: string | null;
}

const props = defineProps<Props>();

const { t } = useI18n();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", payload: CreateEditorRequest): void;
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
const localForm = ref({
  username: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  email: "",
  phoneCountryCode: "+39",
  phoneNumber: "",
});

// Скидаємо форму при закритті модального вікна
watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      localForm.value = {
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        email: "",
        phoneCountryCode: "+39",
        phoneNumber: "",
      };
    }
  }
);

// Валідація
const canSubmit = computed(() => {
  const username = localForm.value.username.trim();
  const password = localForm.value.password.trim();
  const confirm = localForm.value.confirmPassword.trim();
  return username.length >= 3 && password.length >= 6 && password === confirm;
});

const passwordMismatch = computed(
  () =>
    localForm.value.confirmPassword.length > 0 &&
    localForm.value.password !== localForm.value.confirmPassword
);

// Обробка відправки форми
function handleSubmit(): void {
  if (!canSubmit.value || props.saving) {
    return;
  }

  const payload: CreateEditorRequest = {
    username: localForm.value.username.trim(),
    password: localForm.value.password,
    confirmPassword: localForm.value.confirmPassword,
  };

  if (localForm.value.fullName.trim()) {
    payload.full_name = localForm.value.fullName.trim();
  }
  if (localForm.value.email.trim()) {
    payload.email = localForm.value.email.trim();
  }
  if (localForm.value.phoneCountryCode.trim()) {
    payload.phoneCountryCode = localForm.value.phoneCountryCode.trim();
  }
  if (localForm.value.phoneNumber.trim()) {
    payload.phoneNumber = localForm.value.phoneNumber.trim();
  }

  emit("submit", payload);
}
</script>

