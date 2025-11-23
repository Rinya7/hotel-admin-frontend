<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t("stayCheckIn.subtitle", { room: roomNumber }) }}
        </p>
        <h1 class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {{ t("stayCheckIn.title", { stayId: stayId }) }}
        </h1>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        @click="goBackToRoom"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {{ t("stayCheckIn.backToRoom") }}
      </button>
    </header>

    <div v-if="loading" class="space-y-4">
      <div
        class="h-32 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
      ></div>
      <div
        class="h-64 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
      ></div>
    </div>

    <div
      v-else-if="loadError"
      class="rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10 px-4 py-6 text-red-700 dark:text-red-300"
    >
      <h2 class="text-lg font-semibold">
        {{ t("stayCheckIn.loadErrorTitle") }}
      </h2>
      <p class="mt-2 text-sm">
        {{ loadError }}
      </p>
      <button
        type="button"
        class="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors"
        @click="loadStay"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ t("stayCheckIn.retry") }}
      </button>
    </div>

    <div v-else-if="stay" class="space-y-6">
      <section
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
      >
        <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t("stayCheckIn.summary.title") }}
          </h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ t("stayCheckIn.summary.description") }}
          </p>
        </div>
        <dl
          class="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700 dark:text-gray-300"
        >
          <div>
            <dt class="font-medium text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">
              {{ t("stayCheckIn.summary.fields.room") }}
            </dt>
            <dd class="mt-1 text-base text-gray-900 dark:text-gray-100">
              {{ stay.room.roomNumber }}
            </dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">
              {{ t("stayCheckIn.summary.fields.booking") }}
            </dt>
            <dd class="mt-1 text-base text-gray-900 dark:text-gray-100">
              {{ formatBookingNumber(stay) }}
            </dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">
              {{ t("stayCheckIn.summary.fields.status") }}
            </dt>
            <dd class="mt-1">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-semibold',
                  getStatusClass(stay.status),
                ]"
              >
                {{ t(`roomStays.status.${stay.status}`) }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">
              {{ t("stayCheckIn.summary.fields.checkIn") }}
            </dt>
            <dd class="mt-1 text-base text-gray-900 dark:text-gray-100">
              {{ formatDateForDisplay(stay.checkIn, false) }}
            </dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">
              {{ t("stayCheckIn.summary.fields.checkOut") }}
            </dt>
            <dd class="mt-1 text-base text-gray-900 dark:text-gray-100">
              {{ formatDateForDisplay(stay.checkOut, false) }}
            </dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">
              {{ t("stayCheckIn.summary.fields.primaryGuest") }}
            </dt>
            <dd class="mt-1 text-base text-gray-900 dark:text-gray-100">
              {{ stay.mainGuestName }}
            </dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">
              {{ t("stayCheckIn.summary.fields.capacity") }}
            </dt>
            <dd class="mt-1 text-base text-gray-900 dark:text-gray-100">
              {{ capacityDisplay }}
            </dd>
          </div>
          <div>
            <dt class="font-medium text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wide">
              {{ t("stayCheckIn.summary.fields.nights") }}
            </dt>
            <dd class="mt-1 text-base text-gray-900 dark:text-gray-100">
              {{ stayNights }}
            </dd>
          </div>
        </dl>
      </section>

      <section
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
      >
        <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t("stayCheckIn.form.title") }}
          </h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ t("stayCheckIn.form.description") }}
          </p>
        </div>
        <form class="px-5 py-6 space-y-6" @submit.prevent="submit">
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {{ t("stayCheckIn.form.fields.comment") }}
            </label>
            <textarea
              v-model.trim="comment"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
              :placeholder="t('stayCheckIn.form.placeholders.comment')"
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t("stayCheckIn.form.hints.comment") }}
            </p>
          </div>

          <p
            v-if="maxGuests && maxGuests > 0"
            class="text-xs font-medium text-gray-600 dark:text-gray-300"
          >
            {{ t("stayCheckIn.form.hints.capacity", { capacity: maxGuests }) }}
          </p>

          <div class="space-y-4">
            <div
              v-for="(guest, index) in guestRows"
              :key="`guest-${index}`"
              class="border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div
                class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {{
                    index === 0
                      ? t("stayCheckIn.form.guests.primary")
                      : t("stayCheckIn.form.guests.secondary", {
                          number: index + 1,
                        })
                  }}
                </h3>
                <button
                  v-if="index > 0"
                  type="button"
                  class="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                  @click="removeGuest(index)"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m5-4v4"
                    />
                  </svg>
                  {{ t("stayCheckIn.form.guests.remove") }}
                </button>
              </div>

              <div class="px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t("stayCheckIn.form.fields.fullName") }}
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model.trim="guest.fullName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
                    :placeholder="t('stayCheckIn.form.placeholders.fullName')"
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t("stayCheckIn.form.fields.documentType") }}
                  </label>
                  <select
                    v-model="guest.documentType"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
                  >
                    <option value="">
                      {{ t("stayCheckIn.form.placeholders.documentType") }}
                    </option>
                    <option
                      v-for="option in documentTypeOptions"
                      :key="`doc-${option.value}`"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t("stayCheckIn.form.fields.documentNumber") }}
                  </label>
                  <input
                    v-model.trim="guest.documentNumber"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
                    :placeholder="
                      t('stayCheckIn.form.placeholders.documentNumber')
                    "
                  />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t("stayCheckIn.form.fields.birthDate") }}
                  </label>
                  <input
                    v-model="guest.birthDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
                  />
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t("stayCheckIn.form.fields.notes") }}
                  </label>
                  <textarea
                    v-model.trim="guest.notes"
                    rows="2"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand"
                    :placeholder="t('stayCheckIn.form.placeholders.notes')"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand border border-brand rounded-md bg-white dark:bg-gray-900 hover:bg-brand/10 transition-colors"
            @click="addGuest"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {{ t("stayCheckIn.form.guests.add") }}
          </button>

          <p v-if="submitError" class="text-sm text-red-600 dark:text-red-400">
            {{ submitError }}
          </p>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              @click="goBackToRoom"
            >
              {{ t("stayCheckIn.cancel") }}
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand hover:bg-brand-light rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="animate-pulse">…</span>
              <span>{{ t("stayCheckIn.submit") }}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { checkInStay, getStayById } from "@/api/stays";
