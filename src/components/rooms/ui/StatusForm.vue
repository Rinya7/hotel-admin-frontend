<template>
    <div
      class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-6 space-y-5"
    >
      <!-- Заголовок -->
      <h5 class="text-base font-semibold text-brand dark:text-emerald-300">
        {{ t("roomStays.summary.currentStay.statusForm.title") }}
      </h5>
  
      <!-- Select статусу -->
      <div class="space-y-2">
        <label class="status-label">
          {{ t("roomStays.summary.currentStay.statusForm.selectLabel") }}
        </label>
  
        <select
          v-model="model.status"
          class="status-select"
        >
          <option
            v-for="opt in options"
            :key="opt"
            :value="opt"
          >
            {{ t(`roomStays.status.${opt}`) }}
          </option>
        </select>
      </div>
  
      <!-- Comment for cancellation -->
      <div v-if="model.status === 'cancelled'" class="space-y-2">
        <label class="status-label">
          {{ t("roomStays.summary.currentStay.statusForm.commentLabel") }}
        </label>
  
        <textarea
          v-model.trim="model.comment"
          class="status-textarea"
          rows="3"
          :placeholder="commentPlaceholder"
        ></textarea>
  
        <p class="note">{{ commentHint }}</p>
      </div>
  
      <!-- Error text -->
      <p v-if="error" class="error-text">{{ error }}</p>
  
      <!-- Restriction: cannot complete today -->
      <p
        v-if="model.status === 'completed' && !canCompleteToday"
        class="warning-text"
      >
        {{ t("stayDetails.status.messages.completeOnlyOnCheckout") }}
      </p>
  
      <!-- Button -->
      <div class="flex justify-end pt-2">
        <button
          type="button"
          class="submit-btn"
          :disabled="isLoading || isDisabled"
          @click="emit('submit')"
        >
          <span v-if="isLoading" class="animate-pulse">…</span>
          <span v-else>
            {{ t("roomStays.summary.currentStay.statusForm.submit") }}
          </span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from "vue";
  import { useI18n } from "vue-i18n";
  
  const { t } = useI18n();
  
  // Типи пропсів
  interface Props {
    statusDraft: string | null;
    statusComment: string;
    options: string[];
    error: string | null;
    isLoading: boolean;
    canCompleteToday: boolean;
    isDisabled: boolean;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(["update:statusDraft", "update:statusComment", "submit"]);
  
  // Двостороння модель
  const model = {
    get status(): string | null {
      return props.statusDraft;
    },
    set status(v: string | null) {
      emit("update:statusDraft", v);
    },
  
    get comment(): string {
      return props.statusComment;
    },
    set comment(v: string) {
      emit("update:statusComment", v);
    },
  };
  
  // Тексти
  const commentPlaceholder = computed(() =>
    t("roomStays.summary.currentStay.statusForm.commentPlaceholder")
  );
  
  const commentHint = computed(() =>
    t("roomStays.summary.currentStay.statusForm.commentHint")
  );
  </script>
  
  <style scoped>
  .status-label {
    @apply block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide;
  }
  
  .status-select {
    @apply w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 
           border border-gray-300 dark:border-gray-600 
           text-gray-900 dark:text-white text-sm
           focus:ring-2 focus:ring-brand dark:focus:ring-emerald-400 focus:border-brand;
  }
  
  .status-textarea {
    @apply w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 
           border border-gray-300 dark:border-gray-600
           text-gray-900 dark:text-white text-sm
           focus:ring-2 focus:ring-brand dark:focus:ring-emerald-400 focus:border-brand;
  }
  
  .error-text {
    @apply text-xs text-red-600 dark:text-red-400;
  }
  
  .warning-text {
    @apply text-xs text-amber-600 dark:text-amber-300 font-medium;
  }
  
  .note {
    @apply text-xs text-gray-500 dark:text-gray-400;
  }
  
  .submit-btn {
    @apply inline-flex items-center gap-2 px-6 py-2.5 rounded-xl
           bg-brand hover:opacity-90 text-white font-semibold text-sm
           shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed;
  }
  </style>
  