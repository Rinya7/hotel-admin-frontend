<!-- StayDetails.vue — деталі проживання з вкладками -->
<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-brand dark:text-white">
        {{ t("stayDetails.title", { stayId: stay?.id || "" }) }}
      </h2>
      <RouterLink
        :to="backUrl"
        class="text-brand hover:text-brand-light dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
      >
        ← {{ t("stayDetails.back") }}
      </RouterLink>
    </header>

    <div
      v-if="loading"
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      Завантаження...
    </div>

    <div v-else-if="error" class="text-center py-8 text-red-500">
      {{ error }}
    </div>

    <div
      v-else-if="!stay"
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      Проживання не знайдено
    </div>

    <div v-else class="space-y-4">
      <!-- Вкладки -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex space-x-4">
          <button
            @click="activeTab = 'info'"
            :class="[
              'py-2 px-4 font-medium text-sm transition-colors border-b-2',
              activeTab === 'info'
                ? 'border-brand text-brand dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
          >
            Інфо
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              'py-2 px-4 font-medium text-sm transition-colors border-b-2',
              activeTab === 'history'
                ? 'border-brand text-brand dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
          >
            Історія
          </button>
        </nav>
      </div>

      <!-- Контент вкладок -->
      <div
        v-if="activeTab === 'info'"
        class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-6"
      >
        <h3 class="text-lg font-semibold mb-4 text-brand dark:text-white">
          Інформація про проживання
        </h3>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              ID
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ stay.id }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Гість
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ stay.mainGuestName }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Кімната
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ stay.room.roomNumber }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Статус
            </dt>
            <dd class="mt-1">
              <span
                :class="getStatusClass(stay.status)"
                class="px-2 py-1 rounded text-xs font-medium"
              >
                {{ stay.status }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Заїзд
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ stay.checkIn }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Виїзд
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ stay.checkOut }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Баланс
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{
                typeof stay.balance === "number"
                  ? stay.balance.toFixed(2)
                  : stay.balance || "—"
              }}
            </dd>
          </div>
          <div v-if="stay.createdBy">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Створено
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ stay.createdBy }}
            </dd>
          </div>
          <div v-if="stay.updatedBy">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Оновлено
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ stay.updatedBy }}
              <span
                v-if="stay.updatedByRole"
                class="text-gray-500 dark:text-gray-400"
              >
                ({{ stay.updatedByRole }})
              </span>
            </dd>
          </div>
          <div v-if="stay.status === 'cancelled'">
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ t("stayDetails.status.cancelReasonLabel") }}
            </dt>
            <dd
              class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-line"
            >
              {{ cancellationComment || t("stayDetails.status.noComment") }}
            </dd>
          </div>
        </dl>

        <div
          v-if="canEditDates"
          class="mt-4 flex items-center justify-end"
        >
          <button
            type="button"
            @click="openEditDates"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand bg-brand/10 hover:bg-brand/20 dark:text-emerald-300 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 border border-brand/30 dark:border-emerald-400/40 rounded-md transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10m-9 8h8a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            {{ t("stayDetails.editDates.button") }}
          </button>
        </div>

        <div
          v-if="!isFinalStatus"
          class="mt-6 border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 space-y-4"
        >
          <h4 class="text-md font-semibold text-brand dark:text-white">
            {{ t("stayDetails.status.title") }}
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {{ t("stayDetails.status.current") }}
              </label>
              <span
                :class="getStatusClass(stay.status)"
                class="mt-1 inline-flex items-center px-2 py-1 rounded text-xs font-medium"
              >
                {{ t(`roomStays.status.${stay.status}`) }}
              </span>
            </div>
            <div>
              <label
                class="block text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {{ t("stayDetails.status.new") }}
              </label>
              <select
                v-model="statusDraft"
                class="mt-1 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand"
              >
                <option
                  v-for="option in statusOptions"
                  :key="option"
                  :value="option"
                  :disabled="
                    option === 'completed' && !canCompleteToday
                  "
                >
                  {{ t(`roomStays.status.${option}`) }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="isCancelled" class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {{ t("stayDetails.status.commentLabel") }}
            </label>
            <textarea
              v-model="comment"
              :placeholder="cancelCommentPlaceholder"
              rows="3"
              class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand"
            ></textarea>
          </div>

          <div class="flex items-center justify-between">
            <p
              v-if="statusError"
              class="text-sm text-red-600 dark:text-red-400"
            >
              {{ statusError }}
            </p>
            <button
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-light text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="isUpdateDisabled"
              @click="submitStatus"
            >
              <span v-if="isSaving" class="animate-pulse">…</span>
              <span>{{ t("stayDetails.status.submit") }}</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'history'">
        <StayHistory ref="historyRef" :stay-id="stay.id" />
      </div>
    </div>

    <div
      v-if="showEditDates"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="closeEditDates"
    >
      <div
        class="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-brand dark:text-emerald-300">
            {{ t("stayDetails.editDates.title") }}
          </h3>
          <button
            type="button"
            @click="closeEditDates"
            class="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
              ></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitEditDates" class="px-4 py-5 space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("stayDetails.editDates.checkInLabel") }}
            </label>
            <input
              v-model="editDatesForm.checkIn"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :max="editDatesForm.checkOut || undefined"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("stayDetails.editDates.checkOutLabel") }}
            </label>
            <input
              v-model="editDatesForm.checkOut"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :min="editDatesForm.checkIn || undefined"
              required
            />
          </div>

          <p
            v-if="editDatesError"
            class="text-sm text-red-500 dark:text-red-400"
          >
            {{ editDatesError }}
          </p>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeEditDates"
              class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {{ t("stayDetails.editDates.cancel") }}
            </button>
            <button
              type="submit"
              :disabled="isSavingDates"
              class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="isSavingDates" class="animate-pulse">…</span>
              <span>{{ t("stayDetails.editDates.save") }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  getStayById,
  updateStayStatus,
  fetchStayHistory,
  updateStayByDates,
} from "@/api/stays";
import type { Stay, StayStatus } from "@/types/stays";
import StayHistory from "@/components/stays/StayHistory.vue";
import { useNotifications } from "@/composables/useNotifications";