import type { Stay, StayGuestPayload } from "@/types/stays";
import { useNotifications } from "@/composables/useNotifications";

interface GuestFormRow {
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  notes: string;
}

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const { showError, showSuccess } = useNotifications();

const stayId = Number(route.params.id);
const roomNumber = String(route.params.roomNumber ?? "");

const stay = ref<Stay | null>(null);
const loading = ref(true);
const loadError = ref<string | null>(null);
const comment = ref("");
const guestRows = ref<GuestFormRow[]>([]);
const submitError = ref<string | null>(null);
const isSubmitting = ref(false);

const documentTypeOptions = computed(() => [
  {
    value: "passport",
    label: t("stayCheckIn.form.documentOptions.passport") as string,
  },
  {
    value: "idCard",
    label: t("stayCheckIn.form.documentOptions.idCard") as string,
  },
]);

const stayNights = computed(() => {
  if (!stay.value) {
    return "—";
  }
  const start = new Date(stay.value.checkIn);
  const end = new Date(stay.value.checkOut);
  const diff = Math.max(0, end.getTime() - start.getTime());
  const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
});

function goBackToRoom(): void {
  router.push({
    name: "room-stays",
    params: { roomNumber },
  });
}

function emptyGuestRow(): GuestFormRow {
  return {
    fullName: "",
    documentType: "",
    documentNumber: "",
    birthDate: "",
    notes: "",
  };
}

function normalizeDateString(value: string): string {
  if (!value) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10);
  }
  return parsed.toISOString().slice(0, 10);
}

function toDateOnly(value: string | null | undefined): string {
  if (!value) {
    return "";
  }
  return value.includes("T") ? normalizeDateString(value) : value;
}

