<!-- RoomStays.vue — список проживаний комнаты + создать/сменить статус -->
<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-brand dark:text-white">
        {{ t("roomStays.title", { roomNumber }) }}
      </h2>
      <RouterLink
        to="/rooms"
        class="text-brand hover:text-brand-light dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
      >
        ← {{ t("roomStays.back") }}
      </RouterLink>
    </header>

    <div
      v-if="isRoomCleaning"
      class="border border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    >
      <div class="space-y-1">
        <h3 class="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
          {{ t("roomStays.cleaningBanner.title", { roomNumber }) }}
        </h3>
        <p class="text-sm text-yellow-800 dark:text-yellow-300">
          {{ t("roomStays.cleaningBanner.description") }}
        </p>
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand bg-brand/15 hover:bg-brand/25 dark:text-emerald-300 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 rounded-lg border border-brand/20 dark:border-emerald-500/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="cleaningLoading"
          @click="markRoomAsCleaned"
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
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span v-if="cleaningLoading" class="animate-pulse">…</span>
          <span v-else>{{ t("roomStays.cleaningBanner.button") }}</span>
        </button>
      </div>
    </div>

    <details
      open
      class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4"
    >
      <summary
        class="text-lg font-medium text-brand dark:text-white cursor-pointer mb-4"
      >
        {{ t("roomStays.createNewStay") }}
      </summary>
      <form @submit.prevent="createNew" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            v-model.trim="form.mainGuestName"
            :placeholder="t('roomStays.form.mainGuestName')"
            required
            :class="[
              'w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand',
              formError
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600',
            ]"
            @input="formError = ''"
          />
          <input
            v-model.trim="extraGuestsLine"
            :placeholder="t('roomStays.form.extraGuests')"
            :class="[
              'w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand',
              formError
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600',
            ]"
            @input="formError = ''"
          />
          <div class="flex gap-2">
            <input
              v-model="form.checkIn"
              type="date"
              required
              :class="[
                'flex-1 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand',
                formError
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600',
              ]"
              @change="formError = ''"
            />
            <input
              v-model="form.checkOut"
              type="date"
              required
              :class="[
                'flex-1 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand',
                formError
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600',
              ]"
              @change="formError = ''"
            />
          </div>
          <div class="flex gap-2">
            <select
              v-model="form.status"
              class="flex-1 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
              @change="formError = ''"
            >
              <option value="booked">{{ t("roomStays.status.booked") }}</option>
              <option value="occupied">
                {{ t("roomStays.status.occupied") }}
              </option>
            </select>
            <input
              v-model.number="form.balance"
              type="number"
              step="0.01"
              :placeholder="t('roomStays.form.balance')"
              class="flex-1 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
              @input="formError = ''"
            />
          </div>
        </div>

        <!-- Сообщение об ошибке прямо в форме -->
        <div
          v-if="formError"
          class="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <svg
            class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div class="flex-1">
            <p
              class="text-sm font-semibold text-red-800 dark:text-red-300 mb-1"
            >
              {{ t("roomStays.messages.error") }}
            </p>
            <p class="text-sm text-red-700 dark:text-red-400">
              {{ formError }}
            </p>
          </div>
          <button
            type="button"
            @click="formError = ''"
            class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors flex-shrink-0"
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

        <!-- Кнопка создания по центру -->
        <div class="flex justify-center py-10">
          <button
            type="submit"
            class="px-6 py-2.5 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
          >
            {{ t("roomStays.createButton") }}
          </button>
        </div>
      </form>
    </details>

    <!-- Історія змін статусів кімнати -->
    <RoomHistory ref="roomHistoryRef" />

    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-brand dark:text-white">
        {{ t("roomStays.historyCurrent") }}
      </h3>
      <div
        class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <table class="min-w-full text-sm">
          <thead
            class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <tr>
              <th class="px-4 py-3 text-center font-medium w-16">
                {{ t("roomStays.table.id") }}
              </th>
              <th class="px-4 py-3 text-left font-medium">
                {{ t("roomStays.table.guest") }}
              </th>
              <th class="px-4 py-3 text-left font-medium min-w-[200px]">
                {{ t("roomStays.table.dates") }}
              </th>
              <th class="px-4 py-3 text-left font-medium min-w-[140px]">
                {{ t("roomStays.table.status") }}
              </th>
              <th class="px-4 py-3 text-center font-medium w-24">
                {{ t("roomStays.table.balance") }}
              </th>
              <th class="px-4 py-3 text-center font-medium w-20">
                {{ t("roomStays.table.actions") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Пустое состояние внутри таблицы -->
            <template v-if="stays.length === 0">
              <tr>
                <td colspan="6" class="px-4 py-16 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <div class="text-gray-400 dark:text-gray-500 mb-4">
                      <svg
                        class="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                    </div>
                    <h3
                      class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                    >
                      {{ t("roomStays.empty.title") }}
                    </h3>
                    <p
                      class="text-sm text-gray-500 dark:text-gray-400 max-w-md"
                    >
                      {{ t("roomStays.empty.message") }}
                    </p>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Данные проживаний -->
            <template v-else>
              <tr
                v-for="s in stays"
                :key="s.id"
                class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td
                  class="px-4 py-3 text-gray-900 dark:text-white font-semibold text-center"
                >
                  {{ s.id }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ s.mainGuestName }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  <span class="font-medium">{{ s.checkIn }}</span>
                  <span class="mx-2 text-gray-400 dark:text-gray-500">→</span>
                  <span class="font-medium">{{ s.checkOut }}</span>
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="getStatusClass(s.status)"
                    class="px-2 py-1 rounded text-xs font-medium"
                  >
                    {{ t(`roomStays.status.${s.status}`) }}
                  </span>
                </td>
                <td
                  class="px-4 py-3 text-gray-700 dark:text-gray-300 text-center font-medium"
                >
                  {{
                    typeof s.balance === "number"
                      ? s.balance.toFixed(2)
                      : s.balance ?? "—"
                  }}
                </td>
                <td class="px-4 py-3 text-center">
                  <RouterLink
                    :to="{
                      name: 'stay-details',
                      params: { id: s.id },
                      query: { roomNumber },
                    }"
                    class="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-brand hover:bg-brand-light rounded-md transition-colors"
                  >
                    {{ t("roomStays.table.viewDetails") }}
                  </RouterLink>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useNotifications } from "@/composables/useNotifications";
