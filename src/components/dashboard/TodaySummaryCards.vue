<!-- TodaySummaryCards.vue -->
<!-- Компонент для відображення сьогоднішніх заїздів та виїздів -->
<template>
  <div
    v-if="arrivals.length > 0 || departures.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6"
  >
    <!-- Arrivals Card -->
    <TodaySummaryCard
      type="arrivals"
      :stays="arrivals"
      :is-active="stayTypeFilters.includes('arrivals')"
      @toggle="handleToggle('arrivals')"
    />

    <!-- Departures Card -->
    <TodaySummaryCard
      type="departures"
      :stays="departures"
      :is-active="stayTypeFilters.includes('departures')"
      @toggle="handleToggle('departures')"
    />
  </div>
</template>

<script setup lang="ts">
// src/components/dashboard/TodaySummaryCards.vue
// Компонент для відображення сьогоднішніх заїздів та виїздів

import TodaySummaryCard from "./TodaySummaryCard.vue";
import type { TodayStay } from "@/types/stays";

interface Props {
  arrivals: TodayStay[];
  departures: TodayStay[];
  stayTypeFilters: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "toggle-filter", type: "arrivals" | "departures"): void;
}>();

function handleToggle(type: "arrivals" | "departures"): void {
  emit("toggle-filter", type);
}
</script>




