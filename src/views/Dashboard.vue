<!-- Dashboard.vue — сводка /rooms/stats и /rooms/stays/current -->
<template>
  <section class="space-y-6">
    <h2 class="text-2xl font-semibold text-brand dark:text-white">
      {{ t("dashboard.title") }}
    </h2>

    <!-- Statistics Cards -->
    <DashboardStatsCards
      :stats="stats"
      :status-filters="statusFilters"
      @toggle-filter="toggleStatusFilter"
    />

    <!-- Today's Summary -->
    <TodaySummaryCards
      :arrivals="todayArrivals"
      :departures="todayDepartures"
      :stay-type-filters="stayTypeFilters"
      @toggle-filter="toggleStayTypeFilter"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Current stays -->
      <CurrentStaysTable
        :loading="loading"
        :error="error"
        :filtered-rooms="filteredRooms"
        :status-filters="statusFilters"
        :stay-type-filters="stayTypeFilters"
        :search-query="roomNumberSearch"
        :table-title="getTableTitle()"
        :today-arrivals="todayArrivals"
        :today-departures="todayDepartures"
        :current-stays="currentStays"
        @refresh="load"
        @clear-filters="clearFilters"
        @update:search-query="roomNumberSearch = $event"
      />

      <!-- Room Management -->
      <RoomManagementSidebar
        :is-admin="auth.isAdmin"
        :check-in-hour="policyHoursForm.checkInHour"
        :check-out-hour="policyHoursForm.checkOutHour"
        :wifi-name="currentWiFi.wifiName"
        :wifi-password="currentWiFi.wifiPassword"
        @open-policy-hours="openPolicyHoursModal"
        @open-wifi="openWiFiModal"
      />

      <!-- Модальное окно Policy Hours -->
      <PolicyHoursModal
        v-model="showPolicyHours"
        :check-in-hour="policyHoursForm.checkInHour"
        :check-out-hour="policyHoursForm.checkOutHour"
        :saving="savingPolicyHours"
        @save="handleSavePolicyHours"
      />

      <!-- Модальное окно Wi-Fi -->
      <WifiModal
        v-model="showWiFi"
        :wifi-name="wifiForm.wifiName"
        :wifi-password="wifiForm.wifiPassword"
        :saving="savingWiFi"
        @save="handleSaveWiFi"
      />
    </div>

    <!-- Global Booking Overview + Editor management -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <AllStaysTable
        :loading="bookingStaysLoading"
        :error="bookingStaysError"
        :filtered-stays="filteredBookingStays"
        :status-filters="bookingStatusFilters"
        :search-query="bookingCodeSearch"
        :stay-status-options="stayStatusOptions"
        :needs-action-count="needsActionStore.items.length"
        v-model:checking="checkingOverdue"
        @refresh="loadBookingStays()"
        @check-overdue="handleCheckOverdue"
        @toggle-status-filter="toggleBookingStatusFilter"
        @update:search-query="bookingCodeSearch = $event"
      />

      <AddEditorSidebar
        :can-manage="canManageEditors"
        @open-modal="openAddEditorModal"
      />
    </div>

    <!-- Add Editor Modal -->
    <AddEditorModal
      v-model="showAddEditorModal"
      :saving="isCreatingEditor"
      :error="addEditorError"
      @submit="handleSubmitAddEditor"
    />

    <!-- Needs Action Modal -->
    <NeedsActionModal
      v-model="showNeedsActionModal"
      :count="needsActionStore.items.length"
      @view="handleViewNeedsAction"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards.vue";
import TodaySummaryCards from "@/components/dashboard/TodaySummaryCards.vue";
import CurrentStaysTable from "@/components/dashboard/CurrentStaysTable.vue";
import RoomManagementSidebar from "@/components/dashboard/RoomManagementSidebar.vue";
import PolicyHoursModal from "@/components/dashboard/PolicyHoursModal.vue";
import WifiModal from "@/components/dashboard/WifiModal.vue";
import AllStaysTable from "@/components/dashboard/AllStaysTable.vue";
import AddEditorSidebar from "@/components/dashboard/AddEditorSidebar.vue";
import AddEditorModal from "@/components/dashboard/AddEditorModal.vue";
import NeedsActionModal from "@/components/needsAction/NeedsActionModal.vue";
import { useNeedsActionStore } from "@/stores/needsAction";
import { useRouter } from "vue-router";
import type {
  RoomsStats,
  Room,
  RoomStatus,
  BulkPolicyHoursRequest,
  BulkWiFiRequest,
} from "@/types/rooms";
import type { Stay, StayStatus, StayListItem, TodayStay } from "@/types/stays";
import {
  getRoomsStats,
  getRooms,
  updateBulkPolicyHours,
  updateBulkWiFi,
} from "@/api/rooms";
import {
  getCurrentStays,
  getTodayArrivals,
  getTodayDepartures,
  getStaysByStatus,
  testAutoCheck,
} from "@/api/stays";
import { useAuthStore } from "@/stores/auth";
import { useNotifications } from "@/composables/useNotifications";
import { createEditor } from "@/api/auth";
import type { CreateEditorRequest } from "@/types/dto";

