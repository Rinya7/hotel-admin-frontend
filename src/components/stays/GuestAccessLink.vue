<!-- GuestAccessLink.vue -->
<!-- Компонент для генерації та відображення гостьового лінку доступу -->

<template>
  <div class="space-y-4">
    <!-- Заголовок секції -->
    <div class="flex items-center gap-2">
      <div class="flex-shrink-0">
        <svg
          class="h-5 w-5 text-brand dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </div>
      <h4 class="text-base font-semibold text-gray-900 dark:text-white">
        {{ t("guestAccess.title") }}
      </h4>
    </div>

    <!-- Кнопка генерації лінку -->
    <div class="flex items-center justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400 flex-1">
        {{ t("guestAccess.description") }}
      </p>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="isGenerating"
        @click="handleGenerateLink"
      >
        <svg
          v-if="isGenerating"
          class="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <svg
          v-else
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <span>{{ t("guestAccess.generateButton") }}</span>
      </button>
    </div>

    <!-- Відображення згенерованого лінку -->
    <div
      v-if="generatedLink"
      class="border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 p-5 shadow-sm space-y-4"
    >
      <!-- Токен -->
      <div class="space-y-2">
        <label class="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <svg
            class="h-4 w-4 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
          {{ t("guestAccess.tokenLabel") }}
        </label>
        <div class="flex items-center gap-2">
          <input
            :value="generatedLink.token"
            readonly
            class="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
          />
          <button
            type="button"
            @click="copyToClipboard(generatedLink.token)"
            class="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-brand hover:text-brand-light dark:text-emerald-400 dark:hover:text-emerald-300 bg-brand/10 hover:bg-brand/20 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 border border-brand/20 dark:border-emerald-500/30 rounded-lg transition-all hover:shadow-sm"
            :title="t('guestAccess.copyToken')"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>{{ t("guestAccess.copy") }}</span>
          </button>
        </div>
      </div>

      <!-- URL -->
      <div class="space-y-2">
        <label class="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
          <svg
            class="h-4 w-4 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          {{ t("guestAccess.urlLabel") }}
        </label>
        <div class="flex items-center gap-2">
          <input
            :value="generatedLink.url"
            readonly
            class="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white break-all focus:ring-2 focus:ring-brand focus:border-brand"
          />
          <button
            type="button"
            @click="copyToClipboard(generatedLink.url)"
            class="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-brand hover:text-brand-light dark:text-emerald-400 dark:hover:text-emerald-300 bg-brand/10 hover:bg-brand/20 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 border border-brand/20 dark:border-emerald-500/30 rounded-lg transition-all hover:shadow-sm"
            :title="t('guestAccess.copyUrl')"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>{{ t("guestAccess.copy") }}</span>
          </button>
        </div>
      </div>

      <!-- Кнопки відправки -->
      <div class="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- Кнопка Send via Email -->
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            @click="showEmailModal = true"
            :disabled="isSendingEmail"
            :title="t('guestAccess.sendEmail')"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{{ t("guestAccess.sendEmail") }}</span>
          </button>

          <!-- Кнопка Send via WhatsApp (майбутнє) -->
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
            :title="t('guestAccess.whatsappComingSoon')"
          >
            <svg
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
              />
            </svg>
            <span>{{ t("guestAccess.sendWhatsApp") }}</span>
          </button>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
          {{ t("guestAccess.whatsappComingSoon") }}
        </p>
      </div>
    </div>

    <!-- Модальне вікно для введення email -->
    <div
      v-if="showEmailModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showEmailModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ t("guestAccess.sendEmail") }}
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email адреса отримувача
            </label>
            <input
              v-model="emailInput"
              type="email"
              placeholder="example@email.com"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :disabled="isSendingEmail"
            />
          </div>
          <div class="flex gap-3 justify-end">
            <button
              type="button"
              @click="showEmailModal = false; emailInput = ''"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
              :disabled="isSendingEmail"
            >
              Скасувати
            </button>
            <button
              type="button"
              @click="sendViaEmail"
              class="px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-light dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSendingEmail || !emailInput.trim()"
            >
              <span v-if="isSendingEmail">Відправка...</span>
              <span v-else>Відправити</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Список активних токенів -->
    <div
      v-if="tokens.length > 0"
      class="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm"
    >
      <h5 class="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
        <svg
          class="h-4 w-4 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        {{ t("guestAccess.activeTokens") }}
      </h5>
      <div class="space-y-2">
        <div
          v-for="token in tokens"
          :key="token.id"
          class="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex-1 min-w-0">
            <p class="text-xs font-mono text-gray-600 dark:text-gray-400 truncate mb-1">
              {{ token.token }}
            </p>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-500">
              <span>
                {{ t("guestAccess.createdAt") }}:
                {{ formatDate(token.createdAt) }}
              </span>
              <span
                v-if="token.lastUsedAt"
                class="text-emerald-600 dark:text-emerald-400"
              >
                {{ t("guestAccess.lastUsed") }}:
                {{ formatDate(token.lastUsedAt) }}
              </span>
              <span
                v-if="token.revokedAt"
                class="text-red-600 dark:text-red-400"
              >
                {{ t("guestAccess.revokedAt") }}:
                {{ formatDate(token.revokedAt) }}
              </span>
            </div>
          </div>
          <button
            type="button"
            @click="copyToClipboard(getTokenUrl(token.token))"
            class="flex-shrink-0 px-2.5 py-1.5 text-xs font-medium text-brand hover:text-brand-light dark:text-emerald-400 dark:hover:text-emerald-300 bg-brand/10 hover:bg-brand/20 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 border border-brand/20 dark:border-emerald-500/30 rounded-md transition-all hover:shadow-sm"
            :title="t('guestAccess.copyUrl')"
          >
            {{ t("guestAccess.copy") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Помилка -->
    <div
      v-if="error"
      class="border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 flex items-start gap-3"
    >
      <svg
        class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-sm text-red-600 dark:text-red-400 flex-1">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// src/components/stays/GuestAccessLink.vue
// Компонент для генерації та відображення гостьового лінку доступу

import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { generateGuestAccessLink, getGuestAccessTokens, sendGuestAccessLinkEmail, type GenerateTokenResponse, type GuestAccessTokenInfo } from "@/api/guest";
import { useNotifications } from "@/composables/useNotifications";

const props = defineProps<{
  stayId: number;
}>();

const { t } = useI18n();
const { showSuccess, showError } = useNotifications();

// Стан компонента
const isGenerating = ref(false);
const generatedLink = ref<GenerateTokenResponse | null>(null);
const tokens = ref<GuestAccessTokenInfo[]>([]);
const error = ref<string | null>(null);
const showEmailModal = ref(false);
const emailInput = ref("");
const isSendingEmail = ref(false);

// Базовий URL для гостьового додатку
// Пріоритет: 1) VITE_GUEST_APP_URL з .env, 2) URL з бекенду (якщо є), 3) localhost за замовчуванням
const guestAppBaseUrl = import.meta.env.VITE_GUEST_APP_URL;

/**
 * Генерувати лінк доступу
 */
async function handleGenerateLink(): Promise<void> {
  isGenerating.value = true;
  error.value = null;

  try {
    const response = await generateGuestAccessLink(props.stayId);
    
    // Якщо є VITE_GUEST_APP_URL - використовуємо його (пріоритет)
    // Інакше використовуємо URL з бекенду (fallback)
    if (guestAppBaseUrl) {
      generatedLink.value = {
        ...response,
        url: `${guestAppBaseUrl}/access/${response.token}`,
      };
    } else {
      // Використовуємо URL з бекенду, якщо VITE_GUEST_APP_URL не встановлено
      generatedLink.value = response;
    }
    
    showSuccess(t("guestAccess.generateSuccess"));
    // Оновлюємо список токенів
    await loadTokens();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : t("guestAccess.generateError");
    error.value = errorMessage;
    showError(errorMessage);
  } finally {
    isGenerating.value = false;
  }
}

/**
 * Завантажити список активних токенів
 * Примітка: Endpoint може бути не реалізований, тому не показуємо помилку
 */
async function loadTokens(): Promise<void> {
  try {
    tokens.value = await getGuestAccessTokens(props.stayId);
  } catch (err) {
    // Endpoint може бути не реалізований, тому не показуємо помилку користувачу
    // Просто не відображаємо список токенів
    tokens.value = [];
    // Логуємо тільки в консоль для розробки
    if (import.meta.env.DEV) {
      console.warn("Endpoint для отримання токенів не реалізований або недоступний:", err);
    }
  }
}

/**
 * Копіювати текст в буфер обміну
 */
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    showSuccess(t("guestAccess.copied"));
  } catch (err) {
    console.error("Помилка копіювання:", err);
    showError(t("guestAccess.copyError"));
  }
}

