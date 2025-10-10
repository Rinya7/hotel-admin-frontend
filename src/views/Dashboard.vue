<!-- Dashboard.vue — сводка /rooms/stats и /rooms/stays/current -->
<template>
  <section class="space-y-6">
    <h2 class="text-2xl font-semibold text-brand dark:text-white">Dashboard</h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <button
        @click="toggleStatusFilter('free')"
        :class="[
          'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
          statusFilters.includes('free')
            ? 'border-white bg-brand/10 dark:bg-brand/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50',
        ]"
      >
        <strong
          :class="[
            'text-sm block mb-1',
            statusFilters.includes('free')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-600 dark:text-gray-400',
          ]"
        >
          Free
        </strong>
        <div
          :class="[
            'text-3xl font-bold',
            statusFilters.includes('free')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-900 dark:text-white',
          ]"
        >
          {{ stats?.free ?? "—" }}
        </div>
      </button>

      <button
        @click="toggleStatusFilter('booked')"
        :class="[
          'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
          statusFilters.includes('booked')
            ? 'border-white bg-brand/10 dark:bg-brand/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50',
        ]"
      >
        <strong
          :class="[
            'text-sm block mb-1',
            statusFilters.includes('booked')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-600 dark:text-gray-400',
          ]"
        >
          Booked
        </strong>
        <div
          :class="[
            'text-3xl font-bold',
            statusFilters.includes('booked')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-900 dark:text-white',
          ]"
        >
          {{ stats?.booked ?? "—" }}
        </div>
      </button>

      <button
        @click="toggleStatusFilter('occupied')"
        :class="[
          'border p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer',
          statusFilters.includes('occupied')
            ? 'border-white bg-brand/10 dark:bg-brand/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50',
        ]"
      >
        <strong
          :class="[
            'text-sm block mb-1',
            statusFilters.includes('occupied')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-600 dark:text-gray-400',
          ]"
        >
          Occupied
        </strong>
        <div
          :class="[
            'text-3xl font-bold',
            statusFilters.includes('occupied')
              ? 'text-white dark:text-brand-300'
              : 'text-gray-900 dark:text-white',
          ]"
        >
          {{ stats?.occupied ?? "—" }}
        </div>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Current stays -->
      <section
        class="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-brand dark:text-white">
            {{ getTableTitle() }}
          </h3>
          <button
            @click="load"
            :disabled="loading"
            class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "Loading..." : "Refresh" }}
          </button>
        </div>

        <!-- Индикатор активных фильтров -->
        <div
          v-if="statusFilters.length > 0"
          class="flex items-center gap-2 mb-4"
        >
          <span class="text-sm text-gray-600 dark:text-gray-400"
            >Active filters:</span
          >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="status in statusFilters"
              :key="status"
              class="px-2 py-1 text-xs bg-brand/20 text-brand dark:text-brand-300 rounded-md"
            >
              {{ getStatusLabel(status) }}
            </span>
            <button
              @click="clearFilters"
              class="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-md transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
        <div
          class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <table class="min-w-full text-sm">
            <thead
              class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <tr>
                <th class="px-4 py-3 text-left">Room #</th>
                <th class="px-4 py-3 text-left">Floor</th>
                <th class="px-4 py-3 text-left">Capacity</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Check-in</th>
                <th class="px-4 py-3 text-left">Check-out</th>
              </tr>
            </thead>
            <tbody>
              <!-- Состояние загрузки -->
              <tr v-if="loading">
                <td
                  colspan="6"
                  class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading rooms...
                </td>
              </tr>

              <!-- Ошибка загрузки -->
              <tr v-else-if="error">
                <td
                  colspan="6"
                  class="px-4 py-6 text-center text-red-600 dark:text-red-400"
                >
                  {{ error }}
                </td>
              </tr>

              <!-- Нет данных -->
              <tr v-else-if="filteredRooms.length === 0">
                <td
                  colspan="6"
                  class="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  {{
                    statusFilters.length > 0
                      ? "No rooms match the selected filters"
                      : "No rooms found"
                  }}
                </td>
              </tr>

              <!-- Данные -->
              <tr
                v-else
                v-for="room in filteredRooms"
                :key="room.id"
                class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">
                  {{ room.roomNumber }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ room.floor }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{ room.capacity }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 text-xs rounded-full block text-center"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                        room.status === 'free',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                        room.status === 'booked',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                        room.status === 'occupied',
                    }"
                  >
                    {{ room.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{
                    room.checkInHour !== null ? `${room.checkInHour}:00` : "—"
                  }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {{
                    room.checkOutHour !== null ? `${room.checkOutHour}:00` : "—"
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Room Management -->
      <section
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-brand dark:text-white">
            Room Management
          </h2>
          <button
            v-if="auth.isAdmin"
            @click="showPolicyHours = true"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-brand bg-brand/10 hover:bg-brand/20 dark:text-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20 rounded-lg transition-colors"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Policy Hours
          </button>
        </div>

        <!-- Policy Hours Display -->
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center mb-2">
                <svg
                  class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Check-in Time
                </span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white font-mono">
                {{
                  policyHoursForm.checkInHour !== null
                    ? `${policyHoursForm.checkInHour}:00`
                    : "Not set"
                }}
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div class="flex items-center mb-2">
                <svg
                  class="w-4 h-4 text-brand dark:text-emerald-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Check-out Time
                </span>
              </div>
              <p class="text-sm text-gray-900 dark:text-white font-mono">
                {{
                  policyHoursForm.checkOutHour !== null
                    ? `${policyHoursForm.checkOutHour}:00`
                    : "Not set"
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>• View all rooms and their status</p>
              <p>• Filter by status using cards above</p>
              <p>• Manage rooms in the Rooms section</p>
            </div>
            <RouterLink
              to="/rooms"
              class="inline-flex items-center px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors"
            >
              Go to Rooms
              <svg
                class="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Модальное окно Policy Hours -->
      <dialog
        v-if="showPolicyHours"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="showPolicyHours = false"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-brand dark:text-white">
              Policy Hours
            </h3>
            <button
              @click="showPolicyHours = false"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                class="w-6 h-6"
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

          <form @submit.prevent="savePolicyHours" class="space-y-6">
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Check-in Hour
                </label>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="decreaseCheckInHour"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <input
                    v-model="policyHoursForm.checkInHour"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="14"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand text-center"
                  />
                  <button
                    type="button"
                    @click="increaseCheckInHour"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter hour in 24-hour format (0-23)
                </p>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Check-out Hour
                </label>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="decreaseCheckOutHour"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <input
                    v-model="policyHoursForm.checkOutHour"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="10"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-brand text-center"
                  />
                  <button
                    type="button"
                    @click="increaseCheckOutHour"
                    class="flex items-center justify-center w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter hour in 24-hour format (0-23)
                </p>
              </div>
            </div>

            <div
              class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                type="button"
                @click="showPolicyHours = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="savingPolicyHours || !isPolicyHoursValid"
                class="px-6 py-3 text-sm font-medium text-white bg-brand hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                <span v-if="savingPolicyHours" class="flex items-center">
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Saving...
                </span>
                <span v-else class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Save Policy Hours
                </span>
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from "vue";
import type { RoomsStats, Room, BulkPolicyHoursRequest } from "@/types/rooms";
import { getRoomsStats, getRooms, updateBulkPolicyHours } from "@/api/rooms";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const stats = ref<RoomsStats | null>(null);
const rooms = ref<Room[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const statusFilters = ref<string[]>([]);

// Policy hours settings
const showPolicyHours = ref(false);
const savingPolicyHours = ref(false);
const policyHoursForm = reactive<BulkPolicyHoursRequest>({
  checkInHour: null,
  checkOutHour: null,
});

async function load() {
  try {
    loading.value = true;
    error.value = null;

    stats.value = await getRoomsStats();
    rooms.value = await getRooms();

    // Заполняем форму текущими значениями из номера с установленным временем
    if (rooms.value.length > 0) {
      const roomWithTime = rooms.value.find(
        (room) => room.checkInHour !== null || room.checkOutHour !== null
      );

      if (roomWithTime) {
        policyHoursForm.checkInHour = roomWithTime.checkInHour ?? null;
        policyHoursForm.checkOutHour = roomWithTime.checkOutHour ?? null;
      } else {
        // Если ни у одного номера нет времени, берем значения по умолчанию
        policyHoursForm.checkInHour = 14; // 14:00 по умолчанию
        policyHoursForm.checkOutHour = 10; // 10:00 по умолчанию
      }
    }
  } catch (e: any) {
    console.error("Error loading dashboard data:", e);
    error.value = e?.message || "Failed to load data";
  } finally {
    loading.value = false;
  }
}

// Функции для кнопок +/- времени
function increaseCheckInHour() {
  const current = policyHoursForm.checkInHour || 0;
  policyHoursForm.checkInHour = Math.min(23, current + 1);
}

function decreaseCheckInHour() {
  const current = policyHoursForm.checkInHour || 0;
  policyHoursForm.checkInHour = Math.max(0, current - 1);
}

function increaseCheckOutHour() {
  const current = policyHoursForm.checkOutHour || 0;
  policyHoursForm.checkOutHour = Math.min(23, current + 1);
}

function decreaseCheckOutHour() {
  const current = policyHoursForm.checkOutHour || 0;
  policyHoursForm.checkOutHour = Math.max(0, current - 1);
}

async function savePolicyHours() {
  try {
    savingPolicyHours.value = true;

    // Преобразуем значения в числа
    const payload = {
      checkInHour: policyHoursForm.checkInHour
        ? Number(policyHoursForm.checkInHour)
        : null,
      checkOutHour: policyHoursForm.checkOutHour
        ? Number(policyHoursForm.checkOutHour)
        : null,
    };

    await updateBulkPolicyHours(payload);
    showPolicyHours.value = false;

    // Показываем сообщение об успехе
    alert("Policy hours updated successfully for all rooms!");

    // Перезагружаем данные после успешного сохранения
    await load();
  } catch (e: any) {
    console.error("Error saving policy hours:", e);
    alert("Failed to save policy hours");
  } finally {
    savingPolicyHours.value = false;
  }
}

// Computed свойство для отфильтрованных комнат
const filteredRooms = computed(() => {
  if (statusFilters.value.length === 0) {
    return rooms.value;
  }
  return rooms.value.filter((room) =>
    statusFilters.value.includes(room.status)
  );
});

// Валидация формы Policy Hours
const isPolicyHoursValid = computed(() => {
  const checkIn = policyHoursForm.checkInHour;
  const checkOut = policyHoursForm.checkOutHour;

  return (
    checkIn !== null &&
    checkOut !== null &&
    checkIn >= 0 &&
    checkIn <= 23 &&
    checkOut >= 0 &&
    checkOut <= 23
  );
});

// Функции для работы с фильтрами
function toggleStatusFilter(status: string) {
  const index = statusFilters.value.indexOf(status);
  if (index > -1) {
    statusFilters.value.splice(index, 1);
  } else {
    statusFilters.value.push(status);
  }
}

function clearFilters() {
  statusFilters.value = [];
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    free: "Free",
    booked: "Booked",
    occupied: "Occupied",
  };
  return labels[status] || status;
}

function getTableTitle(): string {
  if (statusFilters.value.length === 0) {
    return "All Rooms";
  }

  if (statusFilters.value.length === 1) {
    return `${getStatusLabel(statusFilters.value[0])} Rooms`;
  }

  if (statusFilters.value.length === 2) {
    return `${getStatusLabel(statusFilters.value[0])} & ${getStatusLabel(
      statusFilters.value[1]
    )} Rooms`;
  }

  return "Filtered Rooms";
}

onMounted(load);
</script>