const { t } = useI18n();
const auth = useAuthStore();
const { showSuccess, showError } = useNotifications();
const stats = ref<RoomsStats | null>(null);
const rooms = ref<Room[]>([]);
const currentStays = ref<Stay[]>([]);
const todayArrivals = ref<TodayStay[]>([]);
const todayDepartures = ref<TodayStay[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const statusFilters = ref<RoomStatus[]>([]);
const stayTypeFilters = ref<string[]>(["current"]); // По умолчанию показываем текущие проживания
const stayStatusOptions: StayStatus[] = [
  "booked",
  "occupied",
  "completed",
  "cancelled",
];
const bookingStatusFilters = ref<StayStatus[]>(["booked"]);
const bookingCodeSearch = ref("");
const bookingLoaded = ref(false);
const bookingStays = ref<StayListItem[]>([]);
const bookingStaysLoading = ref(false);
const bookingStaysError = ref<string | null>(null);
const checkingOverdue = ref(false);
const roomNumberSearch = ref("");

// Policy hours settings
const showPolicyHours = ref(false);
const savingPolicyHours = ref(false);
const policyHoursForm = reactive<BulkPolicyHoursRequest>({
  checkInHour: null,
  checkOutHour: null,
});

// Wi-Fi settings
const showWiFi = ref(false);
const savingWiFi = ref(false);
const wifiForm = reactive<BulkWiFiRequest>({
  wifiName: "",
  wifiPassword: "",
});

// Текущие отображаемые значения Wi-Fi
const currentWiFi = ref({
  wifiName: "",
  wifiPassword: "",
});

// Функции для управления модалками
function openPolicyHoursModal(): void {
  showPolicyHours.value = true;
}

function openWiFiModal(): void {
  showWiFi.value = true;
}

async function load() {
  try {
    loading.value = true;
    error.value = null;

    stats.value = await getRoomsStats();
    rooms.value = await getRooms();

    // Загружаем текущие проживания, но не блокируем загрузку дашборда при ошибке
    try {
      currentStays.value = await getCurrentStays();
    } catch (stayError) {
      console.warn("Failed to load current stays:", stayError);
      currentStays.value = [];
    }

    // Загружаем сегодняшние заезды и выезды
    try {
      todayArrivals.value = await getTodayArrivals();
    } catch (arrivalError) {
      console.warn("Failed to load today arrivals:", arrivalError);
      todayArrivals.value = [];
    }

    try {
      todayDepartures.value = await getTodayDepartures();
    } catch (departureError) {
      console.warn("Failed to load today departures:", departureError);
      todayDepartures.value = [];
    }

    // Заполняем форму Policy Hours из authStore (базовое время отеля из профиля админа)
    policyHoursForm.checkInHour = auth.defaultCheckInHour ?? 14; // 14:00 по умолчанию
    policyHoursForm.checkOutHour = auth.defaultCheckOutHour ?? 10; // 10:00 по умолчанию

    // Заполняем текущие значения Wi-Fi данными из первой комнаты
    // (у всех комнат одинаковые Wi-Fi данные)
    if (rooms.value.length > 0) {
      const firstRoom = rooms.value[0];

      if (firstRoom) {
        currentWiFi.value.wifiName = firstRoom.wifiName ?? "";
        currentWiFi.value.wifiPassword = firstRoom.wifiPassword ?? "";
        // Также заполняем форму для редактирования
        wifiForm.wifiName = firstRoom.wifiName ?? "";
        wifiForm.wifiPassword = firstRoom.wifiPassword ?? "";
      }
    }
  } catch (e: any) {
    console.error("Error loading dashboard data:", e);
    error.value = e?.message || "Failed to load data";
  } finally {
    loading.value = false;
  }
}

async function loadBookingStays(
  statuses: StayStatus[] = stayStatusOptions
): Promise<void> {
  if (bookingStaysLoading.value) {
    return;
  }
  const uniqueStatuses = Array.from(new Set(statuses));
  bookingStaysLoading.value = true;
  bookingStaysError.value = null;

  try {
    const chunks = await Promise.all(
      uniqueStatuses.map(async (status) => {
        try {
          const data = await getStaysByStatus(status);
          return data.map((stay) => ({
            ...stay,
            checkIn: normalizeDate(stay.checkIn),
            checkOut: normalizeDate(stay.checkOut),
          }));
        } catch (err) {
          console.error(`Failed to load stays with status ${status}:`, err);
          return [] as StayListItem[];
        }
      })
    );

    bookingStays.value = chunks.flat().sort((a, b) => b.stayId - a.stayId);
  } catch (err) {
    console.error("Error loading booking stays:", err);
    bookingStaysError.value =
      err instanceof Error ? err.message : t("common.unknownError");
    bookingStays.value = currentStays.value.map((stay) => ({
      stayId: stay.id,
      status: stay.status,
      room: {
        id: stay.room.id,
        number: stay.room.roomNumber,
        floor: (stay.room as { floor?: number }).floor ?? 0,
      },
      mainGuestName: stay.mainGuestName,
      checkIn: normalizeDate(stay.checkIn),
      checkOut: normalizeDate(stay.checkOut),
      balance: stay.balance,
    }));
  } finally {
    bookingStaysLoading.value = false;
  }
}

watch(
  currentStays,
  (list) => {
    if (!bookingLoaded.value && list.length > 0) {
      void loadBookingStays();
    }
  },
  { immediate: true }
);


function normalizeDate(value: string): string {
  if (!value) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return new Date(value).toISOString().slice(0, 10);
}

function toggleBookingStatusFilter(status: StayStatus): void {
  const current = [...bookingStatusFilters.value];
  const index = current.indexOf(status);

  if (index > -1) {
    current.splice(index, 1);
  } else {
    current.push(status);
  }

  bookingStatusFilters.value = current;
}

const filteredBookingStays = computed(() => {
  let list = bookingStays.value;

  if (bookingStatusFilters.value.length > 0) {
    list = list.filter((stay) =>
      bookingStatusFilters.value.includes(stay.status)
    );
  }

  const search = bookingCodeSearch.value.trim().toLowerCase();
  if (search.length > 0) {
    list = list.filter((stay) => {
      // Фильтруем по номеру брони (формат: номер-стайId, например "101-123")
      const roomNumber = String(stay.room?.number ?? "?").toLowerCase();
      const stayId = String(stay.stayId ?? "").toLowerCase();
      const bookingCode = `${roomNumber}-${stayId}`;
      return bookingCode.includes(search);
    });
  }

  return list;
});

/**
 * Обробник для ручного запуску перевірки просрочених stays
 */
async function handleCheckOverdue(): Promise<void> {
  try {
    checkingOverdue.value = true;
    const result = await testAutoCheck();
    showSuccess(
      `Перевірка завершена: ${result.stats.total} stays позначено (${result.stats.missedCheckIns} check-ins, ${result.stats.missedCheckOuts} check-outs)`
    );
    // Перезавантажуємо stays та needsAction
    await loadBookingStays();
    await needsActionStore.load();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Помилка при перевірці просрочених stays";
    showError(message);
    console.error("[Dashboard] Check overdue error:", err);
  } finally {
    checkingOverdue.value = false;
  }
}

async function handleSavePolicyHours(payload: BulkPolicyHoursRequest): Promise<void> {
  try {
    savingPolicyHours.value = true;

    await updateBulkPolicyHours(payload);
    showPolicyHours.value = false;

    // Обновляем дефолтные часы в authStore (базовое время отеля)
    auth.defaultCheckInHour = payload.checkInHour;
    auth.defaultCheckOutHour = payload.checkOutHour;

    // Сохраняем в localStorage
    if (payload.checkInHour !== null) {
      localStorage.setItem("defaultCheckInHour", String(payload.checkInHour));
    } else {
      localStorage.removeItem("defaultCheckInHour");
    }
    if (payload.checkOutHour !== null) {
      localStorage.setItem("defaultCheckOutHour", String(payload.checkOutHour));
    } else {
      localStorage.removeItem("defaultCheckOutHour");
    }

    // Показываем сообщение об успехе
    showSuccess(
      t("dashboard.policyHoursModal.successMessage"),
      t("dashboard.policyHoursModal.successDescription")
    );

    // Перезагружаем данные после успешного сохранения
    await load();
  } catch (e: any) {
    console.error("Error saving policy hours:", e);
    showError(
      t("dashboard.policyHoursModal.errorMessage"),
      e.response?.data?.message || e.message
    );
  } finally {
    savingPolicyHours.value = false;
  }
}

// Функция для сохранения Wi-Fi данных
async function handleSaveWiFi(payload: BulkWiFiRequest): Promise<void> {
  try {
    savingWiFi.value = true;

    await updateBulkWiFi(payload);
    showWiFi.value = false;

    // Обновляем отображаемые значения
    currentWiFi.value.wifiName = payload.wifiName;
    currentWiFi.value.wifiPassword = payload.wifiPassword;

    // Показываем сообщение об успехе
    showSuccess(
      t("dashboard.wifiModal.successMessage"),
      t("dashboard.wifiModal.successDescription")
    );

    // Перезагружаем данные после успешного сохранения
    await load();
  } catch (e: any) {
    console.error("Error saving Wi-Fi credentials:", e);
    showError(
      t("dashboard.wifiModal.errorMessage"),
      e.response?.data?.message || e.message
    );
  } finally {
    savingWiFi.value = false;
  }
}

// Computed свойство для отфильтрованных комнат
const filteredRooms = computed(() => {
  let filtered = rooms.value;

  // Фильтр по статусу комнаты
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((room) =>
      statusFilters.value.includes(room.status)
    );
  }

  // Фильтр по заездам сегодня
  if (stayTypeFilters.value.includes("arrivals")) {
    const arrivalRoomNumbers = todayArrivals.value.map(
      (stay) => stay.room.number
    );
    filtered = filtered.filter((room) =>
      arrivalRoomNumbers.includes(room.roomNumber)
    );
  }

  // Фильтр по выездам сегодня
  if (stayTypeFilters.value.includes("departures")) {
    const departureRoomNumbers = todayDepartures.value.map(
      (stay) => stay.room.number
    );
    filtered = filtered.filter((room) =>
      departureRoomNumbers.includes(room.roomNumber)
    );
  }

  const search = roomNumberSearch.value.trim().toLowerCase();
  if (search.length > 0) {
    filtered = filtered.filter((room) =>
      room.roomNumber.toLowerCase().includes(search)
    );
  }

  return filtered;
});


