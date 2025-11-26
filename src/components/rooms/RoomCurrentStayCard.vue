<template>
    <!-- Головна card -->
    <div
      class="rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 p-6 space-y-6"
    >
      <!-- Заголовок + статус -->
      <header class="flex items-start justify-between">
        <div>
          <h3 class="text-xl font-semibold text-brand dark:text-emerald-300">
            {{ t("roomStays.summary.currentStay.title") }}
          </h3>
  
          <p
            v-if="!stay"
            class="text-sm text-gray-500 dark:text-gray-400 mt-1"
          >
            {{ t("roomStays.summary.currentStay.noData") }}
          </p>
        </div>
  
        <!-- Статус -->
        <div v-if="stay">
          <span
            :class="[
              getStatusClass(stay.status),
              'px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm'
            ]"
          >
            {{ t(`roomStays.status.${stay.status}`) }}
          </span>
        </div>
      </header>
  
      <!-- Якщо нема stay -->
      <div v-if="!stay"></div>
  
      <!-- Tabs -->
      <nav
        v-else
        class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 w-fit"
      >
        <!-- INFO TAB -->
        <button
          type="button"
          @click="emitTab('info')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'info'
              ? 'bg-white dark:bg-gray-800 shadow text-brand dark:text-emerald-300'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ t("roomStays.summary.tabs.info") }}
        </button>
  
        <!-- HISTORY TAB -->
        <button
          type="button"
          @click="emitTab('history')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            activeTab === 'history'
              ? 'bg-white dark:bg-gray-800 shadow text-brand dark:text-emerald-300'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          {{ t("roomStays.summary.tabs.history") }}
        </button>
      </nav>
  
      <!-- INFO PANEL -->
      <div
        v-if="stay && activeTab === 'info'"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-6"
      >
        <!-- 2-колоночна таблиця -->
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
  
          <!-- ID -->
          <InfoRow
            :label="t('roomStays.summary.currentStay.fields.id')"
            :value="String(stay.id)"
          />
  
          <!-- Room -->
          <InfoRow
            :label="t('roomStays.summary.currentStay.fields.room')"
            :value="stay.room.roomNumber"
          />
  
          <!-- Booking -->
          <InfoRow
            :label="t('roomStays.summary.currentStay.fields.booking')"
            :value="formatBookingNumber(stay)"
          />
  
          <!-- Main Guest -->
          <InfoRow
            :label="t('roomStays.summary.currentStay.guest')"
            :value="stay.mainGuestName"
          />

          <!-- First Name -->
          <InfoRow
            v-if="stay.firstName"
            :label="t('roomStays.summary.currentStay.fields.firstName')"
            :value="stay.firstName"
          />

          <!-- Last Name -->
          <InfoRow
            v-if="stay.lastName"
            :label="t('roomStays.summary.currentStay.fields.lastName')"
            :value="stay.lastName"
          />

          <!-- Email -->
          <InfoRow
            v-if="stay.email"
            :label="t('roomStays.summary.currentStay.fields.email')"
            :value="stay.email"
          />

          <!-- Phone -->
          <InfoRow
            v-if="stay.phoneCountryCode || stay.phoneNumber"
            :label="t('roomStays.summary.currentStay.fields.phone')"
            :value="phoneDisplay"
          />

          <!-- Guests Count -->
          <InfoRow
            v-if="stay.guestsCount"
            :label="t('roomStays.summary.currentStay.fields.guestsCount')"
            :value="String(stay.guestsCount)"
          />
  
          <!-- CheckIn -->
          <InfoRow
            :label="t('roomStays.summary.currentStay.checkIn')"
            :value="formatDate(stay.checkIn)"
          />
  
          <!-- CheckOut + Edit button -->
          <div class="flex flex-col">
            <dt class="info-label">
              {{ t("roomStays.summary.currentStay.checkOut") }}
            </dt>
  
            <dd class="mt-1 flex items-center gap-2 text-gray-900 dark:text-white">
              {{ formatDate(stay.checkOut) }}
  
              <button
                v-if="canEditDates"
                type="button"
                @click="$emit('edit-dates')"
                class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                :title="t('roomStays.summary.currentStay.editDates')"
              >
                <svg
                  class="w-4 h-4 text-brand dark:text-emerald-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </dd>
          </div>
  
          <!-- Balance -->
          <InfoRow
            :label="t('roomStays.summary.currentStay.balance')"
            :value="balanceValue"
          />
  
          <!-- Created By -->
          <InfoRow
            v-if="stay.createdBy"
            :label="t('roomStays.summary.currentStay.fields.createdBy')"
            :value="stay.createdBy"
          />
  
          <!-- Updated By -->
          <InfoRow
            v-if="stay.updatedBy"
            :label="t('roomStays.summary.currentStay.fields.updatedBy')"
            :value="updatedByDisplay"
          />
  
          <!-- Extra Guests -->
          <InfoRow
            class="sm:col-span-2"
            :label="t('roomStays.summary.currentStay.extraGuests')"
            :value="extraGuestsDisplay"
          />
  
          <!-- Registered Guests -->
          <div class="sm:col-span-2">
            <dt class="info-label">
              {{ t("roomStays.summary.currentStay.registeredGuests") }}
            </dt>
  
            <dd class="mt-2 space-y-3">
              <template v-if="stay.guests && stay.guests.length > 0">
                <div
                  v-for="g in stay.guests"
                  :key="g.id"
                  class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3"
                >
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ g.fullName }}
                  </p>

                  <p v-if="g.documentType || g.documentNumber" class="guest-meta">
                    {{ t("roomStays.summary.currentStay.guestDocument") }}:
                    {{ g.documentType || "—" }} · {{ g.documentNumber }}
                  </p>

                  <p v-if="g.birthDate" class="guest-meta">
                    {{ t("roomStays.summary.currentStay.guestBirthDate") }}:
                    {{ formatDate(g.birthDate) }}
                  </p>

                  <p v-if="g.notes" class="guest-meta whitespace-pre-line">
                    {{ t("roomStays.summary.currentStay.guestNotes") }}:
                    {{ g.notes }}
                  </p>
                </div>
              </template>

              <span v-else class="text-sm text-gray-500 dark:text-gray-400">
                {{ t("roomStays.summary.currentStay.registeredGuestsEmpty") }}
              </span>
            </dd>
          </div>
  
          <!-- Cancellation Comment -->
          <InfoRow
            v-if="summaryCancellationComment"
            class="sm:col-span-2"
            :label="t('roomStays.summary.currentStay.commentLabel')"
            :value="summaryCancellationComment"
          />
        </dl>
      </div>
  
      <!-- HISTORY PANEL -->
      <div
        v-if="stay && activeTab === 'history'"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
      >
        <slot name="history"></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from "vue";
  import { useI18n } from "vue-i18n";
  import type { Stay } from "@/types/stays";
  import InfoRow from "@/components/rooms/ui/InfoRow.vue";
  
  interface Props {
    stay: Stay | null;
    activeTab: "info" | "history";
    canEditDates: boolean;
    summaryCancellationComment: string | null;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(["tab-change", "edit-dates"]);
  
  const { t } = useI18n();
  
  // ——— Лейбл табу
  function emitTab(tab: "info" | "history"): void {
    emit("tab-change", tab);
  }
  
  function formatDate(date: string): string {
    const d = new Date(date);
    return new Intl.DateTimeFormat("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  }
  
  function formatBookingNumber(stay: Stay): string {
    const rn = stay.room.roomNumber;
    return `${rn}-${stay.id}`;
  }

  // Отображение телефона
  const phoneDisplay = computed(() => {
    if (!props.stay) return "—";
    const { phoneCountryCode, phoneNumber } = props.stay;
    if (phoneCountryCode && phoneNumber) {
      return `${phoneCountryCode} ${phoneNumber}`;
    }
    if (phoneCountryCode) {
      return phoneCountryCode;
    }
    if (phoneNumber) {
      return phoneNumber;
    }
    return "—";
  });
  
  const balanceValue = computed(() => {
    if (!props.stay) return "—";
    const b = props.stay.balance;
    return typeof b === "number" ? b.toFixed(2) : b ?? "—";
  });
  
  const updatedByDisplay = computed(() => {
    if (!props.stay) return "";
    const role = props.stay.updatedByRole
      ? ` (${props.stay.updatedByRole})`
      : "";
    return `${props.stay.updatedBy}${role}`;
  });
  
  const extraGuestsDisplay = computed(() => {
    if (!props.stay) return "";
    const arr = props.stay.extraGuestNames;
    return arr && arr.length ? arr.join(", ") : t("roomStays.summary.currentStay.extraGuestsEmpty");
  });
  
  // ——— Кольори статусів
  function getStatusClass(status: Stay["status"]): string {
    const m: Record<Stay["status"], string> = {
      booked: "bg-yellow-100 text-yellow-800",
      occupied: "bg-blue-100 text-blue-800",
      completed: "bg-gray-200 text-gray-700",
      cancelled: "bg-red-100 text-red-800",
    };
    return m[status];
  }
  </script>
  
  <style scoped>
  .info-label {
    @apply text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400;
  }
  
  .guest-meta {
    @apply text-xs text-gray-600 dark:text-gray-300 mt-1;
  }
  </style>
  