<!-- RoomsList.vue — список комнат, кнопка Add (только для admin), edit/status/delete -->
<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-brand dark:text-white">Rooms</h2>
      <button
        v-if="auth.isAdmin"
        @click="showCreate = true"
        class="px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors"
      >
        Add room
      </button>
    </header>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Filter by number:
      </label>
      <input
        v-model="filter"
        placeholder="101"
        class="w-full max-w-xs text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
      />
    </div>

    <div
      class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <table class="min-w-full text-sm">
        <thead
          class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          <tr>
            <th class="px-4 py-3 text-left">#</th>
            <th class="px-4 py-3 text-left">Floor</th>
            <th class="px-4 py-3 text-left">Capacity</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in filtered"
            :key="r.id"
            class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">
              {{ r.roomNumber }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ r.floor }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ r.capacity }}
            </td>
            <td class="px-4 py-3">
              <select
                :disabled="!canChangeStatus"
                v-model="statusDraft[r.id]"
                @change="saveStatus(r)"
                class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="free">free</option>
                <option value="booked">booked</option>
                <option value="occupied">occupied</option>
              </select>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <RouterLink
                  :to="{
                    name: 'room-stays',
                    params: { roomNumber: r.roomNumber },
                  }"
                  class="text-sm text-brand hover:text-brand-light dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                  Stays
                </RouterLink>
                <button
                  v-if="auth.isAdmin"
                  @click="openEdit(r)"
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  v-if="auth.isAdmin"
                  @click="remove(r)"
                  class="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog
      v-if="showCreate"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
      >
        <form @submit.prevent="create" class="space-y-4">
          <h3 class="text-lg font-semibold text-brand dark:text-white">
            Create room
          </h3>
          <div class="space-y-3">
            <input
              v-model="createForm.roomNumber"
              placeholder="Room number"
              required
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model.number="createForm.floor"
              placeholder="Floor"
              type="number"
              required
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model.number="createForm.capacity"
              placeholder="Capacity"
              type="number"
              required
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model="createForm.wifiName"
              placeholder="WiFi name"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model="createForm.wifiPassword"
              placeholder="WiFi password"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model="createForm.qrBarUrl"
              placeholder="QR Bar URL"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <input
              v-model="createForm.mapPosition"
              placeholder="Map position"
              class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
            />
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              class="px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              @click="showCreate = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
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
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { Room, UpdateRoomRequest, CreateRoomRequest } from "@/types/rooms";
import {
  getRooms,
  updateRoomStatus,
  updateRoomByNumber,
  createRoom,
} from "@/api/rooms";

const auth = useAuthStore();
const rooms = ref<Room[]>([]);
const filter = ref("");
const statusDraft = reactive<Record<number, Room["status"]>>({});
const showCreate = ref(false);
const createForm = reactive<CreateRoomRequest>({
  roomNumber: "",
  floor: 1,
  capacity: 2,
});

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

async function create() {
  const created = await createRoom(createForm);
  rooms.value.push(created);
  statusDraft[created.id] = created.status;
  showCreate.value = false;
  createForm.roomNumber = "";
}

onMounted(load);
</script>
