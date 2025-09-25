<!-- Dashboard.vue — сводка /rooms/stats и /rooms/stays/current -->
<template>
  <section class="space-y-6">
    <h2 class="text-2xl font-semibold text-brand dark:text-white">Dashboard</h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
      <div
        class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded-lg"
      >
        <strong class="text-sm text-gray-600 dark:text-gray-400">Free</strong>
        <div class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ stats?.free ?? "—" }}
        </div>
      </div>
      <div
        class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded-lg"
      >
        <strong class="text-sm text-gray-600 dark:text-gray-400">Booked</strong>
        <div class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ stats?.booked ?? "—" }}
        </div>
      </div>
      <div
        class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded-lg"
      >
        <strong class="text-sm text-gray-600 dark:text-gray-400"
          >Occupied</strong
        >
        <div class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ stats?.occupied ?? "—" }}
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-brand dark:text-white">
        Current stays
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
              <th class="px-4 py-3 text-left">Room</th>
              <th class="px-4 py-3 text-left">Guest</th>
              <th class="px-4 py-3 text-left">Dates</th>
              <th class="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="s in current"
              :key="s.id"
              class="border-t border-gray-200 dark:border-gray-600"
            >
              <td class="px-4 py-3 text-gray-900 dark:text-white">
                {{ s.id }}
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                {{ s.room.roomNumber }}
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                {{ s.mainGuestName }}
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
                {{ s.checkIn }} → {{ s.checkOut }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                      s.status === 'occupied',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                      s.status === 'booked',
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200':
                      s.status === 'completed',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                      s.status === 'cancelled',
                  }"
                >
                  {{ s.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { RoomsStats } from "@/types/rooms";
import type { Stay } from "@/types/stays";
import { getRoomsStats } from "@/api/rooms";
import http from "@/api/http"; // используем для /rooms/stays/current

const stats = ref<RoomsStats | null>(null);
const current = ref<Stay[]>([]);

async function load() {
  stats.value = await getRoomsStats();
  const { data } = await http.get<Stay[]>("/rooms/stays/current");
  current.value = data;
}

onMounted(load);
</script>
