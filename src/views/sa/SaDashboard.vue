<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-brand dark:text-white">
      {{ t("saDashboard.title") }}
    </h1>

    <!-- Картки зі статистикою -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        :title="t('saDashboard.stats.totalHotels')"
        :value="totalHotels"
      />
      <StatCard
        :title="t('saDashboard.stats.activeHotels')"
        :value="activeHotels"
      />
      <StatCard
        :title="t('saDashboard.stats.blockedHotels')"
        :value="blockedHotels"
      />
      <StatCard
        :title="t('saDashboard.stats.totalEditors')"
        :value="totalEditors"
        :hint="`~${avgEditorsPerHotel} ${t(
          'saDashboard.stats.avgEditorsPerHotel'
        )}`"
      />
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Останні готелі -->
      <section
        class="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-medium text-brand dark:text-white">
            {{ t("saDashboard.latestHotels.title") }}
          </h2>
          <RouterLink
            :to="{ name: 'sa-hotels' }"
            class="text-emerald-700 dark:text-emerald-400 text-sm"
            >{{ t("saDashboard.latestHotels.goToList") }}</RouterLink
          >
        </div>

        <table class="min-w-full text-sm">
          <thead
            class="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <tr>
              <th class="px-3 py-2 text-left">
                {{ t("saDashboard.latestHotels.table.hotel") }}
              </th>
              <th class="px-3 py-2 text-left">
                {{ t("saDashboard.latestHotels.table.address") }}
              </th>
              <th class="px-3 py-2 text-left">
                {{ t("saDashboard.latestHotels.table.login") }}
              </th>
              <th class="px-3 py-2 text-left">
                {{ t("saDashboard.latestHotels.table.created") }}
              </th>
              <th class="px-3 py-2 text-left">
                {{ t("saDashboard.latestHotels.table.status") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td
                colspan="5"
                class="px-3 py-6 text-center text-gray-500 dark:text-gray-400"
              >
                {{ t("saDashboard.latestHotels.loading") }}
              </td>
            </tr>
            <template v-else>
              <tr
                v-for="h in latest"
                :key="h.id"
                class="border-t border-gray-200 dark:border-gray-600"
              >
                <td class="px-3 py-2">
                  <div class="font-medium text-gray-900 dark:text-white">
                    {{ h.hotel_name ?? "—" }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ h.full_name ?? "—" }}
                  </div>
                </td>
                <td class="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {{ h.address ?? "—" }}
                </td>
                <td class="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {{ h.username }}
                </td>
                <td class="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {{ new Date(h.createdAt).toLocaleString() }}
                </td>
                <td class="px-3 py-2">
                  <span
                    :class="
                      h.isBlocked
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-emerald-700 dark:text-emerald-400'
                    "
                  >
                    {{
                      h.isBlocked
                        ? t("saDashboard.latestHotels.status.blocked")
                        : t("saDashboard.latestHotels.status.active")
                    }}
                  </span>
                </td>
              </tr>
              <tr v-if="latest.length === 0">
                <td
                  colspan="5"
                  class="px-3 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  {{ t("saDashboard.latestHotels.empty") }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </section>

      <!-- Форма створення готелю -->
      <section
        class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <h2 class="font-medium mb-3 text-brand dark:text-white">
          {{ t("saDashboard.createHotel.title") }}
        </h2>
        <CreateHotelForm />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSuperHotelsStore } from "@/stores/superadmin";
import StatCard from "@/components/dashboard/StatCard.vue";
import CreateHotelForm from "@/components/superadmin/CreateHotelForm.vue";
import { useLocale } from "@/composables/useLocale";

const store = useSuperHotelsStore();
const { t } = useLocale();
const {
  loading,
  totalHotels,
  totalEditors,
  blockedHotels,
  activeHotels,
  avgEditorsPerHotel,
} = storeToRefs(store);

onMounted(() => {
  void store.fetchAll(); // підвантажимо дані для статистики
});

// останні 5 готелів
const latest = computed(() => store.latestHotels(5));
</script>
