<!-- NeedsActionView.vue -->
<!-- Сторінка для відображення та управління stays, які потребують дії -->
<template>
  <section class="space-y-6">
    <header class=" ">
        <div class="flex items-center justify-between my-4"> 
         
        <button
          @click="refresh"
          :disabled="needsActionStore.loading"
          class="px-2 py-1 bg-brand text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ t("dashboard.refresh") }}
        </button>
        <RouterLink
          to="/"
          class=" text-brand hover:text-brand-light dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          ← {{ t("dashboard.needsAction.view.back") }}
        </RouterLink>
    </div>
         
      <h2 class="text-2xl font-semibold text-brand dark:text-white">
        {{ t("dashboard.needsAction.view.title") }}
      </h2>
      
     
       
    </header>

    <div v-if="needsActionStore.loading" class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">
        {{ t("dashboard.needsAction.view.loading") }}
      </p>
    </div>

    <div
      v-else-if="needsActionStore.items.length === 0"
      class="text-center py-8"
    >
      <p class="text-gray-600 dark:text-gray-400">
        {{ t("dashboard.needsAction.view.empty") }}
      </p>
    </div>

    <div v-else class="overflow-x-auto -mx-4 px-4">
      <table class="min-w-[800px] w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-700">
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("dashboard.needsAction.view.table.room") }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("dashboard.needsAction.view.table.guest") }}
            </th>
            <th class="hidden md:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("dashboard.needsAction.view.table.checkIn") }}
            </th>
            <th class="hidden md:table-cell px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("dashboard.needsAction.view.table.checkOut") }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("dashboard.needsAction.view.table.problem") }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ t("dashboard.needsAction.view.table.actions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in needsActionStore.items"
            :key="item.id"
            class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
              {{ item.roomNumber }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
              {{ item.mainGuestName }}
            </td>
            <td class="hidden md:table-cell px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
              {{ formatDate(item.checkIn) }}
            </td>
            <td class="hidden md:table-cell px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
              {{ formatDate(item.checkOut) }}
            </td>
            <td class="px-4 py-3 text-sm">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.needsActionReason === 'missed_checkin'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                ]"
              >
                {{
                  item.needsActionReason === "missed_checkin"
                    ? t("dashboard.needsAction.view.problems.missed_checkin")
                    : t("dashboard.needsAction.view.problems.missed_checkout")
                }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <div class="flex gap-2 flex-wrap">
                <!-- Actions for missed_checkin -->
                <template v-if="item.needsActionReason === 'missed_checkin'">
                  <button
                    @click="openNoShowModal(item)"
                    class="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {{ t("dashboard.needsAction.view.actions.noShow") }}
                  </button>
                  <button
                    @click="openCheckInNowModal(item)"
                    class="px-3 py-1 text-xs bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded hover:bg-green-300 dark:hover:bg-green-900/50 transition-colors"
                  >
                    {{ t("dashboard.needsAction.view.actions.checkInNow") }}
                  </button>
                  <button
                    @click="openEditDatesModal(item)"
                    class="px-3 py-1 text-xs bg-blue-200 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded hover:bg-blue-300 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {{ t("dashboard.needsAction.view.actions.editDates") }}
                  </button>
                </template>

                <!-- Actions for missed_checkout -->
                <template v-else>
                  <button
                    @click="openCheckOutNowModal(item)"
                    class="px-3 py-1 text-xs bg-red-200 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded hover:bg-red-300 dark:hover:bg-red-900/50 transition-colors"
                  >
                    {{ t("dashboard.needsAction.view.actions.checkOutNow") }}
                  </button>
                  <button
                    @click="openExtendStayModal(item)"
                    class="px-3 py-1 text-xs bg-purple-200 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded hover:bg-purple-300 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {{ t("dashboard.needsAction.view.actions.extendStay") }}
                  </button>
                  <button
                    @click="openEditDatesModal(item)"
                    class="px-3 py-1 text-xs bg-blue-200 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded hover:bg-blue-300 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {{ t("dashboard.needsAction.view.actions.editDates") }}
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <ConfirmNoShowModal
      v-model="showNoShowModal"
      :stay="selectedStay"
      @confirmed="handleModalConfirmed"
    />
    <ConfirmCheckInModal
      v-model="showCheckInModal"
      :stay="selectedStay"
      @confirmed="handleModalConfirmed"
    />
    <ConfirmCheckOutModal
      v-model="showCheckOutModal"
      :stay="selectedStay"
      @confirmed="handleModalConfirmed"
    />
    <EditDatesModal
      v-model="showEditDatesModal"
      :stay="selectedStay"
      @confirmed="handleModalConfirmed"
    />
    <ExtendStayModal
      v-model="showExtendStayModal"
      :stay="selectedStay"
      @confirmed="handleModalConfirmed"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useNeedsActionStore } from "@/stores/needsAction";
import { useLocale } from "@/composables/useLocale";
import ConfirmNoShowModal from "@/components/needsAction/ConfirmNoShowModal.vue";
import ConfirmCheckInModal from "@/components/needsAction/ConfirmCheckInModal.vue";
import ConfirmCheckOutModal from "@/components/needsAction/ConfirmCheckOutModal.vue";
import EditDatesModal from "@/components/needsAction/EditDatesModal.vue";
import ExtendStayModal from "@/components/needsAction/ExtendStayModal.vue";
import type { StayNeedsAction } from "@/types/stays";

const { t } = useLocale();
const needsActionStore = useNeedsActionStore();

// Modal states
const showNoShowModal = ref(false);
const showCheckInModal = ref(false);
const showCheckOutModal = ref(false);
const showEditDatesModal = ref(false);
const showExtendStayModal = ref(false);
const selectedStay = ref<StayNeedsAction | null>(null);

/**
 * Форматує дату для відображення
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("uk-UA");
}

/**
 * Оновлює список після підтвердження дії
 */
async function handleModalConfirmed(): Promise<void> {
  await needsActionStore.load();
}

/**
 * Оновлює список stays
 */
async function refresh(): Promise<void> {
  await needsActionStore.load();
}

/**
 * Відкриває модальне вікно для no-show
 */
function openNoShowModal(item: StayNeedsAction): void {
  selectedStay.value = item;
  showNoShowModal.value = true;
}

/**
 * Відкриває модальне вікно для check-in
 */
function openCheckInNowModal(item: StayNeedsAction): void {
  selectedStay.value = item;
  showCheckInModal.value = true;
}

/**
 * Відкриває модальне вікно для check-out
 */
function openCheckOutNowModal(item: StayNeedsAction): void {
  selectedStay.value = item;
  showCheckOutModal.value = true;
}

/**
 * Відкриває модальне вікно для редагування дат
 */
function openEditDatesModal(item: StayNeedsAction): void {
  selectedStay.value = item;
  showEditDatesModal.value = true;
}

/**
 * Відкриває модальне вікно для продовження stay
 */
function openExtendStayModal(item: StayNeedsAction): void {
  selectedStay.value = item;
  showExtendStayModal.value = true;
}

onMounted(async () => {
  await needsActionStore.load();
});
</script>

