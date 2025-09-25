<!-- RoomStays.vue — список проживаний комнаты + создать/сменить статус -->
<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-brand dark:text-white">
        Room {{ roomNumber }} — Stays
      </h2>
      <RouterLink
        to="/rooms"
        class="text-brand hover:text-brand-light dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
      >
        ← Back
      </RouterLink>
    </header>

    <details
      open
      class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4"
    >
      <summary
        class="text-lg font-medium text-brand dark:text-white cursor-pointer mb-4"
      >
        Create new stay
      </summary>
      <form @submit.prevent="createNew" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            v-model.trim="form.mainGuestName"
            placeholder="Main guest name"
            required
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
          />
          <input
            v-model.trim="extraGuestsLine"
            placeholder="Extra guests (comma separated)"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
          />
          <input
            v-model="form.checkIn"
            type="date"
            required
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
          />
          <input
            v-model="form.checkOut"
            type="date"
            required
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
          />
          <select
            v-model="form.status"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
          >
            <option value="booked">booked</option>
            <option value="occupied">occupied</option>
          </select>
          <input
            v-model.number="form.balance"
            type="number"
            step="0.01"
            placeholder="Balance"
            class="w-full text-brand placeholder:text-brand bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-base disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand focus:border-brand"
          />
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-lg transition-colors"
        >
          Create
        </button>
      </form>
    </details>

    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-brand dark:text-white">
        History / Current
      </h3>
      <div
        class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <table class="min-w-full text-sm">
          <thead
            class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <tr>
              <th class="px-4 py-3 text-left">#</th>
              <th class="px-4 py-3 text-left">Guest</th>
              <th class="px-4 py-3 text-left">Dates</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Balance</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="s in stays"
              :key="s.id"
              class="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">
                {{ s.id }}
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                {{ s.mainGuestName }}
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                {{ s.checkIn }} → {{ s.checkOut }}
              </td>
              <td class="px-4 py-3">
                <select
                  v-model="statusDraft[s.id]"
                  @change="changeStatus(s)"
                  class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="booked">booked</option>
                  <option value="occupied">occupied</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                {{ s.balance }}
              </td>
              <td class="px-4 py-3 text-gray-500 dark:text-gray-400">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import type { Stay, CreateStayRequest } from "@/types/stays";
import { listStaysByRoom, createStay, updateStayStatus } from "@/api/stays";

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