const route = useRoute();
const { t } = useI18n();

const stayId = Number(route.params.id);
const roomNumber = route.query.roomNumber as string | undefined;

const stay = ref<Stay | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const activeTab = ref<"info" | "history">("info");

const { showSuccess, showError } = useNotifications();
const historyRef = ref<InstanceType<typeof StayHistory> | null>(null);
const cancellationComment = ref<string | null>(null);

const statusOptions: StayStatus[] = [
  "booked",
  "occupied",
  "completed",
  "cancelled",
];
const statusDraft = ref<StayStatus | null>(null);
const comment = ref("");
const isSaving = ref(false);
const statusError = ref<string | null>(null);
const showEditDates = ref(false);
const editDatesError = ref<string | null>(null);
const isSavingDates = ref(false);
const editDatesForm = ref({
  checkIn: "",
  checkOut: "",
});

const cancelCommentPlaceholder = computed(() =>
  t("stayDetails.status.commentPlaceholder")
);
const isCancelled = computed(() => statusDraft.value === "cancelled");
const isFinalStatus = computed(() =>
  stay.value ? ["cancelled", "completed"].includes(stay.value.status) : false
);
const normalizedCheckOut = computed(() =>
  stay.value ? normalizeDateString(stay.value.checkOut) : null
);
const todayDate = computed(() => normalizeDateString(new Date().toISOString()));
const canCompleteToday = computed(() =>
  normalizedCheckOut.value !== null &&
  todayDate.value !== null &&
  normalizedCheckOut.value === todayDate.value
);
const canEditDates = computed(() =>
  stay.value ? ["booked", "occupied"].includes(stay.value.status) : false
);
const isUpdateDisabled = computed(() => {
  if (!stay.value || !statusDraft.value) {
    return true;
  }
  if (statusDraft.value === "completed" && !canCompleteToday.value) {
    return true;
  }
  return statusDraft.value === stay.value.status || isSaving.value;
});

const backUrl = computed(() => {
  if (roomNumber) {
    return `/rooms/${roomNumber}/stays`;
  }
  return "/rooms";
});

async function loadCancellationComment(): Promise<void> {
  if (!stay.value) {
    cancellationComment.value = null;
    return;
  }
  try {
    const data = await fetchStayHistory(stay.value.id);
    const cancelledLog = data.logs?.find(
      (log) => log.newStatus === "cancelled"
    );
    cancellationComment.value = cancelledLog?.comment ?? null;
  } catch (err) {
    console.error("Error loading cancellation comment:", err);
    cancellationComment.value = null;
  }
}

async function loadStay() {
  loading.value = true;
  error.value = null;
  try {
    const loadedStay = await getStayById(stayId);
    stay.value = loadedStay;
    await loadCancellationComment();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Помилка завантаження проживання";
    console.error("Error loading stay:", err);
  } finally {
    loading.value = false;
  }
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    booked:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return (
    classes[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  );
}

function normalizeDateString(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.length >= 10 ? value.slice(0, 10) : null;
  }
  return date.toISOString().slice(0, 10);
}