function formatDateForDisplay(value?: string | null, withTime = false): string {
  if (!value) {
    return t("roomStays.summary.unknown") as string;
  }
  const formatter = new Intl.DateTimeFormat(locale.value ?? "uk-UA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  });
  return formatter.format(new Date(value));
}

function addGuest(): void {
  guestRows.value.push(emptyGuestRow());
}

function removeGuest(index: number): void {
  if (index === 0) {
    return;
  }
  guestRows.value.splice(index, 1);
}

async function loadStay(): Promise<void> {
  try {
    loading.value = true;
    loadError.value = null;
    const data = await getStayById(stayId);
    stay.value = {
      ...data,
      checkIn: toDateOnly(data.checkIn),
      checkOut: toDateOnly(data.checkOut),
      extraGuestNames: data.extraGuestNames ?? [],
      guests: data.guests ?? [],
    };

    const registry =
      stay.value.guests && stay.value.guests.length > 0
        ? stay.value.guests.map((guest) => ({
            fullName: guest.fullName,
            documentType: guest.documentType ?? "",
            documentNumber: guest.documentNumber ?? "",
            birthDate: toDateOnly(guest.birthDate ?? ""),
            notes: guest.notes ?? "",
          }))
        : [
            {
              fullName: stay.value.mainGuestName,
              documentType: "",
              documentNumber: "",
              birthDate: "",
              notes: "",
            },
            ...((stay.value.extraGuestNames ?? []).map((name) => ({
              fullName: name,
              documentType: "",
              documentNumber: "",
              birthDate: "",
              notes: "",
            })) as GuestFormRow[]),
          ];

    guestRows.value = registry.length > 0 ? registry : [emptyGuestRow()];
  } catch (error: unknown) {
    console.error("Error loading stay:", error);
    let errorMessage: string | null = null;
    
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      errorMessage = axiosError.response?.data?.message || null;
    }
    
    if (!errorMessage && error instanceof Error) {
      errorMessage = error.message;
    }
    
    loadError.value = errorMessage || (t("stayCheckIn.loadErrorFallback") as string);
  } finally {
    loading.value = false;
  }
}

async function submit(): Promise<void> {
  if (!stay.value) {
    return;
  }

  submitError.value = null;

  const guests = guestRows.value
    .map<StayGuestPayload | null>((guest) => {
      const fullName = guest.fullName.trim();
      if (!fullName) {
        return null;
      }
      return {
        fullName,
        documentType: guest.documentType.trim()
          ? guest.documentType.trim()
          : undefined,
        documentNumber: guest.documentNumber.trim()
          ? guest.documentNumber.trim()
          : undefined,
        birthDate: guest.birthDate
          ? normalizeDateString(`${guest.birthDate}T00:00:00`)
          : undefined,
        notes: guest.notes.trim() ? guest.notes.trim() : undefined,
      };
    })
    .filter((guest): guest is StayGuestPayload => guest !== null);

  if (guests.length === 0) {
    submitError.value = t("stayCheckIn.errors.noGuests") as string;
    return;
  }

  if (guests.some((guest) => !guest.fullName || guest.fullName.length < 2)) {
    submitError.value = t("stayCheckIn.errors.invalidGuest") as string;
    return;
  }

  try {
    isSubmitting.value = true;
    await checkInStay(stay.value.id, {
      comment: comment.value.trim() ? comment.value.trim() : undefined,
      guests,
    });
    showSuccess(
      t("stayCheckIn.messages.successTitle"),
      t("stayCheckIn.messages.success") as string
    );
    goBackToRoom();
  } catch (error: unknown) {
    console.error("Error during check-in:", error);
    let rawMessage: string | null = null;
    
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      rawMessage = axiosError.response?.data?.message || null;
    }
    
    if (!rawMessage && error instanceof Error) {
      rawMessage = error.message;
    }

    const capacityValue = maxGuests.value ?? "—";
    const defaultMessage = t("stayCheckIn.messages.error") as string;
    const message = rawMessage || defaultMessage;
    
    const friendlyMessage: string =
      message.includes("Guest count exceeds room capacity")
        ? (t("stayCheckIn.errors.capacityExceeded", { capacity: capacityValue }) as string)
        : message;

    submitError.value = friendlyMessage;
    showError(t("stayCheckIn.messages.error"), friendlyMessage);
  } finally {
    isSubmitting.value = false;
  }
}

function getStatusClass(status: Stay["status"]): string {
  const classes: Record<Stay["status"], string> = {
    booked:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    occupied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return (
    classes[status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  );
}

function formatBookingNumber(currentStay: Stay): string {
  return `${currentStay.room.roomNumber}-${currentStay.id}`;
}

const maxGuests = computed(() => {
  if (!stay.value) {
    return null;
  }
  // room в Stay має спрощений тип без capacity
  // Використовуємо null, якщо capacity недоступний
  // Можна було б зробити окремий запит для отримання повної інформації про кімнату
  return null;
});

const capacityDisplay = computed(() => {
  const capacity = maxGuests.value;
  if (capacity === null) {
    return t("stayCheckIn.summary.capacityUnknown") as string;
  }
  return t("stayCheckIn.summary.capacityValue", { capacity }) as string;
});

onMounted(async () => {
  await loadStay();
});
</script>

<style scoped>
</style>


