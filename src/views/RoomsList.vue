<!-- RoomsList.vue — список комнат, кнопка Add (только для admin), edit/status/delete -->
<template>
  <div class="space-y-6">
    <section
      class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:py-[24px]"
    >
      <h1 class="text-2xl font-semibold text-brand dark:text-white">Rooms</h1>
      <div class="flex flex-col sm:flex-row gap-3">
        <input
          v-model="filter"
          type="text"
          placeholder="Filter by room number..."
          class="w-full sm:w-64 text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-2xl text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
        />
        <button
          v-if="auth.isAdmin"
          @click="showCreate = true"
          class="inline-flex items-center px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md font-medium"
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
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Add Room
        </button>
      </div>
    </section>

    <section
      class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <table class="w-full text-sm table-fixed">
        <thead
          class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <tr>
            <th class="px-4 py-3 text-left font-medium">Room</th>
            <th class="px-4 py-3 text-left font-medium">Floor</th>
            <th class="px-4 py-3 text-left font-medium">Capacity</th>
            <th class="px-4 py-3 text-left font-medium">Status</th>
            <th class="px-4 py-3 text-left font-medium">Check-in</th>
            <th class="px-4 py-3 text-left font-medium">Check-out</th>
            <th v-if="canChangeStatus" class="px-4 py-3 text-left font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="r in filtered"
            :key="r.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td class="px-4 py-4 text-gray-900 dark:text-white font-medium">
              {{ r.roomNumber }}
            </td>
            <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
              {{ r.floor }}
            </td>
            <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
              {{ r.capacity }}
            </td>
            <td class="px-4 py-4">
              <select
                :disabled="!canChangeStatus"
                v-model="statusDraft[r.id]"
                @change="saveStatus(r)"
                class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
              >
                <option value="free">Free</option>
                <option value="booked">Booked</option>
                <option value="occupied">Occupied</option>
              </select>
            </td>
            <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
              {{ r.checkInHour !== null ? `${r.checkInHour}:00` : "—" }}
            </td>
            <td class="px-4 py-4 text-gray-600 dark:text-gray-300">
              {{ r.checkOutHour !== null ? `${r.checkOutHour}:00` : "—" }}
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <RouterLink
                  :to="{
                    name: 'room-stays',
                    params: { roomNumber: r.roomNumber },
                  }"
                  class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-brand bg-brand/10 hover:bg-brand/20 dark:text-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20 rounded-lg transition-colors"
                >
                  Stays
                </RouterLink>
                <button
                  v-if="auth.isAdmin"
                  @click="openEdit(r)"
                  class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-400/10 dark:hover:bg-blue-400/20 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  v-if="auth.isAdmin"
                  @click="remove(r)"
                  class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-400/10 dark:hover:bg-red-400/20 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Пустое состояние -->
      <div v-if="filtered.length === 0" class="text-center py-12">
        <div class="text-gray-400 dark:text-gray-500 mb-4">
          <svg
            class="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No rooms found
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{
            filter
              ? "Try adjusting your search filter."
              : "Get started by creating your first room."
          }}
        </p>
      </div>
    </section>

    <!-- Модальное окно создания номера -->
    <dialog
      v-if="showCreate"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showCreate = false"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-brand dark:text-white">
            Create New Room
          </h3>
          <button
            @click="showCreate = false"
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
        <CreateRoomForm @success="onRoomCreated" @cancel="showCreate = false" />
      </div>
    </dialog>

    <dialog
      v-if="editForm"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
      >
        <form @submit.prevent="saveEdit" class="space-y-4">
          <h3 class="text-lg font-semibold text-brand dark:text-white">
            Edit room {{ editRoom?.roomNumber }}
          </h3>
          <div class="space-y-3">
            <input
              v-model.number="editForm.floor"
              placeholder="Floor"
              type="number"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model.number="editForm.capacity"
              placeholder="Capacity"
              type="number"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model="editForm.wifiName"
              placeholder="WiFi name"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model="editForm.wifiPassword"
              placeholder="WiFi password"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model="editForm.qrBarUrl"
              placeholder="QR Bar URL"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model="editForm.mapPosition"
              placeholder="Map position"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              class="px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              @click="editForm = null"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { Room, UpdateRoomRequest } from "@/types/rooms";
import { getRooms, updateRoomStatus, updateRoomByNumber } from "@/api/rooms";
import CreateRoomForm from "@/components/common/CreateRoomForm.vue";

const auth = useAuthStore();
const rooms = ref<Room[]>([]);
const filter = ref("");
const statusDraft = reactive<Record<number, Room["status"]>>({});
const showCreate = ref(false);

const editForm = ref<UpdateRoomRequest | null>(null);
const editRoom = ref<Room | null>(null);

const canChangeStatus = computed(() => auth.isAdmin || auth.isEditor);

const filtered = computed(() =>
  rooms.value.filter((r) =>
    r.roomNumber.toLowerCase().includes(filter.value.trim().toLowerCase())
  )
);

async function load() {
  rooms.value = await getRooms();
  rooms.value.forEach((r) => (statusDraft[r.id] = r.status));
}

function openEdit(r: Room) {
  editRoom.value = r;
  editForm.value = {
    floor: r.floor,
    capacity: r.capacity,
    wifiName: r.wifiName,
    wifiPassword: r.wifiPassword,
    qrBarUrl: r.qrBarUrl,
    mapPosition: r.mapPosition,
  };
}

async function saveEdit() {
  if (!editRoom.value || !editForm.value) return;
  const updated = await updateRoomByNumber(
    editRoom.value.roomNumber,
    editForm.value
  );
  const idx = rooms.value.findIndex((x) => x.id === updated.id);
  if (idx >= 0) rooms.value[idx] = updated;
  editForm.value = null;
}

async function saveStatus(r: Room) {
  await updateRoomStatus(r.roomNumber, { status: statusDraft[r.id] });
  // после успешного сохранения — обновим локально
  r.status = statusDraft[r.id];
}

async function remove(_r: Room) {
  // Здесь можно сделать confirm и реальный DELETE /rooms/number/:roomNumber,
  // но эндпоинт уже реализован на сервере — просто вызовите через axios по аналогии.
  alert("DELETE не реализован в примере. Добавьте при необходимости.");
}

function onRoomCreated() {
  showCreate.value = false;
  // Перезагружаем список комнат после создания
  load();
}

onMounted(load);
</script>