function openEditDates(): void {
  if (!stay.value || !canEditDates.value) {
    return;
  }
  editDatesForm.value = {
    checkIn: normalizeDateString(stay.value.checkIn) ?? "",
    checkOut: normalizeDateString(stay.value.checkOut) ?? "",
  };
  editDatesError.value = null;
  showEditDates.value = true;
  document.body.style.overflow = "hidden";
}

function closeEditDates(): void {
  showEditDates.value = false;
  editDatesError.value = null;
  document.body.style.overflow = "";
}

async function submitEditDates(): Promise<void> {
  if (!stay.value || !canEditDates.value) {
    return;
  }

  const { checkIn, checkOut } = editDatesForm.value;
  if (!checkIn || !checkOut) {
    editDatesError.value = t("stayDetails.editDates.validators.required");
    return;
  }
  if (checkIn > checkOut) {
    editDatesError.value = t("stayDetails.editDates.validators.order");
    return;
  }

  const originalCheckIn =
    normalizeDateString(stay.value.checkIn) ?? stay.value.checkIn;
  const originalCheckOut =
    normalizeDateString(stay.value.checkOut) ?? stay.value.checkOut;

  isSavingDates.value = true;
  editDatesError.value = null;

  try {
    const updatedStay = await updateStayByDates(
      stay.value.room.roomNumber,
      originalCheckIn,
      originalCheckOut,
      {
        newCheckIn: checkIn,
        newCheckOut: checkOut,
      }
    );

    stay.value = updatedStay;
    statusDraft.value = updatedStay.status;
    showSuccess(
      t("stayDetails.editDates.successTitle"),
      t("stayDetails.editDates.successMessage")
    );
    closeEditDates();
    historyRef.value?.loadHistory();
  } catch (err) {
    console.error("Error updating stay dates:", err);
    let message = t("stayDetails.editDates.errorMessage");
    if (err && typeof err === "object" && "response" in err) {
      const axiosError = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const serverMessage = axiosError.response?.data?.message;
      if (serverMessage) {
        message = serverMessage;
      }
    } else if (err instanceof Error) {
      message = err.message;
    }
    editDatesError.value = message;
  } finally {
    isSavingDates.value = false;
  }
}

async function submitStatus(): Promise<void> {
  if (!stay.value || !statusDraft.value) {
    return;
  }

  const newStatus = statusDraft.value;
  // Забороняємо оновлення якщо статус не змінився
  if (newStatus === stay.value.status) {
    statusError.value = t("stayDetails.status.messages.noChange");
    return;
  }

  if (newStatus === "completed" && !canCompleteToday.value) {
    statusError.value = t(
      "stayDetails.status.messages.completeOnlyOnCheckout"
    );
    return;
  }

  let finalComment: string | null = null;
  if (newStatus === "cancelled") {
    if (!comment.value || comment.value.trim().length === 0) {
      statusError.value = t("stayDetails.status.messages.commentRequired");
      return;
    }
    finalComment = comment.value.trim();
  } else if (comment.value && comment.value.trim().length > 0) {
    finalComment = comment.value.trim();
  }

  isSaving.value = true;
  statusError.value = null;

  try {
    const response = await updateStayStatus(stay.value.id, {
      status: newStatus,
      comment: finalComment,
    });

    stay.value = response.stay;
    statusDraft.value = response.stay.status;
    comment.value = "";

    showSuccess(
      t("stayDetails.status.messages.successTitle"),
      t("stayDetails.status.messages.success")
    );
    await loadCancellationComment();
    historyRef.value?.loadHistory();
  } catch (err) {
    console.error("Error updating stay status:", err);
    let message = t("stayDetails.status.messages.error");

    if (err && typeof err === "object" && "response" in err) {
      const axiosError = err as {
        response?: { status?: number; data?: { message?: string } };
      };
      const serverMessage = axiosError.response?.data?.message;
      if (serverMessage) {
        message = serverMessage;
      }
    } else if (err instanceof Error) {
      message = err.message;
    }

    statusError.value = message;
    showError(t("stayDetails.status.messages.errorTitle"), message);
  } finally {
    isSaving.value = false;
  }
}

watch(
  () => stay.value,
  (value) => {
    if (value) {
      statusDraft.value = value.status;
      comment.value = "";
      statusError.value = null;
    } else {
      cancellationComment.value = null;
    }
  }
);

watch(statusDraft, (newStatus) => {
  statusError.value = null;
  if (newStatus === "completed" && !canCompleteToday.value) {
    statusError.value = t(
      "stayDetails.status.messages.completeOnlyOnCheckout"
    );
    nextTick(() => {
      statusDraft.value = stay.value?.status ?? null;
    });
    return;
  }
  if (newStatus !== "cancelled") {
    comment.value = "";
  }
});

onMounted(loadStay);
onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>