import type { Stay, CreateStayRequest } from "@/types/stays";
import { listStaysByRoom, createStayForRoom } from "@/api/stays";
import { getRooms, markRoomCleaned } from "@/api/rooms";
import type { Room } from "@/types/rooms";
import RoomHistory from "@/components/rooms/RoomHistory.vue";

const route = useRoute();
const { t } = useI18n();
const { showSuccess, showError } = useNotifications();
const roomNumber = String(route.params.roomNumber ?? "");
const stays = ref<Stay[]>([]);
const roomHistoryRef = ref<InstanceType<typeof RoomHistory> | null>(null);
const currentRoom = ref<Room | null>(null);
const cleaningLoading = ref(false);

const isRoomCleaning = computed(() => currentRoom.value?.status === "cleaning");

function sortStaysByDate(): void {
  stays.value.sort((a, b) => {
    const aDate = new Date(`${a.checkIn}T00:00:00`);
    const bDate = new Date(`${b.checkIn}T00:00:00`);
    const diff = aDate.getTime() - bDate.getTime();
    if (diff !== 0) return diff;
    return a.id - b.id;
  });
}

const form = reactive<CreateStayRequest>({
  mainGuestName: "",
  extraGuestNames: [],
  checkIn: "",
  checkOut: "",
  status: "booked",
  balance: 0,
});

const extraGuestsLine = ref("");
const formError = ref("");

async function load() {
  stays.value = await listStaysByRoom(roomNumber);
  sortStaysByDate();
  await loadRoomInfo();
}

async function createNew() {
  // Сбрасываем предыдущую ошибку
  formError.value = "";

  try {
    form.extraGuestNames = extraGuestsLine.value
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x.length > 0);
    const created = await createStayForRoom(roomNumber, form);

    // Проверяем, что объект создан корректно
    if (!created || !created.id) {
      console.error("Invalid response from server:", created);
      throw new Error("Invalid response from server");
    }

    // Добавляем созданный стейт в список и пересортировываем
    stays.value.push(created);
    sortStaysByDate();

    // Сброс формы
    form.mainGuestName = "";
    extraGuestsLine.value = "";
    form.checkIn = "";
    form.checkOut = "";
    form.status = "booked";
    form.balance = 0;
    formError.value = "";

    showSuccess(
      t("roomStays.messages.success"),
      t("roomStays.messages.stayCreated")
    );
    await loadRoomInfo();
  } catch (error: unknown) {
    console.error("Error creating stay:", error);

    // Извлекаем понятное сообщение об ошибке
    let errorMessage = t("roomStays.messages.unknownError");

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      // Обработка конфликта дат (409)
      if (status === 409) {
        if (
          serverMessage &&
          serverMessage.includes("already booked/occupied")
        ) {
          errorMessage = t("roomStays.messages.dateConflict");
        } else {
          errorMessage = t("roomStays.messages.dateConflict");
        }
      } else if (serverMessage) {
        errorMessage = serverMessage;
      } else if (status === 404) {
        errorMessage = t("roomStays.messages.roomNotFound");
      } else if (status === 400) {
        errorMessage = t("roomStays.messages.invalidData");
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Показываем ошибку в форме
    formError.value = errorMessage;
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

async function loadRoomInfo(): Promise<void> {
  try {
    const rooms = await getRooms();
    currentRoom.value =
      rooms.find((room) => room.roomNumber === roomNumber) ?? null;
  } catch (err) {
    console.error("Error loading room info:", err);
  }
}

async function markRoomAsCleaned(): Promise<void> {
  if (!currentRoom.value) {
    return;
  }

  cleaningLoading.value = true;
  try {
    const response = await markRoomCleaned(currentRoom.value.id);
    currentRoom.value = response.room;
    showSuccess(
      t("roomStays.cleaningBanner.successTitle"),
      t("roomStays.cleaningBanner.successMessage")
    );
    roomHistoryRef.value?.loadHistory();
  } catch (err) {
    console.error("Error marking room cleaned:", err);
    let message = t("roomStays.cleaningBanner.errorMessage");
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
    showError(t("roomStays.cleaningBanner.errorTitle"), message);
  } finally {
    cleaningLoading.value = false;
    await loadRoomInfo();
  }
}

onMounted(load);
</script>
