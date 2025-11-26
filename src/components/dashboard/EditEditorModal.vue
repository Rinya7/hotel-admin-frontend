<!-- Модалка для редактирования редактора -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
    >
      <!-- Заголовок -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-brand dark:text-white">
          {{ t("editEditorModal.title") }}
        </h2>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Форма -->
      <div v-if="editor" class="p-6 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Имя -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("editEditorModal.fields.fullName") }}
            </label>
            <input
              v-model.trim="form.fullName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('editEditorModal.placeholders.fullName')"
            />
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("editEditorModal.fields.email") }}
            </label>
            <input
              v-model.trim="form.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('editEditorModal.placeholders.email')"
            />
          </div>

          <!-- Код страны телефона -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("editEditorModal.fields.phoneCountryCode") }}
            </label>
            <input
              v-model.trim="form.phoneCountryCode"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('editEditorModal.placeholders.phoneCountryCode')"
            />
          </div>

          <!-- Номер телефона -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("editEditorModal.fields.phoneNumber") }}
            </label>
            <input
              v-model.trim="form.phoneNumber"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('editEditorModal.placeholders.phoneNumber')"
            />
          </div>
        </div>

        <!-- Информация о том, что нельзя изменить -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
          <p>{{ t("editEditorModal.info.cannotChange") }}</p>
        </div>

        <!-- Ошибка -->
        <p v-if="error" class="text-sm text-red-500 dark:text-red-400">
          {{ error }}
        </p>

        <!-- Кнопки -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="close"
            class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {{ t("editEditorModal.actions.cancel") }}
          </button>
          <button
            @click="handleSave"
            :disabled="saving"
            class="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-light dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="saving" class="animate-pulse">…</span>
            <span v-else>{{ t("editEditorModal.actions.save") }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { useI18n } from "vue-i18n";
import type { PublicAdminUser } from "@/types/hotel";
import { updateEditor } from "@/api/auth";

interface Props {
  show: boolean;
  editor: PublicAdminUser["editors"][number] | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "saved"): void;
}>();

const { t } = useI18n();

const form = reactive({
  fullName: "",
  email: "",
  phoneCountryCode: "",
  phoneNumber: "",
});

const saving = ref(false);
const error = ref<string | null>(null);

// Заполняем форму при открытии модалки
watch(
  () => props.editor,
  (editor) => {
    if (editor) {
      form.fullName = editor.full_name || "";
      form.email = editor.email || "";
      form.phoneCountryCode = editor.phoneCountryCode || "";
      form.phoneNumber = editor.phoneNumber || "";
    }
    error.value = null;
  },
  { immediate: true }
);

// Сбрасываем форму при закрытии
watch(
  () => props.show,
  (isOpen) => {
    if (!isOpen) {
      error.value = null;
    }
  }
);

function close(): void {
  emit("close");
}

async function handleSave(): Promise<void> {
  if (!props.editor) {
    return;
  }

  saving.value = true;
  error.value = null;

  try {
    await updateEditor(props.editor.username, {
      full_name: form.fullName || null,
      email: form.email || null,
      phoneCountryCode: form.phoneCountryCode || null,
      phoneNumber: form.phoneNumber || null,
    });

    emit("saved");
    close();
  } catch (err: unknown) {
    console.error("Error updating editor:", err);
    if (err && typeof err === "object" && "response" in err) {
      const axiosError = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const message = axiosError.response?.data?.message;
      error.value =
        typeof message === "string" && message.length > 0
          ? message
          : t("editEditorModal.errors.saveError");
    } else if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = t("editEditorModal.errors.saveError") as string;
    }
  } finally {
    saving.value = false;
  }
}
</script>