/**
 * Отримати URL для токену
 * Використовує VITE_GUEST_APP_URL, якщо встановлено, інакше формує з базового URL з бекенду
 */
function getTokenUrl(token: string): string {
  if (guestAppBaseUrl) {
    return `${guestAppBaseUrl}/access/${token}`;
  }
  // Fallback: використовуємо базовий URL з бекенду (якщо generatedLink вже має URL)
  if (generatedLink.value?.url) {
    // Витягуємо базовий URL з існуючого URL
    const baseUrl = generatedLink.value.url.replace(/\/access\/.*$/, "");
    return `${baseUrl}/access/${token}`;
  }
  // Останній fallback
  return `http://localhost:5174/access/${token}`;
}

/**
 * Відправити лінк на email через бекенд
 */
async function sendViaEmail(): Promise<void> {
  if (!generatedLink.value || !emailInput.value.trim()) {
    return;
  }

  isSendingEmail.value = true;
  try {
    const subject = t("guestAccess.emailSubject") as string;
    await sendGuestAccessLinkEmail(props.stayId, emailInput.value.trim(), subject);
    showSuccess(t("guestAccess.emailSent") || "Email відправлено успішно");
    showEmailModal.value = false;
    emailInput.value = "";
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : t("guestAccess.emailError") || "Помилка відправки email";
    showError(errorMessage);
  } finally {
    isSendingEmail.value = false;
  }
}

/**
 * Форматувати дату для відображення
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Завантажуємо токени при монтуванні
onMounted(() => {
  loadTokens();
});
</script>