// Функции для работы с фильтрами
function toggleStatusFilter(status: RoomStatus) {
  const index = statusFilters.value.indexOf(status);
  if (index > -1) {
    statusFilters.value.splice(index, 1);
  } else {
    statusFilters.value.push(status);
  }
}

function toggleStayTypeFilter(type: "current" | "arrivals" | "departures") {
  const index = stayTypeFilters.value.indexOf(type);
  if (index > -1) {
    stayTypeFilters.value.splice(index, 1);
  } else {
    stayTypeFilters.value.push(type);
  }
}

function clearFilters() {
  statusFilters.value = [];
  stayTypeFilters.value = []; // Очищаем все фильтры
}


function getStatusLabel(status: RoomStatus): string {
  const labels: Record<RoomStatus, string> = {
    free: t("dashboard.stats.free"),
    occupied: t("dashboard.stats.occupied"),
    cleaning: t("dashboard.stats.cleaning"),
  };
  return labels[status] ?? status;
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

onMounted(async () => {
  await load();
  await loadBookingStays();
  
  // Завантажуємо stays, які потребують дії
  await needsActionStore.load();
  // Показуємо modal, якщо є stays, які потребують дії
  if (needsActionStore.hasItems) {
    showNeedsActionModal.value = true;
  }
});

const canManageEditors = computed(() => auth.isSuperadmin || auth.isAdmin);
const showAddEditorModal = ref(false);
const isCreatingEditor = ref(false);
const addEditorError = ref<string | null>(null);

// Needs Action
const needsActionStore = useNeedsActionStore();
const router = useRouter();
const showNeedsActionModal = ref(false);

function handleViewNeedsAction(): void {
  showNeedsActionModal.value = false;
  router.push({ name: "needs-action" });
}
function openAddEditorModal(): void {
  if (!canManageEditors.value) {
    return;
  }
  showAddEditorModal.value = true;
  addEditorError.value = null;
}

function resolveErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
    };
    const message = axiosError.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
    if (axiosError.response?.status) {
      return `Server error (${axiosError.response.status})`;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return t("common.unknownError") as string;
}

async function handleSubmitAddEditor(payload: CreateEditorRequest): Promise<void> {
  if (!canManageEditors.value) {
    addEditorError.value = t("dashboard.addEditor.modal.notAllowed") as string;
    return;
  }

  isCreatingEditor.value = true;
  addEditorError.value = null;

  try {
    await createEditor(payload);
    showSuccess(
      t("dashboard.addEditor.modal.successTitle"),
      t("dashboard.addEditor.modal.successMessage", {
        username: payload.username,
      })
    );
    showAddEditorModal.value = false;
  } catch (error: unknown) {
    const message = resolveErrorMessage(error);
    addEditorError.value = message;
    showError(t("dashboard.addEditor.modal.errorTitle"), message);
  } finally {
    isCreatingEditor.value = false;
  }
}
</script>
