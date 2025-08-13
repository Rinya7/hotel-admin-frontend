<!-- RoomStays.vue — список проживаний комнаты + создать/сменить статус -->
<template>
  <section>
    <header style="display:flex;align-items:center;gap:12px;">
      <h2 style="margin-right:auto;">Room {{ roomNumber }} — Stays</h2>
      <RouterLink to="/rooms">← Back</RouterLink>
    </header>

    <details open>
      <summary>Create new stay</summary>
      <form @submit.prevent="createNew">
        <input v-model.trim="form.mainGuestName" placeholder="Main guest name" required />
        <input v-model.trim="extraGuestsLine" placeholder="Extra guests (comma separated)" />
        <input v-model="form.checkIn" type="date" required />
        <input v-model="form.checkOut" type="date" required />
        <select v-model="form.status">
          <option value="booked">booked</option>
          <option value="occupied">occupied</option>
        </select>
        <input v-model.number="form.balance" type="number" step="0.01" placeholder="Balance" />
        <button>Create</button>
      </form>
    </details>

    <h3 style="margin-top:16px;">History / Current</h3>
    <table border="1" cellspacing="0" cellpadding="8">
      <thead>
        <tr>
          <th>#</th>
          <th>Guest</th>
          <th>Dates</th>
          <th>Status</th>
          <th>Balance</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in stays" :key="s.id">
          <td>{{ s.id }}</td>
          <td>{{ s.mainGuestName }}</td>
          <td>{{ s.checkIn }} → {{ s.checkOut }}</td>
          <td>
            <select v-model="statusDraft[s.id]" @change="changeStatus(s)">
              <option value="booked">booked</option>
              <option value="occupied">occupied</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </td>
          <td>{{ s.balance }}</td>
          <td><!-- под удаление/прочее -->—</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import type { Stay, CreateStayRequest } from "../types/stays";
import { listStaysByRoom, createStay, updateStayStatus } from "../api/stays";

const route = useRoute();
const roomNumber = String(route.params.roomNumber ?? "");
const stays = ref<Stay[]>([]);
const statusDraft = reactive<Record<number, Stay["status"]>>({});

const form = reactive<CreateStayRequest>({
  roomNumber,
  mainGuestName: "",
  extraGuests: [],
  checkIn: "",
  checkOut: "",
  status: "booked",
  balance: 0,
});

const extraGuestsLine = ref("");

async function load() {
  stays.value = await listStaysByRoom(roomNumber);
  stays.value.forEach((s) => (statusDraft[s.id] = s.status));
}

async function createNew() {
  form.extraGuests = extraGuestsLine.value
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  const created = await createStay(form);
  stays.value.unshift(created);
  statusDraft[created.id] = created.status;
  // сброс формы
  form.mainGuestName = "";
  extraGuestsLine.value = "";
  form.checkIn = "";
  form.checkOut = "";
  form.status = "booked";
  form.balance = 0;
}

async function changeStatus(s: Stay) {
  const updated = await updateStayStatus(s.id, { status: statusDraft[s.id] });
  const idx = stays.value.findIndex((x) => x.id === s.id);
  if (idx >= 0) stays.value[idx] = updated;
}

onMounted(load);
</script>