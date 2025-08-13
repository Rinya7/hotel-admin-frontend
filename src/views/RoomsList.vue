<!-- RoomsList.vue — список комнат, кнопка Add (только для admin), edit/status/delete -->
<template>
  <section>
    <header style="display: flex; align-items: center; gap: 12px">
      <h2 style="margin-right: auto">Rooms</h2>
      <button v-if="auth.isAdmin" @click="showCreate = true">Add room</button>
    </header>

    <div style="margin: 12px 0">
      <label
        >Filter by number: <input v-model="filter" placeholder="101"
      /></label>
    </div>

    <table border="1" cellspacing="0" cellpadding="8">
      <thead>
        <tr>
          <th>#</th>
          <th>Floor</th>
          <th>Capacity</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in filtered" :key="r.id">
          <td>{{ r.roomNumber }}</td>
          <td>{{ r.floor }}</td>
          <td>{{ r.capacity }}</td>
          <td>
            <select
              :disabled="!canChangeStatus"
              v-model="statusDraft[r.id]"
              @change="saveStatus(r)"
            >
              <option value="free">free</option>
              <option value="booked">booked</option>
              <option value="occupied">occupied</option>
            </select>
          </td>
          <td style="white-space: nowrap">
            <RouterLink
              :to="{ name: 'room-stays', params: { roomNumber: r.roomNumber } }"
              >Stays</RouterLink
            >
            <button v-if="auth.isAdmin" @click="openEdit(r)">Edit</button>
            <button v-if="auth.isAdmin" @click="remove(r)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <dialog v-if="showCreate">
      <form @submit.prevent="create">
        <h3>Create room</h3>
        <input
          v-model="createForm.roomNumber"
          placeholder="Room number"
          required
        />
        <input
          v-model.number="createForm.floor"
          placeholder="Floor"
          type="number"
          required
        />
        <input
          v-model.number="createForm.capacity"
          placeholder="Capacity"
          type="number"
          required
        />
        <input v-model="createForm.wifiName" placeholder="WiFi name" />
        <input v-model="createForm.wifiPassword" placeholder="WiFi password" />
        <input v-model="createForm.qrBarUrl" placeholder="QR Bar URL" />
        <input v-model="createForm.mapPosition" placeholder="Map position" />
        <div style="display: flex; gap: 8px; margin-top: 8px">
          <button type="submit">Create</button>
          <button type="button" @click="showCreate = false">Cancel</button>
        </div>
      </form>
    </dialog>

    <dialog v-if="editForm">
      <form @submit.prevent="saveEdit">
        <h3>Edit room {{ editRoom?.roomNumber }}</h3>
        <input
          v-model.number="editForm.floor"
          placeholder="Floor"
          type="number"
        />
        <input
          v-model.number="editForm.capacity"
          placeholder="Capacity"
          type="number"
        />
        <input v-model="editForm.wifiName" placeholder="WiFi name" />
        <input v-model="editForm.wifiPassword" placeholder="WiFi password" />
        <input v-model="editForm.qrBarUrl" placeholder="QR Bar URL" />
        <input v-model="editForm.mapPosition" placeholder="Map position" />
        <div style="display: flex; gap: 8px; margin-top: 8px">
          <button type="submit">Save</button>
          <button type="button" @click="editForm = null">Cancel</button>
        </div>
      </form>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import type {
  Room,
  UpdateRoomRequest,
  CreateRoomRequest,
} from "../types/rooms";
import {
  getRooms,
  updateRoomStatus,
  updateRoomByNumber,
  createRoom,
} from "../api/rooms";

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

async function remove(r: Room) {
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
