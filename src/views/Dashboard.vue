<!-- Dashboard.vue — сводка /rooms/stats и /rooms/stays/current -->
<template>
  <section>
    <h2>Dashboard</h2>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        max-width: 720px;
      "
    >
      <div style="border: 1px solid #ddd; padding: 12px; border-radius: 8px">
        <strong>Free</strong>
        <div style="font-size: 32px">{{ stats?.free ?? "—" }}</div>
      </div>
      <div style="border: 1px solid #ddd; padding: 12px; border-radius: 8px">
        <strong>Booked</strong>
        <div style="font-size: 32px">{{ stats?.booked ?? "—" }}</div>
      </div>
      <div style="border: 1px solid #ddd; padding: 12px; border-radius: 8px">
        <strong>Occupied</strong>
        <div style="font-size: 32px">{{ stats?.occupied ?? "—" }}</div>
      </div>
    </div>

    <h3 style="margin-top: 20px">Current stays</h3>
    <table border="1" cellspacing="0" cellpadding="8">
      <thead>
        <tr>
          <th>#</th>
          <th>Room</th>
          <th>Guest</th>
          <th>Dates</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in current" :key="s.id">
          <td>{{ s.id }}</td>
          <td>{{ s.room.roomNumber }}</td>
          <td>{{ s.mainGuestName }}</td>
          <td>{{ s.checkIn }} → {{ s.checkOut }}</td>
          <td>{{ s.status }}</td>
        </tr>
      </tbody>
    </table>
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
